/* 工具类函数 */
let Utils = {

  /**
   * 格式化时间 yyyy-mm-dd hh:mm:ss
   */
  formatDate(date: any): string {
    if (typeof date == 'string') {
      date = new Date(date);
    }
    return `${date.getFullYear()}-${date.getMonth() <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() <= 9 ? '0' + (date.getDate()) : date.getDate()}`
  },
  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month: number | string = date.getMonth() + 1;
    var strDate: number | string = date.getDate();
    var hour: number | string = date.getHours()
    var minutes: number | string = date.getMinutes()
    var seconds: number | string = date.getSeconds()
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
      " " + hour + seperator2 + minutes +
      seperator2 + seconds;
    return currentdate;
  },


  /**
   * 生成id
   */
  getNewId(): string {
    let id = '';
    for (var i = 0; i < 8; i++) {
      id += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return id;
  },

  /** 数字金额大写转换(可以处理整数,小数,负数) */
  smalltoBIG(n: number) {
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);

    var s = '';

    for (var i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (var i = 0; i < unit[0].length && n > 0; i++) {
      var p = '';
      for (var j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
  },

  /**
   * 加
   */
  add(val1: number, val2: number) {
    let a = !isNaN(val1) ? val1 : 0
    let b = !isNaN(val2) ? val2 : 0
    return parseFloat((a + b).toPrecision(12))
  },
  /**
   * 减
   */
  subtr(val1: number, val2: number) {
    let a = !isNaN(val1) ? val1 : 0
    let b = !isNaN(val2) ? val2 : 0
    return parseFloat((a - b).toPrecision(12))
  },
  /**
   * 乘
   */
  mul(val1: number, val2: number) {
    let a = !isNaN(val1) ? val1 : 0
    let b = !isNaN(val2) ? val2 : 0
    return Math.round(parseFloat((a * b).toPrecision(12)))
  },
  /**
   * 除
   */
  chu(val1: number, val2: number) {
    let a = !isNaN(val1) ? val1 : 0
    let b = !isNaN(val2) ? val2 : 0
    return parseFloat((a / b).toPrecision(12))
  },
  /**
   * 金额分转元
   */
  filterPrice(val: any) {
    if (val === '' || val === undefined || val === null || val === 0) return 0
    let num = this.chu(val, 100).toFixed(2)
    // let num = (val / 100).toFixed(2)
  // 　num = parseFloat(num)
  // 　num = num.toLocaleString()
  　return num;
  },

  formatCurrency(val: string, chu = true) {
    // if (val === '' || val === undefined || val === null || val === 0) return '0.00'
    if (val === '' || val === undefined || val === null || val === 0) return 0
    // let reg: RegExp = /(\d)(?=(\d{3})+\.)/g
    let num = chu ? this.chu(val, 100) : val
    // num = num.toFixed(2).replace(reg, '$&,')
    return num.toLocaleString()
  },
  getSum(values: any[], currency: boolean) {
    let total = values.reduce((prev, curr) => {
      return this.add(prev, curr)
    }, 0)
    if (currency) return this.formatCurrency(total)
    else return total
  },
  toMoney(num: number | string) {
    if (num === '' || num === undefined || num === null || num === 0) return 0
　　num = Number(num).toFixed(2)
　　num = parseFloat(num)
　　num = num.toLocaleString()
　　return num
  },
  /**
   * 去重
   */
  uniq(array: any[], key: string): any[] {
    var temp: any[] = [];
    for(var i = 0; i < array.length; i++){
      var flag = true;
      for(var j = 0;j < temp.length; j++){
        if(array[i][key] == temp[j][key]) {
          flag = false;
        }
      }
      if(flag) temp.push(array[i])
    }
    return temp;
  },

  /**
   * 正则验证手机号
   */
  checkPhone(phone: string) {
    const reg = /^1[3456789]\d{9}$/
    return reg.test(phone)
  },
  /**
   * 正则验证身份证号
   */
  checkIDCard(idCard: string) {
    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
    return reg.test(idCard)
  },
};

export default Utils