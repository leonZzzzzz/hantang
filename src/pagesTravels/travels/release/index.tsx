import Taro, { Config } from '@tarojs/taro'
import { View, Button, Input, Textarea, Video, Image, Form, Text } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'


type StateType = {
  model: any
  videoUrl: string
  // tempFilePaths: any[]
  // count: number
}

interface Release {
  state: StateType
}

class Release extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '发布',
  }

  tempFilePaths: any[]
  count: number
  journeyBaseId: string

  constructor() {
    super()
    this.state = {
      // count: 0,
      model: {
        type: '',
        title: '',
        content: '',
        attachmentList: [],
        journeyBaseId: '',
      },
      // tempFilePaths: [],
      videoUrl: 'http://1257173625.vod2.myqcloud.com/5b2595a6vodgzp1257173625/ae9645135285890791638132269/W1guYoCzZ3sA.mp4',
    }
    this.tempFilePaths = []
    this.count = 0
    this.journeyBaseId = ''
  }

  componentWillMount() {
    console.log(this.$router.params)
    const { type, journeyBaseId } = this.$router.params
    this.journeyBaseId = journeyBaseId
    this.setState((preState: any) => {
      preState.model.type = Number(type)
    }, () => {
      console.log(this.state.model)
    })

    Taro.setNavigationBarTitle({
      title: '发布相片'
    })
  }

  chooseImage(): void {
    const { model } = this.state
    Taro.chooseImage({
      count: 9 - model.attachmentList.length,
    }).then(res => {
      console.log(res.tempFilePaths)
      let tempFilePaths = res.tempFilePaths
      this.tempFilePaths = tempFilePaths,
      this.count = 0
      this.loopUploadImg()

    })
  }
  loopUploadImg() {
    if (this.count < this.tempFilePaths.length) {
      this.tencentCloud(this.tempFilePaths[this.count], 1)
      this.count++
    } else {
      this.showLoading(false)
      console.log(this.state.model)
    }
  }
  chooseVideo(): void {
    Taro.chooseVideo({
      sourceType: ['album'],
    }).then((res: any) => {
      console.log(res)
      this.tencentCloud(res.tempFilePath, 2)
    }).catch(err => {
      console.log(err)
    })
  }
  async tencentCloud(path: string, type: number): Promise<any> {
    this.showLoading(true, `正在上传${type === 1 ? '图片' : '视频'}`)
    try {
      const res = await this.$api.common.tencentCloud(path, {imageType: 'travels'})
      console.log('tencentCloud', res.data.data.imageUrl)
      this.setState((preState: any) => {
        preState.model.attachmentList.push({
          type,
          content: this.imgHost + res.data.data.imageUrl
        })
      })
      this.loopUploadImg()
      if (type === 2) this.showLoading(false)
    } catch (err) {
      this.showLoading(false)
    }
  }

  handleSubmit(e: any): void {
    let { model } = this.state
    if (e.detail && e.detail.formId) model.wxMiniFormId = e.detail.formId
    model = Object.assign(model, e.detail.value)
    
    // if (model.attachmentList.length === 0) {
    //   this.showToast(`请上传${model.type === 1 ? '图片' : '视频'}`)
    //   return
    // }
    if (!model.title) {
      this.showToast(`请输入标题`)
      return
    }
    if (!model.content && model.type === 1) {
      this.showToast(`请输入内容`)
      return
    }
    if (this.journeyBaseId) {
      model.journeyBaseId = this.journeyBaseId
    }
    this.showLoading(true, '发布中')
    this.travelsInsert(model)
  }
  async travelsInsert(params: any): Promise<any> {
    try {
      let res = await this.$api.travels.travelsInsert(params)
      console.log('try', res)
      this.showLoading(false)
      this.showToast('发布成功')
      setTimeout(() => {
        this.navigateBack()
      }, 1000)
    } catch (err) {
      console.log('catch', err)
      // this.showLoading(false)
    }
  }

  deleteImage(index: number) {
    let { model } = this.state
    model.attachmentList.splice(index, 1)
    this.setState({
      model
    })
  }

  render() {
    let { model } = this.state

    return (
      <View className="release">
        {model.type === 1 && 
          <View className="image-upload-wrap">
            {model.attachmentList.map((item: any, index: number) => {
              return (
                <View className="item" key={item.id}>
                  <Text className="iconfont iguanbi" onClick={this.deleteImage.bind(this, index)} />
                  <Image src={item.content} mode="aspectFill" />
                </View>
              )
            })}
            {model.attachmentList.length < 9 &&
              <View className="item add" onClick={this.chooseImage}>
                <View className="iconfont ijiahao" />
                <View>添加图片</View>
              </View>
            }
          </View>
        }


        {model.type === 2 && 
          <View className="video-upload-wrap">
            {model.attachmentList.length ?
              <View className="video-box">
                <Video src={model.attachmentList[0].content} />
              </View>
              :
              <View className="add-box" onClick={this.chooseVideo}>
                <View className="iconfont ijiahao" />
                <View>添加视频</View>
              </View>
            }
          </View>
        }

        <Form reportSubmit onSubmit={this.handleSubmit.bind(this)}>
          <View className="input-wrap">
            <View className="item line">
              <View className="title">标题</View>
              <Input placeholder="请输入标题" name="title" value={model.title} />
            </View>
            {model.type === 1 && 
              <View className="item">
                <View className="title">内容</View>
                <Textarea 
                  placeholder="说点什么吧~（300字以内）" 
                  value={model.content} 
                  maxlength={300} 
                  name="content"
                  className="content-textarea"
                />
              </View>
            }
          </View>

          <View className="btn-wrap">
            <Button className="send" formType="submit">发布</Button>
            <View className="desc">发布后需待平台管理员审核</View>
          </View>
        </Form>
      </View>
    )
  }
}

export default Release