import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image, ScrollView, Button, Form } from '@tarojs/components'
// import { AtInputNumber } from 'taro-ui'
import './index.scss'
import BaseComponent from '@/utils/components'
import util from '@/utils/util'

import { SwiperWrap, LogoWrap, CantuanItem, DividingLine, SmallEvaluateItem, RecommendWrap, VipPrice, OpenVip, Dialog, AssemblePriceWrap, ContentWrap, BroadcastWrap, LoadingBox, ShareWrap, BottomTab } from '@/components/index'

type StateType = {
  pageLoading: boolean;
  joinGroup: any
  joinGroupList: any[]
  specsVisible: boolean;
  shareVisible: boolean;
  moreGroupVisible: boolean
  productList: any[];
  broadcastList: any[]
  broadcast: any
  query: any
  product: any
  productSwiperItem: any
  productStock: any
  propertys: any[]
  collected: boolean
  isSelectedProduct: boolean
  model: any
  organizeOrderId: string
  productEvaluateInfo: any
  productEvaluate: any[]
  transportExpenses: any
}

interface GroupProductDetail {
  state: StateType
}

class GroupProductDetail extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '拼团商品详情',
  }

  searchData: any
  isExpire: boolean
  broadcastList: any[]
  isTimer: boolean

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      organizeOrderId: '',
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
        type: 'alone',
        price: 0,
        qty: 0,
        iconUrl: '',
        info: {},
      },
      propertys: [],
      isSelectedProduct: false,
      broadcastList: [],
      broadcast: {},
      joinGroup: {},
      joinGroupList: [],
      specsVisible: false,
      shareVisible: false,
      moreGroupVisible: false,
      productList: [],
      productEvaluateInfo: {},
      productEvaluate: [],
      transportExpenses: {},
    }
    this.searchData = {
      pageNum: 0,
      pageSize: 20,
      total: 0,
    }
    this.isExpire = false // 时间到
    this.broadcastList = []
    this.isTimer = true
  }

  componentWillMount() {
    Taro.hideShareMenu();
    const query = this.$router.params
    query.id = query.id || query.scene
    console.log('query', query)

    const storeId = Taro.getStorageSync('storeId')
    this.searchData.groupShoppingId = query.id
    this.setState({ 
      query,
      organizeOrderId: query.organizeOrderId
    })
    let params: any = {
      storeId,
      groupShoppingId: query.id
    }
    this.groupProductGet(params)
    this.listOrganizerOrder({groupShoppingId: query.id})
    this.groupProductPage(query.id)
  }

  /**
   * 分享
   */
  onShareAppMessage() {
    const { product, query } = this.state
    return {
      title: product.name,
      imageUrl: this.imgHost + product.iconUrl,
      path: '/pagesCommon/group-product/detail/index?id=' + query.id
    }
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
   * 获取团购商品详情
   * @param groupShoppingId 团购商品id
   * @param storeId 门店id
   */
  async groupProductGet(params: any) {
    let { productStock } = this.state
    const res = await this.$api.mall.groupProductGet(params)
    console.log(res.data)
    let data = res.data.data
    // 处理轮播图数据
    let imgList = data.product.rollingImgUrl.split('_');
    imgList = imgList.map((item: string) => {
      return this.imgHost + item
    });

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
    productStock.groupOrganizerPrice = data.product.groupOrganizerPrice;
    productStock.qty = data.product.qty;
    productStock.iconUrl = data.product.iconUrl;

    this.setState({
      collected: data.collected,
      productSwiperItem: imgList,
      product: data.product,
      productStock,
      propertys,
      transportExpenses: data.transportExpenses,
    }, () => {
      if (propertys.length === choiceProp) {
        this.getProductStock();
      }
      this.setPageLoading(false)
      this.getProductEvaluateInfo(data.product.id)
      this.getChosenEvaluate(data.product.id)
      this.listOrganizer()
    })
  }

  /**
   * 发起的拼团订单
   * @param params groupShoppingId
   */
  async listOrganizerOrder(params: any) {
    const res = await this.$api.mall.listOrganizerOrder(params)
    this.setState({
      joinGroup: res.data.data
    })
    this.pageOrganizerOrder()
  }
  /**
   * 发起的拼团订单(分页)
   * @param isLoadMore 
   */
  async pageOrganizerOrder() {
    let { joinGroupList } = this.state
    this.searchData.pageNum++
    const res = await this.$api.mall.pageOrganizerOrder(this.searchData)
    const data = res.data.data

    this.setState({
      joinGroupList: [...joinGroupList, ...data.list],
    })
  }
  /**
   * 拼团订单轮播显示
   */
  async listOrganizer() {
    const res = await this.$api.mall.listOrganizer()
    this.broadcastList = res.data.data
    // this.setState({
    //   broadcastList: res.data.data
    // })
    if (this.broadcastList.length > 0) {
      this.setBroadcast()
    } 
  }

  setBroadcast() {
    setTimeout(() => {
      this.setState({
        // broadcast: params
        broadcast: this.broadcastList.shift()
      })
      setTimeout(() => {
        this.setState({
          broadcast: {}
        })
        if (this.broadcastList.length > 0 && this.isTimer) {
          this.setBroadcast()
        }
      }, 5000)
    }, 5000)
    
  }


  /**
   * 拼团商品列表
   */
  async groupProductPage(id: string) {
    const res = await this.$api.mall.groupProductPage({pageNum: 1, pageSize: 6})
    let list = res.data.data.list.filter((item: any) => {
      return id !== item.groupShoppingId
    })
    this.setState({
      productList: list
    })
  }

  handleBottom() {
    let { joinGroupList } = this.state;
    if (this.isHasNextPage(this.searchData, joinGroupList.length)) {
      this.pageOrganizerOrder()
    }
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

    let params: any = {
      groupShoppingId: query.id
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

    let res = await this.$api.mall.groupProductStock(params)
    let data = res.data.data
    productStock.price = data.price;
    productStock.groupPrice = data.groupPrice;
    productStock.groupOrganizerPrice = data.groupOrganizerPrice;
    productStock.qty = data.qty;
    productStock.iconUrl = data.iconUrl;
    model.id = data.id;
    model.groupShoppingItemId = data.groupShoppingItemId
    let status = data.qty > 0 ? true : false;
    this.setState({
      model: model,
      isSelectedProduct: status,
      productStock,
    });
  }


  /**
   * 团购
   */
  async handleGroupBuy() {
    if (this.isExpire) {
      this.showToast('拼团活动已结束，请选择其他拼团商品')
      return
    }
    let { isSelectedProduct, model, organizeOrderId } = this.state
    console.log('handleGroupBuy', organizeOrderId)
    if (!isSelectedProduct) {
      this.showToast('请选择规格')
      return
    }
    this.setDialogVisible(false, 'specsVisible')
    this.isTimer = false
    this.navigateTo(`/pagesCommon/confirm-order/index?id=${model.groupShoppingItemId}&type=group&organizeOrderId=${organizeOrderId || ''}`)
  }

  async nowBuy(e: any) {
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
    const res = await this.$api.mall.nowBuy(params)
    this.setDialogVisible(false, 'specsVisible')
    this.isTimer = false
    this.navigateTo(`/pagesCommon/confirm-order/index?id=${res.data.data.id}`)
    this.setDialogVisible(false, 'specsVisible')
  }

  handleBuyType(type: string, joinId: string) {
    if (this.isExpire) {
      this.showToast('拼团活动已结束，请选择其他拼团商品')
      return
    }
    let { moreGroupVisible, productStock, organizeOrderId } = this.state
    if (moreGroupVisible) this.setDialogVisible(false, 'moreGroupVisible')
    productStock.type = type
    if (joinId) organizeOrderId = joinId
    this.setState({
      productStock,
      organizeOrderId,
    }, () => {
      this.setDialogVisible(true, 'specsVisible')
    })
  }

  // 到计时结束
  handleTimeEnd() {
    this.isExpire = true
  }


  render() {
    const { pageLoading, query, joinGroup, specsVisible, shareVisible, productList, broadcast, collected, productSwiperItem, product, productStock, propertys, isSelectedProduct, model, moreGroupVisible, joinGroupList, productEvaluateInfo, productEvaluate, transportExpenses, organizeOrderId } = this.state

    return (
      <View className="group-product-detail">

        <LoadingBox visible={pageLoading} />

        {broadcast.groupShoppingId &&
          <BroadcastWrap item={broadcast} />
        }
        {/* <BroadcastWrap item={broadcast} /> */}

        {productSwiperItem &&
          <SwiperWrap swiperData={productSwiperItem} isDetail={true} />
        }
        
        <AssemblePriceWrap price={organizeOrderId ? product.groupPrice : product.groupOrganizerPrice} endTime={product.groupEndTime} num={product.groupQuantity} onEnd={this.handleTimeEnd.bind(this)} />

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
            {transportExpenses && transportExpenses.amount > 0 ?
            <View className="kuai">快递：{util.filterPrice(transportExpenses.amount)}元，满{util.filterPrice(transportExpenses.freeAmount)}元包邮，满{transportExpenses.freeQuantity}件包邮</View>
            :
            <View className="kuai">快递：包邮</View>
            }
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
                  return infoItem === 'groupShoppingId' ? '' : <Text key={infoItem}>"{productStock.info[infoItem]}"</Text>;
                })}
              </Text>
            ) : (
              <Text className="black">请选择规格</Text>
            )}

            <Text className="iconfont iyoujiantou"></Text>
          </View>
        </View>

        {joinGroup.quantity && joinGroup.quantity > 0 &&
          <View>
            <View className="desc-wrap">
              <Text>邀请组图，满员成功，不满员自动退款</Text>
              <Text className="iconfont icon-share"></Text>
            </View>

            <View className="pindan-wrap">
              <View className="p-title">
                <View className="title">
                  <Text className="num">{joinGroup.quantity}</Text>
                  <Text>人正在拼单，可直接参与</Text>
                </View>
                <View className="more" onClick={this.setDialogVisible.bind(this, true, 'moreGroupVisible')}>
                  <Text>更多</Text>
                  <Text className="iconfont iyoujiantou"></Text>
                </View>
              </View>
              <View>
                {joinGroup.list.map((item: any, index: number) => {
                  return <CantuanItem item={item} index={index} key={item.id} onJoin={this.handleBuyType.bind(this)} />
                })}
              </View>
            </View>
          </View>
        }

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

        {productList.length > 0 &&
          <View>
            <DividingLine />
            <RecommendWrap list={productList} url="/pagesCommon/group-product/index" title="大家都在拼" />
          </View>
        }

        <View className="bottom-wrap">
          <BottomTab onShare={this.setDialogVisible.bind(this, true, 'shareVisible')} isPoster={true} />

          <View className="right-btn-wrap">
            <View className="alone" onClick={this.handleBuyType.bind(this, 'alone', '')}>
              <View>￥{util.filterPrice(productStock.price)}</View>
              <View>单独购买</View>
            </View>
            <View className="group" onClick={this.handleBuyType.bind(this, 'group', '')}>
              <View>￥{util.filterPrice(organizeOrderId ? productStock.groupPrice : productStock.groupOrganizerPrice)}</View>
              <View className="one">{query.join ? '我要参团' : '一键开团'}</View>
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
                  {productStock.type === 'group' ? 
                    <View className="price">{util.filterPrice(organizeOrderId ? productStock.groupPrice : productStock.groupOrganizerPrice)}</View>
                    :
                    <View className="price">{util.filterPrice(productStock.price)}</View>
                  }
                  {/* <VipPrice vipPrice={78.5} style={{marginLeft: '15rpx'}} /> */}
                </View>
                <View className="qty">库存{productStock.qty <= 0 ? '0' : productStock.qty}件</View>
                {isSelectedProduct ? (
                  <View className="choice">
                    已选择：
                    {Object.keys(productStock.info).map(infoItem => {
                      return infoItem === 'groupShoppingId' ? '' : <Text key={infoItem}>"{productStock.info[infoItem]}"</Text>
                      // return <Text key={infoItem}>"{productStock.info[infoItem]}"</Text>
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
            {/* <View className="qty-wrap">
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
            </View> */}

            <View className="d-btn-wrap">
              {productStock.type === 'group' ? 
                <Form 
                  reportSubmit onSubmit={this.handleGroupBuy.bind(this)}
                  className="form-btn"
                >
                  <Button className="confirm" formType="submit">确定</Button>
                </Form>
                :
                <Form 
                  reportSubmit onSubmit={this.nowBuy.bind(this)}
                  className="form-btn"
                >
                  <Button className="confirm" formType="submit">立即购买</Button>
                </Form>
              }
            </View>

          </View>
        </Dialog>

        {/* 分享组件 */}
        <ShareWrap 
          visible={shareVisible}
          onClose={this.setDialogVisible.bind(this, false, 'shareVisible')}
          // posterId={query.id}
          params={{id: query.id}}
          apiStr="createGroupShoppingPoster"
        />

        {/* 更多拼单弹窗 */}
        <Dialog
          visible={moreGroupVisible}
          position="center"
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'moreGroupVisible')}
        >
          <View className="more-group-dialog">
            <View 
              className="iconfont iguanbi1"
              onClick={this.setDialogVisible.bind(this, false, 'moreGroupVisible')}
            ></View>
            <View className="d-title">正在拼单</View>
            <ScrollView scrollY className="group-list" onScrollToLower={this.handleBottom.bind(this)}>
              {joinGroupList.map((item: any, index: number) => {
                return <CantuanItem item={item} index={index} key={item.id} type="page" onJoin={this.handleBuyType.bind(this)} />
              })}
            </ScrollView>
          </View>
        </Dialog>
    
      </View>
    )
  }
}


export default GroupProductDetail