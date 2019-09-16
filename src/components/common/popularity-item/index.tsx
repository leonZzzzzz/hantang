import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'
// import { VipPrice } from '@/components/index';
import config from '@/config/index'
import util from '@/utils/util'

function PopularityItem(props: any): JSX.Element {

  let { item, index } = props

  const navigateTo = () => {
    Taro.navigateTo({
      url: `/pagesCommon/product/detail/index?id=${item.id}`
    })
  }

  return (
    <View 
      className={`popularity-item ${index % 2 === 0 ? 'left' : ''}`}
      onClick={navigateTo}
    >
      <View className="img">
        <Image src={config.imgHost + item.iconUrl} mode="aspectFill"></Image>
      </View>
      
      <View className="title">{item.name}</View>
      <View className="price">{util.filterPrice(item.price)}</View>
      {/* <VipPrice vipPrice={item.price} style={{fontSize: '24rpx'}} /> */}

    </View>
  )
}

PopularityItem.defaultProps = {
  item: {}
}

PopularityItem.options = {
  addGlobalClass: true
}


export default PopularityItem
