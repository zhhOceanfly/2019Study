记录学习《学习JavaScript数据结构与算法》过程中的知识点与心得。

问题
1. 常见的数据结构具有哪些属性、方法
2. 这些方法的返回值是什么

注意事项
1. 在删除元素或需要返回元素的时候，需注意判断数组是否为空

## 1 数组
数组在内存中是连续排列的，根据下标查询数组的时间复杂度是O(1)（改同理），增与删操作与数组的长度有关，时间复杂度是O(n)。

优点：查询、修改操作速度快
缺点：增、删操作平均需要操作n/2

js中的数组也是对象模拟的，可以使用对象来实现一个数组。
数组方法(全部实现一遍)：
* es3：push pop shift unshift reverse join slice splice concat indexOf lastIndexOf sort
* es5：map forEach some every reduce filter 
* es6：includes find findIndex entries keys values

### 1.1 sort
sort函数接收一个比较函数，在对两个数进行比较时，若比较函数返回正数，则交换位置
```
cosnt arr1 = [1, 10, 5, 11]
cosnt arr3 = arr1.sort((a, b) => a-b) // [1, 5, 10, 11]
```

## 2 栈
栈是一个后进先出的数据结构，用于某些需要限制操作的场景，如vue-router、react-router中保存历史路由的数据结构就是栈。

优点：可以看做一个功能限制的数组，增、删、查栈顶元素的时间复杂度为O(1)

* 栈的长度属性一般为count

使用数组实现栈数据结构
```
class Stack {
  constructor () {
    this._items = []
  }
  push (...elements) {
    for (let element of elements) {
      this._items.push(element)
    }
  }
  pop () {
    if (this.isEmpty()) {
      return undefined
    } else {
      const result = this._items[this._items.length - 1]
      this._items.length--
      return result
    }
  }
  clear () {
    this._items.length = 0
  }
  peek () {
    return this._items[this._items.length - 1]
  }
  isEmpty () {
    return this._items.length === 0
  }
  size () {
    return this._items.length
  }
}
```

js中数组数据结构也是由对象实现的，故应该使用对象实现栈数据结构
```
class Stack {
  constructor () {
    this._init()
  }
  _init () {
    this._items = {}
    this._count = 0
  }
  push (...elements) {
    for (let element of elements) {
      this._items[this._count] = element
      this._count++
    }
  }
  pop () {
    if (this.isEmpty()) {
      return undefined
    }
    const result = this._items[this._count - 1]
    Reflect.deleteProperty(this._items, this._count - 1)
    this._count--
    return result
  }
  clear () {
    this._init()
  }
  peek () {
    if (this.isEmpty()) {
      return undefined
    }
    return this._items[this._count - 1]
  }
  isEmpty () {
    return this._count === 0
  }
  size () {
    return this._count
  }
  toString () {
    if (this.isEmpty()) {
      return ''
    }
    let str = `${this._items[0]}`
    for (let i = 1; i < this._count; i++) {
      str +=`,${this._items[i]}`
    }
    return str
  }
}
```
