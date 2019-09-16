import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import { Avatar } from '@/components/index'

function MiniButlerWrap(props: any): JSX.Element {
  
  let { butler } = props

  const makePhoneCall = () => {
    console.log('makePhoneCall')
    Taro.makePhoneCall({
      phoneNumber: butler.phoneNumber
    })
  }

  return (
    <View className="butler-wrap">
      <Avatar imgUrl={butler.headImage} width={60} onEvent={makePhoneCall} />
      <View className="name">{butler.name}</View>
    </View>
  )
}

MiniButlerWrap.defaultProps = {
  butler: {},
}

MiniButlerWrap.options = {
  addGlobalClass: true
}

export default MiniButlerWrap