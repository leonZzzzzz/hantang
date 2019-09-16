import Taro from '@tarojs/taro';
import BaseComponent from '@/utils/components'
import { View, Text, Image, Form, Button, Input, Picker } from '@tarojs/components';
import { AtTextarea } from 'taro-ui';
import { LoadingBox } from '@/components/index';

import './index.scss';

import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  canAmount: number
  amount: string
  reason: string
  reasonType: string | number
  remark: string
  proofImgs: any[]
  count: number
  limitSize: number
  reasonRange: any[]
  reasonIndex: number
}

interface AfterSaleCompensate {
  state: StateType
}

class AfterSaleCompensate extends BaseComponent {
  config = {
    navigationBarTitleText: '申请赔付',
  };

  orderId: string
  btnLoading: boolean

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      // 可以申请的赔付金额
      canAmount: 0,
      // 填写申请赔付的金额
      amount: '',
      // 赔付原因
      reason: '',
      reasonType: '',
      remark: '',
      // 上传凭证
      proofImgs: [],
      count: 3,
      // 上传图片限制  5mb
      limitSize: 5,
      // 原因列表
      reasonRange: [],
      reasonIndex: 0,
    };
    // 订单ID
    this.orderId = '';
    this.btnLoading = false;
  }

  componentDidMount() {
    const { id } = this.$router.params;
    this.orderId = id;
    this.getOrderCompensationReasonType();
  }

  // 获取赔付原因类型
  async getOrderCompensationReasonType() {
    const res = await this.$api.mall.getOrderCompensationReasonType()
    let data = res.data.data;
    this.setState({
      reasonRange: data,
    });
    this.setPageLoading(false)
  }

  // 输入申请赔付的金额
  onAmountInput(e: any) {
    this.setState({
      amount: e.detail.value,
    });
  }

  // 输入赔付原因说明
  onRemarkInput(e: any) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 选择图片
  onChooseImage() {
    const { count, proofImgs } = this.state;
    Taro.chooseImage({
      count: count - proofImgs.length,
    }).then(res => {
      console.log('choose image res :', res);
      this.handleWxChooseImage(res.tempFiles, count);
    });
  }

  // 处理小程序端的选择图片上传
  handleWxChooseImage(tempFiles: any[], count: number) {
    if (!tempFiles.length) return;
    let { proofImgs, limitSize } = this.state;
    if (tempFiles.length + proofImgs.length > count) {
      this.showToast(`最多上传${count}张图片`);
      return;
    } else {
      Taro.showLoading({
        title: '上传图片中...',
      });
      let promiseArray: any[] = [];
      for (let file of tempFiles) {
        // 判断选择的图片大小
        const fileSize = file.size / 1024 / 1024;
        if (fileSize > limitSize) {
          this.showToast(`大于${limitSize}MB的图片将不会上传`);
        } else {
          let promise = this.$api.common.tencentCloud(file.path, {imageType: 'afterSale'});
          promiseArray.push(promise);
        }
      }
      Promise.all(promiseArray).then(result => {
        console.log('[result] :', result);
        for (let res of result) {
          let url = res.data.imageUrl;
          proofImgs.push(url);
        }
        this.setState({
          proofImgs,
        },() => {
          console.log('上传完成:', this.state.proofImgs);
        });
        Taro.hideLoading();
      }).catch(err => {
        console.error('upload err :', err);
        Taro.hideLoading();
      });
    }
  }

  // 删除上传的凭证
  deleteProofImg(index: number) {
    let { proofImgs } = this.state;
    proofImgs.splice(index, 1);
    this.setState({
      proofImgs,
    });
  }

  async submit(e: any) {
    if (this.btnLoading) return;
    const { amount, proofImgs, reasonType, remark, reason } = this.state;
    const reg = /^(\d+)(\.\d{1,2})?$/;
    if (!reg.test(amount.toString())) {
      this.showToast('金额只能是数字且小数点后不超过2位');
      return;
    }
    if (!reason) {
      this.showToast('请选择原因');
      return;
    }
    if (reason === '其他' && !remark) {
      this.showToast('请填写说明');
      return;
    }
    this.btnLoading = true;
    Taro.showLoading({ title: '请稍后' });
    let image = proofImgs.join(',');
    let params: any = {
      orderId: this.orderId,
      reasonType,
      reason: remark,
      image,
      amount: util.mul(Number(amount), 100),
    };
    if (e.detail && e.detail.formId) {
      params.wxMiniFormId = e.detail.formId;
    }
    try {
      await this.$api.mall.applyOrderCompensation(params)
      let url = `/pagesMine/mine/after-sale/compensate/result/index?id=${this.orderId}`;
      this.navigateTo(url);
      this.btnLoading = false;
      Taro.hideLoading();
    } catch(err) {
      this.btnLoading = false;
    }
  }

  // 选择原因
  onPickerChange(e: any) {
    let index = e.detail.value;
    let { reasonRange } = this.state;
    let item = reasonRange[index];
    this.setState({
      reason: item.name,
      reasonType: item.value,
      reasonIndex: index,
    });
  }

  render() {
    const { pageLoading, proofImgs, count, reason, reasonRange, reasonIndex, remark, amount } = this.state;
    return (
      <View className="page-apply-after-compensate">
        <LoadingBox visible={pageLoading} />

        <View className="cell-item">
          <View className="title">申请赔付金额</View>
          <View className="content right">
            <Input
              className="price-input"
              type="text"
              value={amount}
              placeholder="请输入金额"
              onInput={this.onAmountInput.bind(this)}
            />
            <View className="m-l-1">元</View>
          </View>
        </View>
        <View className="cell-item">
          <View className="title">申请赔付原因</View>
          <View className="content">
            <Picker
              className="picker"
              mode="selector"
              range={reasonRange}
              rangeKey="name"
              onChange={this.onPickerChange.bind(this)}
              value={reasonIndex}
            >
              <View className="picker__inner">
                {reason ? <Text className="value">{reason}</Text> : <Text className="placeholder">请选择原因</Text>}
                <Text className="iconfont icon-arrow-right rotate" />
              </View>
            </Picker>
          </View>
        </View>
        <View className="action-item">
          <View className="textarea-wrapper">
            <AtTextarea
              value={remark}
              placeholder={`说明（选其他时必填）`}
              maxLength={100}
              onChange={this.onRemarkInput.bind(this)}
            />
          </View>
        </View>
        <View className="action-item">
          <View className="title">上传凭证</View>
          <View className="img-list">
            {proofImgs.map((item, index) => {
              return (
                <View className="img-list__item" key={item}>
                  <Image className="img-item" mode="aspectFit" src={this.imgHost + item} />
                  <View className="iconfont icon-close" onClick={this.deleteProofImg.bind(this, index)} />
                </View>
              );
            })}
            {proofImgs.length < count && (
              <View className="img-list__item" onClick={this.onChooseImage.bind(this)}>
                <View className="iconfont icon-tupian1" />
                <View className="content">上传凭证</View>
                <View className="desc">(最多{count}张)</View>
              </View>
            )}
          </View>
        </View>
        <View className="btn-wrapper">
          <Form reportSubmit onSubmit={this.submit.bind(this)}>
            <Button className="primary-btn no-radius" formType="submit">
              提交
            </Button>
          </Form>
        </View>
      </View>
    );
  }
}

export default AfterSaleCompensate