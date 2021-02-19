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
    },
  },
});
