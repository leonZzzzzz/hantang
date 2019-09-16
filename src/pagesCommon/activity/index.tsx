import Taro, { Config } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui';
import BaseComponent from '@/utils/components'
import config from '@/config/index'

import './index.scss'

import { LogoWrap, ActivityItem, TabsWrap, DividingLine, LoadingBox, EmptyDataBox } from '@/components/index'

type StateType = {
  pageLoading: boolean
  searchData: any;
  tabList: any[];
  current: number
  paneHeight: number
  list: any[]
}

interface Activity {
  state: StateType
}


class Activity extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '精彩活动',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  // systemInfo: any
  isMount: boolean

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      paneHeight: 0,
      searchData: {
        title: '',
        pageNum: 0,
        pageSize: 20,
        total: 0,
      },
      list: [],
      current: 0,
      tabList: [
        { 
          id: 1, 
          title: '旅居', 
          current: 0,
          isLoad: false,
          search: {
            pageNum: 1,
            pageSize: 20,
            total: 0,
          },
          list: [
            {
              id: 1,
              title: '道家法术偶是道家法术偶是金佛但是哦对肌肤地金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            },
            {
              id: 2,
              title: '道家法术偶是金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            },
            {
              id: 3,
              title: '道家法术偶是金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            },
            {
              id: 3,
              title: '道家法术偶是金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            },
            {
              id: 4,
              title: '道家法术偶是金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            },
            {
              id: 5,
              title: '道家法术偶是金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            },
            {
              id: 6,
              title: '道家法术偶是金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            }
          ],
        },
        {
          id: 2, 
          title: '商品', 
          current: 1,
          isLoad: false,
          search: {
            pageNum: 1,
            pageSize: 20,
            total: 0,
          },
          list: [
            {
              id: 1,
              title: '道家法术偶是道家法术偶是金佛但是哦对肌肤地金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            },
            {
              id: 2,
              title: '道家法术偶是金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            },
            {
              id: 3,
              title: '道家法术偶是金佛但是哦对肌肤地',
              tag: '3人团',
              price: 234354,
              iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
            }
          ],
        }
      ],

    }
    // this.systemInfo = config.systemInfo
    this.isMount = false
  }

  componentWillMount() {
    this.activityPage()
    // this.listByTypeAndParent()
  }
  // componentDidMount() {
  //   this.getPaneHeight()
  // }

  componentDidShow() {
    if (!this.isMount) return;
    this.activityPage();
  }

  onPullDownRefresh() {
    this.activityPage();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.activityPage(true)
    }
  }

  async listByTypeAndParent() {
    await this.$api.common.listByTypeAndParent({type: 3})
  }

  async activityPage(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      searchData.total = 0
      list = []
    }
    searchData.pageNum++
    const res = await this.$api.common.activityPage(searchData)
    const data = res.data.data
    if (data.total) searchData.total = data.total

    this.setState({
      list: [...list, ...data.list],
      searchData,
    })
    Taro.stopPullDownRefresh()
    this.setPageLoading(false)
    this.isMount = true
  }

  getPaneHeight() {
    const query = Taro.createSelectorQuery()
    query.select('.tab-wrap').boundingClientRect()
    query.exec((res) => {
      console.log(this.systemInfo.windowHeight - res[0].height)
      this.setState({
        paneHeight: this.systemInfo.windowHeight - res[0].height
      })
    })
  }
  handleSearchChange(value: string): void {
    console.log(value)
  }
  handleActionClick(): void {
    console.log('s')
  }
  handleClickTabs(current: number): void  {
    this.setState({
      current
    })
  }
  handleScrollLower(): void {
    // console.log('handleScrollLower')
    const { tabList, current } = this.state
    if (!tabList[current].isLoad) {
      tabList[current].isLoad = true
      console.log('handleScrollLower')
    
      this.setState({
        [`tabList[${current}].isLoad`]: true
      }, () => {
        console.log(this.state.tabList)
      })
    }
  }

  render() {
    const { searchData, tabList, list, current, paneHeight, pageLoading } = this.state
    return (
      <View>
        <LoadingBox visible={pageLoading} />
        {/* <View className="fixed-wrap">
          <AtSearchBar 
            value={searchData.title}
            onChange={this.handleSearchChange}
            onActionClick={this.handleActionClick}
            className="search-bar"
          />
          <TabsWrap
            tabs={tabList}
            current={current}
            onClickTabs={this.handleClickTabs.bind(this)}
          />
        </View>

        <DividingLine height={100} /> */}

    

        {list.length ?
          <View className="list">
            {list.map((item: any, index: number) => {
              return <ActivityItem item={item} index={index} key={item.id} />
            })}
          </View>
          :
          <EmptyDataBox />
        }

        <LogoWrap />
      </View>
    )
  }

  // render() {
  //   const { searchData, tabList, current, paneHeight } = this.state
  //   return (
  //     <View>
  //       <View className="tab-wrap">
  //         <AtSearchBar 
  //           value={searchData.name}
  //           onChange={this.handleSearchChange}
  //           onActionClick={this.handleActionClick}
  //           className="search-bar"
  //         />
 
  //         <TabsWrap
  //           tabs={tabList}
  //           current={current}
  //           onClickTabs={this.handleClickTabs.bind(this)}
  //         />

  //       </View>

  //       <View className="tabs-pane-wrap">
  //         {tabList.map((tab: any) => {
  //           return (
  //             <ScrollView 
  //               scrollY 
  //               className={`tabs-pane ${current !== tab.current ? 'hidden' : ''}`} 
  //               style={{height: paneHeight + 'px'}}
  //               key={tab.id}
  //               onScrollToLower={this.handleScrollLower}
  //               lowerThreshold={100}
  //             >
  //               <View className="goods-wrap">
  //                 {tab.list.map((item: any, index: number) => {
  //                   return <ActivityItem item={item} index={index} key={item.id} />
  //                 })}
  //               </View>
  //               <LogoWrap />
  //             </ScrollView>
  //           )
  //         })}
  //       </View>
  //     </View>
  //   )
  // }
}


export default Activity