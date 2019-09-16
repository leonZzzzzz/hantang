import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button, Form } from '@tarojs/components'
import { AtInputNumber } from 'taro-ui'
import './index.scss'
import BaseComponent from '@/utils/components'
import util from '@/utils/util'

import { SwiperWrap, LogoWrap, CantuanItem, DividingLine, SmallEvaluateItem, VipPrice, OpenVip, Dialog, AssemblePriceWrap, ContentWrap, BroadcastWrap, LoadingBox, ShareWrap, BottomTab } from '@/components/index'

type StateType = {
  pageLoading: boolean;
  specsVisible: boolean;
  shareVisible: boolean;
  query: any
  product: any
  productSwiperItem: any
  productStock: any
  propertys: any[]
  collected: boolean
  isSelectedProduct: boolean
  model: any
  productEvaluateInfo: any
  productEvaluate: any[]
}

interface ProductDetail {
  state: StateType
}

class ProductDetail extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '商品详情',
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      query: {},
      collected: false,  // 收藏
      // 选择的商品信息
      model: {
        id: '',
        qty: 1,
      },
      // 商品信息
      product: {
        qty: 1,
        enabledBuy: true,
        isSell: true,
      },
      productSwiperItem: [],
      productStock: {
        price: 0,
        qty: 0,
        iconUrl: '',
        info: {},
      },
      propertys: [],
      isSelectedProduct: false,
      specsVisible: false,
      shareVisible: false,
      productEvaluateInfo: {},
      productEvaluate: [],
    }
  }

  componentWillMount() {
    Taro.hideShareMenu();
    const query = this.$router.params
    const storeId = Taro.getStorageSync('storeId')
    this.setState({ query })

    let params: any = {
      storeId,
      id: query.id
    }
    this.productGet(params)
    this.getProductEvaluateInfo(query.id)
    this.getChosenEvaluate(query.id)
  }

  onShareAppMessage() {
    const { product } = this.state
    return {
      title: product.name,
      imageUrl: this.imgHost + product.iconUrl,
      path: '/pagesCommon/group-product/detail/index?id=' + product.id
    }
  }

  /**
   * 获取商品详情
   * @param id 商品id
   * @param storeId 门店id
   */
  async productGet(params: any) {
    let { productStock } = this.state
    const res = await this.$api.mall.productGet(params)
    console.log(res.data)
    let data = res.data.data
    // 处理轮播图数据
    let imgList = data.product.rollingImgUrl.split('_');
    imgList = imgList.map((item: string) => {
      return this.imgHost + item
    });
    console.log('imgList', imgList)
    // 处理规格数据
    let choiceProp = 0;
    let propertys = data.propertyList.map(item => {
      // 如果每个规格列表都只有一个时则默认选择
      if (item.valueList.length === 1) {
        item.selectIndex = 0;
        choiceProp++;
      } else {
        item.selectIndex = '';
      }
      return item;
    });
    productStock.price = data.product.price;
    productStock.groupPrice = data.product.groupPrice;
    productStock.qty = data.product.qty;
    productStock.iconUrl = data.product.iconUrl;
    this.setState({
      collected: data.collected,
      productSwiperItem: imgList,
      product: data.product,
      productStock,
      propertys,
    }, () => {
      if (propertys.length === choiceProp) {
        this.getProductStock();
      }
      this.setPageLoading(false)
    })
    
  }

  /**
   *  获取商品评价汇总数据
   */
  async getProductEvaluateInfo(productId: string) {
    const res = await this.$api.mall.getProductEvaluateInfo({productId})
    this.setState({
      productEvaluateInfo: res.data.data,
    })
  }
  /**
   *  获取精选的商品评价列表
   */
  async getChosenEvaluate(productId: string) {
    const res = await this.$api.mall.getChosenEvaluate({productId, chosenNum: 10})
    this.setState({
      productEvaluate: res.data.data.list,
    });
  }

  /**
   * 喜欢
   */
  async handleLike() {
    const { collected, product } = this.state
    let type = collected ? 'delCollection' : 'addCollection'
    console.log(type)
    let params = {
      productId: product.id,
      storeId: product.storeId
    }
    await this.$api.mall[type](params)
    this.setState({
      collected: !collected
    });
  }

  /**
   * 购买数量
   * @param val 数量
   */
  onChangeQty(val: number): void {
    this.setState((preState: any) => {
      preState.model.qty = val
    })
  }

  /**
   * 选择规格
   * @param index 规格下标
   * @param vIndex 规格子项下标
   */
  selectProperty(index: number, vIndex: number) {
    let { propertys, model } = this.state;
    propertys[index].selectIndex = vIndex;
    model.qty = 1;
    this.setState({
      propertys,
      model,
    }, () => {
      this.getProductStock();
    });
  }

  /**
   * 获取商品规格库存
   */
  async getProductStock() {
    let { propertys, query, productStock, model } = this.state

    let params: any = {}
    if (query.type === 'group') params.groupShoppingId = query.id
    else params.productId = query.id

    for (let i = 0; i < propertys.length; i++) {
      let index = propertys[i].selectIndex;
      // 未选择对应的规格
      if (index === '') {
        return;
      } else {
        let value = propertys[i].valueList[index];
        params[`spec${i + 1}Value`] = value;
      }
    }
    // 设置选择的商品规格信息
    productStock.info = params

    let res = await this.$api.mall.productStock(params)
    let data = res.data.data
    productStock.price = data.price;
    productStock.qty = data.qty;
    productStock.iconUrl = data.iconUrl;
    model.id = data.id;
    let status = data.qty > 0 ? true : false;
    this.setState({
      model: model,
      isSelectedProduct: status,
      productStock,
    });
  }

  /**
   * 购买商品
   * @param type 购买类型 addToCart | nowBuy
   * @param e Event
   */
  async handleBuy(type: string, e: any) {
    console.log(type, e)
    let { isSelectedProduct, model } = this.state
    if (!isSelectedProduct) {
      this.showToast('请选择规格')
      return
    }
    let params = {
      ...model,
      storeId: this.state.product.storeId,
      wxMiniFormId: e.detail.formId
    }
    const res = await this.$api.mall[type](params)
    if (type === 'addToCart') this.showToast('成功加入购物车')
    else this.navigateTo(`/pagesCommon/confirm-order/index?id=${res.data.data.id}`)
    this.setDialogVisible(false, 'specsVisible')
  }

  render() {
    const { pageLoading, specsVisible, shareVisible, collected, productSwiperItem, product, productStock, propertys, isSelectedProduct, model, productEvaluateInfo, productEvaluate } = this.state

    return (
      <View className="assemble-detail">

        <LoadingBox visible={pageLoading} />

        {productSwiperItem &&
          <SwiperWrap swiperData={productSwiperItem} isDetail={true} />
        }

        <View className="title-wrap">
          <View className="top">
            <View className="left">
              <View className="title">{product.name}</View>
              <View className="price-wrap">
                <Text className="price">{util.filterPrice(product.price)}</Text>
                {/* <VipPrice vipPrice={23.33} style={{marginLeft: '20rpx'}} /> */}
                <Text className="origin-price">￥{util.filterPrice(product.origPrice)}</Text>
              </View>
            </View>
            <View className="right" onClick={this.handleLike.bind(this)}>
              <Text className={`iconfont ${collected ? 'ixihuan1' : 'ixihuan'}`}></Text>
              <Text>喜欢</Text>
            </View>
          </View>
          
          {/* <OpenVip /> */}

          <View className="bottom">
            <View className="kuai">快递：包邮</View>
            <View className="gou">已售{product.salesQuantity || 0}件</View>
          </View>
        </View>

        <View className="specs-wrap">
          <View className="unit">规格</View>
          <View className="value" onClick={this.setDialogVisible.bind(this, true, 'specsVisible')}>
            {isSelectedProduct ? (
              <Text className="black">
                已选择：
                {Object.keys(productStock.info).map(infoItem => {
                  return infoItem === 'productId' ? '' : <Text key={infoItem}>"{productStock.info[infoItem]}"</Text>;
                })}
              </Text>
            ) : (
              <Text className="black">请选择规格</Text>
            )}

            <Text className="iconfont iyoujiantou"></Text>
          </View>
        </View>

        {productEvaluateInfo.totalQuantity && 
          <View>
            <DividingLine />
            <View className="evaluate-wrap">
              <View className="e-title">
                <View className="title">商品评价（{productEvaluateInfo.totalQuantity}）</View>
                <View className="more" onClick={this.navigateTo.bind(this, `/pagesMine/mine/evaluate/list/index?productId=${product.id}`)}>
                  <Text>好评率</Text>
                  <Text className="red">{productEvaluateInfo.goodRate * 100}%</Text>
                  <Text className="iconfont iyoujiantou"></Text>
                </View>
              </View>
              <ScrollView className="list" scrollX>
                {productEvaluate.map((item: any, index: number) => {
                  return <SmallEvaluateItem item={item} index={index} key={item} />
                })}
              </ScrollView>
            </View>
          </View>
        }
       

        <DividingLine />

        <ContentWrap title="商品详情" content={product.content} />

        <View className="bottom-wrap">
          <BottomTab />

          <View className="right-btn-wrap">
            <View className="now-buy" onClick={this.setDialogVisible.bind(this, true, 'specsVisible')}>
              <View className="m-r">￥{util.filterPrice(productStock.price)}</View>
              <View>我要购买</View>
            </View>
          </View>

        </View>

        <LogoWrap bottom={110} />


        {/* 选择规格购买弹窗 */}
        <Dialog
          visible={specsVisible}
          position="bottom"
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'specsVisible')}
        >
    
          <View className="assemble-dialog">
            <View className="close" onClick={this.setDialogVisible.bind(this, false, 'specsVisible')}>
              <Text className="iconfont iguanbi1"></Text>
            </View>
            <View className="info-section">
              <View className="cover">
                {productStock.iconUrl && (
                  <Image className="img" mode="aspectFill" src={this.imgHost + productStock.iconUrl} />
                )}
                {productStock.qty <= 0 && (
                  <View className="sold-out">
                    <Text className="sold-out-text">已售罄</Text>
                  </View>
                )}
              </View>
              <View className="content">
                <View className="price-wrap">
                  <View className="price">{util.filterPrice(productStock.price)}</View>
                  {/* <VipPrice vipPrice={78.5} style={{marginLeft: '15rpx'}} /> */}
                </View>
                <View className="qty">库存{productStock.qty <= 0 ? '0' : productStock.qty}件</View>
                {isSelectedProduct ? (
                  <View className="choice">
                    已选择：
                    {Object.keys(productStock.info).map(infoItem => {
                      return infoItem === 'productId' ? '' : <Text key={infoItem}>"{productStock.info[infoItem]}"</Text>
                    })}
                  </View>
                ) : (
                  <View className="choice">{productStock.qty <= 0 ? '已售罄' : '请选择规格'}</View>
                )}
              </View>
            </View>
            <View className="specs-list">
              {propertys.map((item: any, index: number) => {
                return (
                  <View className="specs-section" key={item.name}>
                    <View className="key">{item.note}</View>
                    <View className="value">
                      {item.valueList.map((value: string, vIndex: number) => {
                        return (
                          <View 
                            className={`item ${item.selectIndex === vIndex ? 'selected' : ''}`}
                            key={value}
                            onClick={this.selectProperty.bind(this, index, vIndex)}
                          >{value}</View>
                        )
                      })}
                    </View>
                  </View>
                )
              })}
            </View>
            <View className="qty-wrap">
              <View className="key">数量</View>
              <AtInputNumber
                className="number"
                type="number"
                min={1}
                max={productStock.qty}
                step={1}
                value={model.qty}
                onChange={this.onChangeQty.bind(this)}
              />
            </View>

            <View className="d-btn-wrap">
              <Form 
                reportSubmit onSubmit={this.handleBuy.bind(this, 'addToCart')}
                className="form-btn"
              >
                <Button className="border" formType="submit">加入购物车</Button>
              </Form>
              <Form 
                reportSubmit onSubmit={this.handleBuy.bind(this, 'nowBuy')}
                className="form-btn"
              >
                <Button className="confirm" formType="submit">立即购买</Button>
              </Form>
            </View>

          </View>
        </Dialog>


        {/* 分享组件 */}
        {/* <ShareWrap 
          visible={shareVisible}
          onClose={this.setDialogVisible.bind(this, false, 'shareVisible')}
        /> */}
      </View>
    )
  }
}


export default ProductDetail