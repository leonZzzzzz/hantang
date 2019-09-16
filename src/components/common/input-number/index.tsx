import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss';

function InputNumber(props: any): JSX.Element {

  const { value, step, max, min, maxTip, minTip, onAdd, onSub, onChange, onTextClick, className } = props

  const handleNumberAdd = () => {
    let num = value + step;
    let flag = true;
    // 如果设置了最大值并超过最大值
    if (max !== '' && num > max) {
      flag = false;
    }
    if (flag) {
      onAdd && onAdd(num);
      onChange && onChange(num);
    } else {
      Taro.showToast({
        title: maxTip,
        icon: 'none',
      });
    }
  }

  const handleNumberSub = () => {
    let num = value - step;
    let flag = true;
    // 如果设置了最小值并小于最小值
    if (min !== '' && num < min) {
      flag = false;
    }
    if (flag) {
      onSub && onSub(num);
      onChange && onChange(num);
    } else {
      Taro.showToast({
        title: minTip,
        icon: 'none',
      });
    }
  }

  const handleTextClick = () => {
    onTextClick && onTextClick(value)
  }


  return (
    <View className={`input-number ${className}`}>
      <View className="iconfont isubtract" onClick={handleNumberSub} />
      <View className="input-number__value" onClick={handleTextClick}>
        {value}
      </View>
      <View className="iconfont iadd" onClick={handleNumberAdd} />
    </View>
  );
}

InputNumber.options = {
  addGlobalClass: true,
};

InputNumber.defaultProps = {
  className: '',
  value: 0,
  min: '',
  minTip: '不能再低了',
  max: '',
  maxTip: '超出数量了',
  step: 1,
  onAdd: () => {},
  onSub: () => {},
  onChange: () => {},
  onTextClick: () => {},
};

export default InputNumber