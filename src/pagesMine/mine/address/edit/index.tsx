import Taro from '@tarojs/taro';
import BaseComponent from '@/utils/components'
import { View, Text, Picker, Input, Form, Button, Switch } from '@tarojs/components';

import './index.scss';

import regionData from '@/utils/area'
import util from '@/utils/util'

import { LogoWrap, LoadingBox } from '@/components';

type StateType = {
  pageLoading: boolean
  id: string
  model: any
  region: any
  regionData: any
}

interface EditAddress {
  state: StateType
}

class EditAddress extends BaseComponent {
  config = {
    navigationBarTitleText: '编辑地址',
  };
  btnLoading: boolean;

  constructor() {
    super()
    this.state = {
      pageLoading: true,
      // 地址ID
      id: '',
      model: {
        // 地址名称
        name: '默认',
        // 收货人
        receiver: '',
        // 联系方式
        mobile: '',
        // 省
        province: '',
        // 市
        city: '',
        // 区
        area: '',
        // 详细地址
        address: '',
        // 是否默认地址
        isDefault: false,
      },
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
    };
    this.btnLoading = false;
  }

  componentDidMount() {
    let id = this.$router.params.id || '';
    id && this.addressGet(id)
    this.state.region.province = this.getAreaList('province');
    this.setState({
      region: this.state.region,
      id,
    });
  }

  /**
   * 获取对应区域的数据列表
   * @param type 省，市，区
   * @param code 地址数据code
   */
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

  /**
   * 获取地址
   * @param id 地址id
   */
  async addressGet(id: string) {
    let res = await this.$api.mine.addressGet({ id })
    let data = res.data.data
    // 处理编辑时城市及地区选择器中无数据的问题
    let { region } = this.state;
    let province = region['province'].find((item: any) => {
      return item.name === data.province;
    });
    region.provinceIndex = region['province'].findIndex((item: any) => {
      return item.name === data.province;
    });

    region.city = this.getAreaList('city', province.code.slice(0, 2));
    let city = region['city'].find((item: any) => {
      return item.name === data.city;
    });
    region.cityIndex = region['city'].findIndex((item: any) => {
      return item.name === data.city;
    });
    region.area = this.getAreaList('area', city.code.slice(0, 4));

    region.areaIndex = region['area'].findIndex((item: any) => {
      return item.name === data.area;
    });
    // console.log('provinceIndex', provinceIndex)
    // console.log('cityIndex', cityIndex)
    console.log('area', region.area)
    this.setState({
      model: data,
      region,
    });
    this.setPageLoading(false)
  }

  /**
   * 输入事件
   * @param type 类型
   * @param e Event
   */
  onInputChange(type: string, e: any) {
    let value = e.detail.value;
    let { model } = this.state;
    model[type] = value;
    this.setState({ model });
  }

  /**
   * 清除输入事件
   * @param type 类型
   */
  onClearInput(type: string) {
    let { model } = this.state;
    model[type] = '';
    this.setState({ model });
  }

  /**
   * 选择事件
   * @param type 类型
   * @param e Event
   */
  onPickerChange(type: string, e: { detail: { value: any; }; }) {
    let index = e.detail.value;
    let { model, region } = this.state;
    let item = region[type][index];
    let code = item.code;
    model[type] = item.name;
    region[`${type}Index`] = index
    if (type === 'province') {
      model.city = '';
      model.area = '';
      region.cityIndex = '';
      region.areaIndex = '';
      region.area = [];
      region.city = this.getAreaList('city', code.slice(0, 2));
    } else if (type === 'city') {
      model.area = '';
      region.areaIndex = '';
      region.area = this.getAreaList('area', code.slice(0, 4));
    }
    this.setState({ model, region });
  }

  /**
   * 保存地址
   * @param e Event
   */
  handleSubmit(e: { detail: { formId: any; }; }) {
    if (this.btnLoading) return;
    let params = JSON.parse(JSON.stringify(this.state.model));
    for (let i in params) {
      if (params[i] === '') {
        Taro.showToast({
          title: '请将信息填写完整',
          icon: 'none',
        });
        return;
      }
    }
    if (params.mobile && !util.checkPhone(params.mobile)) {
      this.showToast('手机号码格式错误')
      return
    }
    Taro.showLoading({ title: '请稍后' });
    this.btnLoading = true;
    if (e.detail && e.detail.formId) params.wxMiniFormId = e.detail.formId
    this.addressSave(params, this.state.id ? 'addressUpdate' : 'addressAdd')
  }
  async addressSave(params: any, apiType: string): Promise<any> {
    await this.$api.mine[apiType](params)
    Taro.navigateBack()
    this.btnLoading = false
    Taro.hideLoading()
  }


  render() {
    const { model, region } = this.state
    return (
      <View className="page-address-edit">
        <Form reportSubmit onSubmit={this.handleSubmit.bind(this)}>
          <View className="edit-list">
            <View className="form-cell">
              <View className="form-cell__container border">
                <View className="form-cell__title">收货人</View>
                <View className="form-cell__content">
                  <Input
                    name="receiver"
                    type="text"
                    value={model.receiver}
                    placeholder="请输入收货人姓名"
                    maxLength={16}
                    onInput={this.onInputChange.bind(this, 'receiver')}
                  />
                </View>
                <View className="form-cell__footer">
                  {model.receiver && (
                    <View className="iconfont iguanbi3" onClick={this.onClearInput.bind(this, 'receiver')} />
                  )}
                </View>
              </View>
            </View>
            <View className="form-cell spacing">
              <View className="form-cell__container">
                <View className="form-cell__title">手机号</View>
                <View className="form-cell__content">
                  <Input
                    name="mobile"
                    type="number"
                    maxLength={11}
                    value={model.mobile}
                    placeholder="请输入收货人电话"
                    onInput={this.onInputChange.bind(this, 'mobile')}
                  />
                </View>
                <View className="form-cell__footer">
                  {model.mobile && (
                    <View className="iconfont iguanbi3" onClick={this.onClearInput.bind(this, 'mobile')} />
                  )}
                </View>
              </View>
            </View>
            <View className="form-cell">
              <View className="form-cell__container border">
                <View className="form-cell__title">省份</View>
                <View className="form-cell__content">
                  <Picker
                    className="picker"
                    mode="selector"
                    range={region.province}
                    rangeKey="name"
                    value={region.provinceIndex}
                    onChange={this.onPickerChange.bind(this, 'province')}
                  >
                    <View className="picker__inner">
                      {model.province ? (
                        <Text className="value">{model.province}</Text>
                      ) : (
                        <Text className="placeholder">请选择省份</Text>
                      )}
                      <Text className="iconfont ixiajiantou rotate" />
                    </View>
                  </Picker>
                </View>
              </View>
            </View>
            <View className="form-cell">
              <View className="form-cell__container border">
                <View className="form-cell__title">城市</View>
                <View className="form-cell__content">
                  <Picker
                    className="picker"
                    mode="selector"
                    range={region.city}
                    value={region.cityIndex}
                    rangeKey="name"
                    onChange={this.onPickerChange.bind(this, 'city')}
                  >
                    <View className="picker__inner">
                      {model.city ? (
                        <Text className="value">{model.city}</Text>
                      ) : (
                        <Text className="placeholder">请选择城市</Text>
                      )}
                      <Text className="iconfont ixiajiantou rotate" />
                    </View>
                  </Picker>
                </View>
              </View>
            </View>
            <View className="form-cell">
              <View className="form-cell__container border">
                <View className="form-cell__title">区/县/镇</View>
                <View className="form-cell__content">
                  <Picker
                    className="picker"
                    mode="selector"
                    range={region.area}
                    value={region.areaIndex}
                    rangeKey="name"
                    onChange={this.onPickerChange.bind(this, 'area')}
                  >
                    <View className="picker__inner">
                      {model.area ? (
                        <Text className="value">{model.area}</Text>
                      ) : (
                        <Text className="placeholder">请选择区域</Text>
                      )}
                      <Text className="iconfont ixiajiantou rotate" />
                    </View>
                  </Picker>
                </View>
              </View>
            </View>
            <View className="form-cell spacing">
              <View className="form-cell__container top-item">
                <View className="form-cell__title">详细地址</View>
                <View className="form-cell__content">
                  {/* <Textarea
                    className="textarea"
                    maxLength="32"
                    value={model.address}
                    placeholder="请输入详细地址"
                    autoHeight
                    onInput={this.onInputChange.bind(this, 'address')}
                  /> */}
                  <Input
                    name="address"
                    type="text"
                    value={model.address}
                    maxLength={128}
                    placeholder="请输入详细地址"
                    onInput={this.onInputChange.bind(this, 'address')}
                  />
                </View>
                <View className="form-cell__footer">
                  {model.address && (
                    <View className="iconfont iguanbi3" onClick={this.onClearInput.bind(this, 'address')} />
                  )}
                </View>
              </View>
            </View>
            <View className="form-cell">
              <View className="form-cell__container">
                <View className="form-cell__title">设为默认地址</View>
                <View className="form-cell__content" />
                <View className="form-cell__footer">
                  <Switch
                    checked={model.isDefault}
                    color="rgb(209, 13, 35)"
                    onChange={this.onInputChange.bind(this, 'isDefault')}
                  />
                </View>
              </View>
            </View>
          </View>
          <View className="btn-wrapper">
            {process.env.TARO_ENV === 'weapp' ? (
              <Button className="primary-btn spacing" formType="submit">
                保存
              </Button>
            ) : (
              <Button className="primary-btn spacing" onClick={this.handleSubmit.bind(this)}>
                保存
              </Button>
            )}
          </View>
        </Form>

        <LogoWrap />
      </View>
    );
  }
}

export default EditAddress