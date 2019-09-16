import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image, Button, Form } from '@tarojs/components'
import './index.scss'

import bannerUrl from '@/img/help-banner.png'

import { LogoWrap, Avatar, CountDown, LoadingBox } from '@/components/index'

import BaseComponent from '@/utils/components'

import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  product: any
  detail: any
  self: any
  userList: any[]
}

interface FirendHelp {
  state: StateType
}

class FirendHelp extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '好友助力',
  }

  id: string

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      product: {},
      detail: {},
      self: {},
      userList: [],
    }
    this.id = ''
  }

  componentWillMount() {
    Taro.hideShareMenu()
    const { id } = this.$router.params
    this.id = id
    this.helpDetail(id)
  }

  onShareAppMessage() {
    const { product } = this.state
    return {
      title: '我发现一件好货，快来帮我助力吧！',
      imageUrl: this.imgHost + product.iconUrl,
      path: '/pagesCommon/firend-help/index?id=' + product.orderId
    }
  }

  /**
   * 订单助力情况
   * @param orderId 订单id
   */
  async helpDetail(orderId: string) {
    const res = await this.$api.mall.helpDetail({orderId })
    let data = res.data.data
    data.order.helpHaveQuantityArray = Array.from({length: data.order.helpHaveQuantity}, (v,i) => {return i})
    this.setState({
      product: data.orderItemList[0],
      detail: data.order,
      self: data.self,
      userList: data.userList
    })
    this.setPageLoading(false)
  }

  async help(e: any) {
    let params = {
      id: this.id,
      wxMiniFormId: e.detail.formId
    }
    console.log(params)
    await this.$api.mall.help(params)
    this.showToast('助力成功')
    this.helpDetail(this.id)
  }

  render() {
    const { pageLoading, product, detail, self, userList } = this.state

    return (
      <View className="page">
        <LoadingBox visible={pageLoading} />

        <View className="help">
          <View className="rule-wrap">
            <Text className="text">活动规则</Text>
          </View>
          {/* <View className="banner">
            <Image src={bannerUrl} mode="widthFix" />
          </View> */}

          {/* <View className="pay-goods-wrap">
            <View className="user-wrap">
              <View className="user">
                <Avatar imgUrl={detail.buyerHeader} width={120} style={{border: '2px solid #fff'}} />
                <View className="name">{detail.buyerName}</View>
              </View>
            </View>
            <View className="goods">
              <View className="cover">
                <Image src={this.imgHost + product.iconUrl} mode="aspectFill" />
                <View className="qty">仅剩{product.qty}件</View>
              </View>
              <View className="info">
                <View className="title-wrap">
                  <View className="title">{product.name}</View>
                  <View className="unit">规格：{product.specs}</View>
                </View>
                <View className="bottom-wrap">
                  <View className="price-wrap">
                    <Text className="price">{util.filterPrice(product.price)}</Text>
                    <Text className="origin-price">￥{util.filterPrice(product.origPrice)}</Text>
                  </View>
                  <View className="check" onClick={this.navigateTo.bind(this, `/pagesCommon/firend-help/detail/index?id=${product.productId}`)}>
                    <Text>查看</Text>
                    <Text className="iconfont iyoujiantou" />
                  </View>
                </View>
              </View>
            </View>
            <View className="pay-btn">
              <Button plain>邀请好友助力</Button>
            </View>
          </View> */}

          <View className="goods-wrap border">
            {detail.helpStatus === 2 &&
              <View className="iconfont izhulichenggong icon-right success" />
            }
            {detail.helpStatus === -1 &&
              <View className="iconfont izhulichenggong icon-right fail" />
            }
            <View className="user-wrap">
              <View className="user">
                <Avatar imgUrl={detail.buyerHeader} width={120} style={{border: '2px solid #fff'}} />
                <View className="name">{detail.buyerName}</View>
              </View>
            </View>
            {!self.isOrganizer &&
              <View className="zhuli-text">我发现一件好货，快来帮我助力吧！</View>
            }
            <View className="goods">
              <View className="cover">
                <Image src={this.imgHost + product.iconUrl} mode="aspectFill" />
                <View className="qty">仅剩{product.qty}件</View>
              </View>
              <View className="info">
                <View className="title-wrap">
                  <View className="title">{product.name}</View>
                  <View className="unit">规格：{product.specs}</View>
                </View>
                <View className="bottom-wrap">
                  <View className="price-wrap">
                    <Text className="price">{util.filterPrice(product.price)}</Text>
                    <Text className="origin-price">￥{util.filterPrice(product.origPrice)}</Text>
                  </View>
                  <View className="check" onClick={this.navigateTo.bind(this, `/pagesCommon/firend-help/detail/index?id=${product.productId}`)}>
                    <Text>查看</Text>
                    <Text className="iconfont iyoujiantou" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View className="invite-wrap border">
            {detail.helpNeddQuantity > 0 ? 
              <View className="sum-wrap">
                已邀请
                <Text className="red">{detail.helpHaveQuantity}</Text>
                人，还差
                <Text className="red big">{detail.helpNeddQuantity}</Text>
                名好友助力
              </View>
              :
              <View className="sum-wrap">
                已邀请
                <Text className="red">{detail.helpHaveQuantity}</Text>
                人，助力成功
              </View>
            }

            <View className="jindu-wrap">
              {detail.helpHaveQuantity && detail.helpHaveQuantity > 0 && detail.helpHaveQuantityArray.map((index: number) => {
                return  (<Text className={`item ${index !== 0 ? 'line' : ''}`} key={index} style={{width: `${600/detail.helpQuantity}rpx`}}></Text>)
              })}
            </View>
            {detail.helpStatus === 2 ?
              <View className="share-btn">
                <Button plain >查看订单详情</Button>
              </View>
              :
              <View className="share-btn">
                <Form reportSubmit onSubmit={this.help.bind(this)}>
                  {self.isOrganizer ?
                    <Button plain openType="share">邀请好友助力</Button>
                    :
                    <Button plain formType="submit" disabled={self.isHelped} className={`${self.isHelped ? 'disabled' : ''}`}>立即帮TA助力</Button>
                  }
                </Form>
              </View>
            }

            {/* <View className="desc">
              <Text>还剩</Text>
              <CountDown endTime={detail.helpExpireTime} style={{padding: '0 4px'}} styles="text" color="#d10d23" />
              <Text>结束，快喊好友助力吧！</Text>
            </View> */}

            {self.isHelped && detail.helpStatus !== 2 &&  
              <View className="desc">
                <Text>助力成功，感谢你的帮助！</Text>
              </View>
            }
            {!self.isHelped && detail.helpStatus !== 2 &&  
              <View className="desc">
                <Text>还剩</Text>
                <CountDown endTime={detail.helpExpireTime} style={{padding: '0 4px'}} styles="text" color="#d10d23" />
                <Text>结束，快喊好友助力吧！</Text>
              </View>
            }
          </View>

          {userList.length > 0 &&
            <View className="help-list border">
              <View className="title-wrap">
                <Text className="kuai" />
                <Text className="title">助力帮</Text>
                <Text className="kuai" />
              </View>
              <View className="list">
                {userList.map((item: any) => {
                  return (
                    <View className="item" key={item.id}>
                      <View className="user">
                        <Avatar imgUrl={item.header} width={60} />
                        <View className="name">{item.name}</View>
                      </View>
                      <View className="time">{item.createTime}</View>
                    </View>
                  )
                })}
              </View>
            </View>
          }
        </View>
        <LogoWrap styles={{zIndex: 0, background: 'transparent', color: 'rgb(211, 156, 159)'}} />
      </View>
    )
  }
}

export default FirendHelp