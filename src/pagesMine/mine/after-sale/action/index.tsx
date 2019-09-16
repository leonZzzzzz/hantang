import Taro from '@tarojs/taro';

import { View, Text, Image, Form, Button, Picker } from '@tarojs/components';
import { AtTextarea } from 'taro-ui';
import BaseComponent from '@/utils/components'
import { LoadingBox } from '@/components/index';

import './index.scss';

import util from '@/utils/util'

type StateType = {
  pageLoading: boolean
  returnPrice: any
  reason: string,
  proofImgs: any[]
  count: number
  orderItems: any[]
  orderPrice: number
  limitSize: number
  reasonText: string
  reasonType: string
  remark: string
  reasonRange: any[]
  reasonIndex: number
}

interface AfterSaleAction {
  state: StateType
}

class AfterSaleAction extends BaseComponent {
  config = {
    navigationBarTitleText: '',
  };

  id: string
  type: string | number
  status: string | number
  btnLoading: boolean

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      // 退款金额
      returnPrice: 0,
      // 上传凭证
      proofImgs: [],
      count: 3,
      // 售后商品
      orderItems: [],
      // 订单总金额
      orderPrice: 0,
      // 上传图片限制  5mb
      limitSize: 5,
      // 售后原因
      reason: '',
      reasonType: '',
      // 备注
      remark: '',
      // 售后类型文字
      reasonText: '',
      // 原因列表
      reasonRange: [],
      reasonIndex: 0,
    };
    // 订单id
    this.id = '';
    // 售后方式 1:退货 2：换货 3：退款
    this.type = '';
    // 订单的状态
    this.status = '';
    this.btnLoading = false;
  }

  componentDidMount() {
    const { id, type, status } = this.$router.params;
    this.id = id;
    this.type = parseInt(type) || 1;
    this.status = parseInt(status);
    this.setResonText(this.type);
    this.getReasonRange(this.id, this.type);
    let orderItems = JSON.parse(Taro.getStorageSync('checkData'));
    let orderPrice = 0;
    orderItems.forEach((item: any) => {
      orderPrice += item.price * item.selectQty;
    });
    this.setState({
      orderItems,
      orderPrice,
      returnPrice: util.filterPrice(orderPrice),
    },() => {
      console.log('orderItems :', orderItems);
    });
  }

  componentWillUnmount() {
    Taro.removeStorageSync('checkData');
  }

  // 设置售后提示文字
  setResonText(type: number) {
    let reasonText = '退货原因';
    if (type === 2) {
      reasonText = '换货原因';
    } else if (type === 3) {
      reasonText = '退款原因';
    }
    this.setState({
      reasonText,
    });
  }

  // 获取不同售后类型的原因
  // type:选择的售后类型 1:退货 2：换货 3：退款
  async getReasonRange(id: string, type: number) {
    let res: any = null;
    let params = {
      orderId: id,
    };
    if (type === 1) {
      res = await this.$api.mall.returnGoodsReasonType(params);
    } else if (type === 2) {
      res = await this.$api.mall.exchangeGoodsReasonType(params);
    } else {
      res = await this.$api.mall.refundReasonType(params);
    }
    const data = res.data.data;
    this.setState({
      reasonRange: data,
    });
    this.setPageLoading(false)
  }

  // 输入退款金额
  onPriceInput(e: any) {
    this.setState({
      returnPrice: Number(e.detail.value),
    });
  }

  // 输入备注
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
          let url = res.data.data.imageUrl
          proofImgs.push(url);
        }
        this.setState({
          proofImgs,
        }, () => {
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
    const { reason, reasonType, remark, proofImgs, orderItems, orderPrice, returnPrice } = this.state;
    let reg = /^(\d+)(\.\d{1,2})?$/;
    if (!reg.test(returnPrice.toString())) {
      this.showToast('金额只能是数字且小数点后不超过2位');
      return;
    }
    if (this.type === 3) {
      // 如果是选择了仅退款
      if (returnPrice > util.filterPrice(orderPrice)) {
        this.showToast(`退款金额不能超过${util.filterPrice(orderPrice)}元`);
        return;
      }
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
    let afterSalesItemList = orderItems.map(item => {
      let afterSalesItem = {
        orderItemId: item.id,
        qty: item.selectQty,
      };
      return afterSalesItem;
    });
    let voucherImage = proofImgs.join(',');
    let params: any = {
      orderId: this.id,
      reasonType,
      reason: remark,
      voucherImage,
      afterSalesItemList,
    };
    if (e.detail && e.detail.formId) {
      params.wxMiniFormId = e.detail.formId;
    }
    try {
      let res: any = null;
      // 申请退款
      if (this.type === 3) {
        res = await this.$api.mall.refundApply(params);
      }
      // 申请换货
      else if (this.type === 2) {
        res = await this.$api.mall.exchangeGoodsApply(params);
      }
      // 申请退货
      else if (this.type === 1) {
        res = await this.$api.mall.returnGoodsApply(params);
      }
      let id = res.data.data;
      let url = `/pagesMine/mine/after-sale/detail/index?id=${id}`;
      this.redirectTo(url);
      Taro.hideLoading();
      this.btnLoading = false;
    } catch (error) {
      console.log('submit error:', error);
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
    const { pageLoading, orderItems, proofImgs, count, reasonText, returnPrice, reasonRange, reason, reasonIndex, remark } = this.state;

    return (
      <View className="page-apply-after-action">
        <LoadingBox visible={pageLoading} />

        <View className="product-list">
          {orderItems.map((item: any) => {
            return (
              <View className="product-list__item" key={item.id}>
                <View className="cover">
                  <Image className="img" mode="aspectFill" src={this.imgHost + item.iconUrl} />
                </View>
                <View className="info">
                  <View className="name">{item.name}</View>
                  <View className="specs">{item.specs}</View>
                  <View className="price-qty">
                    <View className="price">￥{item.price / 100}</View>
                    <View className="qty">x{item.selectQty}</View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        {this.type === 3 && (
          <View className="cell-item">
            <View className="title">退款金额</View>
            <View className="content">
              <View className="price">￥{returnPrice}</View>
              {/* <Input
                type="text"
                value={this.state.returnPrice}
                placeholder={`输入金额不超过${orderPrice / 100}元`}
                onChange={this.onPriceInput.bind(this)}
              /> */}
            </View>
          </View>
        )}
        <View className="cell-item">
          <View className="title">{reasonText}</View>
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

export default AfterSaleAction