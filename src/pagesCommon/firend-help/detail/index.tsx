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
  query: any
  product: any
  productSwiperItem: any
  productStock: any
  propertys: any[]
  isSelectedProduct: boolean
  model: any
}

interface GroupProductDetail {
  state: StateType
}

class GroupProductDetail extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '拼团商品详情',
  }

  searchData: any

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      query: {},
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
        type: 'alone',
        price: 0,
        qty: 0,
        iconUrl: '',
        info: {},
      },
      propertys: [],
      isSelectedProduct: false,
      specsVisible: false,
    }
    this.searchData = {
      pageNum: 0,
      pageSize: 20,
      total: 0,
    }
  }

  componentWillMount() {
    const query = this.$router.params
    const storeId = Taro.getStorageSync('storeId')

    this.setState({ 
      query,
     })
     let params: any = {
      storeId,
      helpShoppingId: query.id
    }
    this.helpProductGet(params)
  }


  /**
   * 获取助力商品详情
   * @param helpShoppingId 助力商品id
   * @param storeId 门店id
   */
  async helpProductGet(params: any) {
    let { productStock } = this.state
    const res = await this.$api.mall.helpProductGet(params)
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
    productStock.price = data.product.helpPrice;
    productStock.qty = data.product.qty;
    productStock.iconUrl = data.product.iconUrl;
    this.setState({
      productSwiperItem: imgList,
      product: data.product,
      productStock,
      propertys,
    }, () => {
      if (propertys.length === choiceProp) {
        this.helpProductStock();
      }
      this.setPageLoading(false)
    })
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
      this.helpProductStock();
    });
  }

  /**
   * 获取商品规格库存
   */
  async helpProductStock() {
    let { propertys, query, productStock, model } = this.state

    let params: any = {
      helpShoppingId: query.id
    }

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

    let res = await this.$api.mall.helpProductStock(params)
    let data = res.data.data
    productStock.price = data.helpPrice;
    productStock.qty = data.qty;
    productStock.iconUrl = data.iconUrl;
    model.helpShoppingItemId = data.helpShoppingItemId
    let status = data.qty > 0 ? true : false;
    this.setState({
      model: model,
      isSelectedProduct: status,
      productStock,
    });
  }


  /**
   * 助力购
   */
  async handleHelpBuy() {
    let { isSelectedProduct, model } = this.state
    if (!isSelectedProduct) {
      this.showToast('请选择规格')
      return
    }
    this.setDialogVisible(false, 'specsVisible')
    this.navigateTo(`/pagesCommon/confirm-order/index?id=${model.helpShoppingItemId}&type=help`)
  }


  render() {
    const { pageLoading, specsVisible, productSwiperItem, product, productStock, propertys, isSelectedProduct } = this.state

    return (
      <View className="group-product-detail">

        <LoadingBox visible={pageLoading} />

        {productSwiperItem &&
          <SwiperWrap swiperData={productSwiperItem} isDetail={true} />
        }
        
        <AssemblePriceWrap price={product.helpPrice} endTime={product.helpEndTime} num={product.helpQuantity} origPrice={product.price} tag="好友助力" />

        <View className="title-wrap">
          <View className="top">
            <View className="left">
              <View className="title">{product.name}</View>
            </View>
          </View>
          
        </View>

        <View className="specs-wrap">
          <View className="unit">规格</View>
          <View className="value" onClick={this.setDialogVisible.bind(this, true, 'specsVisible')}>
            {isSelectedProduct ? (
              <Text className="black">
                已选择：
                {Object.keys(productStock.info).map(infoItem => {
                  return infoItem === 'helpShoppingId' ? '' : <Text key={infoItem}>"{productStock.info[infoItem]}"</Text>;
                })}
              </Text>
            ) : (
              <Text className="black">请选择规格</Text>
            )}

            <Text className="iconfont iyoujiantou"></Text>
          </View>
        </View>

        <View className="desc-wrap">
          <Text>邀请好友助力，满员成功，不满员自动退款</Text>
          <Text className="iconfont icon-share"></Text>
        </View>

        <ContentWrap title="商品详情" content={product.content} />


        <View className="bottom-wrap">
          <BottomTab isShare={false} />

          <View className="right-btn-wrap">
            <View className="alone" onClick={this.setDialogVisible.bind(this, true, 'specsVisible')}>
              <View>立即购买</View>
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
                </View>
                <View className="qty">库存{productStock.qty <= 0 ? '0' : productStock.qty}件</View>
                {isSelectedProduct ? (
                  <View className="choice">
                    已选择：
                    {Object.keys(productStock.info).map(infoItem => {
                      return infoItem === 'helpShoppingId' ? '' : <Text key={infoItem}>"{productStock.info[infoItem]}"</Text>
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

            <View className="d-btn-wrap">
              <Form 
                reportSubmit onSubmit={this.handleHelpBuy.bind(this)}
                className="form-btn"
              >
                <Button className="confirm" formType="submit">立即购买</Button>
              </Form>
            </View>

          </View>
        </Dialog>

      </View>
    )
  }
}


export default GroupProductDetail