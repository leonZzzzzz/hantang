import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, InviteItem, DividingLine, LoadingBox, EmptyDataBox } from '@/components';

import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  countTotal: any
  list: any[]
}

interface InviteList {
  state: StateType
}

class InviteList extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '邀请列表',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  searchData: any

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      countTotal: {},
      list: []
    }
    this.searchData = {
      pageNum: 1,
      pageSize: 20,
      total: 0,
    }
  }

  componentWillMount() {
    this.shareGetInvite()
    this.shareGetCount()
  }

  onPullDownRefresh() {
    this.shareGetInvite()
  }

  onReachBottom() {
    if (this.isHasNextPage(this.searchData)) {
      this.shareGetInvite(true)
    }
  }

  /**
   * 我的奖励
   */
  async shareGetCount() {
    const res = await this.$api.mine.shareGetCount()
    this.setState({
      countTotal: res.data.data
    })
  }

  /**
   * 邀请列表
   */
  async shareGetInvite(isLoadMore?: boolean) {
    let { list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      this.searchData.pageNum = 0
      list = []
    }
    this.searchData.pageNum++
    try {
      const res = await this.$api.mine.shareGetInvite(this.searchData)
      const data = res.data.data
      if (data.total) this.searchData.total = data.total
      if (isLoadMore) list = [...list, ...data.list]
      else list = data.list
      this.setState({
        list,
      })
      Taro.stopPullDownRefresh();
      this.setPageLoading(false);
    } catch (err) {
      Taro.stopPullDownRefresh();
      this.setPageLoading(false);
    }
  }


  render() {
    const { list, pageLoading, countTotal } = this.state

    return (
      <View className="invite-list">
        <LoadingBox visible={pageLoading} />

        <View className="total-wrap">
          <View className="item">
            已发放奖励：
            <Text className="green">￥{util.filterPrice(countTotal.award)}</Text>
          </View>
          <View className="item">
            未发放奖励：
            <Text className="red">￥{util.filterPrice(countTotal.noAward)}</Text>
          </View>
        </View>

        <DividingLine height={80} />


        {list.length > 0 ?
          <View className="list">
            {list.map((item: any, index: number) => {
            return <InviteItem item={item} index={index} key={item.id} type="white" />
          })}
          </View>
          :
          <EmptyDataBox />
        }
      
        <LogoWrap />
      </View>
    )
  }
}

export default InviteList
