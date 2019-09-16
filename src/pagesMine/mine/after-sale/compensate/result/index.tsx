import Taro from '@tarojs/taro';
import BaseComponent from '@/utils/components'
import { View, Image, Button, Input } from '@tarojs/components';

import './index.scss';

import { Dialog, LoadingBox } from '@/components';

type StateType = {
  pageLoading: boolean
  compensationList: any[]
  flowList: any[]
  cancelReason: string
  dialogStatus: boolean
  canApply: string
  btnType: string
}

interface CompensateResult {
  state: StateType
}

class CompensateResult extends BaseComponent {
  config = {
    navigationBarTitleText: '赔付详情',
  };

  orderId: string

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      compensationList: [],
      flowList: [],
      // 取消原因
      cancelReason: '',
      // 弹框状态
      dialogStatus: false,
      //是否可以再次申请赔付
      canApply: '',
      // 底部按钮的类型 cancel none
      btnType: 'none',
    };
    // 订单ID
    this.orderId = '';
  }

  componentDidMount() {
    const { id, canApply } = this.$router.params;
    this.orderId = id;
    this.setState({
      canApply,
    });
    this.getOrderCompensationReasonType();
  }

  // 查看订单赔付记录
  async getOrderCompensationReasonType() {
    const res = await this.$api.mall.getOrderCompensationList({ orderId: this.orderId })
    let data = res.data.data;
    let flowList: any[] = [];
    let btnType = 'none';
    for (let d of data) {
      for (let f of d.flowList) {
        // 赔付状态流显示的内容
        let flowListItem: any = {
          title: f.title,
          createTime: f.createTime,
          image: f.image,
          // 记录显示的内容
          content: '',
          orderNumber: d.orderNumber,
          number: d.number,
        };
        // 属于申请赔付
        if (f.statusValue.includes('apply')) {
          flowListItem.content += `订单单号：${d.orderNumber}\r\n`;
          flowListItem.content += `赔付单号：${d.number}\r\n`;
          flowListItem.content += `赔付金额：￥${d.applyAmount / 100}\r\n`;
          flowListItem.content += `赔付类型：${d.reasonType}\r\n`;
          if (d.reason) flowListItem.content += `赔付原因：${d.reason}\r\n`;
          if (f.image) flowListItem.imgList = f.image.split(',');
          flowListItem.statusValue = 'apply';
        } else if (f.statusValue.includes('cancel')) {
          if (f.content) flowListItem.content += `理由：${f.content}\r\n`;
          flowListItem.statusValue = 'cancel';
        } else if (f.statusValue.includes('agree')) {
          if (d.refundAmount) flowListItem.content += `赔付金额：￥${d.refundAmount / 100}\r\n`;
          flowListItem.statusValue = 'agree';
        }
        flowList.push(flowListItem);
      }
    }
    // 第一条的属于申请，则可以取消申请赔付
    if (flowList[0].statusValue === 'apply') {
      btnType = 'cancel';
    }
    this.setState({
      btnType,
      flowList,
      compensationList: data,
    });
    this.setPageLoading(false)
  }

  // 取消赔付
  async sumbitCancel() {
    const { cancelReason, compensationList } = this.state;
    if (!cancelReason) {
      this.showToast('请填写取消原因');
      return;
    }
    let params = {
      id: compensationList[0].id,
      cancelReason,
    };
    await this.$api.mall.cancelOrderCompensation(params)
    this.getOrderCompensationReasonType();
    this.setDialogStatus(false);
  }

  // 输入取消原因
  onInputChange(e: any) {
    this.setState({
      cancelReason: e.detail.value,
    });
  }

  // 设置弹框
  setDialogStatus(status: boolean) {
    this.setState({
      dialogStatus: status,
    });
  }

  // 预览大图
  onPreviewImage(index: number, imgIndex: number) {
    const { flowList } = this.state;
    let current = this.imgHost + flowList[index].imgList[imgIndex];
    let urls = flowList[index].imgList.map((item: string) => this.imgHost + item);
    Taro.previewImage({
      current,
      urls,
    });
  }

  // 再次申请赔付
  onRetryApply() {
    let url = `/pagesMine/mine/after-sale/compensate/index?id=${this.orderId}`;
    this.navigateTo(url);
  }

  // 复制数据
  onCopyData(index: number) {
    const { flowList } = this.state;
    let item = flowList[index];
    let data = `订单单号：${item.orderNumber}；赔付单号：${item.number}`;
    Taro.setClipboardData({
      data
    });
  }

  render() {
    const { pageLoading, flowList, btnType, dialogStatus, canApply } = this.state;
    return (
      <View className="page-compensate-result">
        <LoadingBox visible={pageLoading} />

        <View className="flow-list">
          {flowList.map((item, index) => {
            return (
              <View
                className={`timeline ${index === 0 ? 'active' : ''} ${index === flowList.length - 1 ? 'last' : ''}`}
                key={item.title + index}
              >
                <View className="timeline__line" />
                <View className="timeline__dot" />
                <View className="timeline__content">
                  <View className="status">
                    <View>{item.title}</View>
                    {item.statusValue === 'apply' && (
                      <View className="copy" onClick={this.onCopyData.bind(this, index)}>
                        复制单号
                      </View>
                    )}
                  </View>
                  {item.content && <View className="desc">{item.content}</View>}
                  {item.statusValue === 'apply' && item.image && (
                    <View className="img-list">
                      {item.imgList.map((imgItem: string, imgIndex: number) => {
                        return (
                          <View
                            className="img-list__item"
                            key={imgItem}
                            onClick={this.onPreviewImage.bind(this, index, imgIndex)}
                          >
                            <Image className="img-item" mode="aspectFit" src={this.imgHost + imgItem} />
                          </View>
                        );
                      })}
                    </View>
                  )}
                  <View className="date-wrap">
                    <View className="date">{item.createTime}</View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <View className="btn-wrapper">
          {btnType === 'cancel' && (
            <Button className="primary-btn no-radius" onClick={this.setDialogStatus.bind(this, true)}>
              取消赔付
            </Button>
          )}
          {canApply === 'yes' && btnType !== 'cancel' && (
            <Button className="primary-btn no-radius" onClick={this.onRetryApply.bind(this)}>
              再次申请赔付
            </Button>
          )}
        </View>
        <Dialog visible={dialogStatus} position="top" onClose={this.setDialogStatus.bind(this, false)}>
          <View className="dialog-container">
            <View className="title">温馨提示</View>
            <View className="desc">是否确定取消赔付？</View>
            <View className="input-wrap">
              <Input type="text" placeholder="请填写取消原因" maxLength={64} onInput={this.onInputChange.bind(this)} />
            </View>
            <View className="btn-wrap">
              <View className="btn" onClick={this.setDialogStatus.bind(this, false)}>
                不了
              </View>
              <View className="btn confirm" onClick={this.sumbitCancel.bind(this)}>
                确定
              </View>
            </View>
          </View>
        </Dialog>
      </View>
    );
  }
}

export default CompensateResult