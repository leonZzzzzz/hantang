import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, PrizeOrderItem, DividingLine, TabsWrap, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  tabList: any[]
  list: any[]
  searchData: any
  pageLoading: boolean
}

interface PrizeOrder {
  state: StateType
}


class PrizeOrder extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我的奖品',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  isMount: boolean

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      tabList: [
        { title: '全部', id: 'all' },
        { title: '未抽奖', id: 'notStart' },
        { title: '未兑奖', id: 'new' },
        { title: '已兑奖', id: 'checked' },
      ],
      searchData: {
        pageNum: 0,
        pageSize: 20,
        total: 0,
        status: 'all',
      },
      list: [],
    }
    this.isMount = false
  }

  componentWillMount() {
    this.orderPage()
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.orderPage();
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
    const res = await this.$api.mine.myAward(searchData)
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
      preState.searchData.status = current
    }, () => {
      this.orderPage()
    })
  }


  render() {
    const { tabList, searchData, list, pageLoading } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="order">
          <View className="tab-wrap">
            <TabsWrap tabs={tabList} current={searchData.status} onClickTabs={this.handleClickTabs.bind(this)} />
          </View>

          <DividingLine height={100} />

          {list.length ?
            <View className="list">
              {list.map((item: any) => {
                return <PrizeOrderItem item={item} key={item.id} />
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

export default PrizeOrder