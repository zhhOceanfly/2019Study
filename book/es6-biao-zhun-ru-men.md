# README

记录学习《ES6 标准入门》过程中的知识点与心得。

## 1 let 和 const 命令

### 特点

1. 取消变量声明提前（同时导致出现暂时性死区）
2. 不允许重复声明
3. 增加了块级作用域，任何大括号都可以形成块级作用域（解决闭包问题）
4. let&const 定义的全局变量不作为 window 的变量

### 注意事项

1. 应该避免在块级作用域内声明函数
2. const 定义的对象属性值依然可以改变，但地址不能改变。const 实际上保证的是变量指向的内存地址不变
3. typeof 判断未定义变量时，返回 undefined，ES5 会报错（typeof 不再百分百安全）
4. ES5 规定函数只能在全局作用域或函数作用域中声明，不能在块级作用域声明。ES6 规定函数可以在块级作用域中声明，且只能在块级作用域中引用。但浏览器对该规定实现不一，应尽量避免在块级作用域中声明函数。（可以写成函数表达式来代替）

### 暂时性死区

```text
function bar(x=y, y=2) {
  return [x,y]
}
bar()
```

### 获得全局对象

垫片库 global-this 可以在所有环境下拿到 globalThis\(顶层对象\)

```text
// 垫片库源码
(function (Object) {
  typeof globalThis !== 'object' && (
    this ?
      get() :
      (Object.defineProperty(Object.prototype, '_T_', {
        configurable: true,
        get: get
      }), _T_)
  );
  function get() {
    this.globalThis = this;
    delete Object.prototype._T_;
  }
}(Object));
export default globalThis;
```

## 2 变量的解构赋值

### 2.1 数组的解构赋值

#### 本质

数组的解构赋值的本质是对等式右边的变量调用遍历器接口\(Symbol.iterator\)。提取等式左边定义的变量的下标，然后遍历等式右边的变量查找对应下标的值，查找不到的时候返回 undefined

#### 特点

1. 等式右边的数据结构必须部署遍历器接口
2. 解构赋值失败的时候返回 undefined
3. 解构赋值可以设置默认值（或表达式），只有对应下标的值严格等于 undefined 时才使用默认值，设置默认表达式时，等到需要默认值时才会执行表达式（惰性的）

#### es5 对照写法

```text
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

1. 解构赋值失败时返回 undefined
2. 同样可以设置默认值
3. 对象的解构赋值需要设置别名，当属性名与别名相同时可以省略。\(属性名是内部变量，不会外泄。别名是外部变量\)
4. 对象的解构赋值可以提取原型链上的属性

#### 对象解构赋值的别名

```text
let {u: v} = {
  u: 1,
  v: 2
}
console.log(v) //1
```

#### 数组本质也是对象，可以使用对象的解构赋值

```text
const { 0: first } = [1, 2, 3]
console.log(first) // 1
```

#### es5 对照写法

```text
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

```text
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

```text
const { toString: to1 } = 123
const { toString: to2 } = true
console.log(to1, to2)
```

### 2.5 null 与 undefined 的解构赋值

null 与 undefined 的解构赋值会直接报错

### 2.6 总结

解构赋值的规则是，只要等号右边的值不是对象或数组，就先将其转为对象。由于 undefined 和 null 无法转为对象，所以对它们进行解构赋值，都会报错。

## 3 字符串的扩展

js 中的字符串可以识别普通字符串表达式，转义字符串表达式，Unicode 字符串表达式

### 字符的 Unicode 表示法扩展

es6 之前只能解析\u0000-\uFFFF 的字符，超出部分必须使用双字节表示。可以看出来四位的 unicode 码只能表示 16^4\(65536\)种字符。ES6 使用'\u{1F680}'来解析任意位数的 unicode 编码。

### 特点

1. ES6 之前要求 unicode 字符必须是 4 位数的，ES6 引入\u{}写法后可以是任意位数
2. for...in 不能正确识别 ES6 写法的 unicode 字符串，需要使用 for...of
3. 一些特殊字符只能通过转义字符或 unicode 字符输出，如行分隔符\(\u2028\)，段分隔符\(\u2029\)
4. 引入模板字符串\`\`，在模板字符串中可以使用${}来注入 JS 表达式，也可以在模板字符串中使用换行符（普通字符串不支持换行）
5. 模板字符串会默认将字符串转义（存疑）
6. 标签模板功能：模板字符串紧跟在一个函数后面，会将模板字符串作为参数传递给函数并调用该函数（函数调用的特殊形式）。若模板字符串中有变量的话，会将模板字符串处理为多个参数后，再调动函数（可用于过滤 HTML 字符串，防止 XSS 攻击。也可用于多语言转换）

### 例子

```text
let str1 = '\u{41}\u{42}\u{43}' // ABC
let str2 = '\u{1F680}' // 🚀
```

### 实现一个简易的 vue 模板引擎

```text
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

```text
tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
// tag函数
function tag(stringArr, ...values){
  // ...
}
```

### 标签模板用途一：过滤 HTML 字符串

### 标签模板用途二：多语言转换

## 4 字符串的新增方法

### 4.1 String.fromCodePoint\(\)

ES5 提供了 str.charCodeAt\(0\)将字符转为 unicode 码，提供 String.fromCharCode\(\)（接收 16 进制整数）将 16 进制 unicode 码转为字符串，缺点是 String.fromCharCode\(\)不能识别 4 位以上的 unicode 码。ES6 使用 String.fromCodePoint\(\)将任意位 16 进制整数转为字符串

```text
String.fromCodePoint(0x78, 0x1f680, 0x79) // x🚀y
```

### 4.2 str.codePointAt\(\)

JavaScript 内部，字符以 UTF-16 的格式储存，每个字符固定为 2 个字节。对于那些需要 4 个字节储存的字符（Unicode 码点大于 0xFFFF 的字符），JavaScript 会认为它们是两个字符。对于 unicode 码超出 4 位的，str.charCodeAt\(\)不能正确处理。 str.codePointAt\(\)返回的是 32 位的 UTF-16 字符的码点，不正正确处理 4 位及 4 位一下的码点。

处理 unicode 编码的字符串最好的做法是调用遍历器接口，for...of、扩展运算符等

```text
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

### 4.3 String.raw\(\)

对\反转义，即将\变成 \，多用于模板字符串的处理方法

```text
String.raw`Hi\n${2+3}!`; // 返回 "Hi\\n5!"
```

#### 直接调用 String.raw\(\)

#### es5 对照写法

```text
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

### 4.4 str.normalize\(\)

### 4.5 str.includes\(\)

判断是否存在子字符串，返回布尔值，第二个参数接收一个整数表示开始搜索的位置

```text
'abc'.includes('ab') // true
'abc'.includes('d') // false
```

### 4.6 str.startsWith\(\)

判断是否以子字符串开头，返回布尔值，第二个参数接收一个整数表示开始搜索的位置

```text
'abc'.startsWith('ab') // true
'abc'.startsWith('c') // false
'abc'.startsWith('c',2) // true
```

### 4.7 str.endsWith\(\)

判断是否以子字符串开头，返回布尔值，第二个参数接收一个整数表示结束搜索的位置

```text
'abc'.endsWith('ab') // false
'abc'.endsWith('c') // true
'abc'.endsWith('ab',2) // true
```

### 4.8 str.repeat\(\)

接收一个整数，将原字符串重复 n 次，返回一个新字符串

```text
'abc'.repeat(0) // 空字符串
'abc'.repeat(3) // abcabcabc
```

### 4.9 str.padStart\(\)

补全字符串，在字符串开头位置补充字符串，常用于给数值补全指定位数

```text
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'
```

### 4.10 str.padEnd\(\)

补全字符串，在字符串开头位置补充字符串

```text
'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
```

### 4.11 str.trimStart\(\)

清空字符串开头空格，同 str.trimLeft\(\)

### 4.12 str.trimEnd\(\)

清空字符串结尾空格，同 str.trimRight\(\)

### 4.13 str.matchAll\(\)

返回一个正则表达式在当前字符串的所有匹配

```text

```

## 5 正则的扩展

### 5.1 构造函数的扩展

```text
// ES5中创建正则对象的方法
var regexp1 = /abc/ig
var regexp2 = new RegExp(/abc/ig)
var regexp3 = new RegExp('abc','ig')

// ES6扩展了正则的构造函数，第一个参数为正则对象时，可以接受第二个参数作为修饰符并覆盖原修饰符
let regexp4 = new RegExp(/abc/ig,'i')
```

### 5.2 字符串的正则方法移植到正则对象的原型上

字符串对象共有 4 个正则方法，分别是 match\(\)、replace\(\)、search\(\)和 split\(\)。

```text
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

ES6 将这 4 个方法写在 RegExp 的原型对象上，从而做到所有与正则相关的方法，全都定义在 RegExp 对象上。

1. String.prototype.match 调用 RegExp.prototype\[Symbol.match\]

```text
str.match(reg) // [ 'abc', 'abc' ]
reg[Symbol.match](str) // [ 'abc', 'abc' ]
```

1. String.prototype.replace 调用 RegExp.prototype\[Symbol.replace\]

```text
str.search(reg) // 0
reg[Symbol.search](str) // 0
```

1. String.prototype.search 调用 RegExp.prototype\[Symbol.search\]

```text
str.replace(reg,'-') // -d-d
reg[Symbol.replace](str,'-') // -d-d
```

1. String.prototype.split 调用 RegExp.prototype\[Symbol.split\]

```text
str.split(reg) // [ '', 'd', 'd' ]
reg[Symbol.split](str) // [ '', 'd', 'd' ]
```

### 5.3 新增修饰符 u

u 修饰符，含义为“Unicode 模式”，用来正确处理大于\uFFFF 的 Unicode 字符。也就是说，会正确处理四个字节的 UTF-16 编码。

```text
/^\uD83D/u.test('\uD83D\uDC2A') // ES6中增加修饰符u，可以识别为false
/^\uD83D/.test('\uD83D\uDC2A') // ES5中识别为true
```

增加了修饰符 u 的其他改变：

1. 点字符识别码点大于 0xFFFF 的 unicode 编码时，会认为是两个字符，匹配两次.，增加 u 修饰符后对于码点大于 0xFFFF 的 unicode 编码会识别为一个字符，匹配一次.
2. /\u{61}/中的\u 后面的大括号不会被识别为量词符
3. 码点大于 0xFFFF 的 Unicode 字符可以被量词符正确识别

```text
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```

1. 码点大于 0xFFFF 的 Unicode 字符可以被预定义模式正确识别

```text
/^\S$/.test('𠮷') // false
/^\S$/u.test('𠮷') // true
```

1. 正则书写不规范的时候会抛出错误

```text
/\,/ // /\,/
/\,/u // 报错
```

1. 总结：匹配的字符串中可能存在码点超出 0xFFFF 的 unicode 字符都需要考虑使用修饰符 u

### 5.4 增加实例属性 unicode

增加实例属性 unicode 用于判断一个正则对象是否具有修饰符 u

```text
/abc/u.unicode // true
/abc/.unicode //false
```

### 5.5 新增修饰符 y

ES6 还为正则表达式添加了 y 修饰符，叫做“粘连”（sticky）修饰符。

ES5 中有一个修饰符 g 表示全局匹配，后一次匹配都从上一次匹配成功的下一个位置开始。 y 修饰符与 g 修饰符类似。不同之处在于，g 修饰符只要剩余位置中存在匹配字符则返回匹配数组，而 y 修饰符必须从剩余的第一个位置存在匹配字符才能返回匹配数。

```text
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

1. 可以感觉出，y 修饰符号隐含了头部匹配的标志^。
2. 修饰符 y 多与修饰符 g 联用，单独使用修饰符 y 不会匹配全局（惰性匹配）

```text
'a1a2a3'.match(/a\d/y) // ["a1"]
'a1a2a3'.match(/a\d/gy) // ["a1", "a2", "a3"]
```

#### 5.5.2 使用场景

修饰符 y 过滤性会比修饰符 g 更强，可以用于防止用户输入非法字符

下面的正则用于匹配数字或加号，匹配到其他字符时直接中断匹配

```text
const Y = /\s*(\+|[0-9]+)\s*/yg;
const G  = /\s*(\+|[0-9]+)\s*/g;

'3x + 4'.match(Y) // [ '3' ]
// 存在非法字符x，但修饰符g还是会继续匹配
'3x + 4'.match(G) // [ '3', ' + ', '4' ]
```

### 5.6 新增实例属性 sticky

新增实例属性 sticky 用于判断正则对象的修饰符 y 是否存在

```text
/abc/y.sticky // true
/abc/.sticky // false
```

### 5.7 新增实例属性 flags

新增实例属性 flags，用于返回正则表达式的修饰符。

```text
// source属性返回正则对象的正文
/abc/ig.source // 'abc'

// flags属性返回正则对象的修饰符
/abc/ig.flags // 'gi'
```

### 5.8 新增修饰符 s

ES5 中的（.）有两类字符不能正确匹配，第一类不能匹配码点超出 0xFFFF 的 unicode 字符，第二类不能匹配行终止符（行终止符，就是该字符表示一行的终结），下面四个都是行终止符

* U+000A 换行符（\n）
* U+000D 回车符（\r）
* U+2028 行分隔符（line separator）
* U+2029 段分隔符（paragraph separator）

新增修饰符 s 可以使（.）匹配任意字符

```text
/foo.bar/.test('foo\nbar') //false
/foo.bar/s.test('foo\nbar') //true
```

修饰符 s 也叫 dotAll 模式，即点（dot）代表一切字符

### 5.9 新增实例属性 dotAll

新增实例属性 dotAll 用于判断正则对象是否存在修饰符 s

```text
/abc/s.dotAll // true
/abc/.dotAll // false
```

### 5.10 后行断言

ES5 的正则只支持先行断言和先行否定断言,不支持后行断言和后行否定断言，ES2018 引入后行断言

#### 5.10.1 先行断言和先行否定断言

* 先行断言（x\(?=y\)）是指只有 x 在 y 前面时，才匹配 x
* 先行否定断言（x\(?!y\)）是指只有 x 不在 y 前面时，才匹配 x

```text
// 匹配数字后面带有%的所有数字
/\d+(?=%)/.exec('100% of US presidents have been male')  // ["100"]
// 匹配数字后面不带有%的所有数字
/\d+(?!%)/.exec('that’s all 44 of them') ["44"]
```

#### 5.10.2 ES2018 增加的后行断言

后行断言与现行断言正好相反

* 后行断言（\(?&lt;=y\)x）是指只有 x 在 y 后面时，才匹配 x
* 先行否定断言（\(?&lt;!y\)x）是指只有 x 不在 y 后面时，才匹配 x

```text
// 匹配数字前面带有$的所有数字
/(?<=\$)\d+/.exec('Benjamin Franklin is on the $100 bill')  // ["100"]
// 匹配数字前面不带有$的所有数字
/\d+(?!%)/.exec('that’s all 44 of them') // ["90"]
```

#### 5.10.3 后行断言注意事项

“后行断言”的实现，需要先匹配/\(?&lt;=y\)x/的 x，然后再回到左边，匹配 y 的部分。这种“先右后左”的执行顺序，与所有其他正则操作相反，导致了一些不符合预期的行为。

* 后行断言的组匹配，与正常情况下结果是不一样的
* 后行断言的反斜杠引用，也与通常的顺序相反

### 5.11 Unicode 属性类

ES2018 引入了一种新的类的写法\p{...}和\P{...}，允许正则表达式匹配符合 Unicode 某种属性的所有字符。

## 6 数值的扩展

### 6.1 二进制和八进制表示法

ES5 中的数值可以使用 0x 开头表示 16 进制数，ES6 提供了二进制和八进制数值的新的写法，分别用前缀 0b（或 0B）和 0o（或 0O）表示（ES5 非严格模式中还可以用 0 开头表示八进制）。

```text
// 二进制10转10进制为2
0b10 // 2
// 八进制10转10进制为8
0o10 //8
```

### 6.2 新增静态方法 Number.isFinite\(\)和 Number.isNaN\(\)

ES6 在 Number 对象上，新提供了 Number.isFinite\(\)和 Number.isNaN\(\)两个方法。

```text
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

ES5 中存在两个全局方法，分别是 isFinite\(\)用于判断参数是否是有限的，另一个是 isNaN\(\)用于判断参数是否是 NaN，但他会先调用 Number\(\)将参数转为数值再判断，而 Number.isFinite\(\)、Number.isNaN\(\)不会，参数不是数值直接返回 false。

```text
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

### 6.3 新增静态方法 Number.parseInt\(\)和 Number.parseFloat\(\)

ES6 将全局方法 parseInt\(\)和 parseFloat\(\)，移植到 Number 对象上面，行为完全保持不变。

```text
// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
```

这样做的目的，是逐步减少全局性方法，使得语言逐步模块化。

### 6.4 新增静态方法 Number.isInteger\(\)

Number.isInteger\(\)用来判断一个数值是否为整数。

```text
Number.isInteger(25) // true
Number.isInteger(25.1) // false
```

JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。

```text
Number.isInteger(25) // true
Number.isInteger(25.0) // true
```

如果参数不是数值，Number.isInteger 返回 false。

### 6.5 JavaScript 中对数值的存储

JavaScript 采用 IEEE 754 标准，数值存储为 64 位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）。如果数值的精度超过这个限度，第 54 位及后面的位就会被丢弃，这种情况下，Number.isInteger 可能会误判。

### 6.6 Number.EPSILON

ES6 在 Number 对象上面，新增一个极小的常量 Number.EPSILON。根据规格，它表示 1 与大于 1 的最小浮点数之间的差。Number.EPSILON 实际上是 JavaScript 能够表示的最小精度。

```text
Number.EPSILON === Math.pow(2, -52) // true
```

练习：写出 0.1 与 0.2 的二进制表达式

### 6.7 安全整数范围和 Number.isSafeInteger\(\)

JavaScript 能够准确表示的整数范围在-2^53 到 2^53 之间（不含两个端点），超过这个范围，无法精确表示这个值。

ES6 引入了 Number.MAX\_SAFE\_INTEGER 和 Number.MIN\_SAFE\_INTEGER 这两个常量，用来表示这个范围的上下限。

```text
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1 // true
Number.MIN_SAFE_INTEGER === -Math.pow(2, 53) + 1 // true
```

Number.isSafeInteger\(\)则是用来判断一个整数是否落在这个范围之内。不是整数或超出范围都返回 false

```text
Number.isSafeInteger(Math.pow(2, 53) - 1) // true
Number.isSafeInteger(Math.pow(2, 53)) // false
```

### 6.8 Math 对象的扩展

ES6 在 Math 对象上新增了 17 个与数学相关的方法。所有这些方法都是静态方法，只能在 Math 对象上调用。

#### 6.8.1 Math.trunc\(\)

Math.trunc 方法用于去除一个数的小数部分，返回整数部分。（会先对参数使用 Number\(\)转换）

```text
Math.trunc('123.456') // 123
```

#### 6.8.2 Math.sign\(\)

Math.sign 方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值（Number\(\)）。 它会返回五种值。

* 参数为正数，返回+1；
* 参数为负数，返回-1；
* 参数为 0，返回 0；
* 参数为-0，返回-0;
* 其他值，返回 NaN。

```text
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
```

#### 6.8.3 Math.cbrt\(\)

Math.cbrt 方法用于计算一个数的立方根。会先将其转换为数值（Number\(\)）。

```text
Math.cbrt(-1) // -1
Math.cbrt(0)  // 0
Math.cbrt(1)  // 1
Math.cbrt(2)  // 1.2599210498948734
```

#### 6.8.4 Math.clz32\(\)

Math.clz32\(\)方法将参数转为 32 位无符号整数的形式，然后返回这个 32 位值里面有多少个前导 0。

左移运算符（&lt;&lt;）与 Math.clz32 方法直接相关。

```text
Math.clz32(0) // 32
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(1 << 1) // 30
Math.clz32(1 << 2) // 29
```

#### 6.8.5 Math.imul\(\)

Math.imul 方法返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。

多数情况下和 a\*b 一样的，多用于超出精度的大数计算

#### 6.8.5 Math.fround\(\)

Math.fround 方法返回一个数的 32 位单精度浮点数形式。

#### 6.8.6 Math.hypot\(\)

Math.hypot 方法返回所有参数的平方和的平方根。会先将其转换为数值（Number\(\)）。

```text
Math.hypot(3, 4);        // 5
Math.hypot(3, 4, 5);     // 7.0710678118654755
```

#### 6.8.7 Math.expm1\(\)

Math.expm1\(x\)返回 ex - 1，即 Math.exp\(x\) - 1。

#### 6.8.8 Math.log1p\(\)

Math.log1p\(x\)方法返回 1 + x 的自然对数，即 Math.log\(1 + x\)。如果 x 小于-1，返回 NaN。

#### 6.8.9 Math.log10\(\)

Math.log10\(x\)返回以 10 为底的 x 的对数。如果 x 小于 0，则返回 NaN。

#### 6.8.10 Math.log2\(\)

Math.log10\(x\)返回以 10 为底的 x 的对数。如果 x 小于 0，则返回 NaN。

#### 6.8.11 双曲线函数

* Math.sinh\(x\) 返回 x 的双曲正弦（hyperbolic sine）
* Math.cosh\(x\) 返回 x 的双曲余弦（hyperbolic cosine）
* Math.tanh\(x\) 返回 x 的双曲正切（hyperbolic tangent）
* Math.asinh\(x\) 返回 x 的反双曲正弦（inverse hyperbolic sine）
* Math.acosh\(x\) 返回 x 的反双曲余弦（inverse hyperbolic cosine）
* Math.atanh\(x\) 返回 x 的反双曲正切（inverse hyperbolic tangent）

### 6.9 指数运算符

ES2016 新增了一个指数运算符（\*\*）。

```text
Math.pow(2,10) // 1024
2**10 //1024

2**10**2 // 等价于2^(10^2)
```

## 7 函数的扩展

### 7.1 函数参数的默认值

```text
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

ES5 函数默认值的缺点：参数赋值了，但是对应的布尔值为 false，则该赋值不起作用，会采用默认值。

```text
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
* ES5 中函数的 length 属性表示函数期望接收的参数个数，ES6 使用参数默认值后，length 属性是函数参数的个数减去设置了默认值的参数的个数，本质也是表示函数期望接收的参数个数。
* \(重要！！\)一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。

```text
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

### 7.2 rest 参数

ES6 引入 rest 参数（形式为...变量名），用于获取函数的多余参数，这样就不需要使用 arguments 对象了。

注意：不是引入了一个叫 rest 的参数，rest 参数是一种表现形式！！

```text
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

* rest 参数必须是最后一个参数，否则会报错
* 函数的 length 属性不会包括 rest 参数

### 7.3 严格模式

```text
// ES5可以显示定义严格模式的函数
function doSomething(a, b) {
  'use strict';
}
```

ES2016 做了一点修改，规定只要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

```text
// js解释引擎会先解释参数，然后再进入函数体中，此时解析到使用严格模式，与参数部分冲突，于是报错
function doSomething(value = 070) {
  'use strict';
  return value;
}
```

可以通过定义全局严格模式避免这种情况

### 7.4 name 属性

新增函数的 name 属性，返回该函数的函数名。

```text
function foo() {}
foo.name // "foo"
```

匿名函数 ES5 中 name 发回空字符串，ES6 返回变量名

```text
var f = function () {};
// ES5
f.name // ""
// ES6
f.name // "f"
```

具名函数 ES5 与 ES6 都返回具名函数原本的名字

```text
const bar = function baz() {};
// ES5
bar.name // "baz"
// ES6
bar.name // "baz"
```

Function 构造函数返回的函数实例，name 属性的值为 anonymous。

```text
(new Function).name // "anonymous"
```

bind 返回的函数，name 属性值会加上 bound 前缀。

```text
function foo() {};
foo.bind({}).name // "bound foo"

(function(){}).bind({}).name // "bound "
```

### 7.5 箭头函数

#### 7.5.1 特点

1. 箭头函数是匿名函数，不能作为构造函数，不能使用 new。

```text
var B = () => {
  value:1;
}
var b = new B();  //-->TypeError: B is not a constructor
```

1. 箭头函数不绑定 arguments，取而代之用 rest 参数解决。

```text
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

1. 箭头函数不绑定 this，会捕获其所在的上下文的 this 值，作为自己的 this 值。

```text
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

1. 箭头函数通过 call\(\) 或 apply\(\) 方法调用一个函数时，只传入了一个参数，对 this 并没有影响。

```text
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

1. 箭头函数没有原型对象。

```text
var a = () => {
  return 1;
}
function b() {
  return 2;
}
console.log(a.prototype);  //-->undefined
console.log(b.prototype);  //-->object{...}
```

1. 箭头函数不能当做 Generator 函数,不能使用 yield 关键字。箭头函数不能换行。

```text
var a = ()
          => 1;  //-->SyntaxError: Unexpected token =>
```

1. 由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。

```text
// 报错
let getTempItem = id => { id: id, name: "Temp" };

// 不报错
let getTempItem = id => ({ id: id, name: "Temp" });
```

1. 箭头函数可以与解构赋值联用

#### 7.5.2 ES5 对照写法

```text
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

```text
function f(x){
  return g(x);
}
```

不属于尾调用的：

```text
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

```text
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

//目前只有 safari 浏览器会自动执行尾调用优化

#### 7.6.1 尾递归

递归函数在最后一步调用自己即为尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。

```text
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

注意事项：纯函数式编程语言中没有循环语句，使用使用梯柜必须使用尾递归，但 js 中可以使用 for 循环代替递归，能 for 循环就不要使用递归，避免栈溢出。

尾递归优化只在严格模式下开启，因为尾递归优化会影响 func.arguments 和 func.caller

#### 7.6.2 尾递归优化的实现

### 7.7 Function.prototype.toString\(\)

ES2019 对函数实例的 toString\(\)方法做出了修改。toString\(\)方法返回函数代码本身，以前会省略注释和空格。

### 7.8 catch 命令的参数省略

ES5 前规定 catch 语句必须带括号，否则会报错，ES2019 中允许了 catch 语句省略参数

```text
try {
  // ...
} catch {
  // ...
}
```

## 8 数组的扩展

### 8.1 扩展运算符

扩展运算符（spread）是三个点（...）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

扩展运算符的原理是调用遍历器接口\(Symbol.iterator\)，部署了遍历器接口的数据结构都可以使用扩展运算符

```text
// 扩展运算符后面还可以放置表达式。
const arr = [
  ...(x > 0 ? ['a'] : []),
  'b',
];
```

#### 8.1.1 扩展运算符的用途

```text
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

### 8.2 Array.from\(\)

接收一个部署了遍历器接口的数据结构或类数组对象，返回数组

```text
Array.from('hello') // ['h', 'e', 'l', 'l', 'o']
```

同时可以接收第二个参数，用于对每个元素进行处理（类似 map 方法）

```text
Array.from([1, 2, 3], (x) => x * x) // [1, 4, 9]
```

第三个参数可以传入 this，控制第二个参数的行为

### 8.3 Array.of\(\)

这个方法的主要目的，是弥补数组构造函数 Array\(\)的不足。因为参数个数的不同，会导致 Array\(\)的行为有差异。

```text
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```

Array.of 基本上可以用来替代 Array\(\)或 new Array\(\)，并且不存在由于参数不同而导致的重载。它的行为非常统一。

```text
Array.of() // []
Array.of(undefined) // [undefined]
Array.of(1) // [1]
Array.of(1, 2) // [1, 2]
```

### 8.4 实例方法 arr.copyWithin\(\)

copyWithin 用于将指定位置的成员复制到其他位置，然后返回当前数组。

* 参数一 target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
* 参数二 start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
* 参数三 end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

将 start 到 end 之间的参数复制出来，放到 target 开始的位置

```text
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4) // [4, 5, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1) // [4, 5, 3, 4, 5]
```

### 8.5 实例方法 arr.find\(\)

find 方法接收一个函数，返回第一个返回值为 true 的成员。可选的第二个参数可用来绑定 this 对象

```text
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10
// 找不到返回undefined
```

### 8.6 实例方法 arr.findIndex\(\)

findIndex 方法接收一个函数，返回第一个返回值为 true 的成员的下标。可选的第二个参数可用来绑定 this 对象

```text
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) //2
// 找不到返回-1
```

### 8.7 实例方法 arr.fill\(\)

用于填充数组，第一个参数为填充的值，第二个参数和第三个参数表示开始填充和结束填充的位置

```text
['a', 'b', 'c'].fill(7) // [7, 7, 7] 已存在的值会被覆盖

['a', 'b', 'c'].fill(7, 1, 2) // ['a', 7, 'c']
```

### 8.8 实例方法 entries\(\)，keys\(\) 和 values\(\)

entries\(\)，keys\(\)和 values\(\)——用于遍历数组。它们都返回一个遍历器对象

```text
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

### 8.9 实例方法 arr.includes\(\)

Array.prototype.includes 方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的 includes 方法类似。第二个参数表示开始搜索的位置

```text
[1, 2, 3].includes(4)     // false
[1, 2, 3].includes(2，2)     // false
```

ES5 使用 indexOf 来判断元素是否存在，但 indexOf 存在两个问题

* 不够语义化
* 使用===来判断元素是否存在，部分值如 NaN 会判断错误

```text
[1, 2, NaN].includes(NaN) // true
```

### 8.10 实例方法 arr.flat\(\)

flat 用于拍平数组，可接受一个参数表示需要拍平的层数，默认为 1，完全拍平可以传入 Infinity

```text
[1, 2, [3, [4, 5]]].flat()    // [1, 2, 3, [4, 5]]

[1, 2, [3, [4, 5]]].flat(2)   // [1, 2, 3, 4, 5]
```

### 8.11 实例方法 arr.flatMap\(\)

可以看做先对数组执行 map，再对 map 返回的数组执行 flat。同样可以接收第二个参数用于设置 this

```text
[2, 3, 4].flatMap((x) => [x, x * 2])
// 第一步map完得到 [[2, 4], [3, 6], [4, 8]]
// 第二部执行flat得到 [2, 4, 3, 6, 4, 8]
```

### 8.12 数组空位

使用 Array 创建的空数组存在空位，如\[,,\]，空位的值并不等于 undefined

数组 API 对空位的处理行为很不一致，所以要尽量避免数组出现空位。可以使用 Array.Of\(\)来创建并赋初值给数组。

## 9 对象的扩展

### 9.1 属性的简洁表示法

```text
// 属性简写
const foo = 'bar';
// ES5写法
var baz = {foo: foo};

// ES6写法 属性名值相同的时候可以简化
const baz = {foo};
```

```text
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

### 9.2 属性名表达式\(动态属性\)

```text
// ES5中，对象字面量表达式不允许使用动态属性
// ES6中可以使用
let propKey = 'foo';
const obj = {
};
```

注意：动态属性是可以使用表达式的

```text
const obj = {
  ['Hello' + 'world']: 'Hello World!'
}
```

### 9.3 方法的 name 属性

对象的方法的 name 属性同函数的 name 属性

### 9.4 属性的可枚举性和遍历

#### 9.4.1 可枚举性

对象的每个属性都有一个描述对象（Descriptor），用来控制该属性的行为。Object.getOwnPropertyDescriptor 方法可以获取该属性的描述对象。

```text
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true, // 是否可写入
//    enumerable: true, // 是否可枚举
//    configurable: true  // 是否可配置
//  }
```

下面四种操作会忽略 enumerable 为 false 的属性

* for...in 循环：只遍历对象自身的和继承的可枚举的属性。
* Object.keys\(\)：返回对象自身的所有可枚举的属性的键名。
* JSON.stringify\(\)：只串行化对象自身的可枚举的属性。
* Object.assign\(\)： 忽略 enumerable 为 false 的属性，只拷贝对象自身的可枚举的属性。
* 同时 ES6 规定 class 定义的所有原型方法都是不可枚举的

通过设置可枚举性可以使一些内部属性不会被遍历到

#### 9.4.2 属性的遍历

1. for...in 循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）
2. Object.keys 返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名
3. Object.getOwnPropertyNames 返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
4. Object.getOwnPropertySymbols 返回一个数组，包含对象自身的所有 Symbol 属性的键名
5. Reflect.ownKeys 返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举

遍历属性的规则：

1. 首先遍历所有数值键，按照数值升序排列。
2. 其次遍历所有字符串键，按照加入时间升序排列。
3. 最后遍历所有 Symbol 键，按照加入时间升序排列。

```text
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })  // ['2', '10', 'b', 'a', Symbol()]
```

### 9.5 super 关键字

我们知道，this 关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字 super，指向当前对象的原型对象。

super 只能在对象的方法中使用

```text
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

JavaScript 引擎内部，super.foo 等同于 Object.getPrototypeOf\(this\).foo（属性）或 Object.getPrototypeOf\(this\).foo.call\(this\)（方法）。

### 9.6 对象的扩展运算符

#### 9.6.1 作用于解构赋值中

对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有可遍历的（enumerable）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。

```text
// x y已被读取，剩下 a b可被遍历
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
z // { a: 3, b: 4 }
```

注意：解构赋值的拷贝是浅拷贝

扩展运算符的解构赋值，不能复制继承自原型对象的属性。

```text
let o1 = { a: 1 };
let o2 = { b: 2 };
o2.__proto__ = o1;
let { ...o3 } = o2;
o3 // { b: 2 }
o3.a // undefined
```

用途：拓展一个函数的作用

```text
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

```text
let z = { a: 3, b: 4 };
let n = { ...z };   // { a: 3, b: 4 }

let foo = { ...['a', 'b', 'c'] };   // {0: "a", 1: "b", 2: "c"}
```

原理：对象的扩展运算符等同于使用 Object.assign\(\)方法。

```text
let aClone = { ...a };
// 等同于
let aClone = Object.assign({}, a);
```

用途：合并两个对象

```text
let ab = { ...a, ...b };

// 同时也等同于
let ab = Object.assign({}, a, b);
```

## 10 对象的新增方法

### 10.1 Object.is\(\)

ES5 中比较两个值是否相同使用===，但===存在两个问题

1. NaN 不等于 NaN
2. +0 等于-0

ES6 提出“Same-value equality”（同值相等）算法，用来解决这个问题。Object.is 就是部署这个算法的新方法。它用来比较两个值是否严格相等。除了 NaN 等于 NaN,+0 不等于-0 之外，其他都与===保持一致。

```text
Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

### 10.2 Object.assign\(\)

Object.assign 方法用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）

Object.assign 方法的第一个参数是目标对象，后面的参数都是源对象。如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

注意事项：

1. 只有一个参数的时候会将该参数直接返回，不会创建新的对象
2. 如果参数不是对象，则先转为对象再返回
3. 由于 undefined 和 null 无法转成对象，所以如果它们作为第一个参数，就会报错。

```text
Object.assign(undefined) // 报错
Object.assign(null) // 报错
```

1. 如果 undefined 和 null 作为源对象，则会被跳过
2. 拷贝字符串的时候要注意（字符串是类数组对象），字符串转对象会将下标作为 key，值作为 value
3. Object.assign 方法实行的是浅拷贝
4. 对于取值函数的处理，Object.assign 并不能正确的复制取值函数

```text
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

```text
const obj ={}
Object.assign(obj,{
  x: 1,
  y: 2
})
```

1. 为对象添加原型方法

```text
Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});
```

1. 克隆对象

```text
function clone(origin) {
  return Object.assign({}, origin);
}
```

1. 为属性指定默认值

   在目标对象中设置需要指定的默认值

```text
const obj ={}
Object.assign({
  a:1
},obj)
```

### 10.3 Object.getOwnPropertyDescriptors\(\)

ES5 的 Object.getOwnPropertyDescriptor\(\)方法会返回某个对象属性的描述对象。Object.getOwnPropertyDescriptors\(\)方法则是返回对象所有属性的描述对象

实现原理:

```text
function getOwnPropertyDescriptors(obj) {
  const result = {};
  for (let key of Reflect.ownKeys(obj)) {
    result[key] = Object.getOwnPropertyDescriptor(obj, key);
  }
  return result;
}
```

该方法的引入目的，主要是为了解决 Object.assign\(\)无法正确拷贝 get 属性和 set 属性的问题。通过 Object.getOwnPropertyDescriptors\(\)方法配合 Object.defineProperties\(\)方法，就可以实现正确拷贝。

```text
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

1. 配合 Object.defineProperties\(\)方法，就可以实现正确拷贝
2. 配合 Object.create\(\)方法，将对象属性克隆到一个新对象。这属于浅拷贝。
3. 实现一个对象继承另一个对象
4. 实现 mixin

### 10.4 针对原型的操作：**proto**属性，Object.setPrototypeOf\(\)，Object.getPrototypeOf\(\)，Object.create\(\)

尽量不要使用**prote**属性，使用以下三个方法代替

1. Object.getPrototypeOf\(\) // 写操作
2. Object.setPrototypeOf\(\) // 读操作
3. Object.create\(\) // 生成操作

#### 10.4.1 Object.setPrototypeOf\(\)

```text
// 用于设置对象的原型对象，返回这个对象本身
Object.setPrototypeOf(object, prototype)
```

#### 10.4.2 Object.getPrototypeOf\(\)

```text
// 读取对象的原型对象
Object.getPrototypeOf(obj);
```

#### 10.4.3 Object.create\(\)

```text
// 传入一个对象，创建一个继承自该对象的对象
const proto = {
  x: 1,
  y:1
}
const obj = Object.create(proto)
obj.x // 1
```

### 10.5 Object.keys\(\)，Object.values\(\)，Object.entries\(\)

ES5 中存在 Object.keys\(\)用于获得键组成的数组，ES6 中增加了同类型方法

```text
const obj ={
  x: 1,
  y: 2
}
const { keys, values, entries } = Object
Object.keys(obj) // [ 'x', 'y' ] 获得键组成的数组
console.log(values(obj)) // [ 1, 2 ] 获得值组成的数组
console.log(entries(obj)) // [ [ 'x', 1 ], [ 'y', 2 ] ] 获得键值对组成的数组
```

### 10.6 Object.fromEntries\(\)

Object.fromEntries\(\)方法是 Object.entries\(\)的逆操作，用于将一个键值对数组转为对象。

```text
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }
```

该方法的主要目的，是将键值对的数据结构还原为对象，因此特别适合将 Map 结构转为对象。

## 11 Symbol

Symbol 用于作为对象的属性名，达到对象属性名永远不重复的效果。

创建 Symbol，可以接收一个字符串参数（不是字符串的参数会被强转为字符串），这个参数是该 Symbol 的描述，主要用于打印出来的时候好识别

两个 Symbol 永不相等，每一个 Symbol 都是独一无二的

```text
const symbol1 = Symbol('hello')
const symbol2 = Symbol('hello')
symbol1 === symbol2 // false
```

类型转换：

```text
// Symbol可以转换为字符串或布尔，不能转换为其他类型
const symbol = Symbol('hello')
symbol.toString()   // Symbol(hello)
(!!symbol           // true
```

设置为对象的属性时要使用动态属性

```text
// 设置为对象的属性名，必须要使用动态属性的写法
const symbol = Symbol()
obj[symbol] = 'Hello World!'

// 以下写法是错误的，此时的symbol是一个字符串属性
obj.symbol = 'Hello'
```

特点：

1. 每个 Symbol 都是独一无二的，所以任意两 Symbol 都不等
2. Symbol 值不能参数运算，否则会报错
3. Symbol 值只能转为字符串或布尔值
4. Symbol 使用的时候必须用动态属性

### 11.1 实例属性 description

实例属性 description 可以直接获得 Symbol 的描述符 ES10 新增的，v10 版 node 还未实现该方法

```text
const symbol = Symbol('hello')
symbol.description // hello
```

### 11.2 用途

1. 作为对象的属性名，防止属性名重复
2. 设置为常量的值，保证常量不会重复

### 11.3 遍历对象 Symbol 属性 Object.getOwnPropertySymbols

Symbol 作为属性名时，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys\(\)、Object.getOwnPropertyNames\(\)、JSON.stringify\(\)返回。

Object.getOwnPropertySymbols 方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。

```text
const obj = {
  [Symbol('hello')]: 'Hello World!'
}
const symbolArr = Object.getOwnPropertySymbols(obj)  // [ Symbol(hello) ]
obj[symbolArr[0]] //  Hello World!
```

### 11.4 静态方法 Symbol.for\(\)、Symbol.keyFor\(\)

有时候，我们也希望得到同一个 Symbol 的值，这时可以通过 Symbol.for\(\)做到

```text
// 全局环境中存在描述符为foo的Symbol值时，就直接将他返回，没有则先创建再返回
// Sybol.for()创建的Symbol会被登记在全局环境中，而Symbol()创建的不会
let s1 = Symbol('foo')
let s2 = Symbol.for('foo')
let s3 = Symbol.for('foo')
s1 === s2 // false
s2 === s3 // true
```

Symbol.keyFor\(\)用于返回全局环境中已登记的 Symbol 的描述 key

```text
// 描述符为foo的Symbol不存在，于是创建一个Symbol赋予s1，并登记在全局环境中
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"

// 描述符为foo的Symbol存在，于是将该描述符对应的symbol值s1返回
let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
// 所以s1存在全局中，s2不存在
```

### 11.5 使用 Symbol 实现单例模式\(Singleton\)

js 的一个文件就是一个模块，想要在引用一个模块的时候返回的实例永远相同就是单例模式

```text
// node.js中，不使用Symbol
// mod.js
function A() {
  this.foo = 'hello'
}

if (!global._foo) {
  global._foo = new A()
}

module.exports = global._foo
```

上述模式的缺点是 global.\_foo 是全局可写入的，不符合模块化的思想

```text
// 使用Symbol
// mod.js
const FOO_KEY = Symbol.for('foo')

function A() {
  this.foo = 'hello'
}

if (!global[FOO_KEY]) {
  global[FOO_KEY] = new A()
}

module.exports = global[FOO_KEY]
```

上述模式中，其他地方读取不了 global\[FOO\_KEY\]

### 11.6 内置的 Symbol 值

#### 11.6.1 Symbol.hasInstance

对象的 Symbol.hasInstance 属性，指向一个内部方法。当其他对象使用 instanceof 运算符，判断是否为该对象的实例时，会调用这个方法。比如，foo instanceof Foo 在语言内部，实际调用的是 Foo[Symbol.hasInstance](https://github.com/zhhOceanfly/2019Study/tree/65c0f527730fdae65a977bb6de65f27550ae9c11/book/《ES6标准入门》/foo/README.md)。

```text
[1, 2, 3] instanceof Array // true
Array[Symbol.hasInstance]([1, 2, 3]) // true
```

#### 11.6.2 Symbol.isConcatSpreadable

对象的 Symbol.isConcatSpreadable 属性等于一个布尔值，表示该对象用于 Array.prototype.concat\(\)时，是否可以展开。数组的\[Symbol.isConcatSpreadable\]值为 false 则不可展开，类数组对象的\[Symbol.isConcatSpreadable\]值为 true 则可展开，默认值都是 undefined

```text
// 数组 这里能不能展开是由concat的参数决定的，不是由调用concat的数组决定的
let arr1 = ['c', 'd'];
arr1[Symbol.isConcatSpreadable] // undefined
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']


let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']

// 类数组对象
let obj = {length: 2, 0: 'c', 1: 'd'};
obj[Symbol.isConcatSpreadable] // undefined
['a', 'b'].concat(obj, 'e') // ['a', 'b', obj, 'e']

obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e') // ['a', 'b', 'c', 'd', 'e']
```

#### 11.6.3 Symbol.species

#### 11.6.4 Symbol.match

对象的 Symbol.match 属性，指向一个函数。当执行 str.match\(myObject\)时，如果该属性存在，会调用它，返回该方法的返回值。

```text
str.match(regexp)
// 等同于
regexp[Symbol.match](str)
```

#### 11.6.5 Symbol.replace

#### 11.6.6 Symbol.search

#### 11.6.7 Symbol.split

#### 11.6.8 Symbol.iterator

#### 11.6.9 Symbol.toPrimitive

#### 11.6.10 Symbol.toStringTag

#### 11.6.11 Symbol.unscopables

## 12 Set和Map数据结构

### 12.1 Set

Set中的每个值都是唯一的，不能重复。set不同与array，set不能通过下标访问

Set和Map底层都是C++通过hash表实现的，Set是键值相同的hash表，所以值是唯一的

#### 12.1.1 构造函数

```text
// Set参数可以为空或是一个具有Iterable接口的数据结构，Set会遍历参数的Iterable接口提取出值
let set = new Set([1,2,3,4,4,4,4,'5'])
// 结合扩展运算符转数组
[...set1] // [1, 2, 3, 4, '5']
```

#### 12.1.2 用途

1. 数组去重

   ```text
   ([...new Set(array)]
   ```

2. 字符串去重

   ```text
   let str = 'abcabcabcd'
   [...new Set(str)].join('')
   ```

   set结构中判断两个变量是否相同使用的是Same-value-zero equality算法

#### 12.1.3 实例属性及方法

1. 返回成员总数 size
2. 添加元素 add\(\)
3. 删除元素 delete\(\)
4. 判断是否存在 has\(\)
5. 清空Set clear\(\)
6. 返回键名的遍历器 keys\(\)
7. 返回键值的遍历器 values\(\)
8. 返回键值对的遍历器 entries\(\)   其中键名与键值相同
9. 遍历每一个成员 forEach\(\) forEach的第二个参数是指定处理函数（第一个参数）内部的this对象（这在array的方法中也存在）

遍历操作中，Set的遍历顺序就是插入顺序

tips：扩展运算符内部使用的是for...of，故具备遍历器接口的数据结构都可以被展开

只要将set转为数组，就可以使用数组的众多方法

### 12.2 WeakSet

WeakSet 与Set类似，不同点是： 1. 成员只能是对象 2. WeakSet的对象成员是弱引用的 垃圾回收机制不考虑 WeakSet 对该对象的引用

用途不明

### 12.3 Map

Map （Hash结构） ，js对象本质上就是键名只能为字符串和Symbol的hash结构，而Map的是键名是任意类型的hash结构

#### 12.3.1 构造函数

Map的构造函数可以接收一个键值对的数组作为参数（或接收一个具有Iterable接口的数据结构且每个成员都是一个双元素的数组）

```text
let map1 = new Map([[1,2],[3,4]])
```

#### 12.3.2 实例属性及方法

1. 返回成员总数 size
2. 获得键值 get\(\)
3. 添加元素 set\(key, value\)
4. 删除元素 delete\(\)
5. 判断是否存在 has\(\)
6. 清空Set clear\(\)
7. 返回键名的遍历器 keys\(\)  // 遍历顺序为插入顺序
8. 返回键值的遍历器 values\(\)
9. 返回键值对的遍历器 entries\(\)
10. 遍历每一个成员 forEach\(\) forEach的第二个参数是指定处理函数（第一个参数）内部的this对象

```text
// 结合扩展运算符
log([...map2.keys()])
log([...map2.values()])
log([...map2]) // 扩展运算符默认调用entries方法
```

### 12.4 WeakMap

## 13 proxy

### 13.1 概述

proxy用于修改某个操作的默认行为（即对编程语言进行编程），与 Object.definedProperty\(\) 有点类似 不同点： 1. Proxy可以直接监听对象而非属性 2. Proxy直接可以劫持整个对象,并返回一个新对象,不管是操作便利程度还是底层功能上都远强于Object.defineProperty。 3. Proxy可以直接监听数组的变化 4. Proxy有多达13种拦截方法,不限于apply、ownKeys、deleteProperty、has等等是Object.defineProperty不具备的。

### 13.2 特点

* handle为空对象时，代理对象直接指向原对象
* 代理对象是可以被继承的
* tips: 代理对象可以设置在target的proxy属性上，通过target.proxy调用代理对象

### 13.3 用途

#### 13.3.1 实现数组的负数索引

```text
const arr = [1, 2, 3]
const handle = {
  get (target, propKey, receive) {
    const index = Number.parseInt(propKey)
    if (index < 0 && target.length + index) {
      propKey = (target.length + index).toString()
    } else if (index < 0){
      return undefined
    }
    Reflect.get(target, propKey, receive)
  }
}
```

#### 13.3.2 通过get set配合可以实现内部属性

```text
// 下划线开头的属性读写一律报错
const handle = {
  get (target, propKey, receive) {
    if (propKey.startsWith('_')) {
      throw new Error(`Invalid attempt to get private "${propKey}" property`)
    }
    return Reflect.get(target, propKey, receive)
  },
  set (target, propKey, value, receive) {
    if (propKey.startsWith('_')) {
      throw new Error(`Invalid attempt to set private "${propKey}" property`)
    }
    target[propKey] = value
    return true
  }
}
const proxy = new Proxy({_a: 1}, handle)
export default proxy
```

### 13.4 实例方法

#### 13.4.1 get\(target, propKey\[, receiver\]\) 第一个参数为目标对象，第二个参数为属性名，第三个参数为实际执行拦截函数的对象（一般是代理对象，特殊情况下不是代理对象）

```text
const target = {
  name: 'lilei'
}
const handle = {
  get(target, propKey, receiver) {
    if(propKey in target) {
      return target[propKey]
    } else {
      return '没有这个属性'
    }
  }
}
const proxy = new Proxy(target, handle)
console.log(proxy4.name) // 'lilei'
console.log(proxy4.dd)   // '没有这个属性'
```

#### 13.4.2 set\(target, propKey, value\[, receiver\]\)，严格模式下set必须要返回true，否则报错

```text
const handle = {
  set(target, propKey, value, receiver) {
    if(propKey === 'age') {
      if(typeof value === 'number') {
        target[propKey] = value
      } else {
        throw new Error('age is not a number')
      }
    } else {
      target[propKey] = value
    }
    return true
  }
}
const proxy = new Proxy({}, handle)
proxy.age = 123
```

#### 13.4.3 apply\(target, ctx, args\)，第一个参数为目标对象\(函数\)，第二个参数是目标对象的上下文对象，第三个参数为目标对象的参数数组

// apply拦截函数的调用、call、apply操作

```text
// 默认
const handle = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments)
  }
}

const sum = function(a, b) {
  return a+b
}
const handle = {
  apply(target, ctx, args) {
    return '求和函数被拦截'
  }
}
const proxy = new Proxy(sum, handle)

proxy(1, 2) // 求和函数被拦截
```

#### 13.4.4 has\(target, prop\)

```text
// 默认handler
const handler = {
  has (target, prop) {
    return prop in target
  }
}

// has可用于隐藏内部属性而不被in运算符发现
const handle = {
  has (target, prop) {
    if (prop.startsWith('_')) {
      return false
    }
    return prop in target
  }
}
const target = {_a:1}
const proxy = new Proxy(target, handle)
'_a' in proxy // false
```

// 如果原对象不可配置或者禁止扩展，这时has拦截会报错

#### 13.4.5 construct\(target, args, newTarget\) args:构造函数对参数对象 newTarget:创造实例对象时，new命令作用的构造函数\(即new Proxy得到的对象\)

```text
// 默认handler
const handler = {
  construct (target, args, newTarget) {
    return new target(...args) // 必须返回一个对象
  }
}
```

#### 13.4.6 deleteProperty\(target, key\) 拦截delete操作，和set一样必须返回true

```text
// 默认handler
const handler = {
  deleteProperty (target, key) {
    delete target[key]
    return true
  }
}
// 可用于阻止删除内部变量
```

#### 13.4.7 defineProperty\(target, key, description\) 拦截object.definedProperty\(\)

```text
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' // 不会生效
```

#### 13.4.8 getOwnPropertyDescriptor\(target, key\) 返回一个属性描述对象或者undefined 拦截Object.getOwnPropertyDescriptor\(\)

```text
// 获得私有属性的描述对象时拦截掉，返回undefined，其他情况正常返回
var handler = {
  getOwnPropertyDescriptor (target, key) {
    if (key[0] === '_') {
      return
    }
    return Object.getOwnPropertyDescriptor(target, key)
  }
};
var target = { _foo: 'bar', baz: 'tar' }
var proxy = new Proxy(target, handler)
Object.getOwnPropertyDescriptor(proxy, 'wat')
// undefined
Object.getOwnPropertyDescriptor(proxy, '_foo')
// undefined
Object.getOwnPropertyDescriptor(proxy, 'baz')
// { value: 'tar', writable: true, enumerable: true, configurable: true }
```

#### 13.4.9 getPrototypeOf\(target\) 拦截获取原型对象，如

* `Object.prototype.__proto__`
* `Object.prototype.isPrototypeOf()`
* `Object.getPrototypeOf()`
* `Reflect.getPrototypeOf()`
* `instanceof`

  // 必须返回对象或null，否则报错

  ```text
  var proto = {};
  var p = new Proxy({}, {
  getPrototypeOf(target) {
    return proto;
  }
  });
  Object.getPrototypeOf(p) === proto // true
  ```

#### 13.4.10 isExtensible\(target\) 拦截Object.isExtensible操作，只能返回布尔值

```text
var p = new Proxy({}, {
  isExtensible: function(target) {
    console.log("called");
    return true;
  }
});

Object.isExtensible(p)
// "called"
// true
```

#### 13.4.11 ownKeys\(target\) 拦截对象自身属性的读取操作,如:

* `Object.getOwnPropertyNames()`
* `Object.getOwnPropertySymbols()`
* `Object.keys()`
* `for...in循环`

  \`\`\`

  let target = {

  a: 1,

  b: 2,

  c: 3

  }

  let handler = {

  ownKeys\(target\) {

    return \['a'\]

  }

  }

  let proxy = new Proxy\(target, handler\)

Object.keys\(proxy\) // \[ 'a' \]

```text
#### 13.4.12 preventExtensions(target) 拦截Object.preventExtensions()，必须返回一个布尔值

#### 13.4.13 setPrototypeOf(target) 拦截Object.setPrototypeOf
```

var handler = { setPrototypeOf \(target, proto\) { throw new Error\('Changing the prototype is forbidden'\) } } var proto = {} var target = function \(\) {} var proxy = new Proxy\(target, handler\) Object.setPrototypeOf\(proxy, proto\) // Error: Changing the prototype is forbidden

```text
### 13.5 Proxy的静态方法 Proxy.revocable
可用于提供一次性的代理访问
```

const obj = { name: 'lilei', age: 14 } const handle = { get\(target, key\) { return target\[key\] } } const \[proxy, revock\] = Proxy.revocable\(obj, handle\) console.log\(proxy.age\) // 调用revock后会移除proxy实例 revock\(\) console.log\(proxy.name\) // 再次访问时会报错

```text
### 13.6 Proxy的应用

## 14 Reflect
Reflect是为了操作对象而提出的API，取代的操作有：
* 属于语言内部的方法，如Object.definedProperty
* 修改某些Object方法，使其返回值合理，如Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
* 将命令式的操作改为函数行为，如in delete等操作符
* Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。（使Proxy更加的简单）

### 14.1 Reflect.get(target, name[, receiver]) receiver: 可用于指定取值函数(getter)的this
Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined
// 第一个参数不是对象则报错

### 14.2 Reflect.set(target, name, value, receiver) receiver: 可用于指定赋值函数(setter)的this
Reflect.set方法设置target对象的name属性等于value
// 第一个参数不是对象则报错

### 14.3 Reflect.has(obj, name)
Reflect.has方法对应name in obj里面的in运算符
// 第一个参数不是对象则报错

### 14.4 Reflect.deleteProperty(obj, name)
Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性，返回一个布尔值，删除成功或删除的属性不存在则返回true，删除失败或删除的属性还存在则返回false
// 第一个参数不是对象则报错

### 14.5 Reflect.construct(target, args)
Reflect.construct方法等同于new target(...args)，这提供了一种不使用new，来调用构造函数的方法
// 第一个参数不是对象则报错

### 14.6 Reflect.getPrototypeOf(obj)
Reflect.getPrototypeOf方法用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)
// 第一个参数不是对象则报错。Object.getPrototypeOf(obj)中，参数不是对象则会转换为对象

### 14.7 Reflect.setPrototypeOf(obj, newProto)
Reflect.setPrototypeOf方法用于设置目标对象的原型（prototype），对应Object.setPrototypeOf(obj, newProto)方法。它返回一个布尔值，表示是否设置成功。
// 第一个参数不是对象则报错。Object.setPrototypeOf(obj, newProto)中，第一个参数不是对象则会返回第一个参数本身（第一个参数是undefined | null时直接报错，因为转换为对象的时候会报错）

### 14.8 Reflect.apply(func, thisArg, args)
Reflect.apply方法等同于Function.prototype.apply.call(func, thisArg, args)，用于绑定this对象后执行给定函数

一般来说，如果要绑定一个函数的this对象，可以这样写fn.apply(obj, args)，但是如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种操作。
```

const ages = \[11, 33, 12, 54, 18, 96\];

// 旧写法 const youngest = Math.min.apply\(Math, ages\); const oldest = Math.max.apply\(Math, ages\); const type = Object.prototype.toString.call\(youngest\);

// 新写法 const youngest = Reflect.apply\(Math.min, Math, ages\); const oldest = Reflect.apply\(Math.max, Math, ages\); const type = Reflect.apply\(Object.prototype.toString, youngest, \[\]\);

```text
### 14.9 Reflect.defineProperty(target, propertyKey, attributes)
Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它
```

function MyDate\(\) { /_…_/ } // 旧写法 Object.defineProperty\(MyDate, 'now', { value: \(\) =&gt; Date.now\(\) }\) // 新写法 Reflect.defineProperty\(MyDate, 'now', { value: \(\) =&gt; Date.now\(\) }\)

```text
// 第一个参数不是对象则报错

### 14.10 Reflect.getOwnPropertyDescriptor(target, propertyKey)
Reflect.getOwnPropertyDescriptor基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者
```

var myObject = {} Object.defineProperty\(myObject, 'hidden', { value: true, enumerable: false, }\)

// 旧写法 var theDescriptor = Object.getOwnPropertyDescriptor\(myObject, 'hidden'\)

// 新写法 var theDescriptor = Reflect.getOwnPropertyDescriptor\(myObject, 'hidden'\)

```text
// 第一个参数不是对象则报错

### 14.11 Reflect.isExtensible (target)
Reflect.isExtensible方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展。
```

const myObject = {} // 旧写法 Object.isExtensible\(myObject\) // true // 新写法 Reflect.isExtensible\(myObject\) // true

```text
// 第一个参数不是对象则报错

### 14.12 Reflect.preventExtensions(target)
Reflect.preventExtensions对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功
```

var myObject = {} // 旧写法 Object.preventExtensions\(myObject\) // Object {} // 新写法 Reflect.preventExtensions\(myObject\) // true

```text
// 第一个参数不是对象则报错

### 14.13 Reflect.ownKeys (target)
Reflect.ownKeys方法用于返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和
```

var myObject = { foo: 1, bar: 2, }; // 旧写法 Object.getOwnPropertyNames\(myObject\) // \['foo', 'bar'\] Object.getOwnPropertySymbols\(myObject\) //\[Symbol\(baz\), Symbol\(bing\)\] // 新写法 Reflect.ownKeys\(myObject\) // \['foo', 'bar', Symbol\(baz\), Symbol\(bing\)\]

```text
// 第一个参数不是对象则报错

### 14.14 练习 使用proxy结合Reflect实现观察者模式
//  观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行
```

const queuedObservers = new Set\(\) // 向观察者集合中添加观察者 const observe = fn =&gt; queuedObservers.add\(fn\) // 添加观察目标 const observable = obj =&gt; new Proxy\(obj, {set}\) function set\(target, key, value, receiver\) { const result = Reflect.set\(target, key, value, receiver\) queuedObservers.forEach\(observer =&gt; observer\(\)\) return result }

// 设置观察者与观察目标 const fn = \(\) =&gt; console.log\('执行观察者函数'\) observe\(fn\) const obj = { name: 'lilei', age: 13 } observable\(obj\)

obj.age = 14 // 执行观察者函数

```text
## 15 Promise
### 15.1 习题
### 15.1.1
```

const promise = new Promise\(\(resolve, reject\) =&gt; { console.log\(1\) resolve\(\) console.log\(2\) }\) promise.then\(\(\) =&gt; { console.log\(3\) }\) console.log\(4\) // 1 2 4 3

```text
### 15.1.2
```

const promise1 = new Promise\(\(resolve, reject\) =&gt; { setTimeout\(\(\) =&gt; { resolve\('success'\) }, 1000\) }\) const promise2 = promise1.then\(\(\) =&gt; { throw new Error\('error!!!'\) }\) console.log\('promise1', promise1\) console.log\('promise2', promise2\) setTimeout\(\(\) =&gt; { console.log\('promise1', promise1\) console.log\('promise2', promise2\)  
}, 2000\)

```text
### 15.1.3
```

const promise = new Promise\(\(resolve, reject\) =&gt; { resolve\('success1'\) reject\('error'\) resolve\('success2'\) }\)

promise .then\(\(res\) =&gt; { console.log\('then: ', res\) return undefined }\) .catch\(\(err\) =&gt; { console.log\('catch: ', err\) }\) //

```text
### 15.1.4
```

new Promise\(resolve =&gt; { resolve\(value\) }\) Promise.resolve\(1\) .then\(\(res\) =&gt; { console.log\(res\) return 2 }\) .catch\(\(err\) =&gt; { return 3 }\) .then\(\(res\) =&gt; { console.log\(res\) }\) // 1 2

```text
### 15.1.5
```

const promise = new Promise\(\(resolve, reject\) =&gt; { setTimeout\(\(\) =&gt; { console.log\('once'\) // 1 once resolve\('success'\) }, 1000\) }\) const start = Date.now\(\) promise.then\(\(res\) =&gt; { console.log\(res, Date.now\(\) - start\) }\) promise.then\(\(res\) =&gt; { console.log\(res, Date.now\(\) - start\) }\)

```text
### 15.1.6
```

// 错了，再做 Promise.resolve\(\) .then\(\(\) =&gt; { return new Error\('error!!!'\) }\) .then\(\(res\) =&gt; { console.log\('then: ', res\) }\) .catch\(\(err\) =&gt; { console.log\('catch: ', err\) }\)

```text
### 15.1.7
```

const promise = Promise.resolve\(\) .then\(\(\) =&gt; { return promise }\) promise.catch\(console.error\)

```text
### 15.1.8
```

Promise.resolve\(1\) .then\(2\) .then\(Promise.resolve\(3\)\) .then\(console.log\)

```text
### 15.1.9
```

Promise.resolve\(\) .then\(function success \(res\) { throw new Error\('error'\) }, function fail1 \(e\) { console.error\('fail1: ', e\) }\) .catch\(function fail2 \(e\) { console.error\('fail2: ', e\) }\)

```text
### 15.1.10
```

process.nextTick\(\(\) =&gt; { console.log\('nextTick'\) }\) Promise.resolve\(\) .then\(\(\) =&gt; { console.log\('then'\) }\) setImmediate\(\(\) =&gt; { console.log\('setImmediate'\) }\) console.log\('end'\)

```text
### 15.2 实现一个promise的polyfill
```

```text
## 16 Iterator 和 for...of
### 16.1 概念
为统一各类数据结构的访问接口（遍历所有成员接口），同时实现for...of而提出了遍历器接口，实现该接口的数据结构可以被for...of，扩展运算符等遍历。
遍历器接口名是内置的Symbol值Symbol.iterator，也可以通过该属性名调用遍历器接口。
```

const iterator = \[1, 2\][Symbol.iterator](es6-biao-zhun-ru-men.md)

```text
// 遍历器接口返回一个链表结构的head指针，调用next方法可以让指针指向下一个链表元素，同时返回链表元素的值（一个包含value属性和done属性的对象）

### 16.2 默认Iterator接口
原生具备Iterator接口的数据结构有
1. Array
2. String
3. Map
4. Set
5. TypedArray
6. 函数的arguments对象
7. NodeList对象

类数组对象部署遍历器接口，只需要引用数组的遍历器接口即可
```

NodeList.prototype\[Symbol.Iterator\] = \[\]\[Symbol.Iterator\]

```text
### 16.3 默认调用遍历器接口的场合
#### 16.3.1 解构赋值
```

const \[a, b\] = \[1, 2\]

```text
#### 16.3.2 扩展运算符
```

const arr = \[1, 2\] const add = \(a, b\) =&gt; a+b add\(...arr\)

```text
#### 16.3.3 yield*
yield*(生成器章节的内容)后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。
```

let generator = function _\(\) { yield 1 yield_ \[2,3,4\] yield 5 } var iterator = generator\(\) iterator.next\(\) // { value: 1, done: false } iterator.next\(\) // { value: 2, done: false } iterator.next\(\) // { value: 3, done: false } iterator.next\(\) // { value: 4, done: false } iterator.next\(\) // { value: 5, done: false } iterator.next\(\) // { value: undefined, done: true }

```text
#### 16.3.4 其他场合
1. for...of
2. Array.from()
3. Map(), Set(), WeakMap(), WeakSet() 构造函数（比如new Map([['a',1],['b',2]])）
4. Promise.all()
5. Promise.race()

### 16.4 Iterator 接口与 Generator 函数
Symbol.iterator方法的最简单实现，还是使用Generator函数，生成器函数会返回一个遍历器对象（链表的head指针）
```

let myIterable = { \[Symbol.iterator\]: function\* \(\) { yield 1 yield 2 yield 3 } } \[...myIterable\] // \[1, 2, 3\] // 或者采用下面的简洁写法 let obj = {

* [Symbol.iterator](es6-biao-zhun-ru-men.md) {

  yield 'hello'

  yield 'world'

  }

  }

  for \(let x of obj\) {

  console.log\(x\);

  }

  // "hello"

  // "world"

  \`\`\`

### 16.5 遍历器对象的 return\(\)，throw\(\)

遍历器对象除了具有next方法，还可以具有return方法和throw方法。如果你自己写遍历器对象生成函数，那么next方法是必须部署的，return方法和throw方法是否部署是可选的。

return方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有break语句），就会调用return方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署return方法。

```text
for(let item of arr) {
  break // 这是会调用遍历器对象的return方法
}
```

throw方法主要是配合 Generator 函数使用，一般的遍历器对象用不到这个方法。

### 16.6 注意事项

* 遍历字符串时，可以识别超过4位16进制的unicode码

### 16.7 与其他遍历方式的对你

1. forEach,map等方法遍历的缺点是不能使用return，break语句来结束循环
2. for...in 缺点：会遍历原型链上的属性，遍历对象时，顺序不是添加顺序

## 17 Generator函数的语法

Generator函数是ES6提出的一种异步编程解决方案。可以将Generator理解为一个状态机，内部封装了多个状态。

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

### 17.1 特点

* 声明方式 function\*
* 函数内部使用 yield表达式定义状态

### 17.2 使用

```text
function* helloWorldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

var hw = helloWorldGenerator() // 返回一个遍历器对象
hw.next() // { value: 'hello', done: false }
hw.next() // { value: 'world', done: false }
hw.next() // { value: 'ending', done: true }
hw.next() // { value: undefined, done: true }
```

### 17.3 yield表达式

* 遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
* 下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。
* 如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
* 如果该函数没有return语句，则返回的对象的value属性值为undefined。

### 17.4 通过Generator实现Symbol.Iterator接口

```text
const obj = {
  first: 1,
  second: 2,
  third: 3,
  *[Symbol.Iterator]() {
    yield this.first
    yield this.second
    yield this.third
  }
}
[...obj] // 1 2 3
```

### 17.5 next方法的参数

next方法可以接收参数传递给Generator函数\(状态机外部改变状态机内部\)。yield表达式本身返回值为undefined,next方法接收到的参数会作为yield表达式的返回值。

```text
function* f() {
  var i = 0
  while(true) {
    var reset = yield i
    if (reset != undefined) i = reset
    i++
  }
}
var g = f()
g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(100) // { value: 101, done: false }
```

### 17.6 练习

#### 17.6.1 使用Generator函数和for...of实现一个斐波那契数列

```text
function* f() {
  let i = 1
  let first = 1
  let second = 2
  while (true) {
    if (i === 1) {
      yield first
    } else if (i === 2) {
      yield second
    } else {
      yield first + second;
      [first, second] = [second, first + second]
    }
    i++
  }
}

for (let i of f(10)) {
  if (i > 1000) break
  console.log(i)
}
```

#### 17.6.2 为对象添加遍历器接口

```text
function* objectEntries() {
  let propKeys = Object.keys(this)

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]]
  }
}
let jane = { first: 'Jane', last: 'Doe' }
jane[Symbol.iterator] = objectEntries
for (let [key, value] of jane) {
  console.log(`${key}: ${value}`)
}
```

### 17.7 Generator.prototype.throw

Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。\(可以看做在Generator内容部抛出一个错误，错误可以在内部被捕获，内部没有捕获时，还可以在外部被捕获\)

throw的参数会传递给catch

```text
var g = function* () {
  try {
    yield
  } catch (e) {
    console.log('内部捕获', e)
  }
}

var i = g()
i.next()
i.throw(new Error('a'))  // 内部捕获 Error: a
```

// throw方法抛出的错误若在Generator内部被捕获，则可以继续执行到下一个yield表达式。

### 17.8 Generator.prototype.return

Generator 函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历 Generator 函数。

```text
function* gen() {
  yield 1
  yield 2
  yield 3
}
var g = gen()
g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

### 17.9 理解next、throw、return

他们都是为了改变状态，并使用参数改变yield表达式的返回值的。

* next\(\)是将yield表达式替换成一个值。
* throw\(\)是将yield表达式替换成一个throw语句。
* return\(\)是将yield表达式替换成一个return语句。

### 17.10 yield\* 表达式

如果在 Generator 函数内部，调用另一个 Generator 函数。需要在前者的函数体内部，自己手动完成遍历。

```text
function* foo() {
  yield 'a'
  yield 'b'
}
function* bar() {
  yield 'x'
  // 手动遍历 foo()
  for (let i of foo()) {
    console.log(i)
  }
  yield 'y'
}
for (let v of bar()){
  console.log(v)
}
// x a b y
```

yield\* 就是一个语法糖，用于简化Generator函数中使用Generator函数的操作。 // 上述代码bar可以简化为

```text
function* bar() {
  yield 'x'
  yield* foo()
  yield 'y'
}
// 等价于
function* bar() {
  yield 'x'
  yield 'a'
  yield 'b'
  yield 'y'
}
// 等价于 (这个是正确的Generator函数中调用Generator函数的方法)
function* bar() {
  yield 'x'
  for (let item of foo()[Symbol.Iterator]) {
    yield item
  }
  yield 'y'
}
```

// 上面例子中可以看出yiels\* 后面的表达式必须部署了遍历器接口

被调用的Generator函数中若存在return语句，则return语句的返回值会作为yield\*表达式的返回值

#### 17.10.1 yield\*的用途

**17.10.1.1 取出嵌套数组中的成员**

```text
const arr = [1, [2], [[3]], [[[4]]]]
function* generator(arr) {
  if (Array.isArray(arr)) {
    for (let item of arr) {
      yield* generator(item)
    }
  } else {
    yield arr
  }
}

console.log([...generator(arr)])
```

### 17.11 对象属性若为Generator函数，则可以简写

```text
const obj = {
  generator: function* () {}
}
// 可简写为
const obj = {
  * generator() {}
}
```

### 17.12 Generator的this

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的prototype对象上的方法。

但是生成器内部使用this设置属性时，遍历器对象并不会得到这个属性。因为Generator函数返回一个继承自己原型的对象，与new操作不同。

```text
function* g() {
  this.a = 11
}
let obj = g()
obj.next()
obj.a // undefined
```

Generator与new操作符联用会报错

### 17.13 Generator的意义

#### 17.13.1 协程

Generator 函数是 ES6 对协程的实现，但属于不完全实现。Generator 函数被称为“半协程”（semi-coroutine），意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数。如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。

### 17.13.2 执行环境栈

Generator函数的执行环境栈在暂停的时候不会推出栈

### 17.14 Generator的应用

#### 17.14.1 异步操作同步化

原生异步操作

```text
// 简写版XMLHttpRequest
makeAjaxCall("http://some/login", {}, member => { // 登录并获得用户信息
  member = JSON.parse(member)
  makeAjaxCall("http://some/getData", member, data => { //登录后获取数据
    console.log(JSON.parse(data))
  })
})
// 典型的回调地狱写法
```

promise版本

```text
// 简写XMLHttpRequest
function request(url) {
  return new Promise(resolve => {
    makeAjaxCall(url, response => { 
      resolve(JSON.parse(response))
    })
  })
}
function main() {
  request("http://some/login")
    .then(member => {
      return request("http://some/getData", member)
    })
    .then(data => {
      coknsole.log(data)
    })
}
main()
// promise解决了回调地狱问题，但引入了多个then导致页面混乱问题
```

Generator版本

```text
function request(url, data) {
  makeAjaxCall(url, data, response => { // 简写XMLHttpRequest
    it.next(JSON.parse(response))
  })
}
function* main() {
  // 先登录后获取数据
  const member = yield request("http://some/login")
  const data = yield request("http://some/getData", member)
  console.log(data)
}
const it = main()
it.next()
// 使异步操作完全同步化书写，但需要自己控制状态机启动与执行
```

#### 17.14.2 控制流管理

```text
// 原生 回调地狱写法
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      })
    })
  })
})

// promise 引入了大量promise语句，使代码变得冗余
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4) {
    // Do something with value4
  }, function (error) {
    // Handle any error from step1 through step4
  })
  .done()

// Generator 需要引入一个函数使控制流自动执行下去 注意 这里只能执行同步的代码
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}

scheduler(longRunningTask(initialValue))

// 通用的自动的状态机执行函数
function scheduler(task) {
  var taskObj = task.next(task.value)
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value
    scheduler(task)
  }
}
```

### 17.14.3 部署遍历器接口

## 18 Generator函数的异步应用

### 18.1 传统的异步编程方法

* 回调函数
* 事件监听
* 发布/订阅
* Promise

### 18.2 Generator的异步编程方法

Generator实现 “协程” 来达到异步编程 1. 协程A开始执行。 2. 协程A执行到一半，进入暂停，执行权转移到协程B\(B就是异步任务\)。 3. （一段时间后）协程B交还执行权。 4. 协程A恢复执行。

```text
// 代码形式 其中readFile函数中还有执行完毕之后将执行权还给Generator的操作，也就是执行Generator中的yield
function* asyncJob() {
  // ...其他代码
  var f = yield readFile(fileA);
  // ...其他代码
}
```

// 这种写法的好处是几乎和同步操作写法一样

### 18.3 协程的Generator函数实现

```text
var fetch = require('node-fetch')

// 实际执行的代码
function* gen(){
  cosnt url = 'https://api.github.com/users/github'
  cosnt result = yield fetch(url)
  console.log(result.bio)
}

// 控制Generator执行的代码
const g = gen()
cosnt result = g.next() // fetch模块返回的是promise对象
// 控制请求结束之后将执行权还给Generator
result.value
  .then(data => {
    return data.json()
  })
  .then(data => {
    g.next(data)
  })
```

// Generator函数中可以看出书写的代码与同步代码几乎一致，但引入了流程控制部分的代码

### 18.4 thunk函数

Thunk 函数是自动执行 Generator 函数的一种方法\(不需要我们自己控制Generator的流程\)。

#### 18.4.1 thunk函数是什么

```text
function f(m) {
  return m * 2;
}
f(1 + 5)
// C中会先对表达式进行计算，1+5=6，然后调用f(6)，这可能会导致性能损失
// 使用thunk函数后 等同于
var thunk = function () {
  return 1 + 5
}
function f(thunk) {
  return thunk() * 2
}
```

这就是 Thunk 函数的定义，它是“传名调用”的一种实现策略，用来替换某个表达式。

#### 18.4.2 js中的thunk函数

JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。

通过fs.readFile实现fs.readFilSync

```text
// 正常版本的readFile（有callback参数版本）
fs.readFile(fileName, callback)

// Thunk版本的readFile（无callback参数版本）
const Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback)
  }
}
const readFileThunk = Thunk(fileName)
readFileThunk(callback)
```

#### 18.4.3 thunkify源码

```text
function thunkify(fn) {
  return function() {
    var args = new Array(arguments.length)
    var ctx = this
    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i]
    }
    return function (done) {
      var called
      args.push(function () {
        // 只允许执行一次
        if (called) return
        called = true
        done.apply(null, arguments)
      })
      try {
        fn.apply(ctx, args)
      } catch (err) {
        done(err)
      }
    }
  }
}
```

### 18.5 Generator函数的流程管理

要是Generator函数自动执行，本质是要控制执行权在Generator函数与异步操作之间来回交替。 Generator函数可以通过yield表达式交出执行权，异步操作可以通过回调函数或promise的then方法将执行权交回Generator函数。

* yield表达式后面跟着thunk函数，在外部移动Generator函数的指针，得到执行权后，等待异步操作执行结束后再次移动Generator函数的指针交还执行权。
* yield表达式后面跟着thunk函数或promise对象，在外部移动Generator函数的指针，得到执行权后，在promsie对象的then方法中再次移动Generator函数的指针交还执行权。

#### 18.5.1 基于thunk函数的自动流程管理

```text
// 基于thunk函数实现一个Generator函数的执行器
function run(fn) {
  const gn = fn()

  const next = function (data) {
    const result = gn.next(data)
    if (result.done) return
    result.value(next)
  }

  next()
}
function* gn() {
  const result1 = yield readFileThunk('file1.text')
  console.log(result1)
  const result2 = yield readFileThunk('file2.text')
  console.log(result2)
}
run(gn)
```

#### 18.5.2 基于promise的自动流程管理

```text
function run (fn) {
  const gn = fn()

  const next = function (data) {
    const obj = gn.next(data)
    if (obj.done) return
    obj.value.then(result => {
      next(result)
    })
  }

  next()
}
function* gn() {

}
run(gn)
```

#### 18.5.3 基于co模块的自动流程管理

```text
function co(gen) {
  var ctx = this
  var args = slice.call(arguments, 1)
  // 返回一个Promise实例
  return new Promise(function(resolve, reject) {
    // 如果gen是一个函数，则返回一个新的gen函数的副本，
    // 里面绑定了this的指向，即ctx
    if (typeof gen === 'function') gen = gen.apply(ctx, args)
    // 如果gen不存在或者gen.next不是一个函数，就说明gen已经调用完成,那么直接可以resolve(gen)，返回Promise
    if (!gen || typeof gen.next !== 'function') return resolve(gen)
    // 首次调用gen.next()函数，假如存在的话
    onFulfilled()
    function onFulfilled(res) {
      var ret
      try {
        // 尝试着获取下一个yield后面代码执行后返回的值
        ret = gen.next(res)
      } catch (e) {
        return reject(e)
      }
      // 处理结果
      next(ret)
    }
    function onRejected(err) {
      var ret
      try {
        // 尝试抛出错误
        ret = gen.throw(err)
      } catch (e) {
        return reject(e)
      }
      // 处理结果
      next(ret)
    }
    // 这个next()函数是最为关键的一部分，里面几乎包含了generator自动调用实现的核心
    function next(ret) {
      // 如果ret.done === true, 
      // 证明generator函数已经执行完毕
      // 即已经返回了值
      if (ret.done) return resolve(ret.value)
      // 把ret.value转换成Promise对象继续调用
      var value = toPromise.call(ctx, ret.value)
      // 如果存在，则把控制权交给onFulfilled和onRejected，实现递归调用
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected)
      // 否则最后直接抛出错误
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'))
    }
  })
}
function toPromise(obj) {
  if (!obj) return obj
  if (isPromise(obj)) return obj
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj)
  if ('function' == typeof obj) return thunkToPromise.call(this, obj)
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj)
  if (isObject(obj)) return objectToPromise.call(this, obj)
  return obj
}
function objectToPromise(obj){
  // 获取一个和传入的对象一样构造器的对象
  var results = new obj.constructor()
  // 获取对象的所有可以遍历的key
  var keys = Object.keys(obj)
  var promises = []
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    // 对于数组的每一个项都调用一次toPromise方法，变成Promise对象
    var promise = toPromise.call(this, obj[key])
    // 如果里面是Promise对象的话，则取出e里面resolved后的值
    if (promise && isPromise(promise)) defer(promise, key)
    else results[key] = obj[key]
  }
  // 并行，按顺序返回结果，返回一个数组
  return Promise.all(promises).then(function () {
    return results
  })
  // 根据key来获取Promise实例resolved后的结果，
  // 从而push进结果数组results中
  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined
    promises.push(promise.then(function (res) {
      results[key] = res
    }))
  }
}

// 执行
function* gn() {

}
co(gn)
```

## 19 async

async就是Generator函数的语法糖，他在语言层面实现了Generator函数自动流程管理，可以看做异步编程的终极解决方案。

特点：

* 在语言层面内置执行器，在函数前加上async即可实现自动流程管理
* async与await比起\*和yield，语义上更清晰
* await后面可以接promise对象或其他任意类型
* async函数返回的是一个promise对象
* async函数内的所有await执行完毕时，async返回的promise对象状态才会转变为resolve，任意一个await后面的promise状态改为reject后async返回的promise状态改为rejected

### 19.1 错误处理

若async函数中抛出了错误，会导致Promise对象的状态转为rejected，任意一个await后面的promise状态改为rejected后，async函数返回的promise对象状态也会转为rejected，这时async函数会停止执行。

若希望出错后依然执行，则需要使用try catch

### 19.2 使用注意点

不能对所有的异步操作都使用await，不存在互相依赖关系的应同时执行，而不是一个个执行

```text
// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()])
// 写法二
let fooPromise = getFoo()
let barPromise = getBar()
let foo = await fooPromise
let bar = await barPromise
```

async 函数可以保留运行堆栈。

```text
const a = () => {
  b().then(() => c())
}
```

上面代码中，函数a内部运行了一个异步任务b\(\)。当b\(\)运行的时候，函数a\(\)不会中断，而是继续执行。等到b\(\)运行结束，可能a\(\)早就运行结束了，b\(\)所在的上下文环境已经消失了。如果b\(\)或c\(\)报错，错误堆栈将不包括a\(\)。

```text
const a = async () => {
  await b()
  c()
}
```

上面代码中，b\(\)运行的时候，a\(\)是暂停执行，上下文环境都保存着。一旦b\(\)或c\(\)报错，错误堆栈将包括a\(\)。 // 错误栈堆一直不太了解，需要找资料看

### 19.3 async函数的实现原理

### 19.4 顶层await

为什么需要顶层await

```text
// a.js
let a
setTimeout(() => {
  a = true
}, 1000)
export { a }
// b.js
import a from a.js
console.log(a) // 这时a的值为undefined
```

// 通过顶层await可以实现异步加载模块（global模块中获得用户信息，等待获取成功后其他模块才可以使用，当前项目中使用promise解决的）

## 20 class的基本语法

特点： 1. 类的内部所有定义的方法，都是不可枚举的，这一点与ES5中Point.prototype.toStirng定义的不同，ES5中是可枚举的。

```text
class Point {
  constructor(x, y) {
  }
  toString() {
  }
}
Object.keys(Point.prototype)  // []
Object.getOwnPropertyNames(Point.prototype) // ["constructor","toString"]
```

1. 类直接调用会报错，只能通过new调用
2. 与ES5相同，类的内部也可以通过get set定义取值函数与存值函数。存值函数和取值函数是设置在属性的 Descriptor 对象上的。

   ```text
   class CustomHTMLElement {
   constructor(element) {
    this.element = element;
   }
   get html() {
    return this.element.innerHTML;
   }
   set html(value) {
    this.element.innerHTML = value;
   }
   }
   var descriptor = Object.getOwnPropertyDescriptor(
   CustomHTMLElement.prototype, "html"
   );
   "get" in descriptor  // true
   "set" in descriptor  // true
   ```

3. 与函数一样，类也可以使用表达式的形式定义。通过class表达式，可以写出立即执行的new操作

   ```text
   const MyClass = class Me {
   getClassName() {
    return Me.name
   }
   }
   ```

注意点： 1. 类和模块的内部默认为严格模式 2. class定义的变量，也不存在变量声明提示 3. class变量具有name属性，返回class名 4. 注意隐式绑定的this丢失

```text
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`)
  }
  print(text) {
    console.log(text)
  }
}
const logger = new Logger()
const { printName } = logger
printName() // TypeError: Cannot read property 'print' of undefined   这时的this指向undefined
```

解决方案

```text
// 在构造函数中硬绑定this，这样就不会出现隐式绑定this丢失的问题
class Logger {
  constructor() {
    this.printName = this.printName.bind(this)
  }
}
// 另一种方式是使用箭头函数
```

### 20.1 静态方法

* 方法名前增加static即为静态方法
* 静态方法与实例方法可以重名
* 父类的静态方法可以被子类继承
* 子类可以通过super对象调用父类的静态方法

  \`\`\`

  class Foo {

  static classMethod\(\) {

    return 'hello'

  }

  }

  class Bar extends Foo {

  static classMethod\(\) {

    return `${super.classMethod()}, too`

  }

  }

Bar.classMethod\(\) // "hello, too"

```text
### 20.2 实例属性
实例属性除了能在构造函数中定义外，还能在类的顶层定义
```

class IncreasingCounter { \_count = 0 }

```text
### 20.3 静态属性
暂时不支持在类的内容定义静态属性

### 20.4 私有方法与私有属性
暂时不支持在类的内容定义私有方法与私有属性 // ES2020会出现，保持关注

### 20.5 new.target属性
在构造函数中使用，返回new命令作用域的构造函数，若不是通过new命令或Reflect.construct()调用的构造函数，则new.target的值为undefined。
```

// 可用于防止非法调用构造函数 function Person\(name\) { if \(new.target !== undefined\) { this.name = name; } else { throw new Error\('必须使用 new 命令生成实例'\); } }

```text
子类使用super时，父类构造函数中的new.target指向子类
```

class Square extends Rectangle { constructor\(age\) { super\('lilei'\) this.age = age } } // 这时候父类的new.target指向Square

```text
利用这个特点，可以写出不能独立使用、必须继承后才能使用的类（也就是抽象类）。
```

class Shape { constructor\(\) { if \(new.target === Shape\) { // 核心 throw new Error\('本类不能实例化'\) } } } class Rectangle extends Shape { constructor\(length, width\) { super\(\) // ... } }

var x = new Shape\(\) // 报错 var y = new Rectangle\(3, 4\) // 正确

```text
## 21 class的继承
子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。这一点与ES5不同。

ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。
// 看看class是如何实现的

class中若没定义constructor，则有默认的constructor函数
```

constructor \(...arg\) { super\(...arg\) }

```text
### 21.1 Object.getPrototypeOf()
```

Object.getPrototypeOf\(Child\) === Parent // true

// Object.getPrototypeOf\(\) 等价于 function getPrototypeOf \(Child\) { return Child.**proto** }

```text
Object.getPrototypeOf()可以返回一个类的父类，这可以用于判断一个类是否继承至另一个类
// 这是因为extends实现的继承，类__proto__属性指向父类 ，类的原型对象prototype的__proto__属性指向父类的__proto__属性，这里与ES5并不相同

### 21.2 super关键字
super级可作为函数直接调用，也可以作为一个对象使用

* 作为函数使用时，代表父类的构造函数，super中的this指向子类的实例，super()等价于Parent.prototype.constructor.call(this)，super()只能在子类的构函中使用。
* 作为对象使用时，在原型方法中指向父类的原型对象，在静态方法中指向父类本身。
```

// 在子类的原型方法中只能调用父类原型方法，此时fn内的this指向子类的实例 super.fn\(\) // 等价于 Parent.prototype.fn.call\(this\)

// 在子类的原型方法中调用父类的原型属性 super.x // 等价于 this.x

// 在子类的静态方法中只能调用父类的静态方法，此时fn内的this指向子类本身 super.fn\(\) // 等价于 Parent.fn.call\(Child\)

// 在子类的静态方法中调用父类的静态属性 super.x // 等价于 this.x

```text
### 21.3 prototype属性与__proto__属性
js中的对象分为函数对象与普通对象，Function、Object、Function的一切子类都属于函数对象，其他对象为普通对象。
函数对象同时具有prototype属性与__proto__属性，普通对象只具有__proto__属性。

对于函数对象，__proto__总是指向父类的，prototype属性指向该函数对象的原型对象的，prototype属性的__proto__属性则指向父类的原型对象（Parent.prototype），原理是寄生组合继承。
Child.__proto__ = Parent
Child.prototype.__proto__ = Parent.prototype

对于普通对象，__proto__属性指向原型对象
Child实例.__proto__ = Child.prototype

综上可德
Child实例.__proto__.__proto__ = Parent.prototype

继承的实现原理：
```

// 子类的**proto**属性指向父类，子类的原型对象的**proto**属性指向父类的原型对象 Object.setPrototypeOf\(Child.prototype, Parent.prototype\) Object.setPrototypeOf\(Child, Parent\)

```text
Object.setPrototypeOf实现原理
```

function setPrototypeOf \(Child, Parent\) { Child.**proto** = Parent return Child }

```text
Object.create实现原理
```

function create\(Parent\) { function F\(\) {} F.prototype = Parent.prototype reutrn new F\(\) }

```text
#### 21.3.1 特殊情况 函数对象生成的实例也是函数对象
一般函数对象生成的实例都是普通对象，__proto__属性指向构函的原型对象。
而Function的实例也是函数对象，__proto__属性指向Function的原型对象，prototype则指向
没有显示继承的类（可以看做Function的实例）
```

class Child { } Child.**proto** === Function.prototype // true Child.prototype.**proto** === Object.prototype // true

```text
搞清楚Child继承至Parent，Child不继承任何类，这两种情况下所有的prototype与__proto__的指向！！！画图！！！

### 21.4 原生构函的继承
原生构函：
* Boolean()
* Number()
* String()
* Array()
* Date()
* Function()
* RegExp()
* Error()
* Object()

通过继承原生构函可以达到修改原生构函行为的效果。

### 21.5 类的mixin的实现

## 22 module的语法
ES6之前，js通过CommonJS（用于服务端）和AMD（用于浏览器）模块来实现模块化，这是一种运行时加载机制，也用于异步加载模块，但不适合静态加载模块。

### 22.1 模块、类、定义了let const变量的块级作用域中都是严格模式
* 严格模式的限制
* 变量必须声明后再使用
* 函数的参数不能有同名属性，否则报错
* 不能使用with语句
* 不能对只读属性赋值，否则报错
* 不能使用前缀 0 表示八进制数，否则报错
* 不能删除不可删除的属性，否则报错
* 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
* eval不会在它的外层作用域引入变量
* eval和arguments不能被重新赋值
* arguments不会自动反映函数参数的变化
* 不能使用arguments.callee
* 不能使用arguments.caller
* 禁止this指向全局对象
* 不能使用fn.caller和fn.arguments获取函数调用的堆栈
* 增加了保留字（比如protected、static和interface）

### 22.2 export命令
* 单独输入变量
```

export const a = 1

```text
* 统一输出变量，且可以设置别名
```

const a = 1 const b = 2 export { a, b as c }

```text
* 默认输出变量
```

const b = 1 export default b

```text
export 输出的是一个地址，引用了该模块的模块会在使用到的时候来该模块加载该变量，这一过程是动态的。
export语句只能用于顶层，不能用于块级作用域

### 22.3 import命令
* 引入普通变量，可以设置别名
```

import { a, b as c } from './a'

```text
* 引入默认变量
```

import a from './a' import a, { b } from './a'

```text
* 引入所有变量
```

import \* as a from './a'

```text
import 语句引入的变量是只读的，不允许赋值

import语句具有声明提升的效果
```

a\(\) import { a } from './a'

```text
import语句只能用于顶层，不能用于块级作用域

多次import同一变量只会执行一次
```

import { a } from './' import { a } from './' // 不执行

```text
### 22.4 export 与 import 的复合写法
用于转发变量，该变量不会导入一个引用到该模块，只会留下一个地址
* 统一转发变量
```

export { a, b } from './a' export { a, b as c } from './a'

```text
* 整体变量转发
```

export \* from './a'

```text
* 默认变量转发
```

// 默认变量转发 export { default } from './a' // 普通变量改默认变量转发 export { a as default } from './a' // 默认变量改普通变量转发 export { default as a } from './a'

```text
### 22.5 模块的继承
所谓模块的继承就是定义一个模块a，将模块a导入模块b中，模块b对模块a的一些行为作出覆盖（多态）。
```

// a.js const add = \(a, b\) =&gt; a + b export default add

// b.js import add from './a' add = \(a, b, c\) =&gt; a + b + c export default add

```text
### 22.6 跨模块常量
模块对外暴露变量可以理解为模块对外暴露了一个地址，引用该模块的模块根据该地址寻找该变量，不同的模块引用同一个模块的变量时，访问的是同一个值。
```

class a {

} export default a // 对外暴露的变量a可以视作一个单例模式，其他模块访问该模块的a都是访问同一个a

```text
### 22.7 import()
import只能用于顶层，失去了CommonJS异步加载模块的优势，故引入import()。
```

import\('地址'\).then\(data =&gt; console.log\(data\)\)

```text
import()返回的是一个promise对象，promise对象的终值为该模块对外暴露的对象

与CommonJS不同的是CommonJS的require是同步加载的，而import()是异步加载的
```

// 获得模块导出的对象 // 统一导出的 then\({ a } =&gt; console.log\(a\)\) // 默认导出的 then\(a =&gt; console.log\(a.default\)\) then\({ default: a } =&gt; console.log\(a\)\)

```text
## 23 module加载的实现
### 23.1 浏览器的加载
```

// 同步加载的js文件，主线程停止，等待下载完成后立即执行该js文件

  
  // module code  


// 异步加载的js文件，主线程不停止，等待主线程跑完后执行该js文件

  
  // module code  


// 异步加载的js文件，主线程不停止，等待下载完成后立即执行该js文件

  
  // module code  


// 异步加载，等待主线程跑完后执行该js模块

  
  // module code  


// 异步加载，等待下载完成后立即执行该js模块

 // module code 

```text
在js模块中默认采用严格模式，且可以使用import export语句，且代码是在模块中运行的，不是在全局运行。

### 23.2 ES6 模块与 CommonJS 模块的差异
* CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。CommonJS输出变量时，值就固定了，export输出变量时，输出的是引用，值依然会变化。
* CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

### 23.3 Node.js加载
这一部分涉及到package.json文件，且主要讲的是配置，暂时不看。

### 23.4 循环加载
a脚本的执行依赖b脚本，而b脚本的执行又依赖a脚本。

#### 23.4.1 CommonJS模块加载原理
require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。
```

{ id: '...', // 模块名 exports: { ... }, // 对外暴露的变量 loaded: true, // 是否加载完成 ... }

```text
之后再次加载该模块时，不会再重新执行该模块脚本代码。

#### 23.4.2 CommonJS模块的循环加载
一旦出现两个模块循环加载时，CommonJS采用的是只输出已执行部分，未执行部分不输出。
```

// a.js exports.done = false var b = require\('./b.js'\) console.log\('在 a.js 之中，b.done = %j', b.done\) exports.done = true console.log\('a.js 执行完毕'\)

// b.js exports.done = false var a = require\('./a.js'\) console.log\('在 b.js 之中，a.done = %j', a.done\) exports.done = true console.log\('b.js 执行完毕'\)

```text
// 先执行a.js，在遇到require时，会先去执行reuire的模块，即b.js

#### 23.4.3 ES6模块的循环加载
import从一个模块加载变量时，是生成一个指针，指向被加载模块，值是动态的
```

// a.mjs import {bar} from './b' console.log\('a.mjs'\) console.log\(bar\) export let foo = 'foo'

// b.mjs import {foo} from './a' console.log\('b.mjs'\) console.log\(foo\) export let bar = 'bar'

```text
// 先执行a.mjs，在遇到import语句后会优先执行import的模块，即b.js，在b.js中遇到import a.js时，不会回去执行a.js，因为a.js对外的接口已经存在了

import语句具有声明提升的效果，同时存在import语句与function语句时，function语句先进行声明提升，再轮到import

## 24 编程风格
* let与const之间优先使用const：编译器会对const语句进行优化
* 字符串使用单引号或反引号
* 声明单行对象时，最后一个属性不加逗号，多行对象时，最后一个属性加逗号
```

const obj1 = { a, b } const obj2 = { a, b, }

```text
* 立即执行的函数可以写成箭头函数的形式（在顶层中执行的函数this指向undefined，写成箭头函数并不会产生影响）
```

\(\(\) =&gt; { console.log\('init'\) }\)\(\)

```text
* 箭头函数取代Function.prototype.bind（这里保留意见，有些时候bind看起来更加简洁）
```

// 固定this的两种方法，这里也可以看出箭头函数中this的指向与其定义时this的指向有关 const obj ={ name: 'lilei', hello\(\) { return `hello ${this.name}!` }, init\(obj\) { // bing形式 return this.hello.bind\(obj\) // 箭头函数形式 return \(...arg\) =&gt; this.hello.apply\(obj, arg\) } } const hello = obj.init\({name: 'xiaohong'}\)

```text
## 25 异步遍历器
### 25.1 同步遍历器实现异步操作
遍历器若想实现一些异步的行为，可以在next方法中返回promise对象，在then方法中获取终值
```

const obj = { \[Symbol.iterator\] \(\) { let num = 0 return { next\(\) { num++ return { value: new Promise\(resolve =&gt; { setTimeout\(\(\) =&gt; { resolve\(num\) }, 1000\) }\), done:num === 5, } } } } }

const iterator = obj[Symbol.iterator](es6-biao-zhun-ru-men.md) const data = iterator.next\(\) !data.done && data.value.then\(num =&gt; { console.log\(num\) }\)

```text
要想实现异步遍历，next方法返回的对象的value属性可以是一个thunk函数，也可以是一个promise对象。
但是这种方式不太理想，他与同步的遍历器操作不太一样，ES2018中引入了异步遍历器，使用时与同步遍历器的写法几乎相同

### 25.2 异步遍历器接口
```

const asyncIterator = \[1, 2, 3\][Symbol.asyncIterator](es6-biao-zhun-ru-men.md) asyncIterator.next\(\) // 这里返回的是一个promise对象，想要提取遍历的值需要在then方法中得到 .then\(data =&gt; { console.log\(data\) // { value: 1, done: false } return asyncIterator.next\(\) }\) .then\(data =&gt; { console.log\(data\) // { value: 2, done: false } asyncIterator.next\(\) }\) .then\(data =&gt; { console.log\(data\) // { value: 3, done: false } asyncIterator.next\(\) }\) .then\(data =&gt; { console.log\(data\) // { value: undefined, done: true } }\)

// 或者使用async函数 async function f\(\) { const asyncIterator = \[1, 2, 3\][Symbol.asyncIterator](es6-biao-zhun-ru-men.md) console.log\(await asyncIterator.next\(\)\) // { value: 1, done: false } console.log\(await asyncIterator.next\(\)\) // { value: 2, done: false } }

```text
### 25.3 for await ...of
对异步遍历器返回的promise await等待获得终值后将值传入for中，注意await语句还不能在顶层中使用，只能在async函数中使用！！
```

// 这里面是依次执行的，不是并行执行的 \(async \(\) =&gt; { for await \(let item of \[1, 2, 3\][Symbol.asyncIterator](es6-biao-zhun-ru-men.md)\) { console.log\(item\) } }\)\(\)

```text
for await ...of也可以用于同步遍历。

### 25.4 异步生成器
异步Generator函数返回一个异步遍历器对象
```

async function\* gen\(\) { await new Promise\(resovel =&gt; { setTimeout\(\(\) =&gt; { resolve\(\) }, 1000\) }\) yield 'hello' } const asyncIterator = gen\(\) asyncIterator.next\(\).then\(x =&gt; console.log\(x\)\) // 1s后得到 { value: 'hello', done: false }

```text
// yield 返回的是一个promise对象，

### 25.5 异步生成器的执行器
生成器常用的执行器有co模块，完成一个异步生成器的执行器
```

```text
### 25.6 yield*
yield* 后面可以接一个遍历器对象，也可以接一个异步遍历器对象
// yield* 接遍历器对象
```

function\* ge1\(\) { yield 1 yield 2 }

function _ge2\(\) { yield_ ge1\(\) } // 等价于 function\* ge2\(\) { for\(let item of ge1\(\)\) { yield item } }

```text
// yield* 接异步遍历器对象
```

async function\* ge1\(\) { yield await sleep\(1000\) yield await sleep\(1000\) }

async function _ge2\(\) { yield_ ge1\(\) } // 等价于 async function\* ge2\(\) { for await\(let item of ge1\(\)\) { yield item } }

\`\`\`

## 26 Array Buffer

学习webGL后再回来看

## 27 装饰器

等待标准出来后重新看

