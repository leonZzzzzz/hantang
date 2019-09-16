import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, GroupOrderItem, DividingLine, TabsWrap, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  pageLoading: boolean
  searchData: any
  list: any[]
  tabList: any[]
  steward: any
}

interface AssembleOrder {
  state: StateType
}


class AssembleOrder extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '旅居拼团',
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
        { title: '进行中', id: 1 },
        { title: '已完成', id: 2 },
        { title: '已过期', id: -1 },
      ],
      searchData: {
        pageNum: 0,
        pageSize: 20,
        total: 0,
        groupStatus: '',
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
        // path: `/pagesSojourn/sojourn/detail/index?id=${id}&type=group`
        path: `/pagesCommon/join-group/index?id=${id}&type=journey`
      }
    }
    return {}
  }

  onPullDownRefresh() {
    this.orderPage();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
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
    const res = await this.$api.sojourn.journeyGroupOrderPage(searchData)
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

  handleClickTabs(current: string | number): void  {
    this.setState((preState: any) => {
      preState.searchData.groupStatus = current
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
            <TabsWrap tabs={tabList} current={searchData.groupStatus} onClickTabs={this.handleClickTabs.bind(this)} />
          </View>

          <DividingLine height={100} />

          {list.length ?
            <View className="list">
              {list.map((item: any) => {
                return <GroupOrderItem item={item} key={item.id} steward={steward} type="journey" />
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

export default AssembleOrder