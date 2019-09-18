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