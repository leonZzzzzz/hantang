import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import { MiniButlerWrap } from '@/components/index'

import util from '@/utils/util'
import config from '@/config/index'

function HelpOrderItem(props: any): JSX.Element {

  let { item, onCancel, steward, onPay, onWriteoff } = props

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

  const writeoff = () => {
    onWriteoff && onWriteoff()
  }


  return (
    <View className="help-order-item">
      <View className="top-wrap">
        <View>订单号：{item.orderNo}</View>

        <View className={`${(item.helpStatus === 2) ? 'yellow' : 'grey'}`}>{item.helpStatusName}</View>
      </View>
      <View className="middle-wrap" onClick={() => navigateTo(`/pagesCommon/firend-help/index?id=${item.id}`)}>
        <View className="goods-group">
          <View className="cover">
            <Image src={config.imgHost + item.orderItems[0].iconUrl} mode="aspectFill" />
          </View>
          <View className="info-wrap">
            <View className="info">
              <View className="title">{item.name}</View>
            </View>
            <View className="price-wrap">
              <View className="price">{util.filterPrice(item.totalAmount)}</View>
              {item.helpStatus === -1 &&
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

        {item.helpStatus === 1 &&
          <View className="btn-wrap">
            <Button plain className="b-item" openType="share" data-title={item.title} data-coverUrl={item.cover} data-id={item.businessId}>
              分享
            </Button>
          </View>
        }

        {item.helpStatus === 2 &&
          <View className="btn-wrap">
            <Button plain className="b-item" openType="share" data-title={item.title} data-coverUrl={item.cover} data-id={item.businessId}>
              分享
            </Button>
            <Button plain className="b-item primary" onClick={writeoff}>
              核销
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
              onClick={cancelOrder}
            >去点评</View>
          </View>
        }
        
      </View>
    </View>
  )
}

HelpOrderItem.defaultProps = {
  item: {},
  steward: {},
}

export default HelpOrderItem