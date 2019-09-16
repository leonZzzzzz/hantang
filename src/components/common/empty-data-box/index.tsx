import { View, Text, Image } from '@tarojs/components';

import './index.scss';
// import NoneImg from '@/img/none.png';
import config from '@/config/index'

function EmptyDataBox(props: any):JSX.Element {
// export default class EmptyDataBox extends Component {
  const { img, title, absolute } = props

  const NoneImg = config.imgHost + '/attachments/static/none.png'

  return (
    <View className={`none-data ${absolute ? 'absolute' : ''}`}>
      <Image className="img" src={img || NoneImg} mode="widthFix" />
      <Text className="text">{title}</Text>
    </View>
  );
}

EmptyDataBox.defaultProps ={
  img: '',
  title: '暂无数据',
  absolute: true,
}
EmptyDataBox.options = {
  addGlobalClass: true,
};

export default EmptyDataBox
