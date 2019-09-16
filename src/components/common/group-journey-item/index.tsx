import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import config from '@/config/index'
import util from '@/utils/util'

function GroupJourneyItem(props: any): JSX.Element {

  let { item, index, type } = props

  const navigateTo = () => {
    let url = `/pagesSojourn/sojourn/detail/index?id=${item.groupShoppingId}&type=group`
    Taro.navigateTo({ 
      url
    })
  }
  
  return (
    <View 
      className={`group-journey-item ${type === 'scrollX' ? (index === 0 ? 'm-left' : '' ) : 'scroll-y'}`}
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

GroupJourneyItem.defaultProps = {
  item: {},
  index: 0,
  type: 'scrollX'
}

GroupJourneyItem.options = {
  addGlobalClass: true
}

export default GroupJourneyItem