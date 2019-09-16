import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, OrderItem, DividingLine, TabsWrap, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  pageLoading: boolean
  tabList: any[]
  current: number
  searchData: any
  list: any[]
  steward: any
}

interface Order {
  state: StateType
}


class Order extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我的订单',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  isMount: boolean
  
  constructor() {
    super()
    this.state = {
      pageLoading: true,
      tabList: [
        { title: '全部', id: '' },
        { title: '待支付', id: 0 },
        { title: '待发货', id: 1 },
        { title: '待收货', id: 2 },
        { title: '已完成', id: 10 },
      ],
      current: 0,
      searchData: {
        pageNum: 0,
        pageSize: 20,
        total: 0,
        status: '',
      },
      list: [],
      steward: {},
    }
    this.isMount = false;
  }

  componentWillMount() {
    const params = this.$router.params
    let { searchData } = this.state
    searchData.status = params.type ? Number(params.type) : ''
    console.log(searchData)
    this.setState({
      searchData
    }, () => {
      this.getOrderList()
    })
    this.myBindInfo()
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.getOrderList();
  }

  onPullDownRefresh() {
    this.getOrderList();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.getOrderList(true)
    }
  }

  /**
   * 绑定信息
   */
  async myBindInfo() {
    const res = await this.$api.common.myBindInfo()
    this.setState({
      steward: res.data.data.steward
    })
  }

  handleClickTabs(current: number): void  {
    this.setState((preState: any) => {
      preState.searchData.status = current
    }, () => {
      this.getOrderList()
    })
  }

  /**
   * 列表
   * @param isLoadMore 
   */
  async getOrderList(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      searchData.total = 0
      list = []
    }
    searchData.pageNum++
    const res = await this.$api.mall.getOrderList(searchData)
    let data = res.data.data
    if (data.total) searchData.total = data.total

    this.setState({
      list: [...list, ...data.list],
      searchData,
    })
    Taro.stopPullDownRefresh()
    this.setPageLoading(false)
    this.isMount = true
  }


  // 取消订单提示
  cancelTip(id: string) {
    Taro.showModal({
      title: '取消提示',
      content: '是否取消该订单？',
    }).then(res => {
      if (res.confirm) {
        this.cancelOrder(id)
      }
    });
  }
  // 取消订单
  async cancelOrder(id: string) {
    await this.$api.mall.cancelOrder({id})
    this.showToast('操作成功')
    this.getOrderList();
  }

  receiveOrderTip(id: string) {
    Taro.showModal({
      title: '收货提示',
      content: '是否确认收货?',
    }).then(res => {
      if (res.confirm) {
        this.handleReceiveOrder(id)
      }
    });
  }

  async handleReceiveOrder(id: string) {
    await this.$api.mall.receiveOrder({id})
    this.showToast('操作成功')
    this.getOrderList();
  }

  handleTimeEnd() {
    this.getOrderList()
  }


  render() {
    const { tabList, searchData, list, pageLoading, steward } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="order">
          <View className="tab-wrap">
            <TabsWrap tabs={tabList} current={searchData.status} onClickTabs={this.handleClickTabs.bind(this)} />
          </View>


          <DividingLine height={100} />

          {list.length > 0 ?
            <View className="list">
              {list.map((item: any) => {
                return <OrderItem item={item} key={item.id} onCancel={this.cancelTip.bind(this)} onReceiveOrder={this.handleReceiveOrder.bind(this)} onEnd={this.handleTimeEnd.bind(this)} steward={steward} />
              })}
            </View>
            :
            <EmptyDataBox title="暂无相关订单" />
          }
        </View>

        <LogoWrap />
      </View>
    )
  }
}

export default Order