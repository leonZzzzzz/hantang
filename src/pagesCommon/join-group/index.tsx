import Taro, { Config } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'

import './index.scss'
// import config from '@/config'
import dot from '@/img/dot.png'
import BaseComponent from '@/utils/components'

import { JoinGroupItem, CountDown, LogoWrap, RecommendWrap, LoadingBox } from '@/components/index'

type StateType = {
  pageLoading: boolean
  isJoin: boolean;
  recommendList: any[];
  list: any[]
  order: any
  self: any
  orderId: string
  type: string
}

interface JoinAssemble {
  state: StateType
}

class JoinAssemble extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '拼团详情',
    navigationBarBackgroundColor: '#ff3333',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true,
  }

  type: string

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      list: [],
      order: {},
      self: {},
      recommendList: [],
      isJoin: false,
      orderId: '',
      type: '',
    }
    this.type = ''
  }

  componentWillMount() {
    const { id, type } = this.$router.params

    this.type = type
    this.setState({
      type,
      orderId: id
    })
    if (type === 'journey') {
      this.journeyGroupOrderDetail(id)
    } else {
      this.groupDetail(id)
      this.groupProductPage()
    }
  }

  onPullDownRefresh() {
    const { type, orderId } = this.state
    this.setPageLoading(true)
    if (type === 'journey') {
      this.journeyGroupOrderDetail(orderId)
    } else {
      this.groupDetail(orderId)
      this.groupProductPage()
    }
  }

  onShareAppMessage() {
    const { order } = this.state
    return {
      title: order.orderItems[0].name,
      imageUrl: this.imgHost + order.orderItems[0].iconUrl,
      path: '/pagesCommon/join-group/index?id=' + this.$router.params.id
    }
  }

  /**
   * 商品订单参团情况
   * @param orderId 订单id
   */
  async groupDetail(orderId: string) {
    const res = await this.$api.mall.groupDetail({orderId})
    let data = res.data.data
    this.setState({
      list: data.list,
      order: data.order,
      self: data.self
    }, () => {
      this.setPageLoading(false)
      Taro.stopPullDownRefresh()
    })
  }
  /**
   * 旅居订单参团情况
   * @param orderId 订单id
   */
  async journeyGroupOrderDetail(orderId: string) {
    const res = await this.$api.sojourn.journeyGroupOrderDetail({orderId})
    let data = res.data.data
    this.setState({
      list: data.list,
      order: data.order,
      self: data.self
    }, () => {
      this.setPageLoading(false)
      Taro.stopPullDownRefresh()
    })
  }

  async groupProductPage() {
    let params = {
      pageNum: 1,
      pageSize: 10,
      storeId: Taro.getStorageSync('storeId')
    }
    const res = await this.$api.mall.groupProductPage(params)
    this.setState({
      recommendList: res.data.data.list
    })
  }


  clickJoinAssemble(): void {
    this.setState({
      isJoin: true
    })
  }

  handleTimeEnd() {
    console.log('handleTimeEnd')
    let { orderId, type } = this.state
    if (type === 'journey') this.journeyGroupOrderDetail(orderId)
    else this.groupDetail(orderId)
  }

  render() {
    const { pageLoading, order, list, self, recommendList, isJoin, orderId, type } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="page">
          <View className="red"></View>
          {type === 'journey' ? 
            order.journeyProductList && order.journeyProductList.map((item: any) => {
              return <JoinGroupItem key={item.id} item={item} state={order.groupStatus} groupQuantity={order.groupQuantity} type="journey" />
            })
            :
            order.orderItems && order.orderItems.map((item: any) => {
              return <JoinGroupItem key={item.id} item={item} state={order.groupStatus} groupQuantity={order.groupQuantity} type="product" />
            })
          }


          <View className="time-wrap">
            {order.groupStatus === 2 ?
              <View className="success-state">恭喜拼团成功！</View>
              : order.groupStatus === -1 ?
              <View className="fail-state">
                还差
                <Text>{order.groupNeedQuantity}</Text>
                人，拼团失败！
              </View>
              :
              <View>
                <View className="divider-wrap">
                  <View className="line left"></View>
                  <View className="text">距离结束还剩</View>
                  <View className="line right"></View>
                </View>
                <View className="count-down">
                  <CountDown endTime={order.groupExpireTime} onEnd={this.handleTimeEnd.bind(this)} />
                </View>
                <View className="num-wrap">
                  <Text>{order.groupQuantity}</Text>人成团，还差
                  <Text>{order.groupNeedQuantity}</Text>人
                </View>
              </View>
            }

            <View className="chengtuan-wrap">
              {list.map((item: any) => {
                return (
                  <View className="item" key={item.id}>
                    {item.organizer && <View className="top">团长</View>}
                    <View className="head">
                      <Image mode="widthFix" src={item.buyerHeader} />
                    </View>
                    <View className="name">{item.buyerName}</View>
                  </View>
                )
              })}
              {order.groupNeedQuantity &&
                <View className="item not">
                  <View className="head">
                    <Text className="iconfont icon-share" />
                  </View>
                  <View className="name">待参团</View>
                </View>
              }
            </View>
            
            {/* 未参团，拼团成功或失败 */}
            {(order.groupStatus === 2 || order.groupStatus === -1) && !self.isJoined && !self.isOrganizer &&
              <View className="button-wrap">
                {type === 'journey' ? 
                  <Button 
                    className="primary"
                    onClick={this.navigateTo.bind(this, `/pagesSojourn/sojourn/detail/index?id=${order.groupShoppingId}&type=group`)}
                  >我要开团</Button>
                  :
                  <Button 
                    className="primary"
                    onClick={this.navigateTo.bind(this, `/pagesCommon/group-product/detail/index?id=${order.groupShoppingId}`)}
                  >我要开团</Button>
                }
                <Button 
                  className="border d-line"
                  onClick={this.switchTab.bind(this, '/pages/index/index')}
                >返回首页</Button>
              </View>
            }

            {/* 已参团，拼团进行中 */}
            {order.groupStatus === 1 && self.isJoined &&
              <View className="button-wrap">
                <View className="text">拼团正在进行，赶快邀请好友加入吧~</View>
                <Button openType="share" className="primary">邀请小伙伴</Button>
                <Button 
                  className="primary d-line"
                  onClick={this.navigateTo.bind(this, `/pagesMine/mine/order/detail/index?id=${self.orderId}`)}
                >查看订单</Button>
                <Button 
                  className="border d-line"
                  onClick={this.switchTab.bind(this, '/pages/index/index')}
                >返回首页</Button>
              </View> 
            }

            {/* 未参团，拼团进行中 */}
            {order.groupStatus === 1 && !self.isJoined && !self.isOrganizer &&
              <View className="button-wrap">
                <View className="text">拼团正在进行，一起享受最优惠的价格吧~</View>
   
                {type === 'journey' ? 
                  <Button 
                    className="primary"
                    onClick={this.navigateTo.bind(this, `/pagesSojourn/sojourn/detail/index?join=1&id=${order.groupShoppingId}&organizeOrderId=${order.organizeOrderId}&type=group`)}
                  >我也要参团</Button>
                  :
                  <Button 
                    className="primary"
                    onClick={this.navigateTo.bind(this, `/pagesCommon/group-product/detail/index?join=1&id=${order.groupShoppingId}&organizeOrderId=${order.organizeOrderId}`)}
                  >我也要参团</Button>
                }
                <Button 
                  className="border d-line"
                  onClick={this.switchTab.bind(this, '/pages/index/index')}
                >返回首页</Button>
              </View>
            }

            {/* 已参团，拼团成功 */}
            {self.isJoined && order.groupStatus === 2 && (
              <View className="button-wrap">
                <Button 
                  className="primary"
                  onClick={this.navigateTo.bind(this, `/pagesMine/mine/order/detail/index?id=${self.orderId}`)}
                >查看订单</Button>
                <Button 
                  className="border d-line"
                  onClick={this.switchTab.bind(this, '/pages/index/index')}
                >返回首页</Button>
              </View>
            )}

            {/* 已参团，拼团失败 */}
            {self.isJoined && order.groupStatus === -1 && (
              <View className="button-wrap">
                <View className="text">优惠不可等，再次发起拼团吧~</View>
                {type === 'journey' ? 
                  <Button 
                    className="primary"
                    onClick={this.navigateTo.bind(this, `/pagesSojourn/sojourn/detail/index?id=${order.groupShoppingId}&type=group`)}
                  >再来一单</Button>
                  :
                  <Button 
                    className="primary"
                    onClick={this.navigateTo.bind(this, `/pagesCommon/group-product/detail/index?id=${order.groupShoppingId}`)}
                  >再来一单</Button>
                }
                <Button 
                  className="border d-line"
                  onClick={this.switchTab.bind(this, '/pages/index/index')}
                >返回首页</Button>
              </View>
            )}

          </View>
          {type === 'journey' && order.groupStatus === 2 &&
            <View>
              <View className="tip-wrap">
                <View className="title-wrap">
                  <Image src={dot} mode="widthFix" className="dot" />
                  <Text>温馨提示</Text>
                  <Image src={dot} mode="widthFix" className="dot" />
                </View>
                <View className="content">
                  <View>支付成功需提前2天预约出行时间；</View>
                  <View>预约成功后，管家会致电确认；</View>
                  <View>可在”我的“-”我的旅居“查看订单详情。</View>
                </View>
              </View>
              <View className="tip-wrap">
                <View className="title-wrap">
                  <Image src={dot} mode="widthFix" className="dot" />
                  <Text>改退政策</Text>
                  <Image src={dot} mode="widthFix" className="dot" />
                </View>
                <View className="content">
                <View>出行前1天0点（含）之后退订，收取80%违约金；</View>
                <View>出行前1天0点至出行前7天0点（含）之间退订，收取50%违约金；</View>
                <View>出行前7天0点至出行前30天0点（含）之间退订，收取30%违约金；</View>
                </View>
              </View>
            </View>
          }
          {type !== 'journey' &&
            <RecommendWrap list={recommendList} url="/pagesCommon/group-product/index" title="大家都在拼" />
          }
        </View>
        <LogoWrap />
      </View>
    )
  }
}


export default JoinAssemble