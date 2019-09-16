import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui';
import './index.scss'
import BaseComponent from '@/utils/components'

import { LogoWrap, GroupProductItem, GroupJourneyItem, LoadingBox, EmptyDataBox, TabsWrap, DividingLine } from '@/components/index'

type StateType = {
  pageLoading: boolean;
  searchData: any;
  list: any[]
  typeList: any[]
  current: number
  tabList: any[]
  tabCurrent: number
}

interface Assemble {
  state: StateType
}


class Assemble extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '超值拼团',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      tabList: [
        { 
          title: '商品', 
          id: 0,
        },
        { 
          title: '旅居', 
          id: 1,
        },
      ],
      tabCurrent: 0,
      searchData: {
        name: '',
        orderBy: '',
        asc: 1,
        pageNum: 0,
        pageSize: 20,
        total: 0,
        storeId: Taro.getStorageSync('storeId')
      },
      typeList: [
        {
          id: 1,
          name: '全部',
          asc: 1,
          orderBy: '',
        },
        {
          id: 2,
          name: '发布',
          asc: 1,
          orderBy: 'createTime',
        },
        {
          id: 3,
          name: '价格',
          asc: 1,
          orderBy: 'price',
        },
        {
          id: 4,
          name: '销售',
          asc: 1,
          orderBy: 'salesQty',
        }
      ],
      current: 0,
      list: [],
    }
  }

  componentWillMount() {
    let { current } = this.$router.params


    console.log('current', current)
    let { tabCurrent } = this.state
    if (current !== undefined) {
      tabCurrent = Number(current)
      this.setState({
        tabCurrent
      })
    }
    console.log('tabCurrent', tabCurrent)
    if (tabCurrent === 0) this.groupProductPage()
    if (tabCurrent === 1) this.journeyGroupProductPage()
    
  }

  onReachBottom() {
    let { searchData, list, tabCurrent } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      if (tabCurrent === 0) this.groupProductPage(true)
      if (tabCurrent === 1) this.journeyGroupProductPage(true)
    }
  }

  onPullDownRefresh() {
    let { tabCurrent } = this.state
    if (tabCurrent === 0) this.groupProductPage()
    if (tabCurrent === 1) this.journeyGroupProductPage()
  }

  /**
   * 获取商品列表
   * @param isLoadMore 加载更多
   */
  async groupProductPage(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      list = []
    }
    searchData.pageNum++
    const res = await this.$api.mall.groupProductPage(searchData)
    const data = res.data.data

    this.setState({
      list: [...list, ...data.list],
      searchData,
    }, () => {
      console.log(this.state.list, this.state.searchData)
    })
    this.setPageLoading(false)
    Taro.stopPullDownRefresh()
  }

  /**
   * 获取旅居拼团商品列表
   * @param isLoadMore 加载更多
   */
  async journeyGroupProductPage(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      list = []
    }
    searchData.pageNum++
    const res = await this.$api.sojourn.journeyGroupProductPage(searchData)
    const data = res.data.data

    this.setState({
      list: [...list, ...data.list],
      searchData,
    }, () => {
      console.log(this.state.list, this.state.searchData)
    })
    this.setPageLoading(false)
    Taro.stopPullDownRefresh()
  }

  onSearchChange(value: string): void {
    let { searchData } = this.state
    searchData.name = value
    this.setState({
      searchData
    })
  }
  onActionClick(): void {
    let { tabCurrent } = this.state
    if (tabCurrent === 0) this.groupProductPage()
    if (tabCurrent === 1) this.journeyGroupProductPage()

  }
  handleType(item: any, index: number) {
    // if (index === 0) return
    let { searchData, typeList } = this.state
    console.log(item.orderBy, searchData.orderBy)
    if (item.orderBy === searchData.orderBy) {
      let asc = item.asc === 1 ? 0 : 1
      searchData.asc = asc
      typeList[index].asc = asc
    } else {
      searchData.orderBy = item.orderBy
    }
    this.setState({
      searchData,
      typeList,
      current: index,
    }, () => {
      this.groupProductPage()
    })
  }

  handleClickTabs(current: number): void  {
    let { searchData } = this.state
    searchData.name = ''
    searchData.orderBy = ''
    searchData.asc = 1
    this.setState({
      tabCurrent: current,
      searchData,
    }, () => {
      if (current === 0) this.groupProductPage()
      if (current === 1) this.journeyGroupProductPage()
    })
  }

  render() {
    const { searchData, tabList, tabCurrent, typeList, pageLoading, list, current } = this.state
    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="search-wrap">
          <TabsWrap tabs={tabList} current={tabCurrent} onClickTabs={this.handleClickTabs.bind(this)} />

          <AtSearchBar 
            value={searchData.name}
            onChange={this.onSearchChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)}
            className="search-bar"
          />
          <View className="type-wrap">
            {typeList.map((item: any, index: number) => {
              return (
                <View className={`item ${current === index ? 'active' : ''}`} key={item.id} onClick={this.handleType.bind(this, item, index)}>
                  <Text>{item.name}</Text>
                  {index > 0 &&
                    <View className="icon-wrap">
                      <View className={`iconfont ishangjiantou ${item.asc === 1 ? 'black' : ''}`} />
                      <View className={`iconfont ixiajiantou1 ${item.asc === 0 ? 'black' : ''}`} />
                    </View>
                  }
                </View>
              )
            })}
          </View>
        </View>

        <DividingLine height={260} />

        {list.length ?
          (tabCurrent === 0 ?
            <View className="list">
              {list.map((item: any, index: number) => {
                return <GroupProductItem item={item} index={index} key={item.id} type="scrollY" />
              })}
            </View>
            :
            <View className="list">
              {list.map((item: any, index: number) => {
                return <GroupJourneyItem item={item} index={index} key={item.id} type="scrollY" />
              })}
            </View>
          )
          :
          <EmptyDataBox absolute={false} />
        }

        <LogoWrap />
      </View>
    )
  }
}


export default Assemble