import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { Avatar, LogoWrap, LoadingBox, Dialog, BindWrap } from '@/components';

import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  member: any
  serveGroup: any[]
  orderCountGroup: any[]
  topGroup: any
  bindInfo: any
  bindVisible: boolean;
  news: any
}

interface Mine {
  state: StateType
}

class Mine extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '个人中心',
    navigationBarBackgroundColor: '#ff3333',
    navigationBarTextStyle: 'white',
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      member: {},
      bindInfo: {},
      bindVisible: false,
      news: {},
      topGroup: {
        collection: 0,
        balance: 0,
        shopCart: 0,
      },
      orderCountGroup: [
        {
          id: 0,
          title: '待支付',
          icon: 'iqianbao',
          count: 0,
          url: '/pagesMine/mine/order/index?type=0',
        },
        {
          id: 1,
          title: '待发货',
          icon: 'idaifahuo1',
          count: 0,
          url: '/pagesMine/mine/order/index?type=1',
        },
        {
          id: 2,
          title: '待收货',
          icon: 'idaishouhuo',
          count: 0,
          url: '/pagesMine/mine/order/index?type=2',
        },
        {
          id: 10,
          title: '已完成',
          icon: 'iyiwancheng',
          count: 0,
          url: '/pagesMine/mine/order/index?type=10',
        },
        {
          id: 4,
          title: '售后',
          icon: 'ishouhou1',
          count: 0,
          url: '/pagesMine/mine/after-sales-order/index',
        }
      ],
      serveGroup: [
        {
          id: 1,
          title: '我的旅居',
          url: '/pagesMine/mine/sojourn-order/index',
          icon: 'ilvju'
        },
        {
          id: 2,
          title: '旅居拼团',
          url: '/pagesMine/mine/group-journey-order/index',
          icon: 'ipintuan'
        },
        {
          id: 3,
          title: '商品拼团',
          url: '/pagesMine/mine/group-product-order/index',
          icon: 'ipintuan'
        },
        {
          id: 4,
          title: '我的奖品',
          url: '/pagesMine/mine/prize-order/index',
          icon: 'ijiangpin'
        },
        {
          id: 5,
          title: '我的管家',
          url: '',
          icon: 'iguanjia'
        },
        {
          id: 6,
          title: '我的活动',
          url: '/pagesMine/mine/join-activity/index',
          icon: 'iwodehuodong'
        },
        {
          id: 7,
          title: '我的助力',
          url: '/pagesMine/mine/help-order/index',
          icon: 'iwodezhuli'
        },
        {
          id: 8,
          title: '我的地址',
          url: '/pagesMine/mine/address/index',
          icon: 'iwodedizhi'
        },
        {
          id: 9,
          title: '关于我们',
          url: '/pagesMine/mine/about/index',
          icon: 'iguanyuwomen'
        },
      ],
    }
  }

  componentWillMount() {
    this.getMemberInfo()
  }

  componentDidShow() {
    this.noticePage()
    this.getCartNum()
    this.getOrderCount()
    this.getCurrentBalance()
    this.getMyCollectionCount()
  }

  /**
   * 绑定信息
   */
  async myBindInfo() {
    const res = await this.$api.common.myBindInfo()
    this.setState({
      bindInfo: res.data.data
    })
  }

  // 会员信息
  async getMemberInfo() {
    const res = await this.$api.mine.getMemberInfo()
    console.log(res)
    this.setState({
      member: res.data.data.member
    })
    this.setPageLoading(false)
    this.myBindInfo()
    this.noticePage()
    // this.getCartNum()
    // this.getOrderCount()
    // this.getCurrentBalance()
    // this.getMyCollectionCount()
  }
  // 订单
  async getOrderCount() {
    let { orderCountGroup } = this.state
    const res = await this.$api.mine.getOrderCount()
    console.log('getOrderCount', res.data.data)
    let data = res.data.data
    orderCountGroup[0].count = data.unpaidQuantity
    orderCountGroup[2].count = data.undeliveredQuantity
    orderCountGroup[4].count = data.afterSaleQuantity
    this.setState({
      orderCountGroup
    })
  }
  /**
   * 当前余额
   */
  async getCurrentBalance() {
    const res = await this.$api.mine.getCurrentBalance()
    console.log('getCurrentBalance', res.data.data)
    this.setState((preState: any) => {
      preState.topGroup.balance = res.data.data
    })
  }
  /**
   * 喜欢总数
   */
  async getMyCollectionCount() {
    const res = await this.$api.mine.getMyCollectionCount()
    console.log('getMyCollectionCount', res.data.data)
    this.setState((preState: any) => {
      preState.topGroup.collection = res.data.data
    })
  }

  

  // 获取购物车数量
  async getCartNum() {
    let { topGroup } = this.state
    const res = await this.$api.mall.getCartNum()
    topGroup.shopCart = res.data.data.qty
    this.setState({
      topGroup
    })
  }

  /**
   * 消息列表
   */
  async noticePage() {
    let searchData = {
      pageNum: 1,
      pageSize: 1,
    }
    const res = await this.$api.mine.noticePage(searchData)
    let data = res.data.data
    if (data.list.length) {
      this.setState({
        news: data.list[0],
      })
    }
  }

  handleGroup(item: any) {
    if (item.url) {
      this.navigateTo(item.url)
    }
    if (item.title === '我的管家') {
      this.setDialogVisible(true, 'bindVisible')
    }
  }

  render() {
    let { pageLoading, member, topGroup, serveGroup, orderCountGroup, bindInfo, bindVisible, news } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="mine">
          <View className="circle"></View>
          <View className="mine-content">
            <View className="top-user">
              <View className="user">
                <Avatar imgUrl={member.headImage} width={100} style={{border: '1rpx solid #fff'}} />
                <View className="name">{member.name || member.appellation}</View>
                <View className="tag">
                  <Text className="iconfont icon-share" />
                  <Text className="text">普通用户</Text>
                </View>
              </View>
              <View 
                className="check"
                onClick={this.navigateTo.bind(this, '/pagesMine/mine/info/index')}
              >
                <Text>查看资料</Text>
                <Text className="iconfont iyoujiantou" />
              </View>
            </View>

            <View className="price-wrap">
              <View className="group">
                <View 
                  className="item"
                  onClick={this.navigateTo.bind(this, '/pagesMine/mine/like/index')}
                >
                  <View className="num">{topGroup.collection}</View>
                  <View className="text">喜欢</View>
                </View>
                <View 
                  className="item"
                  onClick={this.navigateTo.bind(this, '/pagesMine/mine/wallet/index')}
                >
                  <View className="num">{util.filterPrice(topGroup.balance)}</View>
                  <View className="text">钱包</View>
                </View>
                <View 
                  className="item"
                  onClick={this.navigateTo.bind(this, '/pagesMine/mine/cart/index')}
                >
                  <View className="num">{topGroup.shopCart}</View>
                  <View className="text">
                    <Text>购物车</Text>
                    {topGroup.shopCart > 0 &&
                      <View className="dot" />
                    }
                  </View>
                </View>
              </View>
              <View className="news">
                <View className="title">
                  <Text className="t-1">最新</Text>
                  <Text className="t-2">消息</Text>
                </View>
                <View className="content">
                  <Text className="c-t">{news.title}</Text>
                  <Text 
                    className="iconfont iyoujiantou" 
                    onClick={this.navigateTo.bind(this, '/pagesMine/mine/news/index')}
                  />
                </View>
              </View>
            </View>

            {/* <View className="open-vip-wrap margin">
              <View className="left">
                <View className="iconfont iVIP vip-icon" />
                <View className="content">
                  <View className="title">尊享会员 开通即享3大权益</View>
                  <View className="desc">专属管家服务 / 会员购优惠 / 拼团优惠</View>
                </View>
              </View>
              <View 
                className="open"
                onClick={this.navigateTo.bind(this, '/pagesMine/mine/vip-member/index')}
              >立即开通</View>
            </View> */}

            <View className="order-wrap margin">
              <View className="t-wrap">
                <View>我的订单</View>
                <View 
                  className="more"
                  onClick={this.navigateTo.bind(this, '/pagesMine/mine/order/index')}
                >
                  <Text>查看全部</Text>
                  <Text className="iconfont iyoujiantou" />
                </View>
              </View>
              <View className="group">
                {orderCountGroup.map((item: any) => {
                  return (
                    <View 
                      className="g-item" 
                      key={item.id}
                      onClick={this.navigateTo.bind(this, item.url)}
                    >
                      {item.count && <View className="count">{item.count}</View>}
                      <View className={`iconfont ${item.icon}`} />
                      <View className="title">{item.title}</View>
                    </View>
                  )
                })}
              </View>
            </View>

            <View className="banner-wrap margin" onClick={this.navigateTo.bind(this, '/pagesCommon/invite/index')}>
              <Image src={this.imgHost + '/attachments/static/yq_banner.png'} mode="aspectFill" />
            </View>

            <View className="serve-wrap margin">
              <View className="title">我的服务</View>
              <View className="s-group">
                {serveGroup.map((item: any) => {
                  return (
                    <View 
                      className="s-item" 
                      key={item.id}
                      onClick={this.handleGroup.bind(this, item)}
                    >
                      <View className={`iconfont ${item.icon}`} />
                      <View>{item.title}</View>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>
        </View>

        <LogoWrap />

        <Dialog
          visible={bindVisible}
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'bindVisible')}
        >
          <BindWrap 
            bindInfo={bindInfo}
            onConfirm={this.myBindInfo.bind(this)}
            
            onClose={this.setDialogVisible.bind(this, false, 'bindVisible')}  
          />
        </Dialog>

        
      </View>
    )
  }
}

export default Mine
