import { View, Image, Text } from '@tarojs/components'
import './index.scss'
import config from '@/config/index'
import util from '@/utils/util'

function ConfirmOrderGoodsItem(props: any): JSX.Element {

  let { item } = props

  return (
    <View  className="confirm-order-goods-item">
      <View className="left">
        <Image src={config.imgHost + item.iconUrl} mode="widthFix"></Image>
      </View>
      <View className="right">
        <View className="top">
          <View className="title">{item.name}</View>
          <View className="specs">{item.specs}</View>
        </View>
        <View className="price-wrap">
          <Text className="price">{util.filterPrice(item.price)}</Text>
        </View>
        <View className="qty">x{item.qty}</View>
      </View>
    </View>
  )
}

ConfirmOrderGoodsItem.defaultProps = {
  item: {},
  index: null
}

ConfirmOrderGoodsItem.options = {
  addGlobalClass: true
}

export default ConfirmOrderGoodsItem
