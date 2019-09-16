import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, SojournOrderItem, DividingLine, TabsWrap, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  pageLoading: boolean
  searchData: any
  list: any[]
  tabList: any[]
  steward: any
}

interface SojournOrder {
  state: StateType
}


class SojournOrder extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我的旅居',
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
        { title: '待支付', id: 'unpay' },
        { title: '未出行', id: 'undepart' },
        { title: '已完成/取消', id: 'finish or cancel' },
      ],
      searchData: {
        pageNum: 0,
        pageSize: 20,
        total: 0,
        flowStatus: '',
      },
      list: [],
      steward: {},
    }
    this.isMount = false
  }

  componentWillMount() {
    this.orderPage()
    Taro.hideShareMenu()
    this.myBindInfo()
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.orderPage();
  }

  onShareAppMessage(res: any) {
    if (res.from === 'button') {
      let { title, coverurl, id } = res.target.dataset
      console.log(title, coverurl, id)
      return {
        title,
        imageUrl: this.imgHost + coverurl,
        path: `/pagesSojourn/sojourn/detail/index?id=${id}`
      }
    }
    return {}
  }

  onPullDownRefresh() {
    this.orderPage();
  }

  onReachBottom() {
    let { searchData } = this.state;
    if (this.isHasNextPage(searchData)) {
      this.orderPage(true)
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

  /**
   * 列表
   * @param isLoadMore 
   */
  async orderPage(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      searchData.total = 0
      list = []
    }
    searchData.pageNum++
    const res = await this.$api.sojourn.orderPage(searchData)
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

  handleClickTabs(current: string): void  {
    this.setState((preState: any) => {
      preState.searchData.flowStatus = current
    }, () => {
      this.orderPage()
    })
  }


  render() {
    const { pageLoading, tabList, searchData, list, steward } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="order">
          <View className="tab-wrap">
            <TabsWrap tabs={tabList} current={searchData.flowStatus} onClickTabs={this.handleClickTabs.bind(this)} />
          </View>

          <DividingLine height={100} />

          {list.length ?
            <View className="list">
              {list.map((item: any) => {
                return <SojournOrderItem item={item} key={item.id} steward={steward} />
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

export default SojournOrder