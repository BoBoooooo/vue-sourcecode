/*
 * @file: 观察者
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年07月20 21:37:03
 */
import { compileUtil } from "./Compile.js";

export class Watcher {
  constructor(vm, expr, callback) {
    this.vm = vm;
    this.expr = expr;
    this.callback = callback;
    // 先把旧值保存起来
    this.oldVal = this.getOldVal();
  }
  getOldVal() {
    Dep.target = this;
    const oldVal = compileUtil.getVal(this.expr, this.vm);
    Dep.target = null;
    return oldVal;
  }
  update() {
    const newVal = compileUtil.getVal(this.expr, this.vm);
    if (newVal !== this.oldVal) {
      this.callback(newVal);
    }
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }
  // 收集观察者
  addSub(watcher) {
    this.subs.push(watcher);
  }
  // 通知观察者去更新
  notify() {
    this.subs.forEach((w) => w.update());
  }
}

export class Observer {
  constructor(data) {
    this.observe(data);
  }

  observe(data) {
    if (data && typeof data === "object") {
      Object.keys(data).forEach((key) => {
        this.defineReactive(data, key, data[key]);
      });
    }
  }

  defineReactive(obj, key, value) {
    // 递归遍历
    this.observe(value);
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        // 订阅数据变化的时候,往Dep中添加观察者
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      // 此处注意this指向
      set: (newVal) => {
        // 考虑可能直接赋值一个对象,需要重新建立观察
        this.observe(newVal);
        if (newVal !== value) {
          value = newVal;
          // 告诉Dep通知变化
          dep.notify();
        }
      },
    });
  }
}
