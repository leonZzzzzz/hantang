import { View, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import { CountDown, MiniButlerWrap } from '@/components/index'

import util from '@/utils/util'
import config from '@/config/index'

function GroupOrderItem(props: any): JSX.Element {

  let { item, steward, type, onEnd } = props

  const navigateTo = (url: string) => {
    Taro.navigateTo({
      url
    })
  }

  const handleEnd = () => {
    onEnd && onEnd()
  }

  return (
    <View className="group-order-item">
      <View className="top-wrap">
        <View>订单号：{type === 'journey' ? item.orderNumber : item.orderNo}</View>
        <View className={`${(item.groupStatusName === '拼团进行中') ? 'yellow' : 'grey'}`}>{item.groupStatusName}</View>
      </View>

      {type === 'journey' ?
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
                  <View className="cancel">{item.statusName}</View>
              </View>
            </View>
          </View>
        </View>
        :
        <View className="middle-wrap">
          <View className="goods-group">
            {item.organizer &&
              <View className="tag">
                <Image src={config.imgHost + '/attachments/static/tz-tag.png'} mode="widthFix" />
              </View>
            }
            <View className="cover">
              <Image src={config.imgHost + item.orderItems[0].iconUrl} mode="aspectFill" />
            </View>
            <View className="info-wrap">
              <View className="info">
                <View className="title">{item.orderItems[0].name}</View>
              </View>
              <View className="price-wrap">
                <View className="price">{util.filterPrice(item.totalAmount)}</View>
                {/* {item.groupStatus === -1 &&
                  <View className="cancel">{item.statusName}</View>
                } */}
                <View className="cancel">{item.statusName}</View>
              </View>
            </View>
          </View>
        </View>
      }
      <View className="bottom-wrap">
        {steward.id ?
          <MiniButlerWrap butler={steward} />
          :
          <View></View>
        }

        {type === 'journey' &&
          <View className="btn-wrap">
            <Button plain className="b-item" openType="share" data-title={item.title} data-coverUrl={item.cover} data-id={item.businessId}>
              分享
            </Button>
            <Button plain className="b-item" onClick={() => navigateTo(`/pagesCommon/join-group/index?id=${item.id}&type=journey`)}>
              查看详情
            </Button>
          </View>
        }

        {type === 'product' && item.groupStatus !== -1 && 
          <View className="btn-wrap">
            {item.payStatus !== 1 &&
              <Button plain className="b-item" openType="share" data-title={item.orderItems[0].name} data-coverUrl={item.orderItems[0].iconUrl} data-id={item.id}>
                分享
              </Button>
            }
            {item.payStatus === 1 ?
              <Button 
                className="b-item primary"
                onClick={() => navigateTo(`/pagesMine/mine/order/detail/index?id=${item.id}`)}
              >去支付
                <CountDown endTime={item.expireTime} styles="text" showHour={false} onEnd={handleEnd} />
              </Button>
              :
              <Button plain className="b-item" onClick={() => navigateTo(`/pagesCommon/join-group/index?id=${item.id}`)}>
                查看详情
              </Button>
            }
          </View>
        }
      </View>
    </View>
  )
}

GroupOrderItem.defaultProps = {
  item: {},
  steward: {},
}

export default GroupOrderItem