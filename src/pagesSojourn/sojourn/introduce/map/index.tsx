import Taro, { Config } from '@tarojs/taro'
import { View, Map } from '@tarojs/components'

import './index.scss'

import BaseComponent from '@/utils/components'

type StateType = {
  pageLoading: boolean;
  markers: any[]
}

interface IntroduceMap {
  state: StateType
}

class IntroduceMap extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '基地地址'
  }

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      markers: [{
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
      }],
    }
  }

  render() {
    const { markers } = this.state
    return (
      <View className="map">
        <Map longitude={113.324520} latitude={23.099994} scale={15} markers={markers} />
      </View>
    )
  }
}

export default IntroduceMap