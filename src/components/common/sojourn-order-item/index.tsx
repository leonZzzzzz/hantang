import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import { MiniButlerWrap } from '@/components/index'

import util from '@/utils/util'
import config from '@/config/index'

function SojournOrderItem(props: any): JSX.Element {

  let { item, onCancel, steward, onPay } = props

  const navigateTo = (url: string) => {
    Taro.navigateTo({
      url
    })
  }

  const cancelOrder = () => {
    onCancel && onCancel(item.id)
    Taro.setStorageSync('sojournOrderCancelItem', item)
    navigateTo(`/pagesMine/mine/sojourn-order/cancel/index?id=${item.id}`)
  }

  const handlePay = () => {
    onPay && onPay(item.id)
  }


  return (
    <View className="sojourn-order-item">
      <View className="top-wrap">
        <View>订单号：{item.orderNumber}</View>

        {item.groupStatusName ?
          <View className={`${(item.groupStatusName === '拼团进行中') ? 'yellow' : 'grey'}`}>{item.groupStatusName}</View>
          :
          <View className={`${(item.flowStatus === '待支付' || item.flowStatus === '待出行') ? 'yellow' : 'grey'}`}>{item.flowStatus}</View>
        }
      </View>
      <View className="middle-wrap">
        <View className="goods-group">
          <View className="cover">
            <Image src={config.imgHost + item.cover} mode="aspectFill" />
          </View>
          <View className="info-wrap">
            <View className="info">
              <View className="title">{item.title}</View>
              <View className="unit">出发日期：{item.departDate}</View>
            </View>
            <View className="price-wrap">
              <View className="price">{util.filterPrice(item.amount)}</View>
              {item.groupStatus === -1 &&
                <View className="cancel">已退款</View>
              }
            </View>
          </View>
        </View>
      </View>
      <View className="bottom-wrap">
        {steward.id ?
          <MiniButlerWrap butler={steward} />
          :
          <View></View>
        }

        {(item.groupStatus === 1 || item.groupStatus === 2) &&
          <View className="btn-wrap">
            <Button plain className="b-item" openType="share" data-title={item.title} data-coverUrl={item.cover} data-id={item.businessId}>
              分享
            </Button>
          </View>
        }
      
      
        {item.flowStatus === '待支付' && 
          <View className="btn-wrap">
            <Button plain className="b-item" openType="share" data-title={item.title} data-coverUrl={item.cover} data-id={item.productId}>
              分享
            </Button>
            <View 
              className="b-item primary"
              // onClick={() => navigateTo(`/pagesMine/mine/sojourn-order/detail/index?id=${item.id}`)}
              onClick={() => navigateTo(`/pagesSojourn/sojourn/submit-order/index?id=${item.productId}&selectId=${item.goodsId}&orderId=${item.id}`)}
            >去支付
            </View>
          </View>
        }
        {item.flowStatus === '待出行' && 
          <View className="btn-wrap">
            <Button plain className="b-item" openType="share" data-title={item.title} data-coverUrl={item.cover} data-id={item.productId}>
              分享
            </Button>
            <View 
              className="b-item"
              onClick={cancelOrder}
            >取消订单</View>
          </View>
        }
        {item.flowStatus === '已完成' && 
          <View className="btn-wrap">
            <Button plain className="b-item" openType="share" data-title={item.title} data-coverUrl={item.cover} data-id={item.productId}>
              分享
            </Button>
            <View 
              className="b-item primary"
              onClick={() => navigateTo(`/pagesTravels/travels/release/index?type=1&journeyBaseId=${item.baseId}`)}
            >去点评</View>
          </View>
        }
        
      </View>
    </View>
  )
}

SojournOrderItem.defaultProps = {
  item: {},
  steward: {},
}

export default SojournOrderItem