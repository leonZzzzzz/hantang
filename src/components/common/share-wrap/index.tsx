import { View, Button, Image } from '@tarojs/components'
import Taro, { useState, useEffect } from '@tarojs/taro'

import './index.scss'

import { Dialog } from '@/components'

import api from '@/api/index'
import config from '@/config/index'

function ShareWrap(props: any): JSX.Element {

  const { visible, onClose, apiType, params, apiStr } = props

  const [ shareVisible, setShareVisible ] = useState(false)
  const [ posterVisible, setPosterVisible ] = useState(false)
  const [ posterUrl, setPosterUrl ] = useState('')
  const [ disabled, setDisabled ] = useState(true)
  // const [ posterUrl, setPosterUrl ] = useState(() => {
  //   return config.imgHost + '/attachments/poster/458a6555f2ff4db597a2b714805049fa.png'
  // })

  useEffect(() => {
    // visible ? setShareVisible(true) : setShareVisible(false)
    visible ? setShareVisible(true) : ''
    console.log('visible', visible)
  }, [visible])
  
  const handleClose = () => {
    console.log('handleClose')
    setShareVisible(false)
    setPosterVisible(false)
    onClose && onClose()
  }

  const closeShare = () => {
    console.log('closeShare')
    setShareVisible(false)
    handleClose()
    // onClose && onClose()
  }

  const generatePoster = () => {
    setPosterVisible(true)
    // setShareVisible(false)
    if (!posterUrl) createPoster()
  }

  const createPoster = async () => {
    const res = await api[apiType][apiStr](params)
    let url = res.data.data.posterPath;
    // 下载海报
    Taro.downloadFile({
      url: config.imgHost + url,
    }).then(res => {
      setPosterUrl(res.tempFilePath)
      setDisabled(false)
    });
  }
  const savePoster = () => {
    // getSetting()
    // return
    if (!posterUrl) return
    Taro.saveImageToPhotosAlbum({
      filePath: posterUrl
    }).then(() => {
      Taro.showToast({
        title: '保存成功',
      });
      handleClose()
    }).catch((err) => {
      console.log(err)
      if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
        Taro.showModal({
          title: '提示',
          content: '授权失败，是否重新授权？'
        }).then(res => {
          if (res.confirm) {
            Taro.openSetting().then(openRes => {
              console.log('openRes', openRes)
            }).catch(openErr => {
              console.log('openErr', openErr)
            })
          }
        })
      }
      
    })
  }
  const getSetting = () => {
    Taro.getSetting().then(res => {
      console.log(res.authSetting)

    })
  }
  const authorize = () => {
    Taro.authorize({
      scope: 'scope.writePhotosAlbum',
    }).then(res => {
      console.log(res)
      savePoster()
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <View>
      <Dialog
        position="bottom"
        visible={shareVisible}
        onClose={handleClose}
      >
        <View className="share-dialog">
          <Button 
            plain
            className="share-item" 
            openType="share"
            onClick={handleClose}
          >
            <View className="iconfont ifenxiang" />
            <View>分享给好友</View>
          </Button>
          <Button 
            plain
            className="share-item" 
            onClick={generatePoster}
          >
            <View className="iconfont itupian" />
            <View>生成小海报</View>
          </Button>
        </View>
      </Dialog>

      {/* 海报弹窗 */}
      <Dialog
        visible={posterVisible}
        position="center"
        onClose={handleClose}
      >
        <View className="poster-dialog">
          <View className="poster-wrap">
            <Image src={posterUrl} mode="widthFix" />
            {/* <Image src="https://ht.wego168.com/hantang_test/api/v1/member/share/poster" mode="widthFix" /> */}
            <View className="close" onClick={handleClose} />
          </View>
          <Button type="primary" onClick={savePoster} disabled={disabled}>{disabled ? '加载海报中...' : '保存到手机'}</Button>
        </View>
      </Dialog>
    </View>
  )
}

ShareWrap.options = {
  addGlobalClass: true
}

ShareWrap.defaultProps = {
  apiStr: '',
  params: {},
  apiType: 'mall',
}

export default ShareWrap