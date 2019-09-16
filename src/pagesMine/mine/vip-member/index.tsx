import Taro, { Config } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import './index.scss'

import BaseComponent from '@/utils/components'
import { Dialog, Avatar } from '@/components';


type StateType = {
  bannerUrl: string
  privilegeGroup: any[]
  contactVisible: boolean
  btnVisible: boolean
  butlerData: any
}

interface VipMember {
  state: StateType
}

class VipMember extends BaseComponent {

  config: Config = {
    navigationBarTitleText: '尊享会员',
    navigationBarBackgroundColor: '#313131',
    navigationBarTextStyle: 'white'
  }

  constructor() {
    super()
    this.state = {
      bannerUrl: this.imgHost + 'attachments/actType/2d1443bd41794a7697b5687b7bfa0916.jpg',
      privilegeGroup: [
        {
          id: 1,
          title: '专属管家',
          icon: 'iguanjia'
        },
        {
          id: 2,
          title: '会员优惠',
          icon: 'iVIP'
        },
        {
          id: 3,
          title: '拼团优惠',
          icon: 'ipintuan'
        }
      ],
      contactVisible: false,
      btnVisible: false,
      butlerData: {
        headImage: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI7hze2kl8cOpFtqGkEVmoxxogd2ic1Jvj3fVI1zibphqE3ha9aCHIT0prehVYMhPkVS5UTbPkRmOwQ/132',
        name: '管家',
        number: 324234,
        mobile: '12312321433',
      },
    }
  }

  open() {
    // this.setDialogVisible(true, 'contactVisible')
    this.setDialogVisible(true, 'btnVisible')
  }

  render() {
    const { bannerUrl, privilegeGroup, contactVisible, butlerData, btnVisible } = this.state

    return (
      <View className="page">
        <View className="banner">
          <Image src={bannerUrl} mode="aspectFill" />
        </View>
        <View className="group">
          {privilegeGroup.map((item: any) => {
            return (
              <View className="item" key={item.id}>
                <View className={`iconfont ${item.icon}`} />
                <View>{item.title}</View>
              </View>
            )
          })}
        </View>

        <View className="rule-wrap">
          <View className="title">会员规则</View>
          <View className="content"></View>
        </View>

        <View className="bottom-group">
          <View className="logo-wrap">
            <View className="img">
              <Image src={this.imgHost + '/attachments/static/logo.png'} mode="widthFix" />
            </View>
          </View>

          <View className="btn-wrap">
            <Button onClick={this.open}>立即开通</Button>
          </View>
        </View>

        {/* 已绑定管家 */}
        <Dialog
          visible={contactVisible}
          position="center"
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'contactVisible')}
        >
          <View className="contact-dialog">
            <View 
              className="iconfont icon-share close" 
              onClick={this.setDialogVisible.bind(this, false, 'contactVisible')}
            />
            <View className="title">请联系管家开通</View>
            <View className="butler-wrap">
              <View className="left">
                <Avatar imgUrl={butlerData.headImage} width={80} />
                <View className="name">{butlerData.name}</View>
              </View>
              <View className="right">NO.{butlerData.number}</View>
            </View>
            <Button className="contact-btn">
              <Text className="iconfont idianhua" />
              <Text>一键拨号</Text>
            </Button>
          </View>
        </Dialog>

        {/* 未绑定管家 */}
        <Dialog
          visible={btnVisible}
          position="bottom"
          isMaskClick={false}
          onClose={this.setDialogVisible.bind(this, false, 'btnVisible')}
        >
          <View className="btn-dialog">
            <View className="item">
              <View>绑定管家</View>
            </View>
            <View className="item">
              <View>请管家联系</View>
            </View>
            <View 
              className="iconfont iguanbi3 close"
              onClick={this.setDialogVisible.bind(this, false, 'btnVisible')}
            />
          </View>
        </Dialog>
      </View>
    )
  }
}

export default VipMember