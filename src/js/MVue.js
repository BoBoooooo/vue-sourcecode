/*
 * @file: MVue 源码简单实现
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年07月14 15:24:01
 */
import { Compile } from "./Compile.js";
import { Observer } from "./Observer.js";

export default class MVue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;
    if (this.$el) {
      // 1.实现一个数据观察者
      new Observer(this.$data);
      // 2. 实现一个指令解析器
      new Compile(this.$el, this);
      this.proxyData(this.$data)
    }
  }
  // 代理data  直接vm.xxx访问
  proxyData(data){
    for(const key in data){
      Object.defineProperty(this,key,{
        get(){
          return data[key]
        },
        set(val){
         data[key] = val;
        }
      })
    }
  }
}
