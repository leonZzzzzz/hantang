import { View, Image, Text } from '@tarojs/components'
import Taro, { useState } from '@tarojs/taro'

import './index.scss'

import api from '@/api'

function ImageItem(props: any): JSX.Element {
  
  let { item } = props

  const [ praiseQuantity, setPraiseQuantity ] = useState(() => {
    return item.praiseQuantity
  })

  const [ isPraise, setPraise ] = useState(() => {
    return item.isPraise
  })

  const navigateTo = (): void => {
    Taro.navigateTo({
      url: `/pagesTravels/travels/image-detail/index?id=${item.id}`
    });
  }

  const handlePraise = async (e: any) => {
    e.stopPropagation()
    let type = isPraise ? 'praiseDelete' : 'praiseInsert'
    let params = {
      sourceId: item.id,
      sourceType: 6
    }
    await api.travels[type](params)
    setPraiseQuantity(isPraise ? (praiseQuantity - 1) : (praiseQuantity + 1))
    setPraise(!isPraise)
  }

  return (
    <View className="image-item" onClick={navigateTo}>
      <View className="cover">
        <Image src={item.iconUrl} mode="widthFix" />
      </View>
      <View className="bottom-wrap">
        <View className="title">{item.title}</View>
        <View className="info-wrap">
          <View className="info">
            <View className="head">
              <Image src={item.headImage} mode="aspectFill" />
            </View>
            <View className="name">{item.author}</View>
          </View>
          <View className="praise" onClick={handlePraise}>
            <Text className={`iconfont ${isPraise ? 'ixihuan1' : 'ixihuan'}`} />
            <Text>{praiseQuantity}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

ImageItem.defaultProps = {
  item: {}
}

ImageItem.options = {
  addGlobalClass: true
}

export default ImageItem