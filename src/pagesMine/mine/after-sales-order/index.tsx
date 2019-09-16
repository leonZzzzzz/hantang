import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, AfterSalesOrderItem, DividingLine, TabsWrap, LoadingBox, EmptyDataBox } from '@/components';

type StateType = {
  pageLoading: boolean
  tabList: any[]
  searchData: any
  list: any[]
}

interface AfterSalesOrder {
  state: StateType
}


class AfterSalesOrder extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '售后订单',
    onReachBottomDistance: 200,
    enablePullDownRefresh: true,
  }

  isMount: boolean

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      tabList: [
        { title: '全部', id: '' },
        { title: '进行中', id: 'ongoing' },
        { title: '已完成', id: 'finish' },
      ],
      searchData: {
        pageNum: 0,
        pageSize: 20,
        total: 0,
        status: '',
      },
      list: [],
    }
    this.isMount = false;
  }

  componentWillMount() {
    this.getOrderList()
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.getOrderList();
  }

  onPullDownRefresh() {
    this.getOrderList();
  }

  onReachBottom() {
    let { searchData, list } = this.state;
    if (this.isHasNextPage(searchData, list.length)) {
      this.getOrderList(true)
    }
    console.log(this.isHasNextPage(searchData, list.length))
  }

  handleClickTabs(current: number): void  {
    this.setState((preState: any) => {
      preState.searchData.status = current
    }, () => {
      this.getOrderList()
    })
  }

  /**
   * 列表
   * @param isLoadMore 
   */
  async getOrderList(isLoadMore?: boolean) {
    let { searchData, list } = this.state
    if (!isLoadMore) {
      this.setPageLoading(true)
      searchData.pageNum = 0
      searchData.total = 0
    }
    searchData.pageNum++
    const res = await this.$api.mall.afterSalePage(searchData)
    let data = res.data.data
    if (data.total) searchData.total = data.total
    if (isLoadMore) {
      list = [...list, ...data.list]
    } else {
      list = data.list
    }
    this.setState({
      list,
      searchData,
    })
    Taro.stopPullDownRefresh()
    this.setPageLoading(false)
    this.isMount = true;
  }

  // 取消订单提示
  cancelTip(id: string) {
    Taro.showModal({
      title: '提示',
      content: '是否取消该订单？',
    }).then(res => {
      if (res.confirm) {
        this.cancelOrder(id)
      }
    });
  }
  // 取消订单
  async cancelOrder(id: string) {
    await this.$api.mall.cancelOrder({id})
    this.showToast('取消成功')
    this.getOrderList();
  }


  render() {
    const { tabList, searchData, list, pageLoading } = this.state

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
              {list.map((item: any) => {
                return <AfterSalesOrderItem item={item} key={item.id} onCancel={this.cancelTip.bind(this)} />
              })}
            </View>
            :
            <EmptyDataBox title="暂无相关订单" />
          }
        </View>

        <LogoWrap />
      </View>
    )
  }
}

export default AfterSalesOrder