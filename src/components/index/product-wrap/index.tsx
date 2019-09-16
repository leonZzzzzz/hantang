import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// tslint:disable-next-line
import config from '@/config/index'

import { PopularityItem } from '@/components/index'

function ProductWrap(props: any): JSX.Element {
  const titleData: any = {
    title: '人气商品',
    icon: 'irenqishangpin',
    desc: '大家都爱买！',
  }

  let { popularifyData } = props

  const navigateTo = (): void => {
    Taro.navigateTo({
      url: '/pagesCommon/product/index'
    })
  }

  return (
    <View className="product-wrap">
      <View className="bg"></View>
      <View className="title-wrap">
        <View className="left">
          <Text className={`iconfont ${titleData.icon}`}></Text>
          <Text className="title">{titleData.title}</Text>
          <Text className="desc">{titleData.desc}</Text>
        </View>
        <View className="more" onClick={navigateTo}>
          <Text className="desc">更多</Text>
          <Text className="iconfont iyoujiantou"></Text>
        </View>
      </View>

      {popularifyData.length > 0 && popularifyData.map((item: any) => {
        return (
          <View className="group" key={item.id}>
            <View className="type-cover">
              <Image src={config.imgHost + item.category.iconUrl} mode="aspectFill" />
            </View>
            <View className="list">
              {item.products && item.products.length > 0 && item.products.map((product: any, index: number) => {
                return <PopularityItem className="item-width" item={product} index={index} key={item.id} />
              })}
            </View>
          </View>
        )
      })}
    </View>
  )
}

ProductWrap.defaultProps = {
  popularifyData: []
}

ProductWrap.options = {
  addGlobalClass: true
}

export default ProductWrap