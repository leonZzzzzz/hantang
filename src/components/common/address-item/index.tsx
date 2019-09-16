import { View, Text } from '@tarojs/components'
import Taro  from '@tarojs/taro'

import './index.scss'

function AddressItem(props: any): JSX.Element {

  const { item, onDelete, onSelect } = props

  /**
   * 编辑地址
   * @param e Event
   */
  const handleEdit = (e?: any): void => {
    e.stopPropagation()
    Taro.navigateTo({
      url: '/pagesMine/mine/address/edit/index?id=' + item.id
    })
  }
  /**
   * 删除地址
   * @param e Event
   */
  const handleDelete = (e?: any): void => {
    e.stopPropagation()
    onDelete && onDelete(item.id)
  }
  /**
   * 选择地址
   */
  const handleSelect = (): void => {
    onSelect && onSelect(item)
  }

  return (
    <View className="address-item" onClick={handleSelect}>
      <View className="top">
        <View className="iconfont iwodedizhi" />
        <View className="title-wrap">
          <View className="title">
            {item.isDefault && <Text className="default">默认</Text>}
            <Text>收货人：{item.receiver} {item.mobile}</Text>
          </View>
          <View className="address">地址：{item.province}{item.city}{item.area}{item.address}</View>
        </View>
      </View>
      <View className="bottom">
        <View className="b-item" onClick={handleDelete}>删除</View>
        <View className="b-item" onClick={handleEdit}>编辑</View>
      </View>
    </View>
  )
}

AddressItem.options = {
  addGlobalClass: true
}

AddressItem.defaultProps = {
  item: {}
}

export default AddressItem