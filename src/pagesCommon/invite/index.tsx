import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { LogoWrap, InviteItem, LoadingBox, ShareWrap } from '@/components';

import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  list: any[]
  shareVisible: boolean
  countTotal: any
}

interface Invite {
  state: StateType
}

class Invite extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '邀请有礼',
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      shareVisible: false,
      list: [],
      countTotal: {},
    }
  }

  componentWillMount() {
    console.log(this.$router.params)
    this.shareGetInvite()
    this.shareGetCount()
  }


  async getMemberInfo() {
    await this.$api.mine.getMemberInfo()
  }

  /**
   * 邀请列表
   */
  async shareGetInvite() {
    const res = await this.$api.mine.shareGetInvite({ pageNum: 1, pageSize: 5 })
    this.setState({
      list: res.data.data.list
    })
  }
  /**
   * 我的奖励
   */
  async shareGetCount() {
    try {
      const res = await this.$api.mine.shareGetCount()
      this.setState({
        countTotal: res.data.data
      })
      this.setPageLoading(false)
    } catch (err) {
      this.navigateBack()
    }
  }

  render() {
    const { pageLoading, list, shareVisible, countTotal } = this.state

    return (
      <View className="invite">
        <LoadingBox visible={pageLoading} />

        <View className="banner">
          <Image src={this.imgHost + '/attachments/static/yaoqing.png'} mode="widthFix" />
        </View>
        <View className="container">
          <View className="box">
            <View className="title">
              <Image src={this.imgHost + '/attachments/static/yq-title.png'} mode="widthFix" />
            </View>
          
            <View className="total-group">
              <View className="item">
                <View>累计奖励</View>
                <View className="sum">
                  <Text className="unit">￥</Text>
                  <Text className="num">{util.filterPrice(countTotal.sum)}</Text>
                </View>
              </View>
              <View className="item">
                <View>成功邀请</View>
                <View className="sum">
                  <Text className="num">{countTotal.count}</Text>
                  <Text className="unit">人</Text>
                </View>
              </View>
            </View>

            <View className="invite-btn">
              <Button 
                plain
                onClick={this.setDialogVisible.bind(this, true, 'shareVisible')}
              >

                <Text>{countTotal.count > 0 ? '继续邀请赚更多' : '立即邀请'}</Text>
                <Text className="iconfont iyoujiantou" />
              </Button>
            </View>
            {list.length > 0 && 
              <View className="list">
                <View className="l-title">
                  <Text className="kuai" />
                  <Text className="text">已邀请的</Text>
                  <Text className="kuai" />
                </View>
                {list.map((item: any, index: number) => {
                  return <InviteItem item={item} index={index} key={item.id} />
                })}
                <View className="more" onClick={this.navigateTo.bind(this, '/pagesCommon/invite/list/index')}>
                  <Text>查看全部</Text>
                  <Text className="iconfont iyoujiantou" />
                </View>
              </View>
            }
          </View>
        </View>
        <LogoWrap styles={{zIndex: 0, background: 'transparent', color: 'rgb(211, 156, 159)'}} />

        {/* 分享组件 */}
        <ShareWrap 
          visible={shareVisible}
          apiType="mine"
          apiStr="sharePoster"
          onClose={this.setDialogVisible.bind(this, false, 'shareVisible')}
        />
      </View>
    )
  }
}

export default Invite
