import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSearchBar } from 'taro-ui';
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, DividingLine, TabsWrap, SwiperWrap, ProductItem, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  pageLoading: boolean
  tabs: any[]
  searchData: any;
  swiperData: any[]
  list: any[]
}

interface HotGoods {
  state: StateType
}


class HotGoods extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '人气商品',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      searchData: {
        storeId: '',
        categoryId: '',
        name: '',
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      list: [],
      tabs: [],
      swiperData: [
        {
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
      ],
    }
  }

  componentWillMount() {
    const storeId = Taro.getStorageSync('storeId')
    console.log(storeId)
    let { searchData } = this.state
    searchData.storeId = storeId
    this.setState({
      searchData
    }, () => {
      this.listByTypeAndParentId(storeId)
    })
  }

  onPullDownRefresh() {
    this.productPage();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.productPage(true)
    }
  }

  async listByTypeAndParentId(storeId: string) {
    const { searchData } = this.state
    const res = await this.$api.mall.listByTypeAndParentId({ type: 1, storeId })
    console.log(res.data)
    searchData.categoryId = res.data.data[0].id
    this.setState({
      tabs: res.data.data,
      searchData,
    }, () => {
      this.productPage()
    })
  }

  async productPage(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      list = []
    }
    searchData.pageNum++
    try {
      const res = await this.$api.mall.productPage(searchData)
      const data = res.data.data
      if (data.total) searchData.total = data.total
      if (isLoadMore) list = [...list, ...data.list]
      else list = data.list
      this.setState({
        list,
        searchData,
      }, () => {
        console.log(this.state.list, this.state.searchData)
      })
      Taro.stopPullDownRefresh();
      this.setPageLoading(false);
    } catch (err) {
      Taro.stopPullDownRefresh();
      this.setPageLoading(false);
    }
  }

  handleClickTabs(current: number | string): void {
    const { searchData } = this.state
    searchData.categoryId = current
    this.setState({
      searchData
    }, () => {
      this.productPage()
    })
  }

  onSearchChange(value: string): void {
    const { searchData } = this.state
    searchData.name = value
    this.setState({
      searchData
    })
  }
  onActionClick() {
    this.productPage()
  }

  render() {
    const { tabs, list, searchData, swiperData, pageLoading } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />
        <View className="hot-goods-page">
          <View className="fixed-top">
            <AtSearchBar 
              value={searchData.name}
              onChange={this.onSearchChange.bind(this)}
              onActionClick={this.onActionClick.bind(this)}
              className="search-bar"
            />
            <TabsWrap
              tabs={tabs}
              current={searchData.categoryId}
              onClickTabs={this.handleClickTabs.bind(this)}
            />
          </View>
          

          <DividingLine height={180} />

          {/* <SwiperWrap swiperData={swiperData} /> */}
          {list.length > 0 ?
            <View className="list">
              {list.map((item: any) => {
                return <ProductItem item={item} key={item.id} />
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

export default HotGoods