import Taro from '@tarojs/taro';
import { View, Text, Image, Button, Input } from '@tarojs/components';
import BaseComponent from '@/utils/components'

import './index.scss';
import util from '@/utils/util'

import { LoadingBox, Dialog } from '@/components';

import config from '@/config/index'

const SuccessImg = config.imgHost + '/attachments/static/success.png'
const PendingImg = config.imgHost + '/attachments/static/pending.png'
const FailImg = config.imgHost + '/attachments/static/fail.png'

type StateType = {
  pageLoading: boolean
  afterSaleDetail: any
  itemList: any[]
  flowList: any[]
  statusObject: any
  type: string | number
  dialogStatus: boolean
  cancelReason: string
}

interface AfterSaleDetail {
  state: StateType
}

class AfterSaleDetail extends BaseComponent {
  config = {
    navigationBarTitleText: '售后详情',
  };

  id: string 
  isMount: boolean

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      afterSaleDetail: {},
      // 售后的商品列表
      itemList: [],
      // 售后流列表
      flowList: [],
      statusObject: {
        // '-1': { name: '审核不通过', img: FailImg },
        '-1': { name: '审核不通过', img: FailImg },
        '1': { name: '等待商家处理', img: PendingImg },
        '2': { name: '商家已确认', img: SuccessImg },
        '3': { name: '等待商家收货', img: PendingImg },
        '4': { name: '商家已收货', img: SuccessImg },
        '5': { name: '商家已发货', img: SuccessImg },
        '6': { name: '已收货', img: SuccessImg },
        '0': { name: '已完成', img: SuccessImg },
      },
      // 售后方式
      type: '',
      // 弹窗
      dialogStatus: false,
      // 取消售后原因
      cancelReason: '',
    };
    // 订单Id
    this.id = '';
    this.isMount = false;
  }

  componentDidMount() {
    this.id = this.$router.params.id;
    this.afterSaleGet();
  }

  componentDidShow() {
    if (!this.isMount) return;
    this.afterSaleGet();
  }

  // 设置弹框
  setDialogStatus(status: boolean) {
    this.setState({
      dialogStatus: status,
    });
  }

  async afterSaleGet() {
    let params = {
      afterSaleOrderId: this.id,
    };
    try {
      const res = await this.$api.mall.afterSaleGet(params)
      let data = res.data.data;
      for (let item of data.flowList) {
        if (item.imgUrl) {
          item.imgList = item.imgUrl.split(',');
        }
      }
      this.setState({
        afterSaleDetail: data,
        itemList: data.items,
        flowList: data.flowList,
        type: data.serviceTypeValue,
      });
      this.isMount = true;
      this.setPageLoading(false)
    } catch(err) {
      this.isMount = true;
      this.setPageLoading(false)
    }
  }

  // 查看快递单
  onCheckExpressBill() {
    const { afterSaleDetail } = this.state;
    if (!afterSaleDetail.toSellerExpressNumber) {
      this.showToast('暂无快递单');
      return;
    }
    let model = {
      billNo: afterSaleDetail.toSellerExpressNumber,
      uploadBillImages: afterSaleDetail.toSellerExpressBillImage,
      expressCompany: afterSaleDetail.toSellerExpressCompany,
    };
    Taro.setStorageSync('expressBill', JSON.stringify(model));
    let url = `/pagesMine/mine/after-sale/pages/express-bill/index?id=${1}`;
    this.navigateTo(url);
  }

  // 换货确认收货
  confirmReceipt(id: string) {
    Taro.showModal({
      title: '收货提示',
      content: '是否确认收货',
    }).then(res => {
      if (res.confirm) {
        this.$api.mall.confirmReceipt({ id }).then(() => {
          this.afterSaleGet();
        });
      }
    });
  }

  // 取消售后
  onCancelAction() {
    this.setDialogStatus(true);
  }

  // 输入取消原因
  onInputChange(e: any) {
    this.setState({
      cancelReason: e.detail.value,
    });
  }

  // 提交取消售后操作
  async sumbitCancel() {
    const { type, cancelReason } = this.state;
    if (!cancelReason) {
      this.showToast('请填写取消原因');
      return;
    }
    let params = {
      afterSaleOrderId: this.id,
      cancelReason,
    };
    try {
      // 退货
      if (type === 1) {
        await this.$api.mall.returnGoodsCancel(params);
      }
      // 换货
      else if (type === 2) {
        await this.$api.mall.exchangeGoodsCancel(params);
      }
      // 退款
      else {
        await this.$api.mall.refundCancel(params);
      }
      // 更新售后信息显示
      this.afterSaleGet();
      this.setDialogStatus(false);
    } catch (error) {
      console.error('sumbitCancel error :', error);
    }
  }

  // 复制
  onClipboardData(type: string) {
    const { afterSaleDetail } = this.state;
    let data = afterSaleDetail[type];
    Taro.setClipboardData({
      data: data,
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


  render() {
    const { pageLoading, afterSaleDetail, itemList, flowList, statusObject, type, dialogStatus } = this.state;

    let hideCancel =
      afterSaleDetail.statusValue === -1 || afterSaleDetail.statusValue === 0 || afterSaleDetail.statusValue === 5;
    
    return (
      <View className="page-after-sale-detail">
        <LoadingBox visible={pageLoading} />
        
        {afterSaleDetail.status && (
          <View className="status-wrapper">
            <View className="status">
              <Image className="status-img" src={statusObject[afterSaleDetail.statusValue].img} />
              <View className="status-text">{afterSaleDetail.status}</View>
              {/* <View className="status-text">{flowList[0].title}</View> */}
            </View>
            {!hideCancel && (
              <View className="action-btn" onClick={this.onCancelAction.bind(this)}>
                取消售后
              </View>
            )}
          </View>
        )}
        <View className="progress-wrapper">
          <View className="title">{afterSaleDetail.serviceType}进度</View>
          <View className="progress-list">
            {flowList.map((item, index) => {
              return (
                <View
                  className={`timeline ${index === 0 ? 'active' : ''} ${index === flowList.length - 1 ? 'last' : ''}`}
                  key={item.title + index}
                >
                  <View className="timeline__line" />
                  <View className="timeline__dot" />
                  <View className="timeline__content">
                    <View className="status">{item.title}</View>
                    {item.content && <View className="desc">{item.content}</View>}
                    {item.imgUrl && (
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
                      {/* 换货状态、是流程的第一行、需要买家上传快递单信息 */}
                      {type !== 3 && index === 0 && afterSaleDetail.statusValue === 2 && (
                        <View className="btn-wrapper">
                          <View
                            className="btn primary"
                            onClick={this.navigateTo.bind(
                              this,
                              `/pagesMine/mine/after-sale/express-bill/index?afterSaleId=${afterSaleDetail.id}`,
                            )}
                          >
                            上传快递单
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        {(type === 1 || type == 3) && (
          <View className="refund-amount">
            <View className="title">退款金额</View>
            {afterSaleDetail.refundAmount ? (
              <View className="content">
                <Text>￥{util.filterPrice(afterSaleDetail.refundAmount)}</Text>
              </View>
            ) : (
              <View className="content desc">
                <Text>暂无，等待商家处理</Text>
              </View>
            )}
          </View>
        )}
        <View className="product-list">
          {itemList.map((item) => {
            return (
              <View className="product-list__item" key={item.id}>
                <View
                  className="cover"
                  onClick={this.navigateTo.bind(this, `/pagesCommon/product/detail/index?id=${item.productId}`)}
                >
                  <Image className="img" mode="aspectFill" src={this.imgHost + item.icon} />
                </View>
                <View className="info">
                  <View className="name">{item.name}</View>
                  <View className="specs">{item.spec}</View>
                  <View className="price-qty">
                    <View className="price">￥{util.filterPrice(item.price)}</View>
                    <View className="qty">x{item.quantity}</View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
        <View className="order-info">
          <View className="title">售后信息</View>
          <View className="list-item">
            <View>订单编号</View>
            <View>
              <Text className="m-r-1">{afterSaleDetail.orderNumber}</Text>
              {process.env.TARO_ENV === 'weapp'
                ? afterSaleDetail.orderNumber && (
                    <Text className="copy-btn" onClick={this.onClipboardData.bind(this, 'orderNumber')}>
                      复制
                    </Text>
                  )
                : afterSaleDetail.orderNumber && (
                    <Text className="copy-btn" data-clipboard-text={afterSaleDetail.orderNumber}>
                      复制
                    </Text>
                  )}
            </View>
          </View>
          <View className="list-item">
            <View>售后单号</View>
            <View>
              <Text className="m-r-1">{afterSaleDetail.number}</Text>
              {process.env.TARO_ENV === 'weapp'
                ? afterSaleDetail.number && (
                    <Text className="copy-btn" onClick={this.onClipboardData.bind(this, 'number')}>
                      复制
                    </Text>
                  )
                : afterSaleDetail.number && (
                    <Text className="copy-btn" data-clipboard-text={afterSaleDetail.number}>
                      复制
                    </Text>
                  )}
            </View>
          </View>
          <View className="list-item">
            <View>售后类型</View>
            <View>{afterSaleDetail.serviceType}</View>
          </View>
          <View className="list-item">
            <View>原因</View>
            <View>{afterSaleDetail.reasonType}</View>
          </View>
        </View>
        {type === 2 && afterSaleDetail.status === 5 && (
          <View className="button-wrapper">
            <Button className="primary-btn no-radius" onClick={this.confirmReceipt.bind(this, afterSaleDetail.id)}>
              确认收货
            </Button>
          </View>
        )}
        <Dialog visible={dialogStatus} position="top" onClose={this.setDialogStatus.bind(this, false)}>
          <View className="dialog-container">
            <View className="title">温馨提示</View>
            <View className="desc">当前售后未完成，是否确定取消？</View>
            <View className="input-wrap">
              <Input type="text" placeholder="请填写取消原因" maxLength="64" onInput={this.onInputChange.bind(this)} />
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

export default AfterSaleDetail