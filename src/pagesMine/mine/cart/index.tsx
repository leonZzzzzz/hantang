import Taro from '@tarojs/taro';
import BaseComponent from '@/utils/components'
import { View, Text, Image, Button, Form } from '@tarojs/components';

import './index.scss';

import { CheckBtn, InputNumber, DividingLine, EmptyDataBox, LoadingBox } from '@/components/index';
import config from '@/config/index';
import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  imgHost: string
  cartList: any[]
  isCheckAll: boolean
  totalPrice: number
  offerPrice: number
  selectedPId: any[]
  isLevel: boolean;
  levelRate: number
}

interface Cart {
  state: StateType
}

class Cart extends BaseComponent {
  config = {
    navigationBarTitleText: '购物车',
    enablePullDownRefresh: true,
  };

  isMount: boolean

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      imgHost: config.imgHost,
      cartList: [],
      // 是否全选
      isCheckAll: false,
      // 总价钱
      totalPrice: 0,
      // 成为会员后优惠的价钱
      offerPrice: 0,
      // 选择的商品ID
      selectedPId: [],
      // 是否开通了会员
      isLevel: false,
      // 节省比例
      levelRate: 0,
    };
    this.isMount = false;
  }

  componentDidMount() {
    this.getCartList();
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.getCartList();
  }

  componentDidHide() {
    this.setPageLoading(false);
  }

  // 下拉刷新
  onPullDownRefresh() {
    this.getCartList();
  }

  // 获取购物车商品列表
  async getCartList() {
    this.setPageLoading(true);
    try {
      let res = await this.$api.mall.listOrderItem()
      let data = res.data.data.list;
      for (let store of data) {
        store.isCheck = false;
        for (let product of store.orderItems) {
          product.isCheck = false;
        }
      }
      Taro.stopPullDownRefresh();
      this.isMount = true;
      this.setPageLoading(false);
      this.setState({
        cartList: data,
        isCheckAll: false,
        totalPrice: 0,
        selectedPId: [],
        isLevel: Taro.getStorageSync('isLevel'),
        levelRate: Taro.getStorageSync('levelRate'),
      });
    } catch (err) {
      Taro.stopPullDownRefresh();
      this.isMount = true;
      this.setPageLoading(false);
    }
  }

  toggleCheckAll(e: boolean) {
    const { cartList } = this.state;
    for (let store of cartList) {
      store.isCheck = e;
      for (let product of store.orderItems) {
        if (product.status < 0 || product.stockQty === 0) {
          continue;
        }
        product.isCheck = e;
      }
    }
    this.setState({
      cartList,
    },() => {
      this.calculatePrice();
    });
  }

  // 选择商品
  onProductCheck(sIndex: number, pIndex: number, value: boolean) {
    let { cartList } = this.state;
    cartList[sIndex].orderItems[pIndex].isCheck = value;
    // 已选择的商品
    let selectedList = cartList[sIndex].orderItems.filter(item => {
      return item.isCheck === true;
    });
    // 没下架或者售罄的商品列表
    let canSelectedList = cartList[sIndex].orderItems.filter(item => {
      return !(item.status < 0 || item.stockQty === 0);
    });
    // 是否全选了
    cartList[sIndex].isCheck = selectedList.length === canSelectedList.length ? true : false;
    this.setState({
      cartList,
    },() => {
      this.calculatePrice();
    });
  }

  // 删除购物车商品
  onDeleteCart(id: string) {
    Taro.showModal({
      title: '提示',
      content: '确认要将这件商品删除吗',
    }).then(res => {
      if (res.confirm) this.cartDelete(id)
    });
  }
  async cartDelete(id: string) {
    await this.$api.mall.cartDelete({id})
    this.getCartList()
  }

  /**
   * 改变购物车商品数量
   * @param {Number} sIndex 商店下标
   * @param {Number} pIndex 商店下的商品下标
   * @param {String} type 操作 add || del
   * @param {Number} value 数量
   */
  async onQtyChange(sIndex: number, pIndex: number, type: 'add' | 'del', value: number) {
    let item = this.state.cartList[sIndex].orderItems[pIndex];
    // 目前的商品数量
    let qty = item.qty;
    let params: any = {
      id: item.id,
    };
    let res = null;
    if (type === 'add') {
      params.qty = value - qty;
      res = await this.$api.mall.addCartNum(params);
    } else {
      params.qty = qty - value;
      res = await this.$api.mall.deducteCartNum(params);
    }
    if (res) {
      item.qty = value;
      this.setState({
        cartList: this.state.cartList,
      },() => {
        this.calculatePrice();
      });
    }
  }

  // 计算总价钱
  calculatePrice() {
    let totalPrice = 0;
    let offerPrice = 0;
    let selectedPId: any[] = [];
    let isCheckAll = true;
    const { cartList } = this.state;
    if (!cartList.length) {
      isCheckAll = false;
    } else {
      for (let store of cartList) {
        if (!store.isCheck) isCheckAll = false;
        for (let product of store.orderItems) {
          if (product.isCheck) {
            selectedPId.push(product.id);
            totalPrice += product.price * product.qty;
            offerPrice += product.nowPrice - product.price;
          }
        }
      }
    }
    this.setState({
      totalPrice,
      offerPrice,
      selectedPId,
      isCheckAll,
    });
  }

  onConfirmBuy(e: any) {
    const { selectedPId } = this.state;
    if (selectedPId.length) {
      let id = selectedPId.join('_');
      let formId = e.detail.formId;
      let url = `/pagesCommon/confirm-order/index?id=${id}&formId=${formId}`;
      this.navigateTo(url);
    } else {
      Taro.showToast({
        title: '请先选择商品',
        icon: 'none',
      });
    }
  }

  render() {
    const { imgHost, isCheckAll, cartList, totalPrice, offerPrice, isLevel, levelRate, selectedPId } = this.state;
    return (
      <View className="page-card">
        <LoadingBox visible={this.state.pageLoading} />
        <Form reportSubmit onSubmit={this.onConfirmBuy.bind(this)}>
          <View className="cart-list">
            {cartList.map((store, sIndex) => {
              return (
                <View className="store-item" key={store.storeId}>
                  <View className="product-list">
                    {store.orderItems.map((product: any, pIndex: number) => {
                      return (
                        <View className="product" key={product.id}>
                          <View className="content">
                            <View className="cover">
                              <CheckBtn
                                disabled={product.status < 0 || product.stockQty === 0}
                                value={product.isCheck}
                                onChange={this.onProductCheck.bind(this, sIndex, pIndex)}
                              />
                              <Image
                                className="img"
                                mode="aspectFill"
                                src={imgHost + product.iconUrl}
                                onClick={this.navigateTo.bind(
                                  this,
                                  `/pagesCommon/product/detail/index?id=${product.productId}`,
                                )}
                              />
                            </View>
                            <View className="info">
                              <View className="info__name">{product.name}</View>
                              <View className="info__specs">{product.specs}</View>
                              <View className="info__price">
                                <View className="price">{util.filterPrice(product.nowPrice)}</View>
                                {product.origPrice > 0 && (
                                  <View className="origin-price">￥{util.filterPrice(product.origPrice)}</View>
                                )}
                              </View>
                              <View className="info__action">
                                {product.status === 0 ? (
                                  product.stockQty > 0 ? (
                                    <InputNumber
                                      min={1}
                                      max={product.stockQty}
                                      step={1}
                                      value={product.qty}
                                      onAdd={this.onQtyChange.bind(this, sIndex, pIndex, 'add')}
                                      onSub={this.onQtyChange.bind(this, sIndex, pIndex, 'sub')}
                                    />
                                  ) : (
                                    <View className="invalid">商品已售罄</View>
                                  )
                                ) : (
                                  <View className="invalid">商品已下架</View>
                                )}
                                <View
                                  className="iconfont ilajitong"
                                  onClick={this.onDeleteCart.bind(this, product.id)}
                                />
                              </View>
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
          {!cartList.length && <EmptyDataBox img={this.imgHost + '/attachments/static/cart.png'} title="暂无购物车商品" />}
          <DividingLine />
          <View className="bottom-wrapper">
            <View className="content">
              <CheckBtn value={isCheckAll} onChange={this.toggleCheckAll.bind(this)} text="全选" />
              <View className="pay-info">
                <View className="total">
                  <Text>合计：</Text>
                  <Text className="price">￥{util.filterPrice(totalPrice)}</Text>
                </View>
                {/* {selectedPId.length > 0 &&
                  (!isLevel ? (
                    <View className="offer" onClick={this.navigateTo.bind(this, '/pages/mine/member-rule/index')}>
                      <Text>会员立省￥{util.filterPrice(totalPrice * levelRate)}</Text>
                    </View>
                  ) : (
                    <View
                      className="offer"
                      onClick={this.navigateTo.bind(this, '/pages/mine/member-rule/index?isLevel=1')}
                    >
                      <Text>会员已省￥{util.filterPrice((offerPrice)}</Text>
                    </View>
                  ))} */}
              </View>
            </View>
            <Button className="action" formType="submit">
              去结算
            </Button>
          </View>
        </Form>
      </View>
    );
  }
}

export default Cart