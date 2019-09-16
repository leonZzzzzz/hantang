import { View, Text } from '@tarojs/components';

import './index.scss';

function CheckBtn(props: any): JSX.Element {

  let { value, disabled, text, className, onChange} = props

  const handleChange = (e: any) => {
    e && e.stopPropagation();
    if (disabled) return
    onChange && onChange(!value)
  }


  return (
    <View className={`check-btn ${className}`} onClick={(e) => handleChange(e)}>
      <Text className={`iconfont ${value ? 'iyishenhe' : 'iweixuanzhong'} ${disabled ? 'disabled' : ''}`} />
      {text && <Text>{text}</Text>}
    </View>
  );
}

CheckBtn.options = {
  addGlobalClass: true,
};

CheckBtn.defaultProps = {
  className: '',
  value: false,
  disabled: false,
  text: '',
  onChange: () => {},
};

export default CheckBtn


