import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

import config from '@/config/index'
import BaseComponent from '@/utils/components'

import { SwiperWrap, LogoWrap, DividingLine, ContentWrap, Avatar, LoadingBox } from '@/components/index'

type StateType = {
  pageLoading: boolean
  swiperData: any[];
  content: string;
  signList: any[]
  detail: any
}

interface ActivityDetail {
  state: StateType
}

class ActivityDetail extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '活动详情',
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      detail: {},
      swiperData: [
        {
          id: 1,
          src: config.imgHost + 'attachments/actType/2d1443bd41794a7697b5687b7bfa0916.jpg',
        },
        {
          id: 2,
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 3,
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 4,
          src: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        }
      ],
      content: '就偶的佛过度肥胖骨科大夫高空排放的开票的发票给抛开大盘开房打扑克',
      signList: [
        {
          id: 1,
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 2,
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 3,
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
        {
          id: 4,
          headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        },
      ]
    }
  }

  componentWillMount() {
    const { id } = this.$router.params
    this.activityGet(id)
  }

  async activityGet(id: string) {
    const res = await this.$api.common.activityGet({ id })
    this.setState({
      detail: res.data.data
    })
    this.setPageLoading(false)
  }


  render() {
    const { swiperData, signList, content, pageLoading, detail } = this.state

    return (
      <View className="assemble-detail">

        <LoadingBox visible={pageLoading} />

        {/* <SwiperWrap swiperData={swiperData} /> */}

        <View className="cover-wrap">
          <Image src={config.imgHost + detail.iconUrl} mode="widthFix" />
        </View>

        <View className="title-wrap">
          <View className="title">{detail.title}</View>

          <View className="bottom">
            <View className="total">
              <Text className="num">12343</Text>
              <Text>人已报名</Text>
            </View>
            {detail.activitySignSetting && detail.activitySignSetting.imageList && detail.activitySignSetting.imageList.length &&
              <View className="sign">
                <View className="list">
                  {detail.activitySignSetting.imageList.map((item: any) => {
                    return (
                      <View key={item.id} className="item">
                        <Avatar imgUrl={item} width={60} style={{border: '1px solid #fff'}} />
                      </View>
                    )
                  })}
                </View>
                <View className="iconfont icon-share" />
              </View>
            }
          </View>
        </View>

        <DividingLine />

        <View className="info-wrap">
          <View className="item">
            <View className="label">时间</View>
            <View className="value">{detail.startTimeStr}</View>
          </View>
          <View className="item">
            <View className="label">地点</View>
            <View className="value">
              <Text className="iconfont icon-share" />
              {detail.address || '无'}</View>
          </View>
          <View className="item">
            <View className="label">主办</View>
            <View className="value">{detail.sponsor || '无'}</View>
          </View>
          <View className="item">
            <View className="label">协助</View>
            <View className="value">{detail.organizer || '无'}</View>
          </View>
        </View>

        <DividingLine />

        <ContentWrap title="活动介绍" content={detail.content} />

        <View className="bottom-wrap">
          <View className="icon-wrap">
            <View 
              className="item"
            >
              <Text className="iconfont ishouye1"></Text>首页
            </View>
          </View>
          {/* {detail.status === 1 &&
            <View 
              className="sign-btn disabled" 
            >{detail.activitStatus}</View>
          } */}
          {detail.status === 1 &&
            <View 
              className="sign-btn" 
              onClick={this.navigateTo.bind(this, '/pagesCommon/activity/sign/index?id=' + detail.id)}
            >{detail.activitStatus}</View>
          }
        </View>

        <LogoWrap bottom={110} />

      </View>
    )
  }
}


export default ActivityDetail