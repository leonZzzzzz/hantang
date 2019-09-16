import { View, Text, Button } from '@tarojs/components'
import Taro, { useState, useEffect } from '@tarojs/taro'
import './index.scss'

import api from '@/api/index'

import { BindWrap, Dialog } from '@/components/index'

function BottomTab(props: any) {

  let { isPoster, onShare, isShare, display } = props

  const [ bindInfo, setBindInfo ] = useState<any>({})
  const [ bindVisible, setBindVisible ] = useState(false)

  const handleShare = () => {
    onShare && onShare()
  }

  const backHome = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    })
  }

  useEffect(() => {
    const bindInfoStorage = Taro.getStorageSync('bindInfo')
    if (bindInfoStorage) {
      setBindInfo(bindInfoStorage)
    } else {
      myBindInfo()
    }
  }, [])

  /**
   * 绑定信息
   */
  const myBindInfo = async () => {
    const res = await api.common.myBindInfo()
    if (res.data.data.bindSteward) {
      setBindInfo(res.data.data)
      Taro.setStorageSync('bindInfo', res.data.data)
    }
  }

  const makePhoneCall = () => {
    if (!bindInfo.steward) {
      setDialogVisible(true)
      return
    }
    Taro.makePhoneCall({
      phoneNumber: bindInfo.steward.phoneNumber
    })
  }

  const setDialogVisible = (status: boolean) => {
    setBindVisible(status)
  }

  const handleBindPhone = () => {
    console.log('handleBindPhone')
    setBindInfo((prevBindInfo: any) => {
      prevBindInfo.bindPhoneNum = true
      return prevBindInfo
    })
  }

  useEffect(() => {
    console.log('useEffect bindInfo', bindInfo)
  }, [bindInfo])

  return (
    <View className={`icon-wrap ${display}`}>
      <Button plain hover-class='none' className="item" hoverClass="item-active" onClick={backHome}>
        <Text className="iconfont ishouye1"></Text>首页
      </Button>
      <Button plain hover-class='none' className="item" hoverClass="item-active" onClick={makePhoneCall}>
        <Text className="iconfont iguanjia"></Text>管家
      </Button>
      {isShare && isPoster &&
        <Button plain hover-class='none' className="item" hoverClass="item-active" onClick={handleShare}>
          <Text className="iconfont ifenxiang"></Text>分享
        </Button>
      }
      {isShare && !isPoster &&
        <Button plain hover-class='none' className="item" hoverClass="item-active" openType="share">
          <Text className="iconfont ifenxiang"></Text>分享
        </Button>
      }

      <Dialog
        visible={bindVisible}
        isMaskClick={false}
        onClose={() => setDialogVisible(false)}
      >
        <BindWrap 
          visible={bindVisible}
          bindInfo={bindInfo}
          onConfirm={myBindInfo}
          onBindPhone={handleBindPhone}
          onClose={() => setDialogVisible(false)}  
        />
      </Dialog>
    </View>
  )
}

BottomTab.options = {
  addGlobalClass: true
}

BottomTab.defaultProps = {
  isPoster: false,
  isShare: true,
}

export default BottomTab