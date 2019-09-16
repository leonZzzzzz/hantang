import { View, Text } from '@tarojs/components'
import Taro, { useState, useEffect, navigateTo } from '@tarojs/taro'

import config from '@/config/index'

import './index.scss'


function NavigationBar(): JSX.Element {

  const [ isIOS ] = useState(() => {
    return config.systemInfo.system.includes('iOS')
  })
  const [ statusBarHeight, setStatusBarHeight ] = useState(0)
  const [ navHeight, setNavHeight ] = useState(0)


  useEffect(() => {
    console.log(config.systemInfo)
    setStatusBarHeight(() => {
      let height = isIOS ? 6 : 8
      return config.systemInfo.statusBarHeight + height
    })
    setNavHeight(() => {
      let height = isIOS ? 44 : 48
      return config.systemInfo.statusBarHeight + height
    })
  }, [])

  const navigateTo = () => {
    Taro.navigateTo({
      url: '/pagesCommon/advanced-search/index'
    })
  }

  return (
    <View>
      <View style={{height: navHeight + 'px'}}></View>
    
      <View className="navigation-bar" style={{height: navHeight + 'px'}}>
        <View
          className="search"
          style={{marginTop: statusBarHeight + 'px'}}
          onClick={navigateTo}
        >
          <Text className="iconfont isousuo" />
          <Text className="text">找一找 搜一搜</Text>
        </View>
      </View>
    </View>
  )
}

NavigationBar.options = {
  addGlobalClass: true
}

export default NavigationBar