# README

## 1 前言

最近看到有些人说vue是双向数据绑定的，有些人说vue是单向数据流的，我认为这两种说法都是错误的，vue是一款具有响应式更新机制的框架，既可以实现单向数据流也可以实现数据的双向绑定。

## 2 单向数据流与数据双向绑定

单向数据流是指model中的数据发生改变时引起view的改变。

![](https://user-gold-cdn.xitu.io/2019/6/26/16b93ef7abb57a78?w=1174&h=217&f=png&s=8358) 双向数据绑定是指model中的数据发生改变时view的改变，view的改变也会引起model的改变。

![](https://user-gold-cdn.xitu.io/2019/6/26/16b93f02d4f75de7?w=1174&h=261&f=png&s=11858)

```text
//这个是单向数据流，改变这个input的value值并不能是data中的text属性发生改变。
<input type="text" :value="text">
data:{
    return {
        text:'文本输入框'
    }
}
//这个是双向数据绑定，无论是修改model还是修改view都能引起另一方的改变。
<input type="text" v-model="text">
data:{
    return {
        text:'文本输入框'
    }
}
```

## 3 vue中的数据双向绑定实现原理

vue给我们提供了实现数据双向绑定的两种语法糖，分别v-model和.sync修饰符，v-model用于为表单元素提供数据双向绑定，.sync修饰符用于为任意属性提供数据双向绑定，接下来我们来尝试不使用vue提供的语法糖，自己实现数据双向绑定。

要想view发生改变的时候引起model的改变首先要监听到view的改变，view发生改变时再去改变model，有了思路之后下面是代码实现。

```text
//首先通过input事件监听视图的改变
<input type="text" :value="inputTitle" @input="onInput">
data:{
    return {
        text:'文本输入框'
    }
},
methods:{
    //视图发生改变的时候，将视图的值赋予模型的值，实现数据双向绑定
    onInput(event) {
        this.text=event.target.value;
    }
}
```

## 4 vue中的单向数据流实现原理

vue的单向数据流涉及到Object.defineProperty\(\)这个API。

Object.defineProperty用法:

```text
//Object.defineProperty用于数据劫持，可以监听一个变量的读取与写入，并在发生读取与写入的时候执行回调函数
Object.defineProperty(obj,prop,desc);
//obj是要定义的对象，prop是要定义的属性名，desc是属性的描述符
```

举例：

```text
//定义一个对象并监听他的text属性的存值操作与取值操作
let data={};
Object.defineProperty(data,'text',{
    get() {
        console.log('取值操作');
    },
    set(newVal) {
        console.log('存值操作');
    }
});
console.log('data');
===>输出:
===>{}
===>取值操作
data.text='文本输入框';
===>输出
===>存值操作
```

有了Object.defineProperty\(\)这个API就可以监听model中数据的改变并在数据改变的时候修改视图达到单向数据流的效果。

## 5 实现一个简易的数据双向绑定

下面实现一个简易的数据双向绑定，目标是在修改view可以使model中的变量发生改变，修改model可以使视图发生改变。

```text
//html
<div id="app">
    <input type="text" id="input">
</div>
//js
let input = document.querySelector('#input');
//定义model
let data={
    text:''
};
//监听model中text的变化，首先实现数据单向流
Object.defineProperty(data,'text',{
   get() {

   }，
   //text发生改变的时候，修改input元素的value值 
   set(newVal) {
        input.value=newVal;
   }
});
//监听input元素的改变并修改model的值，实现数据双向绑定
input.addEventLisener('input',event=> {
    data.text=event.target.value;
});
```

至此就实现了简易的数据双向绑定，可以在控制台中修改data.text的值来查看视图是否发生改变，修改input元素的值在控制台中打印data.text查看model是否发生改变。

## 6 交流

如果这篇文章帮到你了，觉得不错的话来点个Star吧。

