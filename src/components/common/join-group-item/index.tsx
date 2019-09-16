import { View, Image } from '@tarojs/components'
import './index.scss'
import config from '@/config/index'
import util from '@/utils/util'
import Taro from '@tarojs/taro'

// import { VipPrice } from '@/components/index'

function JoinGroupItem(props: any): JSX.Element {

  let { state, item, groupQuantity, type } = props

  const navigateTo = () => {
    console.log(type)
    let url = `/pagesCommon/group-product/detail/index?id=${item.businessId}`
    if (type === 'journey') url = `/pagesSojourn/sojourn/detail/index?id=${item.groupShoppingId}&type=group`
    Taro.navigateTo({
      url
    })
  }

  return (
    <View className="join-assemble-item" onClick={navigateTo}>
      <View className="box">
        <View className="iconfont ijiaobiao"></View>
        <View className="tag">{groupQuantity}人团</View>
        <View className="cover">
          <Image mode="aspectFill" src={config.imgHost + (item.iconUrl || item.cover)} />
        </View>
        <View className="info-wrap">
          <View className="title">{item.name || item.title}</View>
          <View className="price-wrap">
            <View className="price">{util.filterPrice(item.price)}</View>
          </View>
        </View>
        <View className="iconfont iyoujiantou right"></View>
      </View>
      {(state === 2 || state === -1) &&
        <View className="state">
          <View className={`iconfont ${state === 2 ? 'ipintuanchenggong success' : state === -1 ? 'ipintuanshibai fail' : ''}`}></View>
          {/* <View className="iconfont icon-gou1 fail"></View> */}
        </View>
      }
    </View>
  )
}

JoinGroupItem.options = {
  addGlobalClass: true
}

JoinGroupItem.defaultProps = {
  item: {},
}

export default JoinGroupItem