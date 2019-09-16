import Taro, { Config, showActionSheet } from '@tarojs/taro'
import { View, Text, Video, ScrollView } from '@tarojs/components'
import './index.scss'

import util from '@/utils/util'

import { SwiperWrap, LogoWrap, AssemblePriceWrap, CantuanItem, TravelsEvaluateItem, PlayPackagesItem, OpenVip, Dialog, ContentWrap, LoadingBox, BottomTab } from '@/components/index'
import BaseComponent from '@/utils/components'

type StateType = {
  pageLoading: boolean;
  swiperData: object[];
  cantuanData: object[];
  evaluateData: object[];
  shareVisible: boolean;
  specsVisible: boolean
  moreGroupVisible: boolean
  contentType: number
  detail: any
  selectId: string,
  joinGroup: any
  joinGroupList: any[]
  type: string
  journeyLines: any[]
}

interface SojournDetail {
  state: StateType
}

class SojournDetail extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '拼团旅居详情'
  }

  id: string
  type: string
  baseId: string
  searchData: any

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      detail: {},
      selectId: '',
      journeyLines: [],
      swiperData: [],
      cantuanData: [
        {
          id: 1,
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
          name: '林琳',
        },
        {
          id: 2,
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
          name: 'sdfdsf',
        }
      ],
      evaluateData: [
        {
          id: 1,
          title: '道家法术偶是金佛但是哦对道家法术偶是金肌肤地',
          coverUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
          name: '士大夫大师傅',
          praise: 234,
        },
        {
          id: 2,
          title: '的说法是感到翻跟斗豆腐干豆腐干东覅',
          coverUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
          name: '士大夫大师傅',
          praise: 234,
        },
        {
          id: 3,
          title: '道家法术偶是金佛但是哦对道家法术偶是金肌豆腐干豆腐干肤地',
          coverUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
          name: '士大夫大师傅',
          praise: 234,
        },
      ],
      specsVisible: false,
      shareVisible: false,
      moreGroupVisible: false,
      contentType: 1,
      joinGroup: {},
      joinGroupList: [],
      type: '',
    }
    this.id = ''
    this.type = ''
    this.baseId = ''
    this.searchData = {
      pageNum: 0,
      pageSize: 20,
      total: 0,
    }
  }

  componentWillMount() {
    const { id, type, selectId, baseId } = this.$router.params
    this.id = id
    this.baseId = baseId
    this.type = type
    this.searchData.groupShoppingId = id
    this.setState({
      selectId,
      type
    })
    this.journeyProductDetail(id)
    if (type === 'group') this.listOrganizerOrder()
  }

  onShareAppMessage() {
    const { detail } = this.state
    return {
      title: detail.title,
      imageUrl: this.imgHost + detail.cover,
      path: '/pagesSojourn/sojourn/detail/index?id=' + detail.id
    }
  }

  /**
   * 旅居详情
   * @param id id
   */
  async journeyProductDetail(id: string): Promise<any> {
    let params: any = {}
    if (this.type === 'group') params.groupShoppingId = id
    else params.id = id
    let type = this.type === 'group' ? 'journeyGroupProductDetail' : 'journeyProductDetail'
    let res = await this.$api.sojourn[type](params)
    console.log('journeyProductDetail', res.data)
    let data = res.data.data
    // 处理轮播图数据
    let imgList = data.slidePicture.split('_');
    imgList = imgList.map((item: string) => {
      return this.imgHost + item
    });
    this.setState({
      detail: res.data.data,
      swiperData: imgList
    })
    this.bindJourneyLines()
    this.setPageLoading(false)
  }

  /**
   * 组团订单列表
   */
  async listOrganizerOrder() {
    const res = await this.$api.sojourn.listOrganizerOrder({groupShoppingId: this.id})
    this.setState({
      joinGroup: res.data.data
    })
    this.pageOrganizerOrder()
  }
  /**
   * 发起的拼团订单(分页)
   */
  async pageOrganizerOrder() {
    console.log('pageOrganizerOrder')
    let { joinGroupList } = this.state
    this.searchData.pageNum++
    const res = await this.$api.sojourn.pageOrganizerOrder(this.searchData)
    // const res = await this.$api.sojourn.pageOrganizerOrder(searchData)
    const data = res.data.data

    this.setState({
      joinGroupList: [...joinGroupList, ...data.list],
    })
  }

  /**
   * 绑定路线
   * @param journeyBaseId 基地id
   */
  async bindJourneyLines() {
    let res = await this.$api.sojourn.bindJourneyLines({ journeyBaseId: this.baseId })
    let list = res.data.data.filter((item: any) => {
      return this.id !== item.id
    })
    this.setState({
      journeyLines: list
    })
  }

  handleBottom() {
    let { joinGroupList } = this.state;
    if (this.isHasNextPage(this.searchData, joinGroupList.length)) {
      this.pageOrganizerOrder()
    }
  }

  /**
   * 底部按钮点击
   * @param item 底部按钮item
   */
  clickBottomBar(item: any): void {
    console.log(item)
    if (item.id === 3) {
      this.setDialogVisible(true, 'shareVisible')
    }
  }

  /**
   * 切换content
   * @param contentType number
   */
  clickContentType(contentType: number): void {
    this.setState({
      contentType
    })
  }

  /**
   * 选择日期
   * @param selectId 日期id
   */
  handleSelectDate(selectId: string) {
    this.setState({
      selectId
    })
  }

  /**
   * 购买
   * @param type 购买类型 alone | group
   */
  handleBuy(type: string, organizeOrderId: string) {
    const { selectId } = this.state
    if (!selectId) {
      this.showToast('请选择出行日期')
      return
    }
    this.navigateTo(`/pagesSojourn/sojourn/submit-order/index?id=${this.id}&selectId=${selectId}&type=${type}&organizeOrderId=${organizeOrderId}`)
  }

  render() {
    const { pageLoading, swiperData, selectId, evaluateData, cantuanData, contentType, journeyLines, detail, joinGroup, joinGroupList, moreGroupVisible, type } = this.state
    return (
      <View>
        <LoadingBox visible={pageLoading} />

        <View className="page">

          {detail.videoUrl ?
            <Video className="video" src={this.imgHost + detail.videoUrl} />
            :
            <SwiperWrap swiperData={swiperData} />
          }

          {detail.groupEndTime &&
            <AssemblePriceWrap price={detail.groupPrice} vipPrice={detail.groupVipPrice} endTime={detail.groupEndTime} num={detail.groupQuantity} />
          }

          <View className="title-wrap">
            <View className="top">
              <View className="left">
                <View className="title">{detail.title}</View>
                <View className="price-wrap">
                  <Text className="price">{util.filterPrice(detail.price)}</Text>
                  {/* <VipPrice vipPrice={23.33} style={{marginLeft: '20rpx'}} /> */}
                  <Text className="origin-price">￥{util.filterPrice(detail.marketPrice)}</Text>
                </View>
              </View>
              <View className="right">
                <Text className="num">{detail.travellerQuantity}</Text>
                <Text>人已购</Text>
              </View>
            </View>
            {/* <OpenVip /> */}
          </View>

          {/* <DividingLine /> */}

          {detail.dateList && detail.dateList.length &&
            <View className="travel-time-wrap d-line">
              <View className="title">选择出行时间</View>
              <View className="group">
                {detail.dateList.map((item: any, index: number) => {
                  return (
                    <View 
                      className={`item ${index % 4 === 0 ? 'left' : ''} ${selectId === (item.groupShoppingItemId || item.id) ? 'select' : '' }`} 
                      key={item.id}
                      onClick={this.handleSelectDate.bind(this, item.groupShoppingItemId ? item.groupShoppingItemId : item.id)}
                    >
                      <View className="date">{item.departDate}</View>
                      {/* <View className="price">￥{util.filterPrice(item.price)}</View> */}
                    </View>
                  )
                })}
                {detail.dateList.length > 8 && 
                  <View className={`item ${detail.dateList.length % 4 === 0 ? 'left' : ''}`} >
                    <View className="date">更多日期</View>
                  </View>
                }
              </View>
            </View>
          }

          {joinGroup.quantity && joinGroup.quantity > 0 &&
            <View>
              <View className="desc-wrap">
                <Text>邀请组图，满员成功，不满员自动退款</Text>
                <Text className="iconfont icon-share"></Text>
              </View>

              <View className="pindan-wrap">
                <View className="p-title">
                  <View className="title">
                    <Text className="num">{joinGroup.quantity}</Text>
                    <Text>人正在拼单，可直接参与</Text>
                  </View>
                  <View className="more" onClick={this.setDialogVisible.bind(this, true, 'moreGroupVisible')}>
                    <Text>更多</Text>
                    <Text className="iconfont iyoujiantou"></Text>
                  </View>
                </View>
                <View>
                  {joinGroup.list.map((item: any, index: number) => {
                    return <CantuanItem item={item} index={index} key={item.id} onJoin={this.handleBuy.bind(this)} />
                  })}
                </View>
              </View>
            </View>
          }

          {/* <DividingLine /> */}

          <View className="content-wrap d-line">
            <View className="content-tab-wrap">
              <View 
                className={`item ${contentType === 1 ? 'active' : ''}`} 
                onClick={this.clickContentType.bind(this, 1)}
              >行程介绍</View>
              <View 
                className={`item ${contentType === 2 ? 'active' : ''}`} 
                onClick={this.clickContentType.bind(this, 2)}
              >费用须知</View>
            </View>
            {contentType === 1 &&
              <ContentWrap content={detail.journeyDescription} />
            }
            {contentType === 2 &&
              <ContentWrap content={detail.feeExplain} />
            }
          </View>

          {journeyLines.length > 0 &&
            <View className="taocan-wrap d-line">
              <View className="title">相关套餐</View>
              {journeyLines.length && journeyLines.map((item: any, index: number) => {
                return <PlayPackagesItem item={item} index={index} key={item.id} />
              })}
            </View>
          }

 

          {/* <View className="travels-evaluate-wrap d-line">
            <View className="title">游记评价（213）</View>
            <View className="list">
              {evaluateData.length && evaluateData.map((item: any, index: number) => {
                return <TravelsEvaluateItem item={item} index={index} key={item.id} />
              })}
            </View>
            <View className="more">
              更多精彩游记
              <Text className="iconfont icon-share" />
            </View>
          </View> */}

        </View>

        <View className="bottom-wrap">
          {/* <BottomTab onEvent={this.clickBottomBar.bind(this)} /> */}
          <BottomTab />

          <View 
            className="alone" 
            onClick={this.handleBuy.bind(this, 'alone', '')}
          >
            <View>￥{util.filterPrice(detail.price)}</View>
            <View>单独购买</View>
          </View>
          {type === 'group' &&
            <View 
              className="group"
              onClick={this.handleBuy.bind(this, 'group', '')}
            >
              <View>￥{util.filterPrice(detail.groupPrice)}</View>
              <View className="one">一键开团</View>
            </View>
          }
        </View>

        <LogoWrap bottom={110} />

        {/* 更多拼单弹窗 */}
        <Dialog
          visible={moreGroupVisible}
          position="center"
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'moreGroupVisible')}
        >
          <View className="more-group-dialog">
            <View 
              className="iconfont iguanbi1"
              onClick={this.setDialogVisible.bind(this, false, 'moreGroupVisible')}
            ></View>
            <View className="d-title">正在拼单</View>
            <ScrollView scrollY className="group-list" onScrollToLower={this.handleBottom.bind(this)}>
              {joinGroupList.map((item: any, index: number) => {
                return <CantuanItem item={item} index={index} key={item.id} type="page" onJoin={this.handleBuy.bind(this)} />
              })}
            </ScrollView>
          </View>
        </Dialog>

      </View>
    )
  }
}

export default SojournDetail