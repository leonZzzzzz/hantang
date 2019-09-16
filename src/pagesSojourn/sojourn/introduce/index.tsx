import Taro, { Config } from '@tarojs/taro'
import { View, Text, Video, Image, Button } from '@tarojs/components'
import './index.scss'

import { SwiperWrap, PlayPackagesItem, RecommendWrap, TravelsEvaluateItem, LogoWrap, DividingLine, ContentWrap, LoadingBox, BottomTab } from '@/components/index'

import BaseComponent from '@/utils/components'

type StateType = {
  pageLoading: boolean;
  playData: object[];
  recommendData: object[];
  evaluateData: object[];
  bottomBar: object[];
  shareVisible: boolean;
  posterVisible: boolean;
  specsVisible: boolean
  detail: any
  journeyLines: object[]
  productList: any[]
  isLike: boolean
  travelsList: any[]
}

interface Introduce {
  state: StateType
}

class Introduce extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '基地介绍'
  }

  id: string;

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      detail: {},
      isLike: false,
      journeyLines: [],
      productList: [],
      playData: [
        {
          id: 1,
          title: '道家法术偶是道家法术偶是金佛但是哦对肌肤地金佛但是哦对肌肤地',
          tag: '3人团',
          price: 234354,
          vipPrice: 21343,
          iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 2,
          title: '道家法术偶是金佛但是哦对肌肤地',
          tag: '3人团',
          price: 234354,
          vipPrice: 21343,
          iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 3,
          title: '道家法术偶是金佛但是哦对肌肤地',
          tag: '3人团',
          price: 234354,
          vipPrice: 21343,
          iconUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        }
      ],
      recommendData: [
        {
          id: 1,
          title: '道家法术偶是道家法术偶是金佛但是哦对肌肤地金佛但是哦对肌肤地',
          price: 23,
          vipPrice: 21,
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 2,
          title: '道家法术偶是金佛但是哦对肌肤地',
          price: 54,
          vipPrice: 43,
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 3,
          title: '道家法术偶是金佛但是哦对肌肤地',
          price: 234354,
          vipPrice: 21343,
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
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
      bottomBar: [
        {
          id: 1,
          name: '首页',
          icon: 'ishouye1'
        },
        {
          id: 2,
          name: '管家',
          icon: 'iguanjia'
        },
        {
          id: 3,
          name: '分享',
          icon: 'ifenxiang'
        },
      ],
      specsVisible: false,
      shareVisible: false,
      posterVisible: false,
      travelsList: [],
    }
    this.id = ''
  }

  componentWillMount() {
    Taro.hideShareMenu();
    const { id } = this.$router.params
    this.id = id
    this.baseDetail(id)
    this.bindJourneyLines(id)
    this.bindShops(id)
    this.groupProductPage()
    this.travelsPage(id)
  }
  componentDidShow() {
    console.log('componentDidShow')
  }

  onShareAppMessage() {
    const { detail } = this.state
    return {
      title: detail.name,
      imageUrl: this.imgHost + detail.iconUrl,
      path: '/pagesSojourn/sojourn/introduce/index?id=' + detail.id
    }
  }

  /**
   * 基地详情
   * @param id 基地id
   */
  async baseDetail(id: string): Promise<any> {
    let res = await this.$api.sojourn.baseDetail({id})
    console.log('baseDetail', res.data.data)
    this.setState({
      detail: res.data.data,
      isLike: res.data.data.isLike
    })
    this.setPageLoading(false)
  }

  /**
   * 绑定路线
   * @param journeyBaseId 基地id
   */
  async bindJourneyLines(journeyBaseId: string): Promise<any> {
    let res = await this.$api.sojourn.bindJourneyLines({ journeyBaseId })
    console.log('bindJourneyLines', res.data.data)
    this.setState({
      journeyLines: res.data.data
    })
  }
  // 绑定商品
  /**
   * 绑定商品
   * @param journeyBaseId 基地id
   */
  async bindShops(journeyBaseId: string): Promise<any> {
    try {
      let res = await this.$api.sojourn.bindShops({ journeyBaseId })
      console.log('bindShops', res.data.data)
      this.setState({
        shops: res.data.data
      })
    } catch (err) {
      console.log('bindShops err', err)
    }
  }

  /**
   * 游记列表
   */
  async travelsPage(journeyBaseId: string) {
    let res = await this.$api.travels.travelsPage({pageNum: 1, pageSize: 4, journeyBaseId})
    let data = res.data.data
    this.setState({
      travelsList: data.list,
    })

  }

  /**
   * 拼团商品列表
   */
  async groupProductPage() {
    const res = await this.$api.mall.groupProductPage({pageNum: 1, pageSize: 6})
    // let list = res.data.data.list
    let list = res.data.data.list
    this.setState({
      productList: list
    })
  }

  /**
   * 喜欢
   */
  async handleLike() {
    const { isLike } = this.state
    let type = isLike ? 'deleteJourneyBaseCollection' : 'addJourneyBaseCollection'
    await this.$api.mine[type]({journeyBaseId: this.id})
    this.setState({
      isLike: !isLike
    });
  }

  /**
   * 底部按钮点击
   * @param item 底部按钮item
   */
  clickBottomBar(item: any): void {
    console.log(item)
    if (item.id === 1) {
      this.switchTab('/pages/index/index')
    }
    if (item.id === 3) {
      this.setDialogVisible(true, 'shareVisible')
    }
  }

  /**
   * 分享按钮点击
   * @param item 分享item
   */
  clickShareBar(item: any): void {
    console.log(item)
    if (item.id === 2) {
      this.setDialogVisible(false, 'shareVisible')
      this.setDialogVisible(true, 'posterVisible')
    }
  }

  render() {
    const { pageLoading, playData, recommendData, evaluateData, bottomBar, travelsList, detail, journeyLines, productList, isLike } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />
        <View className="introduce">
          {/* {detail.videoUrl ?
            <Video className="video" src={this.imgHost + detail.videoUrl} />
            :
            <View className="cover-wrap">
              <Image src={this.imgHost + detail.iconUrl} mode="widthFix" />
            </View>
          } */}
          <View className="cover-wrap">
            <Image src={this.imgHost + detail.iconUrl} mode="widthFix" />
          </View>

          <View className="title-wrap">
            <View className="top">
              <View className="left">
                <View className="title">{detail.name}</View>
              </View>
              <View className="right" onClick={this.handleLike.bind(this)}>
                <Text className={`iconfont ${isLike ? 'ixihuan1' : 'ixihuan'}`}></Text>
                <Text>喜欢</Text>
              </View>
            </View>
            <View className="bottom">
              <View className="gou">{detail.buyCount || 0}人已购</View>
            </View>
          </View>

          <View className="address-wrap">
            <View className="left">
              <View className="iconfont idizhi" />
              <View>{detail.province}{detail.city}{detail.area}</View>
            </View>
            {/* <View className="right" onClick={this.navigateTo.bind(this, '/pagesSojourn/sojourn/introduce/map/index')}> */}
            <View className="right">
              <Text>地图</Text>
              <Text className="iconfont iyoujiantou" />
            </View>
          </View>


          {journeyLines.length && 
            <View className="taocan-wrap d-line">
              <View className="title">游玩套餐</View>
              {journeyLines.length && journeyLines.map((item: any, index: number) => {
                return <PlayPackagesItem item={item} index={index} key={item.id}/>
              })}
          </View>
          }

          {productList.length > 0 &&
            <View className="d-line">
              <RecommendWrap list={productList} url="/pagesCommon/group-product/index" title="大家都在拼" />
            </View>
          }

          <DividingLine />
          
          <ContentWrap title="基地介绍" content={detail.desc} />

          

          {/* <DividingLine /> */}

          {travelsList.length > 0 &&
            <View className="travels-evaluate-wrap d-line">
              <View className="title">游记评价（213）</View>
              <View className="list">
                {travelsList.length && travelsList.map((item: any, index: number) => {
                  return <TravelsEvaluateItem item={item} index={index} key={item.id} />
                })}
              </View>
              <View className="more">
              {/* <View className="more" onClick={this.switchTab.bind(this, '/pages/travels/index')}> */}
                更多精彩游记
                <Text className="iconfont iyoujiantou" />
              </View>
            </View>
          }
        </View>

        <View className="bottom-wrap">
          <BottomTab display="inline-flex" />
        </View>

        <LogoWrap bottom={110} />
      </View>
    )
  }
}

export default Introduce