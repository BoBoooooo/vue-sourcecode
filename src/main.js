/*
 * @file: 
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年07月16 15:14:21
 */ 

import MVue from './js/MVue.js';
import './css/main.scss';

window.vm = new MVue({
  el: "#app",
  data: {
    person: {
      name: "张三",
      sex: "男",
    },
    msg: "Vue源码简单实现",
    model:'input框model',
    imageSrc:'https://pic.downk.cc/item/5e78290a5c56091129507571.png'
  },
  methods:{
    handleClick(index){
      this.person.name = '沈飞飞';
    }
  }
});
