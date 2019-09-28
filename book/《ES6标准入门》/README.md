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
### 5.1 构造函数的扩展
```
// ES5中创建正则对象的方法
var regexp1 = /abc/ig
var regexp2 = new RegExp(/abc/ig)
var regexp3 = new RegExp('abc','ig')

// ES6扩展了正则的构造函数，第一个参数为正则对象时，可以接受第二个参数作为修饰符并覆盖原修饰符
let regexp4 = new RegExp(/abc/ig,'i')
```

### 5.2 字符串的正则方法移植到正则对象的原型上
字符串对象共有 4 个正则方法，分别是match()、replace()、search()和split()。
```
const reg = /abc/ig
const str = 'abcdabcd'
// 返回所有匹配成功的结果组成的数组
str.match(reg) // [ 'abc', 'abc' ]
// 返回第一次匹配成功时的下标
str.search(reg) // 0
// 将匹配成功的结果替换为第二个参数传入的字符串
str.replace(reg,'-') // -d-d
// 将正则匹配成功的结果作为分隔符，将字符串分隔为一个数组
str.split(reg) // [ '', 'd', 'd' ]
```
ES6 将这 4 个方法写在RegExp的原型对象上，从而做到所有与正则相关的方法，全都定义在RegExp对象上。
1. String.prototype.match 调用 RegExp.prototype[Symbol.match]
```
str.match(reg) // [ 'abc', 'abc' ]
reg[Symbol.match](str) // [ 'abc', 'abc' ]
```
2. String.prototype.replace 调用 RegExp.prototype[Symbol.replace]
```
str.search(reg) // 0
reg[Symbol.search](str) // 0
```
3. String.prototype.search 调用 RegExp.prototype[Symbol.search]
```
str.replace(reg,'-') // -d-d
reg[Symbol.replace](str,'-') // -d-d
```
4. String.prototype.split 调用 RegExp.prototype[Symbol.split]
```
str.split(reg) // [ '', 'd', 'd' ]
reg[Symbol.split](str) // [ '', 'd', 'd' ]
```

### 5.3 新增修饰符u
u修饰符，含义为“Unicode 模式”，用来正确处理大于\uFFFF的 Unicode 字符。也就是说，会正确处理四个字节的 UTF-16 编码。
```
/^\uD83D/u.test('\uD83D\uDC2A') // ES6中增加修饰符u，可以识别为false
/^\uD83D/.test('\uD83D\uDC2A') // ES5中识别为true
```

增加了修饰符u的其他改变：
1. 点字符识别码点大于0xFFFF的unicode编码时，会认为是两个字符，匹配两次.，增加u修饰符后对于码点大于0xFFFF的unicode编码会识别为一个字符，匹配一次.
2. /\u{61}/中的\u后面的大括号不会被识别为量词符
3. 码点大于0xFFFF的 Unicode 字符可以被量词符正确识别
```
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```
4. 码点大于0xFFFF的 Unicode 字符可以被预定义模式正确识别
```
/^\S$/.test('𠮷') // false
/^\S$/u.test('𠮷') // true
```
5. 正则书写不规范的时候会抛出错误
```
/\,/ // /\,/
/\,/u // 报错
```
6. 总结：匹配的字符串中可能存在码点超出0xFFFF的unicode字符都需要考虑使用修饰符u

### 5.4 增加实例属性unicode
增加实例属性unicode用于判断一个正则对象是否具有修饰符u
```
/abc/u.unicode // true
/abc/.unicode //false
```

### 5.5 新增修饰符y
ES6 还为正则表达式添加了y修饰符，叫做“粘连”（sticky）修饰符。

ES5中有一个修饰符g表示全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。
y修饰符与g修饰符类似。不同之处在于，g修饰符只要剩余位置中存在匹配字符则返回匹配数组，而y修饰符必须从剩余的第一个位置存在匹配字符才能返回匹配数。
```
const s = 'aaa_aa_a'
// 剩余字符中任意位置匹配一个以上的a
const r1 = /a+/g
// 剩余字符中开头位置匹配一个以上的a
const r2 = /a+/y

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]
// 第一次匹配成功后index为4，也就是下次从下标为4的位置开始匹配
r1.exec(s).index // 4

// 从下标为4的位置开始匹配，则剩余字符串为'_aa_a'
r1.exec(s) // ["aa"]  剩余字符串任意位置匹配到了/a+/，则返回匹配的数组
r2.exec(s) // null    剩余字符串第一个位置没有匹配到/a+/，则返回null
```
#### 5.5.1 注意事项
1. 可以感觉出，y修饰符号隐含了头部匹配的标志^。
2. 修饰符y多与修饰符g联用，单独使用修饰符y不会匹配全局（惰性匹配）
```
'a1a2a3'.match(/a\d/y) // ["a1"]
'a1a2a3'.match(/a\d/gy) // ["a1", "a2", "a3"]
```

#### 5.5.2 使用场景
修饰符y过滤性会比修饰符g更强，可以用于防止用户输入非法字符

下面的正则用于匹配数字或加号，匹配到其他字符时直接中断匹配
```
const Y = /\s*(\+|[0-9]+)\s*/yg;
const G  = /\s*(\+|[0-9]+)\s*/g;

'3x + 4'.match(Y) // [ '3' ]
// 存在非法字符x，但修饰符g还是会继续匹配
'3x + 4'.match(G) // [ '3', ' + ', '4' ]
```

### 5.6 新增实例属性sticky
新增实例属性sticky用于判断正则对象的修饰符y是否存在
```
/abc/y.sticky // true
/abc/.sticky // false
```

### 5.7 新增实例属性flags 
新增实例属性flags，用于返回正则表达式的修饰符。
```
// source属性返回正则对象的正文
/abc/ig.source // 'abc'

// flags属性返回正则对象的修饰符
/abc/ig.flags // 'gi'
```

### 5.8 新增修饰符s
ES5中的（.）有两类字符不能正确匹配，第一类不能匹配码点超出0xFFFF的unicode字符，第二类不能匹配行终止符（行终止符，就是该字符表示一行的终结），下面四个都是行终止符
* U+000A 换行符（\n）
* U+000D 回车符（\r）
* U+2028 行分隔符（line separator）
* U+2029 段分隔符（paragraph separator）

新增修饰符s可以使（.）匹配任意字符
```
/foo.bar/.test('foo\nbar') //false
/foo.bar/s.test('foo\nbar') //true
```
修饰符s也叫dotAll模式，即点（dot）代表一切字符

### 5.9 新增实例属性dotAll
新增实例属性dotAll用于判断正则对象是否存在修饰符s
```
/abc/s.dotAll // true
/abc/.dotAll // false
```

### 5.10 后行断言
ES5的正则只支持先行断言和先行否定断言,不支持后行断言和后行否定断言，ES2018引入后行断言

#### 5.10.1 先行断言和先行否定断言
*  先行断言（x(?=y)）是指只有x在y前面时，才匹配x
*  先行否定断言（x(?!y)）是指只有x不在y前面时，才匹配x
```
// 匹配数字后面带有%的所有数字
/\d+(?=%)/.exec('100% of US presidents have been male')  // ["100"]
// 匹配数字后面不带有%的所有数字
/\d+(?!%)/.exec('that’s all 44 of them') ["44"]
```
#### 5.10.2 ES2018增加的后行断言
后行断言与现行断言正好相反
*  后行断言（(?<=y)x）是指只有x在y后面时，才匹配x
*  先行否定断言（(?<!y)x）是指只有x不在y后面时，才匹配x
```
// 匹配数字前面带有$的所有数字
/(?<=\$)\d+/.exec('Benjamin Franklin is on the $100 bill')  // ["100"]
// 匹配数字前面不带有$的所有数字
/\d+(?!%)/.exec('that’s all 44 of them') // ["90"]
```

#### 5.10.3 后行断言注意事项
“后行断言”的实现，需要先匹配/(?<=y)x/的x，然后再回到左边，匹配y的部分。这种“先右后左”的执行顺序，与所有其他正则操作相反，导致了一些不符合预期的行为。
* 后行断言的组匹配，与正常情况下结果是不一样的
* 后行断言的反斜杠引用，也与通常的顺序相反


### 5.11 Unicode 属性类
ES2018 引入了一种新的类的写法\p{...}和\P{...}，允许正则表达式匹配符合 Unicode 某种属性的所有字符。

<!-- 后续正则扩展暂时不看 -->
## 6 数值的扩展

### 6.1 二进制和八进制表示法
ES5中的数值可以使用0x开头表示16进制数，ES6 提供了二进制和八进制数值的新的写法，分别用前缀0b（或0B）和0o（或0O）表示（ES5非严格模式中还可以用0开头表示八进制）。
```
// 二进制10转10进制为2
0b10 // 2
// 八进制10转10进制为8
0o10 //8
```

### 6.2 新增静态方法Number.isFinite()和Number.isNaN()
ES6 在Number对象上，新提供了Number.isFinite()和Number.isNaN()两个方法。
```
// Number.isFinite()用来检查一个数值是否为有限的，若参数不是数值，则返回false
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
Number.isFinite('15'); // false
Number.isFinite(true); // false

// Number.isNaN()用来检查一个值是否为NaN，不是NaN一律返回false
Number.isNaN(NaN) // true
Number.isNaN(15) // false
Number.isNaN('15') // false
Number.isNaN(true) // false
Number.isNaN(9/NaN) // true
Number.isNaN('true' / 0) // true
Number.isNaN('true' / 'true') // true
```

ES5中存在两个全局方法，分别是isFinite()用于判断参数是否是有限的，另一个是isNaN()用于判断参数是否是NaN，但他会先调用Number()将参数转为数值再判断，而Number.isFinite()、Number.isNaN()不会，参数不是数值直接返回false。
```
isFinite(25) // true
isFinite("25") // true
Number.isFinite(25) // true
Number.isFinite("25") // false

isNaN(NaN) // true
isNaN("NaN") // true
Number.isNaN(NaN) // true
Number.isNaN("NaN") // false
Number.isNaN(1) // false
```

### 6.3 新增静态方法Number.parseInt()和Number.parseFloat()
ES6 将全局方法parseInt()和parseFloat()，移植到Number对象上面，行为完全保持不变。
```
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
```
这样做的目的，是逐步减少全局性方法，使得语言逐步模块化。

### 6.4 新增静态方法Number.isInteger()
Number.isInteger()用来判断一个数值是否为整数。
```
Number.isInteger(25) // true
Number.isInteger(25.1) // false
```

JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。
```
Number.isInteger(25) // true
Number.isInteger(25.0) // true
```
如果参数不是数值，Number.isInteger返回false。

### 6.5 JavaScript中对数值的存储
JavaScript 采用 IEEE 754 标准，数值存储为64位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）。如果数值的精度超过这个限度，第54位及后面的位就会被丢弃，这种情况下，Number.isInteger可能会误判。

### 6.6 Number.EPSILON
ES6 在Number对象上面，新增一个极小的常量Number.EPSILON。根据规格，它表示 1 与大于 1 的最小浮点数之间的差。Number.EPSILON实际上是 JavaScript 能够表示的最小精度。
```
Number.EPSILON === Math.pow(2, -52) // true
```
练习：写出0.1与0.2的二进制表达式

### 6.7 安全整数范围和 Number.isSafeInteger()
JavaScript 能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。

ES6 引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。
```
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1 // true
Number.MIN_SAFE_INTEGER === -Math.pow(2, 53) + 1 // true
```
Number.isSafeInteger()则是用来判断一个整数是否落在这个范围之内。不是整数或超出范围都返回false
```
Number.isSafeInteger(Math.pow(2, 53) - 1) // true
Number.isSafeInteger(Math.pow(2, 53)) // false
```

### 6.8 Math 对象的扩展
ES6 在 Math 对象上新增了 17 个与数学相关的方法。所有这些方法都是静态方法，只能在 Math 对象上调用。

#### 6.8.1 Math.trunc()
Math.trunc方法用于去除一个数的小数部分，返回整数部分。（会先对参数使用Number()转换）
```
Math.trunc('123.456') // 123
```

#### 6.8.2 Math.sign() 
Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值（Number()）。
它会返回五种值。
* 参数为正数，返回+1；
* 参数为负数，返回-1；
* 参数为 0，返回0；
* 参数为-0，返回-0;
* 其他值，返回NaN。
```
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
```

#### 6.8.3 Math.cbrt()
Math.cbrt方法用于计算一个数的立方根。会先将其转换为数值（Number()）。
```
Math.cbrt(-1) // -1
Math.cbrt(0)  // 0
Math.cbrt(1)  // 1
Math.cbrt(2)  // 1.2599210498948734
```

#### 6.8.4 Math.clz32()
Math.clz32()方法将参数转为 32 位无符号整数的形式，然后返回这个 32 位值里面有多少个前导 0。

左移运算符（<<）与Math.clz32方法直接相关。
```
Math.clz32(0) // 32
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(1 << 1) // 30
Math.clz32(1 << 2) // 29
```

#### 6.8.5 Math.imul()
Math.imul方法返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。

多数情况下和a*b一样的，多用于超出精度的大数计算

#### 6.8.5 Math.fround()
Math.fround方法返回一个数的32位单精度浮点数形式。

#### 6.8.6 Math.hypot()
Math.hypot方法返回所有参数的平方和的平方根。会先将其转换为数值（Number()）。
```
Math.hypot(3, 4);        // 5
Math.hypot(3, 4, 5);     // 7.0710678118654755
```

#### 6.8.7 Math.expm1()
Math.expm1(x)返回 ex - 1，即Math.exp(x) - 1。

#### 6.8.8 Math.log1p()
Math.log1p(x)方法返回1 + x的自然对数，即Math.log(1 + x)。如果x小于-1，返回NaN。

#### 6.8.9 Math.log10()
Math.log10(x)返回以 10 为底的x的对数。如果x小于 0，则返回 NaN。

#### 6.8.10 Math.log2()
Math.log10(x)返回以 10 为底的x的对数。如果x小于 0，则返回 NaN。

#### 6.8.11 双曲线函数
* Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
* Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
* Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
* Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
* Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
* Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）

### 6.9 指数运算符
ES2016 新增了一个指数运算符（**）。
```
Math.pow(2,10) // 1024
2**10 //1024

2**10**2 // 等价于2^(10^2)
```

## 7 函数的扩展
### 7.1 函数参数的默认值
```
// ES5函数默认值
function fun1(x) {
  x = x || 'normal'
  return x
}

// ES6函数默认值
function fun2(x = 'normal) {
  return x
}
```
ES5函数默认值的缺点：参数赋值了，但是对应的布尔值为false，则该赋值不起作用，会采用默认值。
```
// 改善后的ES5函数默认值
function fun1(x) {
  if(x === undefined) {
    x = 'normal'
  }
  return x
}
```

#### 7.1.1 注意事项
* 若参数默认值是一个表达式，则每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。尽量不使用表达式做默认值。
* ES5中函数的length属性表示函数期望接收的参数个数，ES6使用参数默认值后，length属性是函数参数的个数减去设置了默认值的参数的个数，本质也是表示函数期望接收的参数个数。
* (重要！！)一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。
```
var x = 1;
function foo(x, y = function() { x = 2; }) {
  var x = 3;
  y();
  console.log(x);
}
foo() // 3

var x = 1;
function foo(x, y = function() { x = 2; }) {
  x = 3;
  y();
  console.log(x);
}
foo() // 2
```

### 7.2 rest参数
ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用arguments对象了。

注意：不是引入了一个叫rest的参数，rest参数是一种表现形式！！

```
// ES5
function sum1 () {
  console.log(argument)
}

// ES6
function sum2 (...values) {
  console.log(values)
}
```
#### 7.2.1 注意事项
* rest参数必须是最后一个参数，否则会报错
* 函数的length属性不会包括rest参数

### 7.3 严格模式
```
// ES5可以显示定义严格模式的函数
function doSomething(a, b) {
  'use strict';
}
```
ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。
```
// js解释引擎会先解释参数，然后再进入函数体中，此时解析到使用严格模式，与参数部分冲突，于是报错
function doSomething(value = 070) {
  'use strict';
  return value;
}
```
可以通过定义全局严格模式避免这种情况

### 7.4 name属性
新增函数的name属性，返回该函数的函数名。
```
function foo() {}
foo.name // "foo"
```
匿名函数ES5中name发回空字符串，ES6返回变量名
```
var f = function () {};
// ES5
f.name // ""
// ES6
f.name // "f"
```
具名函数ES5与ES6都返回具名函数原本的名字
```
const bar = function baz() {};
// ES5
bar.name // "baz"
// ES6
bar.name // "baz"
```
Function构造函数返回的函数实例，name属性的值为anonymous。
```
(new Function).name // "anonymous"
```
bind返回的函数，name属性值会加上bound前缀。
```
function foo() {};
foo.bind({}).name // "bound foo"

(function(){}).bind({}).name // "bound "
```
### 7.5 箭头函数
#### 7.5.1 特点
1. 箭头函数是匿名函数，不能作为构造函数，不能使用 new。
```
var B = () => {
  value:1;
}
var b = new B();  //-->TypeError: B is not a constructor
```
2. 箭头函数不绑定 arguments，取而代之用 rest 参数解决。
```
function A(a) {
  console.log(arguments); 
}
var B = (b) => {
  console.log(arguments); 
}
//...c 即为 rest 参数
var C = (...c) => { 
  console.log(c); 
}
A(1);  //-->[object Arguments] {0: 1}
B(2);  //-->ReferenceError: arguments is not defined
C(3);  //-->[3]
```
3. 箭头函数不绑定 this，会捕获其所在的上下文的 this 值，作为自己的 this 值。
```
var obj = {
  a: 10,
  b: function() {
    console.log(this.a); 
  },
  c: function() {
     return () => {
       console.log(this.a);
     }
  }
}
obj.b();  //-->10
obj.c()();  //-->10
```
4. 箭头函数通过 call()  或  apply() 方法调用一个函数时，只传入了一个参数，对 this 并没有影响。
```
var obj = {
  a: 10,
  b: function(n) {
    var f = (v) => v + this.a;
    return f(n);
  },
  c: function(n) {
    var f = (v) => v + this.a;
    var m = {a:20};
    return f.call(m,n);
  }
}
console.log(obj.b(1));  //-->11
console.log(obj.c(1));  //-->11
```
5. 箭头函数没有原型属性。
```
var a = () => {
  return 1;
}
function b() {
  return 2;
}
console.log(a.prototype);  //-->undefined
console.log(b.prototype);  //-->object{...}
```
6. 箭头函数不能当做 Generator 函数,不能使用 yield 关键字。箭头函数不能换行。
```
var a = ()
          => 1;  //-->SyntaxError: Unexpected token =>
```
7. 由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。
```
// 报错
let getTempItem = id => { id: id, name: "Temp" };

// 不报错
let getTempItem = id => ({ id: id, name: "Temp" });
```
8. 箭头函数可以与解构赋值联用
#### 7.5.2 ES5对照写法
```
// ES6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
```
### 7.6 尾调用优化
尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。
```
function f(x){
  return g(x);
}
```
不属于尾调用的：
```
// 情况一
function f(x){
  let y = g(x);
  return y;
}

// 情况二
function f(x){
  return g(x) + 1;
}

// 情况三
function f(x){
  g(x);
}
```
函数在调用的时候会形成一个“调用帧”，用于保存调动位置和内部变量等信息，若函数是尾调用的，那么不会保存外层的“调用帧”
```
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```
//目前只有safari浏览器会自动执行尾调用优化

#### 7.6.1 尾递归
递归函数在最后一步调用自己即为尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。
```
// 阶乘案例
// 普通递归 空间复杂的O(n)
function factorial(n) {
  if (n === 1) return 1
  return n * factorial(n - 1)
}
factorial(5) // 120

// 尾递归 空间复杂的O(1)
function factorial(n, total = 1) {
  if (n === 1) return total
  return factorial(n - 1, n * total)
}
factorial(5) // 120
```
注意事项：纯函数式编程语言中没有循环语句，使用使用梯柜必须使用尾递归，但js中可以使用for循环代替递归，能for循环就不要使用递归，避免栈溢出。

尾递归优化只在严格模式下开启，因为尾递归优化会影响func.arguments和func.caller
#### 7.6.2 尾递归优化的实现

### 7.7 Function.prototype.toString()
ES2019 对函数实例的toString()方法做出了修改。toString()方法返回函数代码本身，以前会省略注释和空格。

### 7.8 catch 命令的参数省略
ES5前规定catch语句必须带括号，否则会报错，ES2019中允许了catch语句省略参数
```
try {
  // ...
} catch {
  // ...
}
```
## 8 数组的扩展
### 8.1 扩展运算符
扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

扩展运算符的原理是调用遍历器接口(Symbol.iterator)，部署了遍历器接口的数据结构都可以使用扩展运算符

```
// 扩展运算符后面还可以放置表达式。
const arr = [
  ...(x > 0 ? ['a'] : []),
  'b',
];
```

#### 8.1.1 扩展运算符的用途
```
// 复制数组
const arr1 = [1,2,3]
const [...arr2] = arr1
const arr3 = [...arr1]

// 合并数组
const arr1 = ['a', 'b'];
const arr2 = ['c'];
[...arr1, ...arr2, ...arr3]  // [ 'a', 'b', 'c' ]

// 与解构赋值联用
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]
```
### 8.2 Array.from()
接收一个部署了遍历器接口的数据结构或类数组对象，返回数组
```
Array.from('hello') // ['h', 'e', 'l', 'l', 'o']
```
同时可以接收第二个参数，用于对每个元素进行处理（类似map方法）
```
Array.from([1, 2, 3], (x) => x * x) // [1, 4, 9]
```
第三个参数可以传入this，控制第二个参数的行为

### 8.3 Array.of()
这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。
```
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```
Array.of基本上可以用来替代Array()或new Array()，并且不存在由于参数不同而导致的重载。它的行为非常统一。
```
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

### 8.4 实例方法 arr.copyWithin()
copyWithin用于将指定位置的成员复制到其他位置，然后返回当前数组。
* 参数一target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
* 参数二start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
* 参数三end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

将start到end之间的参数复制出来，放到target开始的位置
```
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4) // [4, 5, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1) // [4, 5, 3, 4, 5]
```

### 8.5 实例方法 arr.find()
find方法接收一个函数，返回第一个返回值为true的成员。可选的第二个参数可用来绑定this对象
```
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10 
// 找不到返回undefined
```

### 8.6 实例方法 arr.findIndex()
findIndex方法接收一个函数，返回第一个返回值为true的成员的下标。可选的第二个参数可用来绑定this对象
```
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) //2
// 找不到返回-1
```

### 8.7 实例方法 arr.fill()
用于填充数组，第一个参数为填充的值，第二个参数和第三个参数表示开始填充和结束填充的位置
```
['a', 'b', 'c'].fill(7) // [7, 7, 7] 已存在的值会被覆盖

['a', 'b', 'c'].fill(7, 1, 2) // ['a', 7, 'c']
```

### 8.8 实例方法 entries()，keys() 和 values()
entries()，keys()和values()——用于遍历数组。它们都返回一个遍历器对象
```
const arr = ['a','b']
for (let index of arr.keys()) {
  console.log(index);   // 0 1
}

for (let value of arr.values()) {
  console.log(value);   // 'a' 'b'
}

for (let [index, value] of arr.entries()) {
  console.log(index, value); // 0 'a'   1 'b'
}
```

### 8.9 实例方法 arr.includes()
Array.prototype.includes方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。第二个参数表示开始搜索的位置
```
[1, 2, 3].includes(4)     // false
[1, 2, 3].includes(2，2)     // false
```
ES5使用indexOf来判断元素是否存在，但indexOf存在两个问题
* 不够语义化
* 使用===来判断元素是否存在，部分值如NaN会判断错误

```
[1, 2, NaN].includes(NaN) // true
```

### 8.10 实例方法 arr.flat()
flat用于拍平数组，可接受一个参数表示需要拍平的层数，默认为1，完全拍平可以传入Infinity
```
[1, 2, [3, [4, 5]]].flat()    // [1, 2, 3, [4, 5]]

[1, 2, [3, [4, 5]]].flat(2)   // [1, 2, 3, 4, 5]
```

### 8.11 实例方法 arr.flatMap()
可以看做先对数组执行map，再对map返回的数组执行flat。同样可以接收第二个参数用于设置this
```
[2, 3, 4].flatMap((x) => [x, x * 2]) 
// 第一步map完得到 [[2, 4], [3, 6], [4, 8]]
// 第二部执行flat得到 [2, 4, 3, 6, 4, 8]
```

### 8.12 数组空位
使用Array创建的空数组存在空位，如[,,]，空位的值并不等于undefined

数组API对空位的处理行为很不一致，所以要尽量避免数组出现空位。可以使用Array.Of()来创建并赋初值给数组。

## 9 对象的扩展
### 9.1 属性的简洁表示法
```
// 属性简写
const foo = 'bar';
// ES5写法
var baz = {foo: foo};

// ES6写法 属性名值相同的时候可以简化
const baz = {foo};
```

```
// 方法简写
// ES5写法
var obj = {
  method: function() {
    return "Hello!";
  }
};

// ES6写法 方法的冒号与function可以省略
const obj = {
  method() {
    return "Hello!";
  }
}
```

### 9.2 属性名表达式
```
// ES5中，对象字面量表达式不允许使用动态属性
// ES6中可以使用
let propKey = 'foo';
const obj = {
  [propKey]: true
};
```
注意：动态属性是可以使用表达式的
```
const obj = {
  ['Hello' + 'world']: 'Hello World!'
}
```

### 9.3 方法的 name 属性
对象的方法的name属性同函数的name属性

### 9.4 属性的可枚举性和遍历
#### 9.4.1 可枚举性
对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象。
```
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true, // 是否可写入
//    enumerable: true, // 是否可枚举
//    configurable: true  // 
//  }
```
下面四种操作会忽略enumerable为false的属性
* for...in循环：只遍历对象自身的和继承的可枚举的属性。
* Object.keys()：返回对象自身的所有可枚举的属性的键名。
* JSON.stringify()：只串行化对象自身的可枚举的属性。
* Object.assign()： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。
* 同时 ES6规定class定义的所有原型方法都是不可枚举的

通过设置可枚举性可以使一些内部属性不会被遍历到

#### 9.4.2 属性的遍历
1. for...in循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）
2. Object.keys返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名
3. Object.getOwnPropertyNames返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
4. Object.getOwnPropertySymbols返回一个数组，包含对象自身的所有 Symbol 属性的键名
5. Reflect.ownKeys返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举

遍历属性的规则：
1. 首先遍历所有数值键，按照数值升序排列。
2. 其次遍历所有字符串键，按照加入时间升序排列。
3. 最后遍历所有 Symbol 键，按照加入时间升序排列。

```
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })  // ['2', '10', 'b', 'a', Symbol()]
```
### 9.5 super 关键字
我们知道，this关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字super，指向当前对象的原型对象。

super只能在对象的方法中使用
```
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```
JavaScript 引擎内部，super.foo等同于Object.getPrototypeOf(this).foo（属性）或Object.getPrototypeOf(this).foo.call(this)（方法）。

### 9.6 对象的扩展运算符
#### 9.6.1 作用于解构赋值中
对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。
```
// x y已被读取，剩下 a b可被遍历
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
z // { a: 3, b: 4 }
```
注意：解构赋值的拷贝是浅拷贝

扩展运算符的解构赋值，不能复制继承自原型对象的属性。
```
let o1 = { a: 1 };
let o2 = { b: 2 };
o2.__proto__ = o1;
let { ...o3 } = o2;
o3 // { b: 2 }
o3.a // undefined
```

用途：拓展一个函数的作用
```
function baseFunction({ a, b }) {
  // ...
}
function wrapperFunction({ x, y, ...restConfig }) {
  // 使用 x 和 y 参数进行操作
  // 其余参数传给原始函数
  return baseFunction(restConfig);
}
```
#### 9.6.2 直接使用扩展运算符
```
let z = { a: 3, b: 4 };
let n = { ...z };   // { a: 3, b: 4 }

let foo = { ...['a', 'b', 'c'] };   // {0: "a", 1: "b", 2: "c"}
```

原理：对象的扩展运算符等同于使用Object.assign()方法。
```
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```

用途：合并两个对象
```
let ab = { ...a, ...b };

// 同时也等同于
let ab = Object.assign({}, a, b);
```

## 10 对象的新增方法
### 10.1 Object.is()
ES5中比较两个值是否相同使用===，但===存在两个问题
1. NaN不等于NaN
2. +0等于-0

ES6 提出“Same-value equality”（同值相等）算法，用来解决这个问题。Object.is就是部署这个算法的新方法。它用来比较两个值是否严格相等。除了NaN等于NaN,+0不等于-0之外，其他都与===保持一致。
```
Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### 10.2 Object.assign()
Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）

Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

注意事项：
1. 只有一个参数的时候会将该参数直接返回，不会创建新的对象
2. 如果参数不是对象，则先转为对象再返回
3. 由于undefined和null无法转成对象，所以如果它们作为第一个参数，就会报错。
```
Object.assign(undefined) // 报错
Object.assign(null) // 报错
```
4. 如果undefined和null作为源对象，则会被跳过
5. 拷贝字符串的时候要注意（字符串是类数组对象），字符串转对象会将下标作为key，值作为value
6. Object.assign方法实行的是浅拷贝
7. 对于取值函数的处理，Object.assign并不能正确的复制取值函数
```
// 复制取值函数的时候，会先求值再进行复制，不会直接复制取值函数。
const source = {
  get foo() { return 1 }
};
const target = {};

Object.assign(target, source)
// { foo: 1 }
```

用途：
1. 为对象添加实例属性
```
const obj ={}
Object.assign(obj,{
  x: 1,
  y: 2
})
```
2. 为对象添加原型方法
```
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});
```
3. 克隆对象
```
function clone(origin) {
  return Object.assign({}, origin);
}
```
4. 为属性指定默认值
在目标对象中设置需要指定的默认值
```
const obj ={}
Object.assign({
  a:1
},obj)

```

### 10.3 Object.getOwnPropertyDescriptors()
ES5 的Object.getOwnPropertyDescriptor()方法会返回某个对象属性的描述对象。Object.getOwnPropertyDescriptors()方法则是返回对象所有属性的描述对象

实现原理:
```
function getOwnPropertyDescriptors(obj) {
  const result = {};
  for (let key of Reflect.ownKeys(obj)) {
    result[key] = Object.getOwnPropertyDescriptor(obj, key);
  }
  return result;
}
```

该方法的引入目的，主要是为了解决Object.assign()无法正确拷贝get属性和set属性的问题。通过Object.getOwnPropertyDescriptors()方法配合Object.defineProperties()方法，就可以实现正确拷贝。
```
const source = {
  set foo(value) {
    console.log(value);
  }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }
```
用途：
1. 配合Object.defineProperties()方法，就可以实现正确拷贝
2. 配合Object.create()方法，将对象属性克隆到一个新对象。这属于浅拷贝。
3. 实现一个对象继承另一个对象
4. 实现mixin

### 10.4 针对原型的操作：__proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()，Object.create()
尽量不要使用__prote__属性，使用以下三个方法代替
1. Object.getPrototypeOf() // 写操作
2. Object.setPrototypeOf()  // 读操作
3. Object.create() // 生成操作

#### 10.4.1 Object.setPrototypeOf()
```
// 用于设置对象的原型对象，返回这个对象本身
Object.setPrototypeOf(object, prototype)
```

#### 10.4.2 Object.getPrototypeOf()
```
// 读取对象的原型对象
Object.getPrototypeOf(obj);
```

#### 10.4.3 Object.create()
```
// 传入一个对象，创建一个继承自该对象的对象
const proto = {
  x: 1,
  y:1
}
const obj = Object.create(proto)
obj.x // 1
```

### 10.5 Object.keys()，Object.values()，Object.entries()
ES5中存在Object.keys()用于获得键组成的数组，ES6中增加了同类型方法
```
const obj ={
  x: 1,
  y: 2
}
const { keys, values, entries } = Object
Object.keys(obj) // [ 'x', 'y' ] 获得键组成的数组
console.log(values(obj)) // [ 1, 2 ] 获得值组成的数组
console.log(entries(obj)) // [ [ 'x', 1 ], [ 'y', 2 ] ] 获得键值对组成的数组
```

### 10.6 Object.fromEntries()
Object.fromEntries()方法是Object.entries()的逆操作，用于将一个键值对数组转为对象。
```
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }
```
该方法的主要目的，是将键值对的数据结构还原为对象，因此特别适合将 Map 结构转为对象。