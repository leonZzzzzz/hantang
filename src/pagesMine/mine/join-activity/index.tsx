import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, ActivityItem, DividingLine, TabsWrap, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  pageLoading: boolean
  list: any[]
  searchData: any
  tabList: any[]
}

interface JoinActivity {
  state: StateType
}


class JoinActivity extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我的活动',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  isMount: boolean

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      list: [],
      searchData: {
        pageNum: 0,
        pageSize: 20,
        total: 0,
        status: 1,
      },
      tabList: [
        { title: '进行中', id: 1 },
        { title: '已结束', id: 2 },
      ],
    }
    this.isMount = false
  }

  componentWillMount() {
    this.signActivityPage()
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.signActivityPage();
  }

  onPullDownRefresh() {
    this.signActivityPage();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.signActivityPage(true)
    }
  }

  async signActivityPage(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      searchData.total = 0
      list = []
    }
    searchData.pageNum++
    const res = await this.$api.common.signActivityPage(searchData)
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

  handleClickTabs(current: number): void  {
    this.setState((preState: any) => {
      preState.searchData.status = current
    }, () => {
      this.signActivityPage()
    })
  }


  render() {
    const { pageLoading, tabList, searchData, list } = this.state

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
              {list.map((item: any, index: number) => {
                return <ActivityItem item={item} key={item.id} index={index} />
              })}
            </View>
            :
            <EmptyDataBox />
          }
        </View>

        <LogoWrap />
      </View>
    )
  }
}

export default JoinActivity