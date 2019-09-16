import Taro from '@tarojs/taro';
import { View, Image, Button, Input } from '@tarojs/components';
import BaseComponent from '@/utils/components'

import './index.scss';

type StateType = {
  pageLoading: boolean
  id: string
  afterSaleId: any
  uploadBillImages: any[]
  model: any
  count: number
  limitSize: number
}

interface ExpressBill {
  state: StateType
}

class ExpressBill extends BaseComponent {
  config = {
    navigationBarTitleText: '上传快递单',
  };

  constructor() {
    super();
    this.state = {
      pageLoading: true,
      id: '',
      afterSaleId: '',
      // 上传快递单
      uploadBillImages: [],
      model: {
        // 快递单号
        billNo: '',
        // 快递公司
        expressCompany: '',
      },
      count: 1,
      limitSize: 5,
    };
  }

  componentDidMount() {
    const { afterSaleId, id } = this.$router.params;
    if (id) {
      let model = JSON.parse(Taro.getStorageSync('expressBill'));
      let uploadBillImages = [];
      if (model.uploadBillImages) uploadBillImages = model.uploadBillImages.split(',');
      this.setState({
        model,
        uploadBillImages,
      });
    }
    this.setState({ afterSaleId, id });
  }

  componentWillUnmount() {
    Taro.removeStorageSync('expressBill');
  }

  onInputChange(type: string, e: any) {
    let { model } = this.state;
    model[type] = e.detail.value;
    this.setState({
      model,
    });
  }

  // 选择图片
  onChooseImage() {
    const { count } = this.state;
    Taro.chooseImage({ count }).then(res => {
      console.log('choose image res :', res);
      this.handleWxChooseImage(res.tempFiles);
    });
  }

  // 处理小程序端的选择图片上传
  handleWxChooseImage(tempFiles: any[], count: number = 0) {
    if (!tempFiles.length) return;
    let { uploadBillImages, limitSize } = this.state;
    if (tempFiles.length + uploadBillImages.length > count) {
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
          let url = res.data.data.imageUrl;
          uploadBillImages.push(url);
        }
        this.setState({
          uploadBillImages,
        }, () => {
          console.log('上传完成:', this.state.uploadBillImages);
        });
        Taro.hideLoading();
      }).catch(err => {
        console.error('upload err :', err);
        Taro.hideLoading();
      });
    }
  }

  // 删除上传的凭证
  deleteProofImg(index: number, e: any) {
    e.stopPropagation();
    let { uploadBillImages } = this.state;
    uploadBillImages.splice(index, 1);
    this.setState({
      uploadBillImages,
    });
  }

  // 提交
  async submit() {
    const { afterSaleId, model, uploadBillImages } = this.state;
    if (!model.billNo) {
      this.showToast('请填写快递单号');
      return;
    }
    if (!model.expressCompany) {
      this.showToast('请填写快递公司');
      return;
    }

    let params: any = {
      afterSaleOrderId: afterSaleId,
      expressNumber: model.billNo,
      expressCompany: model.expressCompany,
      expressBillImage: uploadBillImages.join(','),
    };
    console.log('expressBillImage :', params.expressBillImage);
    await this.$api.mall.exchangeGoodsUploadExpressBill(params)
    Taro.navigateBack().then(() => {
      this.showToast('提交成功', 'success');
    })
  }

  onPreviewImage(index: number) {
    const { uploadBillImages } = this.state;
    let current = this.imgHost + uploadBillImages[index];
    let urls = uploadBillImages.map(item => this.imgHost + item);
    Taro.previewImage({
      current,
      urls,
    });
  }

  render() {
    const { id, model, uploadBillImages, count } = this.state;
    return (
      <View className="page-express-bill">
        <View className="cell-item">
          <View className="title">快递单号</View>
          {!id ? (
            <Input
              type="text"
              className="content"
              placeholder="请输入快递单号"
              maxLength={64}
              onInput={this.onInputChange.bind(this, 'billNo')}
            />
          ) : (
            <View className="content">{model.billNo}</View>
          )}
        </View>
        <View className="cell-item">
          <View className="title">快递公司</View>
          {!id ? (
            <Input
              type="text"
              className="content"
              placeholder="请输入快递公司"
              maxLength={64}
              onInput={this.onInputChange.bind(this, 'expressCompany')}
            />
          ) : (
            <View className="content">{model.expressCompany}</View>
          )}
        </View>
        <View className="action-item">
          <View className="title">上传快递单</View>
          <View className="img-list">
            {uploadBillImages.map((item, index) => {
              return (
                <View className="img-list__item" key={item} onClick={this.onPreviewImage.bind(this, index)}>
                  <Image className="img-item" mode="aspectFit" src={this.imgHost + item} />
                  {!id && <View className="iconfont icon-close" onClick={this.deleteProofImg.bind(this, index)} />}
                </View>
              );
            })}
            {!id && uploadBillImages.length < count && (
              <View className="img-list__item" onClick={this.onChooseImage.bind(this)}>
                <View className="iconfont icon-tupian1" />
                <View className="content">上传图片</View>
              </View>
            )}
          </View>
        </View>
        {!id ? (
          <View className="btn-wrapper">
            <Button className="primary-btn" onClick={this.submit.bind(this)}>
              确定
            </Button>
          </View>
        ) : (
          <View className="btn-wrapper">
            <Button className="primary-btn" onClick={this.navigateBack.bind(this)}>
              返回
            </Button>
          </View>
        )}
      </View>
    );
  }
}

export default ExpressBill