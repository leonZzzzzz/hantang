import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'

import config from '@/config/index'
import util from '@/utils/util'

// import { VipPrice } from '@/components/index'

function PlayPackagesItem(props: any): JSX.Element {

  let { item, index } = props

  const navigateTo = (): void => {
    Taro.navigateTo({
      url: `/pagesSojourn/sojourn/detail/index?id=${item.id}&baseId=${item.baseId}`
    })
  }

  return (
    <View 
      className={`play-packages-item ${index !== 0 ? 'top-line': ''}`}
      onClick={navigateTo}
    >
      <View className="left">
        <Image src={config.imgHost + item.cover} mode="aspectFill"></Image>
      </View>
      <View className="right">
        <View className="title">{item.title}</View>
        <View>
          {/* <Text className="num">3人团</Text> */}
        </View>
        <View className="bottom">
          <View className="price-wrap">
            <Text className="price">{util.filterPrice(item.price)}</Text>
          </View>
          <View className="sign">立即预定</View>
        </View>
      </View>
    </View>
  )
}

PlayPackagesItem.defaultProps = {
  item: {},
}

export default PlayPackagesItem
