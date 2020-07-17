/*
 * @file: MVue 源码简单实现
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年07月14 15:24:01
 */
import Compile from './Compile.js';

export default class MVue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;
    if (this.$el) {
      // 1.实现一个数据观察者
      
      // 2. 实现一个指令解析器
      new Compile(this.$el, this);
    }
  }
}






