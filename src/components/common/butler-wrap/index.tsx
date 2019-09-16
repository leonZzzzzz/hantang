import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import { Avatar } from '@/components/index'

function ButlerWrap(props: any): JSX.Element {
  let { butlerData, onBindButler } = props

  function handleBind(): void {
    console.log('handleBind')
    onBindButler && onBindButler()
  }

  function makePhoneCall(): void {
    Taro.makePhoneCall({phoneNumber: butlerData.phoneNumber})
  }
  
  return (
    <View className="butler">
      {butlerData && butlerData.id ?
        <View className="butler-wrap">
          <View className="butler-wrap__left">
            <Avatar imgUrl={butlerData.headImage} width={80} style={{marginRight: '20rpx'}} />
            <Text>{butlerData.name}</Text>
            <Text className="number">(NO.{butlerData.code})</Text>
          </View>
          <View className="butler-wrap__right" onClick={makePhoneCall}>
            <Text className="iconfont icon-kefu"  />
            <Text>联系管家</Text>
          </View>
        </View>
        :
        <View className="butler-wrap">
          <View className="butler-wrap__left">
            <View className="no-head">
              <Text className="iconfont iguanjia" />
            </View>
            <Text className="no-text">暂无管家</Text>
          </View>
          <View className="butler-wrap__right" onClick={handleBind}>
            <Text className="iconfont idianhua"  />
            绑定管家
          </View>
        </View>
      }
    </View>
  )
}

ButlerWrap.defaultProps = {
  butlerData: {},
  isBind: false,
}

ButlerWrap.options = {
  addGlobalClass: true
}

export default ButlerWrap
