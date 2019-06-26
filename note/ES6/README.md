## 前言
ES6是现代JavaScript的基础，ES6是2015年ECMAScript组织提出的JavaScript的第六个版本，也叫ES2015，其中增加了很多新特性，可以说ES6是当下前端程序员必备知识之一。
## ES6中新增的特性
### 1新的变量声明方式
ES6中，使用let和const代替var定义变量。let用于定义一个变量，const用于定义一个常量,其中const定义的对象只是对象的地址不变，对象的属性是可以增加或者删除的。

使用var定义变量时，会有一些问题，如变量声明提前,ES6中禁止了。

```
//ES5
console.log(a); //输出undefined
var a=0;

//ES56
console.log(a); //直接报错，取消变量声明提前
var a=0;
```
var定义变量只存在全局作用域和函数作用域，其他大括号中不存在块级作用域,let&const定义的变量在所有大括号中都存在块级作用域。
```
//ES5
{
    let b=0;
}
console.log(b);//输出0

//ES6
{
    let b=0;
}
console.log(b);//报错，b未定义,b的作用域在上面的括号内
```
let&const定义的变量不能再使用window对象调用
```
var c=0;
console.log(window.c);  //输出0
let d=0;
console.log(window.d);  //输出undefined
```
使用let&const的特点：
* 禁止变量声明提前
* 增加了块级作用域，任何大括号都可以形成块级作用域
* const定义的对象属性值依然可以改变，但地址不能改变。
* let&const定义的全局变量不作为window的变量
### 2解析结构
```
let [a,b,c]=[
    1,
    2,
    3
];
console.log(a,b,c);//输出1,2,3
let {d,e,f}={
	d:4,
	e:5,
	f:6
};
console.log(d,e,f);//输出4,5,6
```
解析结构可以让我们快速的将接口返回的数据赋值到变量上。

同时，只要数组的下标对应或对象的键名对应都可以实现解析结构
```
//数组的下标对应，将第一个跟第三个取出并赋值给a、c变量
let [a,,c]=[
    1,
    2,
    3
];
console.log(a,c);//输出1,3
//对象的键名对应，将键名为d、f的键值赋值给d，f变量
let {d,f}={
	d:4,
	e:5,
	f:6
};
console.log(d,f);//输出4,6
```
### 3字符串
#### 3.1 模板字符串
模板字符串使用反单引号包围，在字符串中可以使用变量,通过${ }的形式插入变量
```
//ES5
var name="李雷";
var age=21;
console.log('你好'+name+','+'我今年'+age+'岁');//输出 你好李雷，我今年21岁
//ES6
let name="李雷";
let age=21;
console.log(`你好${name},我今年${age}岁`);//输出 你好李雷，我今年21岁
```
在${}之中，除了能够解析变量以外，还可以解析js表达式,如三元表达式等。
```
console.log(`${1===1?'true':'false'}`)
```
#### 3.2与字符串有关的API
ES6中引入了一些新的处理字符串的API
```
let str='lilei';
console.log(str.startsWith('li'));//输出true
console.log(str.endsWith('lei'));//输出true
```
startsWith()接收一个字符串，判断调用该方法的字符串是否以接收的字符串参数作为开头，endsWith()接收一个字符串，判断调用该方法的字符串是否以接收的字符串参数作为结尾。

### 4函数默认值
函数的参数可以预设默认值
```
function showNumber(number=0) {
    console.log(number);
}
showNumber();   //输出0
```
### 5箭头函数
实现调用一次obj.addCount方法就使obj.count加一。
```
//ES5
var obj={
    count:0,
    addCount:function() {
        var that=this;  //定义一个变量暂时保存this指向的obj对象，方便在闭包中使用
        setTimeout(function() { 
            that.count++;
            console.log(that.count);
        },1000);
    }
};
obj.addCount();//输出1
//ES6
const obj={
    count:0,
    addCount:function() {
        setTimeout(()=> {   //使用箭头函数修改this指向的上一作用域变量的上下文对象
            this.count++;
            console.log(this.count);
        },1000);
    }
};
obj.addCount();//输出1  
```
箭头函数就是将function(){}改写为()=>,箭头函数内的this指向外层的this指向的对象，这里是addCount函数的作用域中的this指向的obj对象，这是箭头函数最重要的特性。

箭头函数的参数只有一个的时候可以省略括号
```
(res)=>{xx}
//简写为
res=>{xx}
```
箭头函数内只有一条js语句时，可以省略大括号
```
let fun=()=>{console.log('Hello World')};
//简写为
let fun=()=>console.log('Hello World');
fun();  //输出Hello World
```
### 6 对象字面量简写
#### 6.1 对象字面量中赋值简写
对象字面量中相同键名与键值同名的情况可以简写。
```
//ES5
var name='lilei';
var obj={
    name:name
}
//ES6
let name='lilei';
let obj={
    name
}
```
#### 6.2 对象字面量中声明函数简写
```
//ES5
var obj={
    hello:function() {
        console.log('Hello World');
    }
}
//ES6
let obj={
    hello() {
        console.log('Hello World');
    }
}
```
#### 6.3 动态键名
使用中括号表示动态的键名
```
let key='name';
const obj={
    [key]:'李雷'
};
console.log(obj.name);  //输出李雷
```

### 7 Promise
可能你还没有遇到过回调地狱，但是JS作为一门异步编程的语言，学习Promise十分重要，它可以让我们优雅的编写异步程序，详情请看[ES6 Promise](./promise.md)。

### 8 类与继承
ES6中提供了class关键字与extends关键字让我们方便快捷的书写OOP代码，详情请看[ES6 类与继承](./classAndExtends.md)。

### 9 export与import
在ES5的时候，在同一个html文件中引入两个js文件来实现js跨文件的引用。

ES6中，将每一个文件视为一个模块，在一个模块中可以通过export关键字设置允许外部文件访问的变量。其他模块通过import关键字将其他js模块导入当前模块中。下面直接看例子：
```
//a.js
let name='李雷';
let _age=20;
export {name};  //设置外部文件可以访问的变量
//b.js
import {name} from './a.js';    //接收a.js对外暴露的对象
console.log(name);  //输出李雷
```
a.js中name被设置对外允许访问，而\_age没有设置为对外允许访问。
```
//b.js
import {name,_age} from './a.js';    //接收a.js对外暴露的对象
console.log(name);  //输出李雷
console.log(_age);  //输出undfined，未能接收到_age
```
export第二种写法是把export写在要对外暴露的变量之前：
```
//a.js
export let name='李雷'; //设置外部文件可以访问的变量
export let hello=name=> {//设置外部文件可以访问的函数，使用到了5箭头函数
    console.log(`Hello${name}`);    //使用到了3.1模板字符串
}
let _age=20;
//b.js
import {hello,name} from './a.js';    //接收a.js对外暴露的对象
hello(name);  //输出 Hello李雷
```
export第三种写法是使用export default:
```
//a.js
export let name='李雷'; 
export let hello=name=> {
    console.log(`Hello${name}`)
}
let _age=20;
export default _age;
//b.js
import {hello,name} from './a.js';    //接收a.js对外暴露的对象
import _age from './es6_2.js'; 
hello(name);  //输出 Hello李雷
console.log(_age);  //输出20
```
export default语句只能写一句，export语句可以写多句，export default只能输出一个变量，接收的时候不需要包含在大括号内。

注意：export与import在浏览器上还不支持，可以在一些打包工具如webpack中使用。

<!--### 10遍历器-->

<!--### 11第六种基本数据类型Symbol-->
## 小结
ES6中还有很多的新特性，它是现代JS语言的基石，解决了ES5中诟病已久的各种问题。上述特性是我认为最常见的特性，是必须掌握的内容。