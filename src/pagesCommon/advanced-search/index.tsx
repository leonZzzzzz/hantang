import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui';
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, DividingLine, TabsWrap, ProductItem, SojournItem, ActivityItem, LoadingBox, EmptyDataBox } from '@/components';

import config from '@/config/index'

type StateType = {
  pageLoading: boolean;
  searchData: any;
  tabList: any[]
  current: number
  popularList: any[]
  activityList: any[]
  goodsList: any[]
  fixedHeight: string
  isSearch: boolean
  data: any
  historyKeyword: any[]
}

interface AdvancedSearch {
  state: StateType
}

class AdvancedSearch extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '高级搜索',
    navigationBarBackgroundColor: '#e51c23',
    navigationBarTextStyle: 'white',
  }
  constructor() {
    super()
    this.state = {
      pageLoading: false,
      fixedHeight: '',
      // isSearch: false,
      searchData: {
        keyword: '',
        // pageNum: 1,
        // pageSize: 20,
        // total: 0,
      },
      isSearch: false,
      data: {},
      historyKeyword: [],
      current: 0,
      tabList: [
        { 
          id: 1, 
          title: '全部', 
          current: 0,
          num: 0,
        },
        {
          id: 2, 
          title: '旅居', 
          current: 1,
          num: 0,
        },
        {
          id: 3, 
          title: '商品', 
          current: 2,
          num: 0,
        },
        {
          id: 4, 
          title: '活动', 
          current: 3,
          num: 0,
        }
      ],
      popularList: [
        {
          id: 1,
          name: '但是覅送飞机搜房',
          desc: 'IOdfjosfsdfs大师傅但是',
          tags: '所谓;手动阀手动阀;sfds;',
          videoUrl: "/attachments/null/0f23098cb7e04ad4b61011864a82d7f4.mp4",
        },
        {
          id: 2,
          name: '但是覅送飞机搜房',
          desc: 'IOdfjosfsdfs大师傅但是',
          tags: '所谓;手动阀手动阀;sfds;',
          videoUrl: "/attachments/null/0f23098cb7e04ad4b61011864a82d7f4.mp4",
        }
      ],
      activityList: [
        {
          id: 1,
          title: "7.31抽奖",
          iconUrl: "/attachments/activity/914b97debcc644afb52f9620db86d72c.png",
          startTime: "2019-07-31 00:00:00",
        }
      ],
      goodsList: [
        {
          id: 1,
          title: '的手的的手的手法首发法首发的手的手法首发法首发手法首发法首发',
          iconUrl: "/attachments/activity/914b97debcc644afb52f9620db86d72c.png",
          price: 324,
          num: 2344,
          isTuan: true,
        },
        {
          id: 2,
          title: '的手法首发',
          iconUrl: "/attachments/activity/914b97debcc644afb52f9620db86d72c.png",
          price: 324,
          num: 2344,
        }
      ]
    }
  }

  // componentDidMount() {
  //   this.getFixedHeight()
  // }
  componentWillMount() {
    let keyword = Taro.getStorageSync('keyword')
    console.log(keyword)
    this.setState({
      historyKeyword: keyword || []
    })
  }

  getFixedHeight() {
    const query = Taro.createSelectorQuery()
    query.select('.fixed-wrap').boundingClientRect()
    query.exec((res) => {
      console.log('getFixedHeight', res[0].height)
      if (this.state.fixedHeight === res[0].height + 'px') return
      this.setState({
        fixedHeight: res[0].height + 'px'
      })
    })
  }

  
  handleSearchChange(value: string, type?: string): void {
    const { searchData } = this.state
    searchData.keyword = value
    this.setState({
      searchData
    }, () => {
      if (type === 'history') this.homePageSearch()
    })
  }
  handleSearchClear() {
    console.log('handleSearchClear')
    const { searchData } = this.state
    searchData.keyword = ''
    this.setState({
      searchData,
      isSearch: false,
    })
  }
  handleClickTabs(current: number): void  {
    this.setState({
      current
    })
  }

  async homePageSearch() {
    this.setPageLoading(true)
    try {
      let { searchData, fixedHeight } = this.state
      const res = await this.$api.common.homePageSearch(searchData)
      console.log(res.data)
      
      // this.setState((preState: any) =>{
      //   preState.data = res.data.data
      //   preState.isSearch = true
      // }, () => {
      //   if(!fixedHeight) this.getFixedHeight()
      //   // this.setPageLoading(false)
      //   console.log('setState', this.state.data)
      //   // this.saveSearchKeyWord(searchData.keyword)
      // })
      this.setState({
        isSearch: true,
        data: res.data.data,
      }, () => {
        if(!fixedHeight) this.getFixedHeight()
        this.setPageLoading(false)
        console.log('setState', this.state.data)
        this.saveSearchKeyWord(searchData.keyword)
      })
    } catch (err) {
      console.log(err)
      this.setPageLoading(false)
    }
  }
  setTabsSum(data) {
    // const { tabList } = this.state
    // for (let key in data) {
    //   if (  )
    // }
  }
  saveSearchKeyWord(val: string) {
    let keyword = Taro.getStorageSync('keyword')
    keyword = keyword || []
    let flag = true
    keyword.map((item: string) => {
      if (item === val) flag = false
    })
    if (flag) keyword.push(val)
    Taro.setStorageSync('keyword', keyword)
    this.setState({
      historyKeyword: keyword
    })
  }
  deleteHistorySearch() {
    Taro.removeStorageSync('keyword')
    this.setState({
      historyKeyword: [],
    })
  }

  render() {
    const { fixedHeight, isSearch, searchData, tabList, current, data, historyKeyword, pageLoading } = this.state

    return (
      <View className="search-page">
        <LoadingBox visible={pageLoading} title="搜索中" />
        <View className="fixed-wrap">
          <AtSearchBar 
            value={searchData.keyword}
            onClear={this.handleSearchClear.bind(this)}
            onChange={this.handleSearchChange.bind(this)}
            onActionClick={this.homePageSearch.bind(this)}
            placeholder="输入关键词"
            className="search-bar"
          />
          {isSearch &&
            <TabsWrap
              isNum={true}
              tabs={tabList}
              current={current}
              onClickTabs={this.handleClickTabs.bind(this)}
            />
          }

          {!isSearch && historyKeyword.length &&
            <View className="history-search">
              <View className="h-title-wrap">
                <View>历史搜索</View>
                {historyKeyword.length &&
                  <View className="iconfont ilajitong" onClick={this.deleteHistorySearch.bind(this)} />
                }
              </View>
              <View className="key-wrap">
                {historyKeyword.length && historyKeyword.map((item: string) => {
                  return <View 
                    className="key" 
                    key={item} 
                    onClick={this.handleSearchChange.bind(this, item, 'history')}
                  >{item}</View>
                })}
              </View>
            </View>
          }
        </View>

        {isSearch && <DividingLine height={fixedHeight} />}

        
        {isSearch &&
          <View className="search-content-wrap">
            <View className="whole-wrap">
              {data.products && data.products.length > 0 &&
                <View className="w-item">
                  {/* {data.products} */}
                  <View className="w-title">商品</View>
                  <View className="content">
                    {data.products.map((item: any, index: number) => {
                      return <ProductItem item={item} index={index} key={item.id} style="flex" />
                    })}
                  </View>
                </View>
              }
              {data.journeyBases && data.journeyBases.length &&
                <View className="w-item">
                  <View className="w-title">旅居</View>
                  <View className="content">
                    {data.journeyBases.map((item: any, index: number) => {
                      return <SojournItem item={item} index={index} key={item.id} />
                    })}
                  </View>
                </View>
              }
              {data.activities && data.activities.length &&
                <View className="w-item">
                  <View className="w-title">活动</View>
                  <View className="content">
                    {data.activities.map((item, index) => {
                      return <ActivityItem item={item} index={index} key={item.id} />
                    })}
                  </View>
                </View>
              }
            </View>
            {/* {data.groupShoppings.length === 0 && data.journeyBases.length === 0 && data.journeyProducts.length === 0 && data.products.length === 0 && 
              <EmptyDataBox absolute={false} />
            } */}
          </View>
        }
      </View>
    )
  }
}

export default AdvancedSearch