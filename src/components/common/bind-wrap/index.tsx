import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Button, Input, Image, Text } from '@tarojs/components'
import './index.scss'

import api from '@/api/index'

import { Avatar } from '@/components';

function BindWrap(props: any): JSX.Element {

  let { onBindPhone, onConfirm, onClose, bindInfo, visible } = props

  const [ mobile, setMobile ] = useState('')
  const [ code, setCode ] = useState('')
  const [ butlerData, setButlerData ] = useState<any>({})
  const [ loginCode, setLoginCode ] = useState('')

  useEffect(() => {
    if (visible) {
      Taro.login().then((res: any) => {
        console.log('bindWrap useEffect login', res)
        setLoginCode(res.code)
      })
    }
  }, [visible])


  


  const getPhoneNumber = async (e: any): Promise<any> => {
    console.log(e)
    const { encryptedData, iv } = e.detail
    if (encryptedData && iv) {
      // const res = await Taro.login()
      // console.log('login', res)
      // if (res.code) {
        let params = {
          encryptedData,
          iv,
          code: loginCode
        }
        decryptPhone(params)
        // getSessionByCode({code: res.code}, params)
      // }
    } else {
      Taro.showToast({
        title: '授权失败，请重试',
        icon: 'none'
      })
    }
  }
  const getSessionByCode = async (params: any, decryptParams: any) => {
    const session: any = await api.common.getSessionByCode(params)
    const { sessionId, memberId, openId } = session.data.data;
    Taro.setStorageSync('openId', openId);
    Taro.setStorageSync('sessionId', sessionId);
    Taro.setStorageSync('memberId', memberId);
    decryptPhone(decryptParams)
  }
  const decryptPhone = async (params: any): Promise<any> => {
    const res = await api.common.decryptPhone(params)
    console.log('decryptPhone', res)
    setMobile(res.data.message)
  }
  const bindPhonenum = async (): Promise<any> => {
    const res = await api.common.bindPhonenum({mobile})
    console.log('bindPhonenum', res)
    Taro.showToast({
      title: res.data.message,
      icon: 'none'
    })
    // onClose && onClose()
    onBindPhone && onBindPhone()
  }

  const handleConfirm = (): void => {
    if (!bindInfo.bindPhoneNum && mobile) {
      bindPhonenum()
    } else  {
      if (!butlerData.id) return
      bindSteward()
    }
  }

  const bindSteward = async () => {
    await api.mine.bindSteward({code})
    Taro.showToast({
      title: '绑定成功',
      icon: 'none',
    })
    onConfirm && onConfirm()
    onClose && onClose()
  }

  const handleClose = (): void => {
    setCode('')
    onClose && onClose()
  }

  const handleInput = (e: any) => {
    setCode(e.detail.value)
  }


  const queryStewardBaseInfoByCode = async () => {
    if (!code) return
    const res = await api.mine.queryStewardBaseInfoByCode({code})
    if (res.data.data) setButlerData(res.data.data)
    else {
      Taro.showToast({
        title: '无管家信息',
        icon: 'none',
      })
    }
  }

  const makePhoneCall = () => {
    Taro.makePhoneCall({
      phoneNumber: bindInfo.steward.phoneNumber
    }).then(() => {
      onClose && onClose()
    })
  }

  return (
    <View className="bind-wrap">
      <View 
        className="iconfont iguanbi1 close"
        onClick={handleClose}
      />

      {(bindInfo.bindPhoneNum && bindInfo.bindSteward) &&
        <View className="steward-wrap">
          <Avatar imgUrl={bindInfo.steward.headImage} width={100} />
          <View className="text">
            <View>{bindInfo.steward.name}</View>
            <View>(NO.{bindInfo.steward.code})</View>
          </View>
          <Button onClick={makePhoneCall}>
            <Text className="iconfont idianhua1" />
            <Text>一键拨号</Text>
          </Button>
        </View>
      }




      {(!bindInfo.bindPhoneNum || !bindInfo.bindSteward) &&
        <View className="title">{bindInfo.bindPhoneNum ? '绑定管家' : '注册会员'}</View>
      }

      {!bindInfo.bindPhoneNum &&
        <View className="mobile">
          <Button plain openType="getPhoneNumber" onGetPhoneNumber={getPhoneNumber}>{mobile ? mobile : '点击授权微信绑定手机号'}</Button>
        </View>
      }
      {bindInfo.bindPhoneNum && !bindInfo.bindSteward &&
        <View className="butler">
          <View className="input-wrap">
            <Input placeholder="请输入管家码" type="number" value={code} onInput={(e) => handleInput(e)} />
            <Button plain size="mini" type="primary" onClick={queryStewardBaseInfoByCode}>搜索</Button>
          </View>
          {butlerData.id &&
            <View className="info">
              <View className="left">
                <View className="head">
                  <Image mode="widthFix" src={butlerData.headImage} />
                </View>
                <View className="name">{butlerData.name}</View>
              </View>
              <View className="right">NO.{butlerData.code}</View>
            </View>
          }
        </View>
      }
      
      <View className="confirm">
        {!bindInfo.bindPhoneNum &&
          <Button plain className={`${mobile ? '' : 'disabled'}`} onClick={handleConfirm}>确认注册</Button>
        }
        {bindInfo.bindPhoneNum && !bindInfo.bindSteward &&
          <Button plain className={`${mobile ? '' : 'disabled'}`} onClick={handleConfirm}>确认绑定</Button>
        }
      </View>
    </View>
  )
}

BindWrap.defaultProps = {
  type: 'member',
  bindInfo: {
    bindPhoneNum: false,
    bindSteward: false,
  }
}

BindWrap.options = {
  addGlobalClass: true
}

export default BindWrap