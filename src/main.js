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
    imageSrc:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.yipic.cn%2Fthumb%2F2aeb8272%2Fa9ecb08b%2Ffd950107%2Ff695968b%2Fbig_2aeb8272a9ecb08bfd950107f695968b.png&refer=http%3A%2F%2Fimg.yipic.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1616223841&t=efa0a0088e5b0a568fe7d79b7d64665f'
  },
  methods:{
    handleClick(index){
      this.person.name = '沈飞飞';
    },
    handleClick2(index){
      this.person.name = '赵四';
    }
  }
});
