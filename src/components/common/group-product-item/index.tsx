import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import config from '@/config/index'
import util from '@/utils/util'

function GroupProductItem(props: any): JSX.Element {

  let { item, index, type } = props

  const navigateTo = () => {
    let url = `/pagesCommon/group-product/detail/index?id=${item.groupShoppingId}`
    Taro.navigateTo({ 
      url
    })
  }
  
  return (
    <View 
      className={`group-item ${type === 'scrollX' ? (index === 0 ? 'm-left' : '' ) : 'scroll-y'}`}
      onClick={navigateTo}
    >
      <View className="cover">
        <Image src={config.imgHost + (item.baseId ? item.cover : item.iconUrl)} mode="aspectFill" />
      </View>
      <View className="info-wrap">
        <View className="title">{item.baseId ? item.title : item.name}</View>
        <View className="tag">{item.groupQuantity || 0}人团</View>
        <View className="price-wrap">
          <Text className="price">{util.filterPrice(item.groupOrganizerPrice)}</Text>
          <Text className="num">已拼{item.salesQuantity || 0}件</Text>
        </View>
      </View>
    </View>
  )
}

GroupProductItem.defaultProps = {
  item: {},
  index: 0,
  type: 'scrollX'
}

GroupProductItem.options = {
  addGlobalClass: true
}

export default GroupProductItem