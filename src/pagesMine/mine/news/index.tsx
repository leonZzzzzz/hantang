import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, NewsItem, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  pageLoading: boolean
  searchData: any
  list: any[]
}

interface News {
  state: StateType
}


class News extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我的消息',
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
    this.noticePage()
  }

  onPullDownRefresh() {
    this.noticePage();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.noticePage(true)
    }
  }

  /**
   * 列表
   */
  async noticePage(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      searchData.total = 0
      list = []
    }
    searchData.pageNum++
    try {
      const res = await this.$api.mine.noticePage(searchData)
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
    const { pageLoading, list } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        {list.length ?
          <View className="list">
            {list.map((item: any) => {
              return <NewsItem item={item} key={item.id} />
            })}
          </View>
          :
          <EmptyDataBox title="暂无消息" />
        }

        <LogoWrap />
      </View>
    )
  }
}

export default News