import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

import config from '@/config/index'

function LogoWrap(props: any): JSX.Element {
  
  let { bottom, styles, isFixed } = props

  let styleHeight = {
    height: bottom > 0 ? bottom + 80 + 'rpx' : '80rpx'
  }
  let styleBottom = {
    bottom: bottom + 'rpx',
    ...styles
  }
  // let style = {

  // }
  return (
    <View>
      {isFixed && 
      <View 
      className="logo-height" 
      style={styleHeight}
      ></View>
      }
      <View className={`logo-wrap ${isFixed ? 'logo-wrap-fixed' : ''}`} style={styleBottom}>
        <View className="img">
          <Image src={config.imgHost + '/attachments/static/logo.png'} mode="widthFix" />
        </View>
      </View>

    </View>
  )
}

LogoWrap.defaultProps = {
  bottom: 0,
  isFixed: true,
}

LogoWrap.options = {
  addGlobalClass: true
}

export default LogoWrap