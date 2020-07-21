/*
 * @file: 指令解析器
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年07月17 15:14:35
 */
import { Watcher } from "./Observer.js";

// 指令解析对象
export const compileUtil = {
  getVal(expr, vm) {
    return expr.split(".").reduce((data, currentVal) => {
      return data[currentVal];
    }, vm.$data);
  },
  // 此处实现双向绑定,监听input输入内容 
  setVal(expr, vm, inputVal) {
    let model = vm.$data;
    expr.split(".").forEach((k) => {
      let value = model[k];
      if (typeof value === "object") {
        model = value;
      } else {
        model[k] = inputVal;
      }
    });
  },
  getContentVal(expr, vm) {
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getVal(args[1], vm);
    });
  },
  // 解析v-text指令,以及模板{{ }} 语法
  text(node, expr, vm) {
    let value;
    // 解析所有 {{ }} 到对应值
    if (expr.includes("{{")) {
      value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        // 初始化观察者
        new Watcher(vm, args[1], () => {
          this.updater.textUpdater(
            node,
            this.getContentVal(expr, vm)
          );
        });
        return this.getVal(args[1], vm);
      });
    } else {
      // 解析v-text到对应值
      value = this.getVal(expr, vm);
    }
    this.updater.textUpdater(node, value);
  },
  html(node, expr, vm) {
    const value = this.getVal(expr, vm);
    // 初始化观察者
    new Watcher(vm, expr, (newVal) => {
      this.updater.htmlUpdater(node, newVal);
    });
    this.updater.htmlUpdater(node, value);
  },
  model(node, expr, vm) {
    const value = this.getVal(expr, vm);
    // 初始化观察者  -> 数据=>视图
    new Watcher(vm, expr, (newVal) => {
      this.updater.modelUpdater(node, newVal);
    });
    // 视图=>数据=>视图 双向绑定
    node.addEventListener("input", (e) => {
      this.setVal(expr, vm, e.target.value);
    });
    this.updater.modelUpdater(node, value);
  },
  on(node, expr, vm, eventName) {
    const fn =
      vm.$options.methods && vm.$options.methods[expr].bind(vm);
    node.addEventListener(eventName, fn, false);
  },
  bind(node, expr, vm, eventName) {
    const value = this.getVal(expr, vm);
    node.setAttribute(eventName, value);
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    },
  },
};

// 指令解析器
export class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el)
      ? el
      : document.querySelector(el);
    this.vm = vm;
    // 1.获取文档碎片对象 放入内存中减少页面回流和重绘

    const fragment = this.node2Fragment(this.el);

    // 编译模板

    this.compileTemplate(fragment);
    // 2.追加子元素到根元素
    this.el.appendChild(fragment);
  }

  // dom结点转为文档碎片对象
  node2Fragment(el) {
    const f = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = el.firstChild)) {
      f.appendChild(firstChild);
    }
    return f;
  }

  // 解析文档碎片对象
  compileTemplate(fragment) {
    // 1.获取子节点
    const childNodes = fragment.childNodes;
    [...childNodes].forEach((child) => {
      if (this.isElementNode(child)) {
        // 编译元素结点
        this.compileElement(child);
      } else {
        // 编译文本结点
        this.compileText(child);
      }
      if (Array.isArray([...child.childNodes])) {
        this.compileTemplate(child);
      }
    });
  }

  // 编译元素结点
  compileElement(node) {
    const { attributes } = node;
    [...attributes].forEach((attr) => {
      const { name, value } = attr;
      // 判断当前元素结点属性是否含有vue指令 "v-"
      if (this.isDirective(name)) {
        // v-text , v-html , v-on ,v-model等
        const [, dirctive] = name.split("-"); // text , html , on , model
        const [dirName, eventName] = dirctive.split(":"); // 指令名,事件名
        // 指令解析器,更新数据 数据驱动视图
        compileUtil[dirName](node, value, this.vm, eventName);
        // 删除有指令标签上的属性
        node.removeAttribute("v-" + dirctive);
      }
      // 判断是否使用了缩写 例如@click="xxx"
      else if (this.isEventName(name)) {
        const [, eventName] = name.split("@");
        compileUtil["on"](node, value, this.vm, eventName);
      }
    });
  }

  // 编译文本结点
  compileText(node) {
    const content = node.textContent;
    // 解析模板语法的情况
    // {{}}   /\{\{
    if (/\{\{(.+?)\}\}/.test(content)) {
      return compileUtil.text(node, content, this.vm);
    }
    return content;
  }

  // 判断属性是否为vue指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }
  // 判断是否为@缩写
  isEventName(attrName) {
    return attrName.startsWith("@");
  }

  // 判断是否为dom结点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
