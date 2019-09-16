import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Image, Button, Form, Text } from '@tarojs/components'
import { AtRadio, AtCheckbox } from 'taro-ui'
import './index.scss'

import config from '@/config/index'
import BaseComponent from '@/utils/components'

import { LogoWrap, DividingLine } from '@/components/index'

type StateType = {
  pageLoading: boolean
  detail: any
  signDataList: any[]
  // content: string;
  activity: any
  sign: any
}

interface ActivitySign {
  state: StateType
}

class ActivitySign extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '活动报名',
  }

  query: any

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      detail: {},
      sign: {
        sourceId: "",
        sourceType: "",
        shareCode: "",
        shareMemberId: "",
        num: 1
      },
      signDataList: [],
      activity: {
        cover: config.imgHost + 'attachments/actType/2d1443bd41794a7697b5687b7bfa0916.jpg',
        title: '送i的发送i积分送i的房间哦上地附近山东i发加哦就说的',
        time: '2012-23-65',
      }
    }
    this.query = {}
  }

  componentWillMount() {
    this.query = this.$router.params
    this.activityGet(this.query.id)
  }

  async activityGet(id: string) {
    const res = await this.$api.common.activityGet({ id })
    const signDataList = this.formatForm(res.data.data.signDataSettingList)
    this.setState({
      detail: res.data.data,
      signDataList,
    })
    this.setPageLoading(false)
  }

  formatForm(list) {
    return list.map((res: any) => {
      res.value = "";
      res.settingId = res.id;
      if (res.fieldName == "name") {
        // res.value = this.userInfo.name || "";
        res.value = "";
      }
      if (res.fieldName == "mobile") {
        // res.value = this.userInfo.mobile || "";
        res.value = "";
      }
      if (res.fieldName == "company") {
        // res.value = this.userInfo.company || "";
        res.value = "";
      }
      if (res.fieldName == "position") {
        // res.value = this.userInfo.position || "";
        res.value = "";
      }
      if (res.options) {
        let options = res.options.split("_");
        res.options = options.map(option => {
          return {
            value: option,
            label: option,
          }
        })
      }
      if (res.type == 3) {
        res.value = [];
      }
      return res;
    })
  }

  handleInput(index: number, e: any) {
    this.setState((preState: any) => {
      preState.signDataList[index].value = e.detail.value
    })
  }
  handleRadioChange(index: number, e: string) {
    this.setState((preState: any) => {
      preState.signDataList[index].value = e
    })
  }
  handleSubmit(e: any) {
    let wxMiniFormId = e.detail.formId
    let { signDataList, sign, detail } = this.state
    sign.price = (detail.isEnableFee && detail.activityFee && detail.activityFee.price) ? detail.activityFee.price : 0
    for (let i = 0; i < signDataList.length; i++) {
      if (signDataList[i].fieldName == "mobile" && !/^1[0-9]{10}$/.test(signDataList[i].value)) {
        this.showToast('手机格式不正确')
        return;
      }
      if (signDataList[i].isRequired && signDataList[i].value == "") {
        this.showToast(`请填写${signDataList[i].name}`);
        return;
      }
      if (signDataList[i].type == 3 && typeof signDataList[i].value != "string") {
        signDataList[i].value = signDataList[i].value.join("_")
      }
    }
    console.log({ ...this.query, sign, signDataList, wxMiniFormId })
    this.activitySign({ ...this.query, sign, signDataList})
  }
  async activitySign(params: any) {
    params.sign.sourceId = params.id
    // params.sign.checkinSettingId = params.checkinSettingId
    this.showLoading(true, '正在提交')
    const res = await this.$api.common.activitySign(params)
    console.log(res.data.data)
  }

  render() {
    const { detail, signDataList } = this.state

    return (
      <View>
        <View className="activity-wrap">
          <View className="cover">
            <Image src={config.imgHost + detail.iconUrl} mode="aspectFill" />
          </View>
          <View className="title-wrap">
            <View className="title">{detail.title}</View>
            
            <View className="time-wrap">
              <View className="itme">{detail.startTimeStr}</View>
              {detail.isEnableFee ?
                <View className="price">{detail.activityFee.price || 0}</View>
                :
                <View className="price">免费</View>
              }
            </View>
          </View>
        </View>

        <DividingLine />

        {signDataList.length &&
          <View className="sign-wrap">
            <View className="title">报名人信息</View>
            {signDataList.map((item: any, index: number) => {
              return (
                <View key={item.id}>
                  {item.type === 1 &&
                    <View className={`item ${index !== 0 ? 'top-line' : ''}`}>
                      <View className="label">
                        <Text className="xin">{item.isRequired ? '*' : ''}</Text>
                      {item.name}</View>
                      <View className="value">
                        <Input 
                          value={item.value}
                          placeholder={`${item.name}${item.isRequired ? '(必填)' : ''}`}
                          onInput={this.handleInput.bind(this, index)}
                        />
                      </View>
                    </View>
                  }
                  {item.type === 2 &&
                    <View className={`radio-item ${index !== 0 ? 'top-line' : ''}`}>
                      <View className="label">
                        <Text className="xin">{item.isRequired ? '*' : ''}</Text>
                        {item.name}（单选）
                      </View>
                      <AtRadio
                        options={item.options}
                        value={item.value}
                        onClick={this.handleRadioChange.bind(this, index)}
                      />
                    </View>
                  }
                  {item.type === 3 &&
                    <View className={`radio-item ${index !== 0 ? 'top-line' : ''}`}>
                      <View className="label">
                        <Text className="xin">{item.isRequired ? '*' : ''}</Text>
                        {item.name}（多选）
                      </View>
                      <AtCheckbox
                        options={item.options}
                        selectedList={item.value}
                        onChange={this.handleRadioChange.bind(this, index)}
                      />
                    </View>
                  }
                </View>
              )
            })}
          </View>
        }

        <View className="sign-btn">
          <Form reportSubmit onSubmit={this.handleSubmit.bind(this)}>
            <Button formType="submit">确认提交</Button>
          </Form>
        </View>

        <LogoWrap />
      </View>
    )
  }
}

export default ActivitySign