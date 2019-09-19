记录学习《ES6标准入门》过程中的知识点与心得。

## 1 let 和 const 命令
### 特点
1. 取消变量声明提前（同时导致出现暂时性死区）
2. 不允许重复声明
3. 增加了块级作用域，任何大括号都可以形成块级作用域（解决闭包问题）
4. let&const定义的全局变量不作为window的变量

### 注意事项
1. 应该避免在块级作用域内声明函数
2. const定义的对象属性值依然可以改变，但地址不能改变。const实际上保证的是变量指向的内存地址不变
3. typeof判断未定义变量时，返回undefined，ES5会报错（typeof不再百分百安全）
4. ES5规定函数只能在全局作用域或函数作用域中声明，不能在块级作用域声明。ES6规定函数可以在块级作用域中声明，且只能在块级作用域中引用。但浏览器对该规定实现不一，应尽量避免在块级作用域中声明函数。（可以写成函数表达式来代替）

### 暂时性死区
```
function bar(x=y, y=2) {
  return [x,y]
}
bar()
```

### 获得全局对象
垫片库global-this可以在所有环境下拿到globalThis(顶层对象)

## 2 变量的解构赋值
### 2.1 数组的解构赋值
#### 本质
数组的解构赋值的本质是对等式右边的变量调用遍历器接口(Symbol.iterator)。提取等式左边定义的变量的下标，然后遍历等式右边的变量查找对应下标的值，查找不到的时候返回undefined

#### 特点
1. 等式右边变量必须可遍历
2. 解构赋值失败的时候返回undefined
3. 解构赋值可以设置默认值（或表达式），只有对应下标的值严格等于undefined时才使用默认值，设置默认表达式时，等到需要默认值时才会执行表达式（惰性的）

#### es5对照写法
```
// es6写法
const arr = []
let [m = 1] = arr

// es5写法
var arr = []
var m
var mIndex = 0
if(arr[mIndex] === undefined) {
  m =1
} else {
  m = arr[mIndex]
}
```

### 2.2 对象的解构赋值
#### 特点
1. 解构赋值失败时返回undefined
2. 同样可以设置默认值
3. 对象的解构赋值需要设置别名，当属性名与别名相同时可以省略。(属性名是内部变量，不会外泄。别名是外部变量)
4. 对象的解构赋值可以提取原型链上的属性

#### 对象解构赋值的别名
```
let {u: v} = {
  u: 1,
  v: 2
}
console.log(v) //1
```

#### 数组本质也是对象，可以使用对象的解构赋值
```
const { 0: first } =[1, 2, 3]
console.log(first) // 1
```

#### es5对照写法
```
// es6写法
const obj = { foo: 'aaa',  bar: 'bbb' }
const { foo: aaa =1 } = obj

// es5写法
var obj = { foo: 'aaa',  bar: 'bbb' }
// 别名
var aaa
// 属性名
var propName = 'foo'
// 从obj[propName]可以看出，对象的解构赋值是可以提取到原型链上的属性的
if(obj[propName] === undefined) {
  aaa =1
} else {
  m = obj[propName]
}
```
### 2.3 字符串的解构赋值
#### 本质
字符串的解构赋值会先将字符串转为类数组对象，然后再做解构赋值

#### 例子
```
// 作为对象解构赋值
const { length: len } = 'hello'
console.log(len) // 5

// 作为数组解构赋值
const [ h ] = 'hello'
console.log(h) // h
```

### 2.4 数值和布尔值的解构赋值
#### 本质
数值和布尔值的解构赋值会先将数值和布尔值转为对象，然后再做解构赋值

#### 例子
```
const { toString: to1 } = 123
const { toString: to2 } = true
console.log(to1, to2)
```

### 2.5 null与undefined的解构赋值
null与undefined的解构赋值会直接报错

### 2.6 总结
解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于undefined和null无法转为对象，所以对它们进行解构赋值，都会报错。

## 3 字符串的扩展
js中的字符串可以识别普通字符串表达式，转义字符串表达式，Unicode字符串表达式

### 字符的 Unicode 表示法扩展
es6之前只能解析\u0000-\uFFFF的字符，超出部分必须使用双字节表示。可以看出来四位的unicode码只能表示16^4(65536)种字符。ES6使用'\u{1F680}'来解析任意位数的unicode编码。

### 特点
1. ES6之前要求unicode字符必须是4位数的，ES6引入\u{}写法后可以是任意位数
2. for...in不能正确识别ES6写法的unicode字符串，需要使用for...of
3. 一些特殊字符只能通过转义字符或unicode字符输出，如行分隔符(\u2028)，段分隔符(\u2029)
4. 引入模板字符串``，在模板字符串中可以使用${}来注入JS表达式，也可以在模板字符串中使用换行符（普通字符串不支持换行）
5. 模板字符串会默认将字符串转移（存疑）
6. 标签模板功能：模板字符串紧跟在一个函数后面，会将模板字符串作为参数传递给函数并调用该函数（函数调用的特殊形式）。若模板字符串中有变量的话，会将模板字符串处理为多个参数后，再调动函数（可用于过滤HTML字符串，防止XSS攻击。也可用于多语言转换）

### 例子
```
let str1 = '\u{41}\u{42}\u{43}' // ABC
let str2 = '\u{1F680}' // 🚀
```
### 实现一个简易的vue模板引擎
```
// js中export default的对象，为了简化只写data属性
const obj = {
  data() {
    return {
      name: '李雷',
      age: 14
    }
  }
}
// template部分
let template = `
  <div>
    <ul>
      <li>姓名：{{name}}</li>
      <li>年龄：{{age}}</li>
    </ul>
  </div>
`
// 遍历template字符串并用正则表达式替换所有Mustache表达式（双括号表达式）
function Compile(dataObj, template) {
  // 匹配Mustache表达式的正则
  let mustache = /\{\{([\s\S]+?)\}\}/g
  // 替换
  return template.replace(mustache, value => {
    // 去掉{{}}
    let key = value.substring(2, value.length -2)
    // 判断dataObj中是否存在key (Reflect.has(obj, key)就是 key in obj)
    if(Reflect.has(dataObj, key)) {
      return dataObj[key]
    } else {
      // 不存在，抛出错误
      throw new Error(`${key} is not defined`)
    }
  })
}

let templateNew = Compile(obj.data(), template)
console.log(templateNew)
/*<div>
 *  <ul>
 *    <li>姓名：李雷</li>
 *    <li>年龄：14</li>
 *  </ul>
 *</div>
 */
```

### 标签模板
```
tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
// tag函数
function tag(stringArr, ...values){
  // ...
}
```

### 标签模板用途一：过滤HTML字符串
### 标签模板用途二：多语言转换

## 4 字符串的新增方法
### 4.1 String.fromCodePoint()
ES5提供了str.charCodeAt(0)将字符转为unicode码，提供String.fromCharCode()（接收16进制整数）将16进制unicode码转为字符串，缺点是String.fromCharCode()不能识别4位以上的unicode码。ES6使用String.fromCodePoint()将任意位16进制整数转为字符串
```
String.fromCodePoint(0x78, 0x1f680, 0x79) // x🚀y
```
### 4.2 str.codePointAt()
JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode 码点大于0xFFFF的字符），JavaScript 会认为它们是两个字符。对于unicode码超出4位的，str.charCodeAt()不能正确处理。 str.codePointAt()返回的是32位的UTF-16字符的码点，不正正确处理4位及4位一下的码点。

处理unicode编码的字符串最好的做法是调用遍历器接口，for...of、扩展运算符等
```
let s = '𠮷a';
// for...of
for (let ch of s) {
  console.log(ch.codePointAt(0).toString(16));
}
// 扩展运算符
[...s].forEach(
  ch => console.log(ch.codePointAt(0).toString(16))
);
```

### 4.3 String.raw()
对\反转移，即将\变成\\\\，多用于模板字符串的处理方法
```
String.raw`Hi\n${2+3}!`; // 返回 "Hi\\n5!"  
```
#### 直接调用String.raw()

#### es5对照写法
```
String.raw = function (strings, ...values) {
  let output = '';
  let index;
  for (index = 0; index < values.length; index++) {
    output += strings.raw[index] + values[index];
  }

  output += strings.raw[index]
  return output;
}
```
### 4.4 str.normalize()

### 4.5 str.includes()
判断是否存在子字符串，返回布尔值，第二个参数接收一个整数表示开始搜索的位置
```
'abc'.includes('ab') // true
'abc'.includes('d') // false
```

### 4.6 str.startsWith()
判断是否以子字符串开头，返回布尔值，第二个参数接收一个整数表示开始搜索的位置
```
'abc'.startsWith('ab') // true
'abc'.startsWith('c') // false
'abc'.startsWith('c',2) // true
```

### 4.7 str.endsWith()
判断是否以子字符串开头，返回布尔值，第二个参数接收一个整数表示结束搜索的位置
```
'abc'.endsWith('ab') // false
'abc'.endsWith('c') // true
'abc'.endsWith('ab',2) // true
```

### 4.8 str.repeat()
接收一个整数，将原字符串重复n次，返回一个新字符串
```
'abc'.repeat(0) // 空字符串
'abc'.repeat(3) // abcabcabc
```

### 4.9 str.padStart()
补全字符串，在字符串开头位置补充字符串，常用于给数值补全指定位数
```
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'
```

### 4.10 str.padEnd()
补全字符串，在字符串开头位置补充字符串
```
'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
```

### 4.11 str.trimStart()
清空字符串开头空格，同str.trimLeft()

### 4.12 str.trimEnd()
清空字符串结尾空格，同str.trimRight()

### 4.13 str.matchAll()
返回一个正则表达式在当前字符串的所有匹配
```

```

## 5 正则的扩展
### 