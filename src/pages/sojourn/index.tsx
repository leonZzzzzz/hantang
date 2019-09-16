import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'
import { AtSearchBar } from 'taro-ui';

import { SojournItem, LogoWrap, LoadingBox, EmptyDataBox, DividingLine } from '@/components/index'

import BaseComponent from '@/utils/components'

type StateType = {
  pageLoading: boolean;
  searchData: any
  list: any[]
}

interface Sojourn {
  state: StateType
}

class Sojourn extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '旅居',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  isMount: boolean

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      searchData: {
        name: '',
        title: '',
        pageNum: 0,
        pageSize: 20,
        total: 0,
      },
      list: [],
    }

    this.isMount = false;
  }

  componentWillMount() {
    this.base()
  }

  // componentDidShow() {
  //   if (!this.isMount) return;
  //   this.base();
  // }

  // 下拉刷新
  onPullDownRefresh() {
    this.base();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.base(true)
    }
  }

  async base(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true);
      searchData.pageNum = 0
      searchData.total = 0
      list = []
    }
    searchData.pageNum++
    try {
      const res = await this.$api.sojourn.base(searchData)
      let data = res.data.data
      if (data.total) searchData.total = data.total
      list = [...list, ...data]
      this.setState({
        list,
        searchData,
      })
      Taro.stopPullDownRefresh();
      this.isMount = true;
      this.setPageLoading(false);
    } catch (err) {
      Taro.stopPullDownRefresh();
      this.isMount = true;
      this.setPageLoading(false);
    }
  }
  onSearchChange(value: string): void {
    this.setState((preState: any) => {
      preState.searchData.title = value
    })
  }
  onActionClick() {
    this.base()
  }

  render() {
    const { pageLoading, list, searchData } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="fixed-top">
          <AtSearchBar 
            value={searchData.title}
            disabled={list.length === 0}
            onChange={this.onSearchChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
            className="search-bar"
          />
        </View>
        <DividingLine height={100} />

        {list.length > 0 ? 
          <View className="list">
            {list.map((item: any, index: number) => {
              return <SojournItem item={item} key={item.id} index={index} />
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

export default Sojourn