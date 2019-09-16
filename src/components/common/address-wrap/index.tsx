import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'

import tiao from '@/img/tiao.png'

function AddressWrap(props: any): JSX.Element {

  const { address } = props

  const handleSelect = () => {
    Taro.navigateTo({
      url: `/pagesMine/mine/address/index?action=1`
    })
  }

  return (
    <View>
      <View className="address-wrap" onClick={handleSelect}>
        <View className="iconfont iwodedizhi place"></View>
        {address.id ?
          <View className="info">
            <View className="name">收货人：{address.receiver} {address.mobile}</View>
            <View className="address">地址：{address.province}{address.city}{address.area}{address.address}</View>
          </View>
          :
          <View className="info">
            <View className="name">请选择收货地址</View>
          </View>
        }
        <View className="iconfont iyoujiantou arrow"></View>
      </View>
      <View className="tiao">
        <Image src={tiao} />
      </View>
    </View>
  )
}

AddressWrap.options = {
  addGlobalClass: true
}
AddressWrap.defaultProps = {
  address: {}
}

export default AddressWrap