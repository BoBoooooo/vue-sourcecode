/*
 * @file: MVue 源码简单实现
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年07月14 15:24:01
 */

class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el)
      ? el
      : document.querySelector(el);
    this.vm = vm;
    // 1.获取文档碎片对象 放入内存中减少页面回流和重绘

    const fragment = this.node2Fragment(this.el);
    console.log(fragment);

    // 编译模板

    this.compile(this.$el);
    // 2.追加子元素到根元素
    this.el.appendChild(fragment);
  }
  compile(fragment) {
    // 1.获取子节点
    const childNodes = fragment.childNodes;
    [...childNodes].forEach((child) => {
      if (this.isElementNode(child)) {
        // 是元素结点
        // 编译元素结点
        console.log("元素节点", child);
      } else {
        console.log("文本节点", child);
      }
      if (Array.isArray(child.childNodes)) {
        this.compile(child);
      }
    });
  }
  node2Fragment(el) {
    const f = document.createDocumentFragment();
    let firstChild;
    while ((firstChild = el.firstChild)) {
      f.appendChild(firstChild);
    }
    return f;
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
}


class MVuew {
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
