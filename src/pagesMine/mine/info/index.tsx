import Taro, { Config } from '@tarojs/taro'
import { View, Image, Button, Switch } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { Avatar, LoadingBox } from '@/components';

type StateType = {
  pageLoading: boolean
  userInfo: any
}

interface Info {
  state: StateType
}

class Info extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '我的资料',
  }


  constructor() {
    super()
    this.state = {
      pageLoading: true,
      userInfo: {
        headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        name: '山东佛但是',
        mobilePhoneNumber: 3123343,
        sex: 2,
        idCardNum: 23425453453454353443,
        birthday: '2019-07',
        province: '广东省',
        city: '广州市',
        area: '天河区',
        housingAddress: '骏景花园',
        floorNumber: 'i士大夫首发式地方',
        isAllergy: '无',
        drugAllergy: '无',
        hereditaryDiseases: '无',
        familys: [
          {
            id: 1,
            familyName: '林大海',
            familyMobile: '2312432342423',
            isEmergency: true,
            relation: '父女'
          },
          {
            id: 2,
            familyName: '林大海',
            familyMobile: '2312432342423',
            isEmergency: true,
            relation: '父女'
          }
        ],
      }
    }
  }

  // componentWillMount() {
  //   this.myProfile()
  // }
  componentDidShow() {
    this.myProfile()
  }

  async myProfile(): Promise<any> {
    const res = await this.$api.mine.myProfile()
    this.setState({
      userInfo: {...res.data.data.member, ...res.data.data.memberInfo, familys: res.data.data.familys}
    })
    this.setPageLoading(false)
  }

  // 输入事件
  onInputChange(type: string, e: any) {
    // let value = e.detail.value;
    // let { model } = this.state;
    // model[type] = value;
    // this.setState({ model });
  }
  
  render() {
    let { pageLoading, userInfo } = this.state

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
            <View className="value">{userInfo.name}</View>
          </View>
          <View className="item top-line">
            <View className="label">手机号</View>
            <View className="value">{userInfo.mobilePhoneNumber}</View>
          </View>
          <View className="item top-line">
            <View className="label">性别</View>
            <View className="value">{userInfo.sex == 1 ? '男' : userInfo.sex == 2 ? '女' : '未知'}</View>
          </View>
          <View className="item top-line">
            <View className="label">身份证号</View>
            <View className="value">{userInfo.idCardNum}</View>
          </View>
          <View className="item top-line">
            <View className="label">出生年月</View>
            <View className="value">{userInfo.birthday}</View>
          </View>
          <View className="item top-line">
            <View className="label">省市区</View>
            <View className="value">{userInfo.province}{userInfo.city}{userInfo.area}</View>
          </View>
          <View className="item top-line">
            <View className="label">小区名称</View>
            <View className="value">{userInfo.housingAddress}</View>
          </View>
          <View className="item top-line">
            <View className="label">栋/层/号</View>
            <View className="value">{userInfo.floorNumber}</View>
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
                    <View className="value">{item.relation}</View>
                  </View>
                  <View className="item top-line">
                    <View className="label">姓名</View>
                    <View className="value">{item.familyName}</View>
                  </View>
                  <View className="item top-line">
                    <View className="label">手机</View>
                    <View className="value">{item.familyMobile}</View>
                  </View>
                  <View className="item top-line">
                    <View className="label">紧急联系人</View>
                    <View className="value">
                      <Switch
                        disabled
                        checked={item.isEmergency}
                        color="rgb(209, 13, 35)"
                      />
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        }

        <View className="group">
          <View className="title">健康情况</View>
          <View className="item">
            <View className="label">疾病史</View>
            <View className="value">
              <Switch
                disabled
                checked={userInfo.isAllergy}
                color="rgb(209, 13, 35)"
              />
            </View>
          </View>
          <View className="item top-line">
            <View className="label">药物敏感史</View>
            <View className="value">
              <Switch
                disabled
                checked={userInfo.isAllergy}
                color="rgb(209, 13, 35)"
              />
            </View>
          </View>
          <View className="item top-line">
            <View className="label">遗传史</View>
            <View className="value">
              <Switch
                disabled
                checked={userInfo.isAllergy}
                color="rgb(209, 13, 35)"
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

          <View className="btn-wrap">
            <Button onClick={this.navigateTo.bind(this, '/pagesMine/mine/info/edit/index')}>修改资料</Button>
          </View>
        </View>
      </View>
    )
  }
}


export default Info