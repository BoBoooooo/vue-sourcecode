/*
 * @file: 指令解析器
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年07月17 15:14:35
 */
import { Watcher } from "./Observer.js";

// 指令解析对象
export const compileUtil = {
  // 解析模板{{ }} 语法
  text(node, expr, vm) {
    let value;
    // 解析所有 {{ }} 到对应值
    if (expr.includes("{{")) {
      value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        // 初始化观察者
        new Watcher(vm, args[1], () => {
          this.updater.textUpdater(node, vm.$data[args[1]]);
        });
        return vm.$data[args[1]];
      });
    }
    this.updater.textUpdater(node, value);
  },
  model(node, key, vm) {
    const value = vm.$data[key];
    // 初始化观察者  -> 数据=>视图
    new Watcher(vm, key, (newVal) => {
      this.updater.modelUpdater(node, newVal);
    });
    // 视图=>数据=>视图 双向绑定
    node.addEventListener("input", (e) => {
      vm.$data[key] = e.target.value;
    });
    this.updater.modelUpdater(node, value);
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    },
  },
};

// 指令解析器
export class Compile {
  constructor(el, vm) {
    this.el = document.querySelector(el);
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
      if (name === "v-model") {
        // 指令解析器,更新数据 数据驱动视图
        compileUtil.model(node, value, this.vm);
        // 删除有指令标签上的属性
        node.removeAttribute("v-model");
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

  // 判断是否为dom结点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
