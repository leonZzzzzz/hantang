import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, WalletItem, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  pageLoading: boolean
  searchData: any
  list: any[]
}

interface Wallet {
  state: StateType
}


class Wallet extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我的钱包',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      searchData: {
        pageNum: 0,
        pageSize: 20,
        total: 0,
      },
      list: [],
    }
  }

  componentWillMount() {
    this.pageBalance()
  }

  onPullDownRefresh() {
    this.pageBalance();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.pageBalance(true)
    }
  }

  async pageBalance(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      searchData.total = 0
      list = []
    }
    searchData.pageNum++
    try {
      const res = await this.$api.mine.pageBalance()
      let data = res.data.data
      if (data.total) searchData.total = data.total

      this.setState({
        list: [...list, ...data.list],
        searchData,
      })
      Taro.stopPullDownRefresh()
      this.setPageLoading(false)
    } catch (err) {
      Taro.stopPullDownRefresh()
      this.setPageLoading(false)
    }
  }

  render() {
    const { list, pageLoading } = this.state

    return (
      <View className="wallet">
        <LoadingBox visible={pageLoading} />

        {list.length ?
          <View className="list">
            {list.map((item: any, index: number) => {
              return <WalletItem item={item} index={index} key={item.id} />
            })}
          </View>
          :
          <EmptyDataBox title="暂无记录" />
        }

        <LogoWrap />
      </View>
    )
  }
}

export default Wallet