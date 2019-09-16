import Taro, { Config } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, SojournItem, ProductItem, DividingLine, TabsWrap, LoadingBox, EmptyDataBox } from '@/components';

import config from '@/config/index'


type StateType = {
  pageLoading: boolean
  tabList: any[]
  current: number
  paneHeight: number
}

interface Like {
  state: StateType
}


class Like extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我喜欢的',
  }
  systemInfo: any

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      paneHeight: 0,
      tabList: [
        { 
          id: 0, 
          title: '旅居', 
          search: {
            pageNum: 0,
            pageSize: 20,
            total: 0,
          },
          list: [],
        },
        { 
          id: 1, 
          title: '商品', 
          search: {
            pageNum: 1,
            pageSize: 20,
            total: 0,
          },
          list: [],
        }
      ],
      current: 0,
    }
    this.systemInfo = config.systemInfo
  }

  componentWillMount() {
    this.pageJourneyBaseCollection()
    this.pageProductCollection()
  }

  componentDidMount() {
    this.setPaneHeight()
  }

  /**
   * 设置pane高度
   */
  setPaneHeight() {
    const query = Taro.createSelectorQuery()
    query.select('.tab-wrap').boundingClientRect()
    query.exec((res) => {
      console.log(Taro.getSystemInfoSync())
      console.log(res[0].height)
      console.log(Taro.getSystemInfoSync().windowHeight - res[0].height)
      this.setState({
        paneHeight: Taro.getSystemInfoSync().windowHeight - res[0].height
      })
    })
  }

  /**
   * 获取旅居基地收藏列表
   * @param isLoadMore 加载更多
   */
  async pageJourneyBaseCollection(isLoadMore?: boolean) {
    const { tabList } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      tabList[0].search.pageNum = 0
      tabList[0].list = []
    }
    tabList[0].search.pageNum++
    let res = await this.$api.mine.pageJourneyBaseCollection(tabList[0].search)
    console.log(res.data)
    tabList[0].search.total = res.data.data.total
    tabList[0].list = [...tabList[0].list, ...res.data.data.list]
    this.setState({
      tabList
    })
    this.setPageLoading(false)
  }

  /**
   * 获取商品收藏列表
   * @param isLoadMore 加载更多
   */
  async pageProductCollection(isLoadMore?: boolean) {
    const { tabList } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      tabList[1].search.pageNum = 0
      tabList[1].list = []
    }
    tabList[1].search.pageNum++
    let res = await this.$api.mine.pageProductCollection(tabList[0].search)
    console.log(res.data)
    tabList[1].search.total = res.data.data.total
    tabList[1].list = [...tabList[1].list, ...res.data.data.list]
    this.setState({
      tabList
    })
    this.setPageLoading(false)
  }

  handleClickTabs(current: number): void  {
    this.setState({
      current
    })
  }

  handleScrollLower() {
    let { current, tabList } = this.state

    if (this.isHasNextPage(tabList[current].search)) {
      this.pageJourneyBaseCollection(true)
      this.pageProductCollection(true)
    }
  }

  handleDelete(id: string) {
    Taro.showModal({
      title: '提示',
      content: '是否取消喜欢？'
    }).then((res: any) => {
      if (res.confirm) {
        if (this.state.current === 1) {
          this.deleteProductCollection(id)
        } else {
          this.deleteJourneyBaseCollection(id)
        }
      }
    })
  }

  /**
   * 取消收藏商品
   * @param productId 商品id
   */
  async deleteProductCollection(productId: string) {
    await this.$api.mine.deleteProductCollection({ productId })
    this.pageProductCollection()
  }

  /**
   * 取消收藏旅居基地
   * @param journeyBaseId 基地id
   */
  async deleteJourneyBaseCollection(journeyBaseId: string) {
    await this.$api.mine.deleteJourneyBaseCollection({ journeyBaseId })
    this.pageJourneyBaseCollection()
  }


  render() {
    const { tabList, current, paneHeight, pageLoading } = this.state

    return (
      <View className="like">
        <LoadingBox visible={pageLoading} />

        <View className="tab-wrap">
          <TabsWrap
            tabs={tabList}
            current={current}
            onClickTabs={this.handleClickTabs.bind(this)}
          />
        </View>

        <View className="tabs-pane-wrap">
          <ScrollView 
            scrollY 
            className={`tabs-pane ${current !== 0 ? 'hidden' : ''}`} 
            style={{height: paneHeight + 'px'}}
            onScrollToLower={this.handleScrollLower.bind(this)}
          >
            <DividingLine height={30} />
            <View>
              {tabList[0].list.map((item: any, index: number) => {
                return <SojournItem item={item} index={index} key={item.id} isDetele={true} onDelete={this.handleDelete.bind(this)} />
              })}
            </View>
            {tabList[0].list.length === 0 &&  <EmptyDataBox />}
            <LogoWrap />
          </ScrollView>

          <ScrollView 
            scrollY 
            className={`tabs-pane ${current !== 1 ? 'hidden' : ''}`} 
            style={{height: paneHeight + 'px'}}
            onScrollToLower={this.handleScrollLower.bind(this)}
          >
            <View className="goods-wrap">
              {tabList[1].list.map((item: any) => {
                return <ProductItem item={item} key={item.id} isDetele={true} onDelete={this.handleDelete.bind(this)} />
              })}
            </View>
            {tabList[1].list.length === 0 &&  <EmptyDataBox />}
            <LogoWrap />
          </ScrollView>
        </View>
      </View>
    )
  }
}

export default Like