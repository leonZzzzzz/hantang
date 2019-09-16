import Taro, { Config } from '@tarojs/taro'
import { View, Image, Button, Switch, Input, Form, Picker, Text, Radio, Checkbox } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { Avatar, LoadingBox } from '@/components';
import regionData from '@/utils/area'

import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  userInfo: any
  region: any
  regionData: any
  sexArray: any[]
  sexIndex: number
}

interface InfoEdit {
  state: StateType
}

class InfoEdit extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '修改资料',
  }
  
  constructor() {
    super()
    this.state = {
      pageLoading: true,
      userInfo: {},
      region: {
        province: [],
        city: [],
        area: [],
        provinceIndex: '',
        cityIndex: '',
        areaIndex: '',
      },
      // 地区数据
      regionData: regionData,
      sexArray: [
        {
          id: 1,
          name: '男'
        },
        {
          id: 2,
          name: '女'
        },
      ],
      sexIndex: 0,
    }
  }

  componentWillMount() {
    this.myProfile()
    this.state.region.province = this.getAreaList('province');
    this.setState({
      region: this.state.region,
    });
  }

  async myProfile(): Promise<any> {
    const res = await this.$api.mine.myProfile()
    // let member = res.data.data.member
    // if (!member.familys) {
    //   member.familys = []
    //   member.familys.push({
    //     familyName: '',
    //     familyMobile: '',
    //     isEmergency: '',
    //     relation: '',
    //   })
    // } 
    this.setState({
      userInfo: {...res.data.data.member, ...res.data.data.memberInfo, familys: res.data.data.familys}
    })
    this.setPageLoading(false)
  }

  // 获取对应区域的数据列表
  getAreaList(type: string, code?: string) {
    let result: any[] = [];
    if (type !== 'province' && !code) {
      return result;
    }
    const list = this.state.regionData[`${type}_list`];
    result = Object.keys(list).map(code => ({
      code,
      name: list[code],
    }));
    if (code) {
      result = result.filter(item => item.code.indexOf(code) === 0);
    }
    return result;
  }

  

  // input输入事件
  handleInputChange(type: string, index: number | string, e: any) {
    const value = e.detail.value
    let { userInfo } = this.state
    if (index === '') userInfo[type] = value
    else userInfo.familys[index][type] = value
    this.setState({
      userInfo
    })
  }

  handleSwitchChange(type: string, index: number | string, e: any) {
    const value = e.detail.value
    let { userInfo } = this.state
    if (index === '') userInfo[type] = value
    else userInfo.familys[index][type] = value
    this.setState({
      userInfo
    })
  }
  // 清除输入事件
  // onClearInput(type: string) {
  //   // let { model } = this.state;
  //   // model[type] = '';
  //   // this.setState({ model });
  // }

  // 选择省市区事件
  onPickerChange(type: string, e: { detail: { value: any; }; }) {
    let index = e.detail.value;
    let { userInfo, region } = this.state;
    let item = region[type][index];
    if (!item) return
    let code = item.code;
    userInfo[type] = item.name;
    region[`${type}Index`] = index
    if (type === 'province') {
      userInfo.city = '';
      userInfo.area = '';
      region.cityIndex = '';
      region.areaIndex = '';
      region.area = [];
      region.city = this.getAreaList('city', code.slice(0, 2));
    } else if (type === 'city') {
      userInfo.area = '';
      region.areaIndex = '';
      region.area = this.getAreaList('area', code.slice(0, 4));
    }
    this.setState({ userInfo, region });
  }
  sexPickerChange(e: any) {
    const index = e.detail.value
    let { sexArray } = this.state
    this.setState((preState: any) => {
      preState.userInfo.sex = sexArray[index].id
      preState.sexIndex = index
    })
  }
  handleDateChange(e: any) {
    this.setState((preState: any) => {
      preState.userInfo.birthday = e.detail.value
    })
  }

  addFamily() {
    let item = {
      familyName: '',
      familyMobile: '',
      isEmergency: '',
      relation: '',
    }
    this.setState((preState: any) => {
      preState.userInfo.familys.push(item)
    })
  }

  async getPhoneNumber(e: any) {
    console.log(e)
    const { encryptedData, iv } = e.detail
    if (encryptedData && iv) {
      const res = await Taro.login()
      console.log('login', res)
      if (res.code) {
        let params = {
          encryptedData,
          iv,
          code: res.code
        }
        this.decryptPhone(params)
      }
    } else {
      Taro.showToast({
        title: '授权失败，请重试',
        icon: 'none'
      })
    }
  }
  async decryptPhone(params: any) {
    const res = await this.$api.common.decryptPhone(params)
    console.log('decryptPhone', res)
    let { userInfo } = this.state
    userInfo.mobilePhoneNumber = res.data.message
    this.setState({
      userInfo
    })
  }

  /**
   * 提交
   */
  handleSubmit(e: any) {
    const { userInfo } = this.state
    userInfo.wxMiniFormId = e.detail.formId
    console.log(userInfo)
    if (userInfo.mobilePhoneNumber && !util.checkPhone(userInfo.mobilePhoneNumber)) {
      this.showToast('手机号码格式错误')
      return
    }
    this.updateMyProfile(userInfo)
  }
  /**
   * 修改
   */
  async updateMyProfile(params: any) {
    const res = await this.$api.mine.updateMyProfile(params)
    console.log(res.data)
    this.showToast(res.data.message)
    setTimeout(() => {
      this.navigateBack()
    }, 1000)
  }
  
  render() {
    let { pageLoading, userInfo, region, sexArray, sexIndex } = this.state

    return (
      <View>
        <LoadingBox visible={pageLoading} />
        <View className="group">
          <View className="title">个人信息</View>
          <View className="item">
            <View className="label">头像</View>
            <View className="value">
              <Avatar imgUrl={userInfo.headImage} width={100} />
            </View>
          </View>
          <View className="item top-line">
            <View className="label">姓名</View>
            <View className="i-content">
              <Input value={userInfo.name} name="name" placeholder="请输入姓名" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'name', '')} />
              {/* {userInfo.name && (
                <View className="iconfont iguanbi3" onClick={this.onClearInput.bind(this, 'name')} />
              )} */}
            </View>
          </View>
          <View className="item top-line">
            <View className="label">手机号</View>
            <View className="i-content">
              {/* <Input value={userInfo.mobilePhoneNumber} name="mobilePhoneNumber" type="number" placeholder="请输入手机号" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'mobilePhoneNumber', '')} /> */}
              <View className="value">{userInfo.mobilePhoneNumber}</View>
              <Button size="mini" type="primary" class="mini-btn" openType="getPhoneNumber" onGetPhoneNumber={this.getPhoneNumber}>修改</Button>
            </View>
          </View>
          <View className="item top-line">
            <View className="label">性别</View>
            <View className="i-content">
              <Picker
                className="picker"
                mode="selector"
                range={sexArray}
                rangeKey="name"
                value={sexIndex}
                onChange={this.sexPickerChange}
              >
                <View className="picker__inner">
                  {userInfo.sex ? (
                    <Text className="value">{userInfo.sex === 1 ? '男' : userInfo.sex === 2 ? '女' : '未知'}</Text>
                  ) : (
                    <Text className="placeholder">请选择性别</Text>
                  )}
                  <Text className="iconfont ixiajiantou rotate" />
                </View>
              </Picker>
            </View>
          </View>
          <View className="item top-line">
            <View className="label">身份证号</View>
            <View className="i-content">
              <Input value={userInfo.idCardNum} name="idCardNum" type="idcard" placeholder="请输入身份证号" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'idCardNum', '')} />
            </View>
          </View>
          <View className="item top-line">
            <View className="label">出生年月</View>
            <View className="i-content">
              <Picker 
                mode="date" 
                value={userInfo.birthday} 
                onChange={this.handleDateChange}
                className="picker"
                fields="month"
              >
                <View className="picker__inner">
                  {userInfo.birthday ? (
                    <Text className="value">{userInfo.birthday}</Text>
                  ) : (
                    <Text className="placeholder">请选择年月</Text>
                  )}
                  <Text className="iconfont ixiajiantou rotate" />
                </View>
              </Picker>
            </View>
          </View>
 
          <View className="item top-line">
            <View className="label">省份</View>
            <View className="i-content">
              <Picker
                className="picker"
                mode="selector"
                range={region.province}
                rangeKey="name"
                value={region.provinceIndex}
                onChange={this.onPickerChange.bind(this, 'province')}
              >
                <View className="picker__inner">
                  {userInfo.province ? (
                    <Text className="value">{userInfo.province}</Text>
                  ) : (
                    <Text className="placeholder">请选择省份</Text>
                  )}
                  <Text className="iconfont ixiajiantou rotate" />
                </View>
              </Picker>
            </View>
          </View>
          <View className="item top-line">
            <View className="label">城市</View>
            <View className="i-content">
              <Picker
                className="picker"
                mode="selector"
                range={region.city}
                rangeKey="name"
                value={region.cityIndex}
                onChange={this.onPickerChange.bind(this, 'city')}
              >
                <View className="picker__inner">
                  {userInfo.city ? (
                    <Text className="value">{userInfo.city}</Text>
                  ) : (
                    <Text className="placeholder">请选择城市</Text>
                  )}
                  <Text className="iconfont ixiajiantou rotate" />
                </View>
              </Picker>
            </View>
          </View>
          <View className="item top-line">
            <View className="label">区/县/镇</View>
            <View className="i-content">
              <Picker
                className="picker"
                mode="selector"
                range={region.area}
                rangeKey="name"
                value={region.areaIndex}
                onChange={this.onPickerChange.bind(this, 'area')}
              >
                <View className="picker__inner">
                  {userInfo.area ? (
                    <Text className="value">{userInfo.area}</Text>
                  ) : (
                    <Text className="placeholder">请选择区域</Text>
                  )}
                  <Text className="iconfont ixiajiantou rotate" />
                </View>
              </Picker>
            </View>
          </View>

          <View className="item top-line">
            <View className="label">小区名称</View>
            <View className="i-content">
              <Input value={userInfo.housingAddress} name="housingAddress" placeholder="请输入小区名称" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'housingAddress', '')} />
            </View>
          </View>
          <View className="item top-line">
            <View className="label">栋/层/号</View>
            <View className="i-content">
              <Input value={userInfo.floorNumber} name="floorNumber" placeholder="请输入栋/层/号" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'floorNumber', '')} />
            </View>
          </View>
        </View>

 
        {userInfo.familys && userInfo.familys.length &&
          <View className="group">
            <View className="title">家庭成员关系</View>

            {userInfo.familys.map((item: any, index: number) => {
              return (
                <View key={item.id}>
                  <View className="item top-line">
                    <View className="label">关系</View>
                    <View className="i-content">
                      <Input value={item.relation} placeholder="请输入关系" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'relation', index)} />
                    </View>
                  </View>
                  <View className="item top-line">
                    <View className="label">姓名</View>
                    <View className="i-content">
                      <Input value={item.familyName} name="familyName" placeholder="请输入姓名" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'familyName', index)} />
                    </View>
                  </View>
                  <View className="item top-line">
                    <View className="label">手机</View>
                    <View className="i-content">
                      <Input value={item.familyMobile} name="familyMobile" placeholder="请输入手机" placeholderClass="placeholder" type="number" onInput={this.handleInputChange.bind(this, 'familyMobile', index)} />
                    </View>
                  </View>
                  <View className="item top-line">
                    <View className="label">紧急联系人</View>
                    <View className="value">
                      <Switch
                        checked={item.isEmergency}
                        color="rgb(209, 13, 35)"
                        onChange={this.handleSwitchChange.bind(this, 'isEmergency', index)}
                      />
                    </View>
                  </View>
                </View>
              )
            })}
            <View className="add-familys-btn">
              <Button onClick={this.addFamily}>添加</Button>
            </View>
          </View>
        }

        <View className="group">
          <View className="title">健康情况</View>
          <View className="item">
            <View className="label">疾病史</View>
            <View className="i-content">
              {/* <Input value={userInfo.isAllergy} name="isAllergy" placeholder="请输入疾病史" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'isAllergy', '')}  /> */}
              <Switch
                checked={userInfo.isAllergy}
                color="rgb(209, 13, 35)"
                onChange={this.handleSwitchChange.bind(this, 'isAllergy', '')}
              />
            </View>
          </View>
          <View className="item top-line">
            <View className="label">药物敏感史</View>
            <View className="i-content">
              {/* <Input value={userInfo.drugAllergy} name="drugAllergy" placeholder="请输入药物敏感史" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'drugAllergy', '')} /> */}
              <Switch
                checked={userInfo.drugAllergy}
                color="rgb(209, 13, 35)"
                onChange={this.handleSwitchChange.bind(this, 'drugAllergy', '')}
              />
            </View>
          </View>
          <View className="item top-line">
            <View className="label">遗传史</View>
            <View className="i-content">
              {/* <Input value={userInfo.hereditaryDiseases} name="hereditaryDiseases" placeholder="请输入遗传史" placeholderClass="placeholder" onInput={this.handleInputChange.bind(this, 'hereditaryDiseases', '')} /> */}
              <Switch
                checked={userInfo.hereditaryDiseases}
                color="rgb(209, 13, 35)"
                onChange={this.handleSwitchChange.bind(this, 'hereditaryDiseases', '')}
              />
            </View>
          </View>
        </View>

        <View className="bottom-group">
          <View className="logo-wrap">
            <View className="img">
              <Image src={this.imgHost + '/attachments/static/logo.png'} mode="widthFix" />
            </View>
          </View>

          <Form reportSubmit onSubmit={this.handleSubmit.bind(this)}>
            <View className="btn-wrap">
              <Button formType="submit" formType="submit">确定修改</Button>
            </View>
          </Form>
        </View>
      </View>
    )
  }
}


export default InfoEdit