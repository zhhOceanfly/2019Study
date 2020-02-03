记录学习《学习JavaScript数据结构与算法》过程中的知识点与心得。

问题
1. 常见的数据结构具有哪些属性、方法
2. 这些方法的返回值是什么

注意事项
1. 在删除元素或需要返回元素的时候，需注意判断数组是否为空

## 1 数组(列表)
数组在内存中是连续排列的，根据下标查询数组的时间复杂度是O(1)（改同理），增与删操作与数组的长度有关，时间复杂度是O(n)。

优点：查询、修改操作速度快
缺点：增、删操作平均需要操作n/2

js中的数组也是对象模拟的，可以使用对象来实现一个数组。
数组方法(全部实现一遍)：
* es3：push pop shift unshift reverse join slice splice concat indexOf lastIndexOf sort
* es5：map forEach some every reduce filter 
* es6：includes find findIndex entries keys values

<!-- ### 1.1 sort
sort函数接收一个比较函数，在对两个数进行比较时，若比较函数返回正数，则交换位置
```
cosnt arr1 = [1, 10, 5, 11]
cosnt arr3 = arr1.sort((a, b) => a-b) // [1, 5, 10, 11]
``` -->

## 2 栈
栈是一个后进先出的数据结构，用于某些需要限制操作的场景，如vue-router、react-router中保存历史路由的数据结构就是栈。

优点：可以看做一个功能限制的数组，增、删、查栈顶元素的时间复杂度为O(1)

* 栈的长度属性一般为count

### 2.1 使用数组实现栈数据结构
```
class Stack {
  constructor () {
    this._items = []
    this.count = this.size()
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

### 2.2 使用对象实现栈数据结构
js中数组数据结构也是由对象实现的，故应该使用对象实现栈数据结构
```
class Stack {
  constructor () {
    this._init()
    this.count = this.size()
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

## 3 队列
队列是一种先进先出的数据结构，js事件循环中就有宏任务与微任务，他们都是队列结构，先进入的先执行

优点：也可以看做功能受限的数组，增、删、查队列顶部的时间复杂度都是O(1)

后面的数据结构统一采用对象实现（对象在js中更接近传统语言的哈希表，查询速度有保障）

### 3.1 实现
```
class Queue {
  constructor () {
    this._init()
    this.count = this.size()
  }
  _init () {
    this._items = {}
    // 长度，也可以表示队列中最后一个元素的key值，实现方法很多。（这里采用的是表示长度）
    this._count = 0
    // 存在元素时，该属性表示队列顶部元素的key值（可以看做下标值）
    this._lowestCount = 0
  }
  enqueue (...elements) {
    for (let element of elements) {
      this._items[this._lowestCount + this._count] = element
      this._count++
    }
  }
  dequeue () {
    if (this.isEmpty()) {
      return undefined
    }
    const resutl = this._items[this._lowestCount]
    Reflect.deleteProperty(this._items, this._lowestCount)
    this._lowestCount++
    this._count--
    return resutl
  }
  clear () {
    this._init()
  }
  peek () {
    if (this.isEmpty()) {
      return undefined
    }
    return this._items[this._lowestCount]
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
    let str = this._items[this._lowestCount].toString()
    for (let i = this._lowestCount + 1; i < this._lowestCount + this._count; i++) {
      str += `,${this._items[i]}`
    }
    return str
  }
}
```

### 3.2 双端队列
双端队列允许从两端进出队列

```
class Deque {
  constructor () {
    this._init()
    this.count = this.size()
  }
  _init() {
    this._items = {}
    // 存在元素时，表示队列前端第一个元素key
    this._lowestCount = 0
    // 存在元素时，表示队列后端第一个元素key
    this._tallestCount = 0
  }
  clear () {
    this._init()
  }
  addBack (...elements) {
    for (let element of elements) {
      this._items[this._tallestCount] = element
      this._tallestCount++
    }
  }
  removeBack () {
    if (this.isEmpty()) {
      return undefined
    }
    const result = this._items[this._tallestCount - 1]
    Reflect.deleteProperty(this._items, this._tallestCount - 1)
    this._tallestCount--
    return result
  }
  removeFront () {
    if (this.isEmpty()) {
      return undefined
    }
    const result = this._items[this._lowestCount]
    Reflect.deleteProperty(this._items, this._lowestCount)
    this._lowestCount++
    return result
  }
  addFront (...elements) {
    for (let element of elements) {
      this._items[this._lowestCount - 1] = element
      this._lowestCount--
    }
  }
  peekFront () {
    if (this.isEmpty()) {
      return undefined
    }
    return this._items[this._lowestCount]
  }
  peekBack () {
    if (this.isEmpty()) {
      return undefined
    }
    return this._items[this._tallestCount - 1]
  }
  isEmpty () {
    return this._lowestCount === this._tallestCount
  }
  size () {
    return this._tallestCount - this._lowestCount
  }
  toString () {
    if (this.isEmpty()) {
      return ''
    }
    let str = this._items[this._lowestCount]
    for (let i = this._lowestCount + 1; i < this._tallestCount; i++) {
      str += `,${this._items[i]}`
    }
    return str
  }
}
```

### 3.3 练习
#### 3.3.1 击鼓传花游戏(循环队列)
要求：传入一个数组，让花在数组中传递n次，拿到花者淘汰并记录下来，知道剩一人为止。

// 实际上这个例子使用数组实现效率更高，使用队列实现的时间与队列长度以及传递次数有关，时间复杂度为O(n^2)
```
// @params elementsList: 数组
// @params num: 传递次数
function hotPotato(elementsList, num) {
  const queue = new Queue()
  // 全部进入队列中
  for (let element of elementsList) {
    queue.enqueue(element)
  }
  let remove = []
  while (queue.size() > 1) {
    for (let i=0; i< num; i++) {
      queue.enqueue(queue.dequeue())
    }
    remove.push(queue.dequeue())
  }
  return {
    remove,
    value: queue.peek()
  }
}
```

#### 3.3.2 判断一个字符串是不是回文字符串
要求： 传入一个字符串，判断是不是回文字符串，回文字符串：除去空格、符号，忽略大小写，正着读和反着读相同的字符串

// 数组实现，数组实现中发生了装箱与拆箱，效率可能比双端队列低一些
```
function palindromeChecker (str) {
  str = str.replace(/[^1-9a-zA-Z]/g, "")
  str =  str.toLocaleLowerCase()
  return str.split('').reverse().join('') === str
}
```

也可以使用栈实现

// 双端队列实现
```
function palindromeChecker (str) {
  if (str == null || (typeof str === 'string' && str.length === 0)) return
  str = str.replace(/[^1-9a-zA-Z]/g, "")
  str =  str.toLocaleLowerCase()
  const deque = new Deque()
  for (const s of str) {
    deque.addBack(s)
  }
  while(deque.size() > 1) {
    if (deque.removeBack() !== deque.removeFront()) return false
  }
  return true
}
```

## 4. 链表
链表在内存中是非连续排列的，链表中的每一个元素都有一个指针指向下一个链表元素

优点: 插入与删除操作更快，不需要考虑容量问题(数组需要考虑)
缺点: 查找速度慢

### 4.1 单向链表
```
class Node {
  constructor (element) {
    this.element = element
    this.next = null
  }
}

class LikedList {
  constructor () {
    this._head = null
    this.count = 0
  }
  getElementAt (index) {
    if (index < 0 || index > this.count - 1) return undefined
    let current = this._head
    for (let i = 0; i <= index; i++) {
      current = current.next
    }
    return current
  }
  indexOf (element) {
    let current = this._head
    for (let i = 0; i < this.count; i++) {
      if (current.element === element) return i
    }
    return -1
  }
  push (element) {
    const node = new Node(element)
    if (this.count == 0) {
      this._head = node
    } else {
      const current = this.getElementAt(this.count - 1)
      current.next = node
    }
    this.count++
  }
  insert (element, index) {
    if (index < 0 || index > this.count) return false
    const node = new Node(element)
    if (index === 0) {
      node.next = this._head
      this._head = node
    } else {
      const previous = this.getElementAt(index - 1)
      const current = previous
      node.next = current
      previous.next = node
    }
    this.count++
    return true
  }
  remove (element) {
    const index = this.indexOf(element)
    return this.removeAt(index)
  }
  removeAt (index) {
    if (index < 0 || index > this.count -1) return undefined
    let current
    if (index === 0) {
      current = this._head
      this._head = current.next
    } else {
      const previous = this.getElementAt(index - 1)
      current = previous.next
      previous.next = current.next
    }
    this.count--
    return current.element
  }
  isEmpty () {
    return this.count === 0
  }
  size () {
    return this.count
  }
  toString () {
    if (this.isEmpty()) return ''
    let current = this._head
    let objStr = current.element.toString
    for (let i = 0; i < this.count; i++) {
      current = current.next
      objStr += `,${current.element}`
    }
    return objStr
  }
}
```

### 4.2 双向链表
```
class DoublyNode extends Node{
  constructor (element) {
    super(element)
    this.prev = next
  }
}

class DoublyLikedList extends LikedList {
  constructor () {
    super()
    this._tail = null
  }

  // 继承
  // getElementAt
  // idnexOf
  // isEmpty
  // size
  // toString
  // remove

  push (element) {
    const node = new DoubleyNode(element)
    if (this.count == 0) {
      this._head = node
      this._tail = node
    } else {
      const current = this.getElementAt(this.count - 1)
      node.prev = current
      current.next = node
      this._tail = node
    }
    this.count++
  }
  insert (element, index) {
    if (index < 0 || index > this.count) return false
    const node = new DoublyNode(element)
    if (this.count === 0) {
      this._head = node
      this._tail = node
    } else if (index === 0) {
      const current = this._head
      node.next = current
      current.prev = node
      this._head = node
    } else if (index === this.count) {
      const current = this.getElementAt(this.count - 1)
      node.prev = current
      current.next = node
      this._tail = node
    } else {
      const previous = this.getElementAt(index - 1)
      const current = previous.next
      node.prev = previous
      node.next = current
      previous.next = node
      current.prev = node
    }
    this.count++
    return true
  }
  removeAt (index) {
    if (index < 0 || index > this.count - 1) return undefined
    let current
    if (this.count === 1) {
      current = this._head
      this._head = null
      this._tail = null
    } else if (index === 0) {
      current = this._head
      const next = current.next
      next.prev = null
      this._head = next
    } else if (index === this.count - 1) {
      current = this._tail
      const previous = current.prev
      previous.next = null
      this._tail = previous
    } else {
      current = this.getElementAt(index)
      const previous = current.prev
      const next = current.next
      previous.next = next
      next.prev = previous
    }
    this.count--
    return current.element
  }
}
```

### 4.3 单向循环链表
```
class CircularLikedList extends LikedList {
  constructor () {
    super()
  }

  // 继承
  // getElementAt
  // indexOf
  // isEmpty
  // size
  // toString

  push (element) {
    const node = new Node(element)
    if (this.count === 0) {
      node.next = node
      this._head = node
    } else {
      const current = this.getElementAt(this.count - 1)
      node.next = current.next
      current.next = node
    }
    this.count++
  }
  insert (element, index) {
    if (index < 0 || index > this.count) return false
    const node = new Node(element)
    if (this.count === 0) {
      node.next = node
      this._head = node
    } else {
      const previous = this.getElementAt(index - 1)
      node.next = previous.next
      previous.next = node
    }
    this.count++
    return true
  }
  removeAt (index) {
    if (index < 0 || index > this.count - 1) return undefined
    let current
    if (index === 0) {
      const previous = this.getElementAt(this.count - 1)
      current = previous.next
      previous.next = current.next
      this._head = current.next
    } else {
      const previous = this.getElementAt(index - 1)
      current = previous.next
      previous.next = current.next
    }
    this.count--
    return current.element
  }
}
```

### 4.4 双向循环链表
```
class DoublyCircularLikedLIst extends DoublyLikedList {
  constructor () {
    super()
  }

  // 继承
  // getElementAt
  // indexOf
  // isEmpty
  // size
  // toString

  push (element) {
    const node = new DoublyNode(element)
    if (this.count === 0) {
      node.prev = node
      node.next = node
      this._head = node
      this._tail = node
    } else {
      const current = this.getElementAt(this.count - 1)
      const next = current.next
      node.next = next
      node.prev = current
      current.next = node
      next.prev = node
    }
    this.count++
  }
  insert (element, index) {
    if (index < 0 || index > this.count) return false
    const node = new DoublyNode(element)
    if (this.count === 0) {
      node.prev = node
      node.next = node
      this._head = node
      this._tail = node
    } else if (index === 0) {
      const previous = this._tail
      const next = previous.next
      node.prev = previous
      node.next = next
      previous.next = node
      next.prev = node
      this._head = node
    } else if (index === this.count - 1) {
      const previous = this._tail
      const next = previous.next
      node.prev = previous
      node.next = next
      previous.next = node
      next.prev = node
      this._tail = node
    } else {
      const previous = this.getElementAt(index - 1)
      const next = previous.next
      node.prev = previous
      node.next = next
      previous.next = node
      next.prev = node
    }
    this.count++
    return true
  }
  removeAt (index) {
    if (index < 0 || index > this.count - 1) return undefined
    let current
    if (this.count === 1) {
      current = this._head
      this._head = null
      this._tail = null
    } else if (index === 1) {
      const previous = this._tail
      current = previous.next
      const next = current.next
      previous.nexxt = next
      next.prev = previous
      this._head = next
    } else if (index === this.count - 1) {
      current = this._tail
      const previous = current.prev
      const next = current.next
      previous.next = next
      next.prev = previous
      this._tail = next
    } else {
      const previous = this.getElementAt(index)
      current = previous.next
      const next = current.next
      previous.next = next
      next.prev = previous
    }
    this.count--
    return current.element
  }
}
```

### 4.5 有序链表
```
smallToLarge = Symbol('smallToLarge')
largeToSmall = Symbol('largeToSmall')

class SortedLikedList extends LikedList {
  constructor () {
    super()
    this._order = smallToLarge
  }

  // 继承
  // getElementAt
  // indexOf
  // isEmpty
  // size
  // toString
  // remove
  // removeAt

  push () {
    return undefined
  }
  insert (element) {
    const node = new Node(element)
    let previous
    let current = this._head
    while (current.next) {
      if (this.isInsert(element, current.element)) {
        if (previous == null) {
          // 第一个位置插入
          node.next = current
          this._head = node
        } else {
          node.next = current
          previous.next = node
        }
        return true
      }
      previous = current
      current = current.next
    }
    // 插入最后一位
    current.next = node
  }
  isInsert (newNode, oldNode) {
    return this._order === smallToLarge ? newNode <= oldNode : newNode >= oldNode
  }
}
```

## 5 集合
集合是一组无序且唯一的元素组成的(常用于去重)


### 5.1 实现
```
class MySet {
  constructor () {
    this._init()
  }

  _init () {
    this._item = {}
    this.count = 0
  }

  has (element) {
    return Reflect.has(this._item, element)
  }

  add (element) {
    if (this.has(element)) return false
    this._item[element] = element
    this.count++
    return true
  }

  delete (element) {
    if (!this.has(element)) return false
    this.count--
    return Reflect.deleteProperty(this._item, element)
  }

  clear () {
    this._init()
  }

  size () {
    return this.count
  }

  values () {
    return Object.values(this._item)
  }
}
```

### 5.2 集合操作
1. 交集
```
[...set1, ...set2]
```
2. 并集
```
[...set1].filter(item => set2.has(item))
```
3. 差集
```
[...set1].filter(item => !set2.has(item))
```
4. 子集
```
[...set1].every(item => set2.has(item ))
```

## 6 字典
字典也称作映射、符号表或关联数组。是一种一对一的关系，js中的map就是字典结构。

### 6.1 实现
```
class ValuePair {
  constructor(key, value) {
    this.key = key
    this.value = value
  }

  toString () {
    return `[#${this.key}:${this.value}]`
  }
}

class Dictionary {
  constructor () {
    this._init()
  }

  _init () {
    this._table = {}
    this.count = 0
  }

  keyToString (key) {
    if (key === null) {
      return 'null'
    } else if (key === undefined) {
      return 'undefined'
    } else {
      return key.toString()
    }
  }

  set (key, value) {
    if (key == null) return false
    if (!this.hasKey(key)) this.count++
    this._table[this.keyToString(key)] = new ValuePair(key, value)
    return true
  }

  remove (key) {
    if (this.hasKey(key)) {
      this.count--
      return Reflect.deleteProperty(this._table, this.keyToString(key))
    }
    return false
  }

  hasKey (key) {
    return Reflect.has(this._table, this.keyToString(key))
  }

  get (key) {
    // 第一种实现方法
    // if (!this.hasKey(this.keyToString(key))) return undefined
    // return this._table[this.keyToString(key)].value
    // 第二种实现方法
    const valuePair = this._table[this.keyToString(key)]
    return valuePair == null ? undefiend : valuePair.value
  }

  clear () {
    this._init()
  }

  size () {
    return this.count
  }

  isEmpty () {
    return this.count === 0
  }

  keys () {
    let keys = []
    for (let item in this._table) {
      keys.push(this._table[item].key)
    }
    return keys
  }

  values () {
    let values = []
    for (let item in this._table) {
      values.push(this._table[item].value)
    }
    return values
  }

  entries () {
    let entries = []
    for (let item in this._table) {
      const valuePair = this._table[item]
      entries.push([valuePair.key, valuePair.value])
    }
    return entries
  }

  keyValues () {
    return this.entries()
  }

  forEach (callback, ...arg) {
    if (typeof callback !== 'function') throw new TypeError('callback is not a function')
    if (arg.length !== 0 && typeof arg[0] === 'object') {
      callback = callback.bind(arg[0])
    }
    const entries = this.entries()
    for (let item in this._table) {
      const valuePair = this._table[item]
      const flag = callback(valuePair.key, valuePair.value, entries)
      if (flag === false) break
    }
  }

  toString () {
    if (this.isEmpty()) return ''
    let strObj = ''
    for (let item in this._table) {
      strObj += `${this._table[item].toString()},`
    }
    strObj = strObj.substr(0, strObj.length - 1)
    return strObj
  }
}
```

### 6.2 小tips
字典的get方法中有两种方法实现，第一种方法先判断key是否存在再取出，第二种直接取出，根据取出的值是否为null来决定返回值。

第一种方式需要两次访问存储字典数据的对象，开销更大。一般采用第二种方式，这在node中也很常见，如读取文件时，官网推荐做法是直接读取文件并try，文件不存在时在catch中处理，而不是先判断文件是否存在再进行读取。

## 7 散列表(HashTable或HashMap)
散列表又叫哈希表是一种特殊的字典，散列表的键是数值类型，查找数据时时间复杂度可达O(1)。
字典中的key不能或者不适合作为数据存储的下标，可以考虑通过一个变化（计算）把它们映射到一种下标，也就是通过散列函数实现散列表。

散列表实现思想
1. 选定一个整数的下标范围（如0-N）的顺序表
2. 选定一个从实际关键码集合到上述下标范围的适当映射h(h就是散列函数)
  1. 存入关键码数据为key的数据时，将其存入表中第h(key)个位置
  2. 遇到以key为关键码的检索时，直接去找表中第h(key)个位置的元素


### 7.1 lose lose散列函数
lose lose散列函数是最常见的散列函数，该函数计算方式为：若key为数值类型，则直接返回，否则将key转换为字符串，遍历key的每个字符，转换为ASCII码值并相加。
```
loseloseHashCode (key) {
  if (typeof key === 'nummber') {
    return key
  }
  const tableKey = this.keyToString(key)
  let hashCode = 0
  for (let item of tableKey) {
    hashCode += item.charCodeAt()
  }
  return hashCode % 37
}
```

### 7.2 散列表的实现
```
class ValuePair {
  constructor(key, value) {
    this.key = key
    this.value = value
  }
  toString () {
    return `[#${this.key}:${this.value}]`
  }
}

class HashMap {
  constructor () {
    this._init()
  }
  _init () {
    this._table = {}
    this.count = 0
  }
  keyToString (key) {
    if (key === null) {
      return 'NULL'
    } else if (key === undefined) {
      return 'UNDEFINED'
    } else {
      return key.toString()
    }
  }
  loseloseHashCode (key) {
    if (typeof key === 'nummber') {
      return key
    }
    const tableKey = this.keyToString(key)
    let hashCode = 0
    for (let item of tableKey) {
      hashCode += item.charCodeAt()
    }
    return hashCode % 37
  }
  getHashCode (key) {
    return this.loseloseHashCode(key)
  }
  put (key, value) {
    if (key == null) return false
    const hashCode = this.getHashCode(key)
    this._table[hashCode] = new ValuePair(key, value)
    this.count++
    return true
  }
  remove (key) {
    const hashCode = this.getHashCode(key)
    const valuePair = this._table[hashCode]
    if (valuePair == null) return false
    Reflect.deleteProperty(this._table, hashCode)
    this.count--
    return valuePair.value
  }
  hasKey (key) {
    const hashCode = this.getHashCode(key)
    return Reflect.has(this._table, hashCode)
  }
  clear () {
    this._init()
  }
  get (key) {
    const hashCode = this.getHashCode(key)
    const valuePiar = this._table[hashCode]
    return valuePiar == null ? undefined : valuePiar.value
  }
  isEmpty () {
    return this.count === 0
  }
  size () {
    return this.count
  }
  toString () {
    if (this.isEmpty()) return ''
    let strObj = ''
    for (let item in this._table) {
      strObj += `${this._table[item].toString()},`
    }
    strObj = strObj.substr(0, strObj.length - 1)
    return strObj
  }
}
```

### 7.3 散列集合
为提高集合的取值速度到O(1)，也可以使用散列函数实现散列集合

### 7.4 处理散列表中的冲突
不同的key可能对应同一个hashCode，在执行插入时，后一个key会覆盖前一个key的值，这就是冲突

#### 7.4.1 分离链接解决冲突
hashCode的值原来存储的是valuePair对象，现在存入一个链表，将valuePair作为链表的元素，同一个hashCode存入同一个链表中。

```
const { LikedList } = require('./likedList2')

class HashTableSeparateChaining extends HashMap{
  constructor () {
    super()
  }
  put (key, value) {
    if (key == null) return false
    const hashCode = this.getHashCode(key)
    if (this._table[hashCode] == null) this._table[hashCode] = new LikedList()
    this._table[hashCode].push(new ValuePair(key, value))
    this.count++
    return true
  }
  remove (key) {
    const hashCode = this.getHashCode(key)
    const likedList = this._table[hashCode]
    if (likedList == null || likedList.isEmpty()) return false
    let current = likedList.getHead()
    for (let i = 0; i < likedList.size(); i++) {
      if (current.element.key === key) {
        likedList.removeAt(i)
        if (likedList.isEmpty()) Reflect.deleteProperty(this._table, hashCode)
        break
      }
      current = current.next
    }
    this.count--
    return current.element.value
  }
  get (key) {
    const hashCode = this.getHashCode(key)
    const likedList = this._table[hashCode]
    if (likedList == null || likedList.isEmpty()) return undefined
    let current = likedList.getHead()
    for (let i = 0; i < likedList.size(); i++) {
      if (current.element.key === key) {
        break;
      }
      current = current.next
    }
    return current == null ? undefined : current.element.value
  }
}
```

#### 7.4.2 线性探查法解决冲突

#### 7.4.3 更好的散列函数
评估一个散列函数是否是一个好的散列函数:
* 插入和检索元素的时间（即性能）
* 较低的冲突可能性

loselose散列函数会照成较多的冲突

较受推崇的散列函数：djb2
```
djb2HashCode(key) {
  const tableKey = this.keyToString(key)
  let hash = 5381; // 质数，常用5381
  for (let i = 0; i < tableKey.length; i++) {
    // 33是幻数，即常用的数
    hash = (hash * 33) + tableKey.charCodeAt(i)
  }
  return hash % 1013 // 随机质数，这个值应该比我们预期的哈希表的大小要大
}
```

## 8 递归
学习看懂浏览器的函数调用栈

使用递归函数的时候尽量写成尾调用递归的形式

### 8.1 计算一个数的阶乘
```
function factorial (num) {
  if (num < 0) {
    return undefined
  } else if (num === 1 || num === 0) {
    return 1
  } else {
    return num * factorial(num - 1)
  }
}
```

### 8.2 计算斐波那契数列第n个数的值
```
function fibonacci (num) {
  if (num <= 0) {
    return 0
  } else if (num <= 2) {
    return 1
  } else {
    return fibonacci(num - 1) + fibonacci(num - 2)
  }
}
```

## 9 树
一个树结构包含一系列存在父子关系的节点。每个节点都有一个父节点（除了顶部的第一个节点）以及零个或多个子节点。

### 9.1 术语
* 键: 树中的节点称为键。
* 节点: 树中的每个元素都叫作节点。
* 根节点: 位于树顶部的节点。
* 内部节点与外部节点: 节点分为内部节点和外部节点，至少有一个子节点的节点称为内部节点。没有子节点的节点称为外部节点或叶节点。
* 子树: 子树由节点和它的后代构成。
* 节点的深度: 节点的深度取决于它的祖先节点的数量(这个深度看做高度更好理解)。
* 树的高度: 树的高度取决于所有节点深度的最大值。
* 层级: 根节点在第0层，它的子节点在第1层，以此类推。
* 二叉树: 二叉树中的节点最多只能有两个子节点，一个是左侧子节点，另一个是右侧子节点。
* 二叉搜索树（BST）: 二叉搜索树（BST）是二叉树的一种，但是只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大的值。

### 9.2 二叉搜索树
特性: 二叉搜索树要求左子节点必须比节点的值小，右子节点必须比节点的值大。
二叉树的查找最大次数为该二叉树的高度
缺点: 由于二叉树的特性，导致某一棵子树的高度可能很高，这时查询速度会变慢。
```
// 二叉搜索树
const compare = {
  LESS_THEN: -1,
  BIGGER_THEN: 1
}
class Node {
  constructor (key) {
    this.key = key
    this.left = null
    this.right = null   
  }
}
class BinerySearchTree {
  constructor () {
    this.root = null
  }
  compareFn (left, right) {
    return left < right ? compare.LESS_THEN : (left > right ? compare.BIGGER_THEN : 0)
  }
  insert (key) {
    if (this.root == null) {
      this.root = new Node(key)
    } else {
      this.insertNode(this.root, key)
    }
  }
  insertNode (node, key) {
    if (this.compareFn(key, node.key) === compare.LESS_THEN) {
      if (node.left == null) {
        node.left = new Node(key)
      } else {
        this.insertNode(node.left, key)
      }
    } else {
      if (node.right == null) {
        node.right = new Node(key)
      } else {
        this.insertNode(node.right, key)
      }
    }
  }
  search (key) {
    return this.searchNode(this.root, key)
  }
  searchNode (node, key) {
    if (node == null) return false
    if (this.compareFn(key, node.key) === compare.LESS_THEN) {
      return this.searchNode(node.left, key)
    } else if (this.compareFn(key, node.key) === compare.BIGGER_THEN) {
      return this.searchNode(node.right, key)
    } else {
      return true
    }
  }
  inOrderTraverse (cb) {
    this.inOrderTraverseNode(this.root, cb)
  }
  inOrderTraverseNode (node, cb) {
    if (node == null) return
    this.inOrderTraverseNode(node.left, cb)
    cb(node.key)
    this.inOrderTraverseNode(node.right, cb)
  }
  preOrderTraverse (cb) {
    this.preOrderTraverseNode(this.root, cb)
  }
  preOrderTraverseNode (node, cb) {
    if (node == null) return
    cb(node.key)
    this.preOrderTraverseNode(node.left, cb)
    this.preOrderTraverseNode(node.right, cb)
  }
  postOrderTraverse (cb) {
    this.postOrderTraverse(this.root, cb)
  }
  postOrderTraverseNode (node, cb) {
    if (node == null) return
    this.postOrderTraverseNode(node.left, cb)
    this.postOrderTraverseNode(node.right, cb)
    cb(node.key)
  }
  min () {
    if (this.root == null) return undefined
    let current = this.root
    while (current.left) {
      current = current.left
    }
    return current.key
  }
  max () {
    if (this.root == null) return undefined
    let current = this.root
    while (current.right) {
      current = current.right
    }
    return current.key
  }
  remove (key) {
    this.root = this.removeNode(this.root, key)
  }
  // 注意这里返回的是删掉的节点(或者说是传入的节点)
  removeNode (node, key) {
    if (node == null) return undefined
    if (this.compareFn(key, node.key) === compare.LESS_THEN) {
     node.left = this.removeNode(node.left, node)
     return node
    } else if (this.compareFn(key, node.key) === compare.BIGGER_THEN) {
      node.right = this.removeNode(key, node.right)
      return node
    } else {
      if (node.left == null && node.right == null) {
        node = null
        return node
      } else if (node.left == null) {
        node = node.right
        return node
      } else if (node.right == null) {
        node = node.left
        return node
      } else {
        let current = node.right
        while (current.left) {
          current = current.left
        }
        node.key = current.key
        node.right = this.removeNode(node.right, current.key)
        return node
      }
    }
  }
}
```

### 9.3 AVL自平衡树
AVL树是一棵自平衡树，属于二叉搜索树，目的是解决二叉搜索树时间复杂度可能变为O(n)的情况(不停的在一棵子树上插入数据)
概念:
* 节点的高度: 节点到任意子节点变的最大值
* 平衡因子: 右子树与左子树的高度的差，平衡因子不为-1、0、1时，该树需要平衡

特点:
* 查询速度非常快，时间复杂度为O(log2 N)
* 插入删除速度很慢，每一次插入或删除都会导致整颗树发生改变

```
const BalanceFactor = {
  UNBALANCED_LEFT: Symbol('unbalanced_left'),
  LIGHTLY_UNBALANCED_LEFT: Symbol('lightly_unbalanced_left'),
  BALANCED: Symbol('balanced'),
  LIGHTLY_UNBALANCED_RIGHT: Symbol('lightly_unbalanced_right'),
  UNBALANCED_RIGHT: Symbol('unbalanced_right'),
}
class AVLTree extends BinarySearchTree {
  constructor () {
    super()
  }
  getNodeHeight (node) {
    if (node == null) return -1
    return Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) + 1
  }
  getBalanceFactor (node) {
    const heightDifference = this.getNodeHeight(node.right) - this.getNodeHeight(node.left)
    const configure = [
      [-2, BalanceFactor.UNBALANCED_RIGHT],
      [-1, BalanceFactor.LIGHT_UNBALANCED_RIGHT],
      [1, BalanceFactor.LIGHTLY_UNBALANCED_LEFT],
      [2, BalanceFactor.UNBALANCED_LEFT], 
    ]
    const map = new Map(configure)
    const balanceFactor = map.get(heightDifference)
    return balanceFactor ? balanceFactor : BalanceFactor.BALANCED
  }
  rotationLeft (node) {
    const temp = node.right
    node.right = temp.left
    temp.left = node
    return temp
  }
  rotationRight (node) {
    const temp = node.left
    node.left = temp.right
    temp.right = node
    return temp
  }
  rotationLeftRight (node) {
    node.right = this.rotationLeft(node.right)
    return this.rotationRight(node)
  }
  rotationRightLeft (node) {
    node.left = this.rotationRight(node.left)
    return this.rotationLeft(node)
  }
  balance (node) {
    if (node == null) return null
    const balanceFactor = this.getBalanceFactor(node)
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
      if (this.getNodeHeight(node.left) > this.getNodeHeight(node.right)) {
        node = this.rotationLeftRight(node)
      } else {
        node = this.rotationLeft(node)
      }
    } else if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
      if (this.getNodeHeight(node.right) > this.getNodeHeight(node.left)) {
        node = this.rotationRightLeft(node)
      } else {
        node = this.rotationRight(node)
      }
    }
    return node
  }
  insert (key) {
    this.root = this.insertNode(this.root, key)
  }
  insertNode (node, key) {
    if (node == null) return new Node(key)
    if (this.compareFn(key, node.key) === Compare.LESS_THEN) {
      node.left = this.insertNode(node.left, key)
    } else {
      node.right = this.insertNode(node.right, key)
    }
    return this.balance(node)
  }
  removeNode (node, key) {
    node = super.removeNode(node, key)
    return this.balance(node)
  }
}
```

### 9.4 红黑树
参考文章: https://www.jianshu.com/p/e136ec79235c
红黑树也是一棵自平衡树，属于二叉搜索树。

概念：
* 节点不是红的就是黑的，根节点是黑的，叶子节点是黑的(为null的节点)
* 相邻的两个节点不可同为红色
* 任意给定一个节点到他的任意后代节点(null节点)的路径中包含相同的黑色节点
  * 推断出：如果一个结点存在黑子结点，那么该结点肯定有两个子结点

操作：
* 左旋：以某个结点作为支点(旋转结点)，其右子结点变为旋转结点的父结点，右子结点的左子结点变为旋转结点的右子结点，左子结点保持不变。
* 右旋：以某个结点作为支点(旋转结点)，其左子结点变为旋转结点的父结点，左子结点的右子结点变为旋转结点的左子结点，右子结点保持不变。
* 变色：结点的颜色由红变黑或由黑变红。

特点:
* 红黑树的插入与删除效率比AVL自平衡树要高。AVL树需要更新整颗树使得每个节点的平衡因子小于等于1，而红黑树只更新局部
* 红黑树的平衡因子可能达到2，红黑树并不是一个完美平衡二叉查找树，故查找速度稍慢与AVL树。

为什么插入的节点都是红色的？因为插入红色的节点并不会破坏红黑树的黑色平衡

```
const Colors = {
  RED: Symbol('red'),
  BLACK: Symbol('black')
}
class RedBlackNode extends Node{
  constructor (key, color = Colors.RED) {
    super(key)
    this.color = color
    this.parent = null
  }
  isRed () {
    return this.color === Colors.RED
  }
}

class RedBlackTree extends BinarySearchTree {
  constructor () {
    super()
  }
  insert (key) {
    if (this.root == null) {
      this.root = new RedBlackNode(key, Colors.BLACK)
    } else {
      const newNode = this.insertNode(this.root, key)
      this.fixTreeProperties(newNode)
    }
  }
  insertNode (node, key) {
    if (this.compareFn(key, node.key) === Compare.LESS_THEN) {
      if (node.left == null) {
        node.left = new RedBlackNode(key)
        node.parent = node
        return node.left
      } else {
        return this.insertNode(node.left, key)
      }
    } else {
      if (node.right == null) {
        node.right = new RedBlackNode(key)
        node.parent = node
        return node.right
      } else {
        return this.insertNode(node.right, key)
      }
    }
  }
  fixTreeProperties (node) {
    while (node && node.parent && node.isRed() && node.parent.isRed()) {
      const parent = node.parent
      const grandParent = parent.parent
      if(grandParent == null) return
      if (parent === grandParent.left) {
        const uncle = grandParent.right
        if (uncle && uncle.isRed()) {
          grandParent.color = Colors.RED
          parent.color = Colors.BLACK
          uncle.color = Colors.BLACK
          node = grandParent
        } else {
          if (node === parent.right) {
            this.rotationLeft(parent)
            node = parent
            parent = node.parent
          }
          this.rotationRight(grandParent)
          parent.color = Colors.BLACK
          grandParent.color = Colors.RED
          node = parent
        }
      } else {
        const uncle = grandParent.left
        if (uncle && uncle.isRed()) {
          grandParent.color = Colors.RED
          parent.color = Colors.BLACK
          uncle.color = Colors.BLACK
          node = grandParent
        } else {
          if (node === parent.left) {
            this.rotationRight(parent)
            node = parent
            parent = node.parent
          }
          this.rotationLeft(grandParent)
          parent.color = Colors.BLACK
          grandParent.color = Colors.RED
          node = parent
        }
      }
    }
  }
  rotationLeft (node) {
    const temp = node.right
    node.right = temp.left
    if (temp && temp.left) temp.left.parent = node
    temp.parent = node.parent
    if (!temp.parent) this.root = temp
    else if (node.parent.left === node) node.parent.left = temp
    else if (node.parent.right === node) node.parent.right = temp
    temp.left = node
    node.parent = temp
  }
  rotationRight (node) {
    const temp = node.left
    node.left = temp.right
    if (temp && temp.right) temp.right.parent = node
    temp.parent = node.parent
    if (temp.parent == null) this.root = temp
    else if (node.parent.left === node) node.parent.left = temp
    else if (node.parent.right === node) node.parent.right = temp
    temp.right = node
    node.parent = temp
  }
}
```

### 10 二叉堆与堆排序
二叉堆是一种特殊的二叉树，他的顶点是最大值(或最小值)，用于经典算法堆排序。
特点:
* 是一棵完全二叉树
* 二叉堆不是最大堆就是最小堆，它可以快速的找到最大值(或最小值)
* 堆的每颗子树都是一个堆
* 堆与二叉搜索树不同，他是一棵完全二叉树，所以可以使用数组结构来存储堆中的数据

### 10.1 最小堆
```
const Conpare = {
  LESS_THEN: -1,
  BIGGER_THEN: 1
}
class MinHeap {
  constructor () {
    this.heap = []
  }
  compareFn (left, right) {
    return left < right ? Compare.LESS_THEN : (left > right ? Compare.BIGGER_THEN : 0)
  }
  getLeftIndex (index) {
    return 2 * index + 1
  }
  getRightIndex (index) {
    return 2 * index + 2
  }
  getParentIndex (index) {
    if (index === 0) return undefined
    return Math.floor((index - 1) / 2)
  }
  insert (value) {
    if (value == null) return false
    this.heap.push(value)
    this.shifUp(this.heap.length - 1)
    return true
  }
  extract () {
    if (this.isEmpty()) return void 0
    const result = this.heap.shift()
    if (!this.isEmpty()) this.shifDown(0)
    return result
  }
  findMinimum () {
    return this.isEmpty() ? void 0  : this.heap[0]
  }
  size () {
    return this.heap.length
  }
  isEmpty () {
    return this.size() === 0
  }
  shifUp (index) {
    let parentIndex = this.getParentIndex(index)
    while (index > 0 && this.compareFn(this.heap[index], this.heap[parentIndex]) === Compare.LESS_THEN) {
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]]
      index = parentIndex
      parentIndex = this.getParentIndex(index)
    }
  }
  shifDown (index) {
    const left = this.getLeftIndex(index)
    const right = this.getRightIndex(index)
    const size = this.size()
    if (left < size && this.compareFn(this.heap[index], this.heap[left]) === Compare.BIGGER_THEN) {
      [this.heap[index], this.heap[left]] = [this.heap[left], this.heap[index]]
      this.shifDown(left)
    }
    if (right < size && this.compareFn(this.heap[index], this.heap[right]) === Compare.BIGGER_THEN) {
      [this.heap[index], this.heap[right]] = [this.heap[right], this.heap[index]]
      this.shifDown(right)
    }
  }
}
```

### 10.2 最大堆
```
class MaxHeap {
  constructor () {
    this.heap = []
  }
  compareFn (left, right) {
    return left < right ? Compare.LESS_THEN : (left > right ? Compare.BIGGER_THEN : 0)
  }
  getLeftIndex (index) {
    return 2 * index + 1
  }
  getRightIndex (index) {
    return 2 * index +2
  }
  getParentIndex (index) {
    return Math.floor((index - 1) / 2)
  }
  insert (value) {
    if (value == null) return false
    this.heap.push(value)
    this.shifUp(index)
    return true
  }
  extract () {
    if (this.isEmpty()) return void 0
    const result = this.heap.shift()
    if (!this.isEmpty()) this.shifDown(0)
    return result
  }
  isEmpty () {
    return this.size() === 0
  }
  size () {
    return this.heap.length
  }
  shifUp (index) {
    let parentIndex = this.getParentIndex(index)
    while (index > 0 && this.compareFn(this.heap[index], this.heap[parentIndex]) === Compare.BIGGER_THEN) {
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]]
      index = parent
      parent = this.getParentIndex(index)
    }
  }
  shifDown (index) {
    const left = this.getLeftIndex(index)
    const right = this.getRightIndex(index)
    const size = this.size()
    if (left < size && this.compareFn(this.heap[index], this.heap[left]) === Compare.LESS_THEN) {
      [this.heap[left], this.heap[index]] = [this.heap[index], this.heap[left]]
      this.shifDown(left)
    }
    if (right < size && this.compareFn(this.heap[index], this.heap[right]) === Compare.LESS_THEN) {
      [this.heap[right], this.heap[index]] = [this.heap[index], this.heap[right]]
      this.shifUp(right)
    }
  }
}
```

### 10.3 堆排序算法 时间复杂度O(nlogn)
```
function heapSort (arr, compareFn) {
  buildMaxHeap(arr, compareFn)
  let index = arr.length - 1
  while (index > 0) {
    [arr[0], arr[index]] = [arr[index], arr[0]]
    heapify(arr, 0, index, compareFn)
    i--
  }
}
function buildMaxHeap (arr, compareFn) {
  const length = arr.length
  for (const i = Math.floor(length / 2); i >= 0; i--) {
    heapify(arr, i, length, compareFn)
  }
}
function heapify (heap, index, size, compareFn) {
  const left = getLeftIndex(index)
  const right = getRightIndex(index)
  if (left < size && compareFn(heap[index], heap[left]) === Compare.length) {
    [heap[left], heap[index]] = [heap[index], heap[left]]
    heapify(heap, left, size, compareFn)
  }
  if (right < size && compareFn(heap[index], heap[right]) === Compare.length) {
    [heap[right], heap[index]] = [heap[index], heap[right]]
    heapify(heap, right, size, compareFn)
  }
}
function getLeftIndex (index) {
  return 2 * index +1
}
function getRightIndex (index) {
  return 2 * index + 2
}
```

## 11 图
术语:
* 图: 是一组由边连接的节点（或顶点），任何二元关系都可以用图来表示，数学语言G = (V, E)
* V: 一组节点(verties)
* E: 一组边(edge)
* 相邻节点: 由一条边连接在一起的顶点称为相邻顶点
* 度: 相邻节点的数量
* 路径: 从一个节点到达另一个节点所经过的所有节点的组合，路径要求不包含重复节点。
* 连通图: 任何两个节点都存在路径
* 有向图: 边存在方向
* 无向图: 边不存在方向
* 强连通图: 两顶点在两个方向都存在路径
* 图还可以按加不加权分为加权图和未加权图

图的表示:
1. 邻接矩阵
邻接矩阵即二维数据，一个维度存放所有的节点，另一个维度也存放所有的节点，值为0表示两节点不相邻，为1表示两节点相邻

不是强连通的图（稀疏图）如果用邻接矩阵来表示，则矩阵中将会有很多0，这意味着我们浪费了计算机存储空间来表示根本不存在的边。

ex: 十万人的关系图中，由于一个人认识的人是有限的，故属于非强连通图(稀疏图)，使用邻接矩阵表示时，空间复杂的为O(n^2)，中间很多值都为0，浪费了大量存储空间

2. 邻接表
表的key为节点，value为节点对应的边(可以使用链表、数组等数据结构存储)

优点: 空间利用率更高
缺点: 查找某个节点与另一个节点是否相邻时，邻接矩阵时间复杂度为O(1)，邻接表略慢与邻接矩阵

大多数情况下邻接表更优

3. 关联矩阵
与邻接矩阵类似，关联矩阵的一个维度存放所有的节点，另一个维度存放所有的边，值为0表示该节点不处于该边上，值为1表示该节点处于该边上。

关联矩阵通常用于边的数量比点的数量多的情况

### 11.1 实现
```
const Dictionary = require('../v1/8dictionaryAndHashMap').Dictionary
class Graph {
  constructor (isDirected = false) {
    this.isDirected = isDirected
    this.vertices = []
    this.adjList = new Dictionary()
  }
  addVertex (v) {
    if (v == null) return false
    if (this.vertices.includes(v)) return false
    this.vertices.push(v)
    this.adjList.set(v, [])
    return true
  }
  addEdge (v, w) {
    this.addVertex(v)
    this.addVertex(w)
    const neighborsV = this.adjList.get(v)
    !neighborsV.includes(w) && neighborsV.push(w)
    if (!this.isDirected) {
      const neighborsW = this.adjList.get(w)
      !neighborsW.includes(v) && neighborsW.push(v)
    }
  }
  getVertices () {
    return this.vertices
  }
  getAdjList () {
    return this.adjList
  }
  toString () {
    let str = ''
    for (const vertex of this.vertices) {
      str += `${vertex} ->`
      const neighbors = this.adjList.get(vertex)
      for (const edge of neighbors) {
        str += ` ${edge}`
      }
      str += '\n'
    }
    return str
  }
}
```

### 11.2 图的遍历
#### 11.2.1 广度遍历 breadthFirstSearch(BFS)
广度遍历依靠的是队里数据结构，先搜索到的元素先进行遍历
```
const Colors = {
  WHITE: Symbol('white'),
  GREY: Symbol('grey'),
  BLACK: Symbol('black')
}
const initColor = vertices => {
  const colors = {}
  for (const vertex of vertices) {
    colors[vertex] = Colors.WHITE
  }
  return colors
}
const Queue = require('./queue').default
function breadthFirstSearch (graph, startVertex, callback) {
  const vertices = graph.getVertices()
  const adjList = graph.getAdjList()
  const queue = new Queue()
  const colors = initColor(vertices)

  colors[startVertex] = Colors.GREY
  queue.enqueue(startVertex)

  while (!queue.isEmpty()) {
    const vertex = queue.dequeue()
    const neighbors = adjList.get(vertex)
    for (const neighbor of neighbors) {
      if (colors[neighbor] === Colors.WHITE) {
        colors[neighbor] = Colors.GREY
        queue.enqueue(neighbor)
      }
    }
    colors[vertex] = Colors.BLACK
    callback && callback()
  }
}
```

#### 12.2.2 深度遍历
深度遍历依靠的是栈数据结构
```
const Stack = require('../v1/4stacks').default
function depthFirstSearch (graph, startVertex) {
  const vertices = graph.getVertices()
  const adjList = graph.getAdjList()
  const stack = new Stack()
  const colors = initColor(vertices)

  colors[startVertex] = Colors.GREY
  stack.push(startVertex)

  while (!stack.isEmpty()) {
    const vertex = stack.pop()
    const neighbors = adjList.get(vertex)
    for (const neighbor of neighbors) {
      if (colors[neighbor] === Colors.WHITE) {
        Colors[neighbor] = Colors.GREY
        stack.push(neighbor)
      }
      colors[vertex] = Colors.BLACK
      callback && callback()
    }
  }
}
```

#### 12.2.3 使用广度遍历获得最小路径
```
function BFS (graph, startVertex) {
  const vertices = graph.getVerties()
  const adjList = graph.getAdjList()
  const queue = new Queue()
  const colors = initColor()
  const distances = {}
  const predecessors = {}

  for (const vertex of vertices) {
    distances[vertex] = 0
    predecessors[vertex] = null
  }
  colors[startVertex] = Colors.GREY
  queue.enqueue(startVertex)

  while (!queue.isEmpty()) {
    const vertex = queue.dequeue()
    const neighbors = adjList.get(vertex)
    for (const neighbor of neighbors) {
      if (colors[neighbor] === Colors.WHITE) {
        colors[neighbor] = Colors.GREY
        distances[neighbor] = distances[vertex] + 1
        predecessors[neighbor] = vertex
        queue.enqueue(neighbor)
      }
    }
    colors[vertex] = Colors.BLACK
  }
  const obj = {
    distances,
    predecessors
  }
  obj.minimumPathToString = () => {
    const str = ''
    for (const vertex of vertices) {
      const path = new Stack()
      path.push(vertex)
      while (true) {
        const pre = this.predecessors[vertex]
        if (pre != null){
          path.push(pre)
        } else {
          break
        }
      }
      str += `${path.pop()}`
      while (!path.isEmpty()) {
        str += ` -> ${path.pop()}`
      }
      str += `\n`
    }
    return str
  }
  return obj
}
```

#### 12.2.4 使用深度遍历实现拓扑排序

### 12.3 最短路径算法
上述最广度遍历获取短路径算法并没有考虑是否是有向图、是否是加权图。实际生活中最短路径算法一般都需要考虑有向以及加权。
#### 12.3.1 Dijkstra算法
Dijkstra算法是一种计算从单个源到所有其他源的最短路径的贪心算法
```
// 看了14章的贪心算法后回来看
```

#### 12.3.2 Floyd-Warshall算法
Floyd-Warshall算法是一种计算图中所有最短路径的动态规划算法
```
// 看了14章的动态规划算法后回来看
```

### 12.4 最小生成树
常用于解决图中的全连通问题，如若干个小岛组成的图，以最少的桥连接所有的岛就是最小生成树问题。
#### 12.4.1 Prim算法
Prim算法是一种求解加权无向连通图的MST问题的贪心算法。它能找出一个边的子集，使得其构成的树包含图中所有顶点，且边的权值之和最小。
```

```

#### 12.4.2 Kruskal算法
和Prim算法类似，Kruskal算法也是一种求加权无向连通图的MST的贪心算法。
```

```

## 13 排序和搜索算法
### 13.1 排序算法
#### 13.1.1 冒泡排序
最佳时间复杂度是O(n)
最坏时间复杂度是O(n^2)
平均时间复杂度是O(n^2)
```
function bubbleSort(arr, compareFn = defaultCompare) {
  arr = Array.from(arr)
  for (let i = 0, len = arr.length; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (compareFn(arr[j], arr[j + 1]) === Compare.BIGGER_THEN) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[[j]]]
      }
    }
  }
  return arr
}
```
#### 13.1.2 选择排序
最佳时间复杂度是O(n^2)
最坏时间复杂度是O(n^2)
平均时间复杂度是O(n^2)
```
function selectionSort(arr, compareFn = defaultCompare) {
  arr = Array.from(arr)
  for (let i = 0, len = arr.length; i < len - 1; i++) {
    let index = i
    for (let j = i; j < len; j++) {
      if (compareFn(arr[j], arr[index]) === Compare.LESS_THEN) {
        index = j
      }
    }
    index !== i && ([arr[index], arr[i]] = [arr[i], arr[index]])
  }
  return arr
}
```

#### 13.1.3 插入排序
最佳时间复杂度是O(n)
最坏时间复杂度是O(n^2)
平均时间复杂度是O(n^2)
```
function insertionSort(arr, compareFn = defaultCompare) {
  arr = Array.from(arr)
  let temp
  for (let i = 1, len = arr.length; i < len; i++) {
    temp = arr[i]
    let j = i - 1
    while (j >= 0 && compareFn(arr[j], temp) === Compare.BIGGER_THEN) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = temp
  }
  return arr
}
```

#### 13.1.4 归并排序
最佳时间复杂度是O(NlogN)
最坏时间复杂度是O(NlogN)
平均时间复杂度是O(NlogN)
```
function mergeSort(arr, compareFn = defaultCompare) {
  const len = arr.length
  if (len <= 1) return arr
  // 归并排序的中间下标必须注意，长度为2时一定要分成两个数组
  const middleIndex = Math.floor(len / 2)
  const left = mergeSort(arr.slice(0, middleIndex), compareFn)
  const right = mergeSort(arr.slice(middleIndex, len), compareFn)
  return merge(left, right, compareFn)
}

function merge(left, right, compareFn) {
  let leftIndex = 0
  let rightIndex = 0
  const leftLen = left.length
  const rightLen = right.length
  let result = []
  while (leftIndex < leftLen && rightIndex < rightLen) {
    if (compareFn(left[leftIndex], right[rightIndex]) === Compare.LESS_THEN) {
      result.push(left[leftIndex++])
    } else {
      result.push(right[rightIndex++])
    }
  }
  if (leftIndex < leftLen) {
    result = result.concat(left.slice(leftIndex, leftLen))
  } else {
    result = result.concat(right.slice(rightIndex, rightLen))
  }
  return result
}
```

#### 13.1.5 快速排序
最佳时间复杂度是O(NlogN)
最坏时间复杂度是O(NlogN)
平均时间复杂度是O(N^2)
快速排序一般较同等时间复杂度的算法要快
```
function quickSort(arr, compareFn = defaultCompare) {
  arr = Array.from(arr)
  quick(arr, 0, arr.length - 1, compareFn)
  return arr
}

function quick(arr, leftIndex, rightIndex, compareFn) {
  if (arr.length <= 1) return
  const index = partition(arr, leftIndex, rightIndex, compareFn);
  if (leftIndex < index - 1) {
    quick(arr, leftIndex, index - 1, compareFn)
  }
  if (rightIndex > index) {
    quick(arr, index, rightIndex, compareFn)
  }
}

function partition(arr, leftIndex, rightIndex, compareFn) {
  const middleIndex = Math.floor((leftIndex + rightIndex) / 2)
  const middle = arr[middleIndex]
  let i = leftIndex
  let j = rightIndex
  while (i <= j) {
    while (compareFn(arr[i], middle) === Compare.LESS_THEN) {
      i++
    }
    while (compareFn(arr[j], middle) === Compare.BIGGER_THEN) {
      j--
    }
    if (i <= j) {
      [arr[i], arr[j]] = [arr[j], arr[i]]
      i++
      j--
    }
  }
  return i
}
```

#### 13.1.6 技术排序
最佳时间复杂度是O(N+K)
最坏时间复杂度是O(N+K)
平均时间复杂度是O(N+K)
```
function countingSort(arr, compareFn = defaultCompare) {
  arr = Array.from(arr)
  // 又没有过滤数据！
  if (arr.length <= 1) return arr
  let max = arr[0]
  for (let i = 1, len = arr.length; i < len; i++) {
    if (compareFn(arr[i], max) === Compare.BIGGER_THEN) {
      max = arr[i]
    }
  }
  // max是下标，Array构造函数的参数是长度，故需要加一
  const countingArr = new Array(max + 1)
  // 初始化
  for (let i = 0, len = arr.length; i < len; i++) {
    if (countingArr[arr[i]] === undefined) {
      countingArr[arr[i]] = 0
    }
    countingArr[arr[i]]++
  }
  for (let index = 0, i = 0, len = countingArr.length; i < len; i++) {
    if (countingArr[i] > 0) {
      arr[index++] = i
      --countingArr[i--]
    }
  }
  return arr
}
```

#### 13.1.7 桶排序
最佳时间复杂度是O(N+C)  C=N*(logN-logM)
最坏时间复杂度是O(N+C)
平均时间复杂度是O(N^2)
```
function bucketSort(arr, bucketSize = 5, compareFn = defaultCompare) {
  if (arr.length <= 2) return arr
  const buckets = createBucket(arr, bucketSize, compareFn)
  return sortBuckets(buckets, compareFn)
}

function createBucket(arr, bucketSize, compareFn) {
  let min = arr[0]
  let max = arr[0]
  for (let i = 0, len = arr.length; i < len; i++) {
    if (compareFn(arr[i], max) === Compare.BIGGER_THEN) {
      max = arr[i]
    } else if (compareFn(arr[i], min) === Compare.LESS_THEN) {
      min = arr[i]
    }
  }
  const bucketLenth = Math.floor((max - min) / bucketSize) + 1
  const buckets = new Array(bucketLenth)

  for (let i = 0, len = arr.length; i < len; i++) {
    const index = Math.floor((arr[i] - min) / bucketSize)
    if (buckets[index] === undefined) {
      buckets[index] = []
    }
    buckets[index].push(arr[i])
  }
  return buckets
}

function sortBuckets(buckets, compareFn) {
  const result = []
  for (let i = 0, len = buckets.length; i < len; i++) {
    if (buckets[i] !== undefined) {
      sortBucket = insertionSort(buckets[i], compareFn)
      result.push(...sortBucket)
    }
  }
  return result
}
```

#### 13.1.8 基数排序
最佳时间复杂度是O(d(n+k))
最坏时间复杂度是O(d(n+k))
平均时间复杂度是O(d(n+k))
```
function radixSort(arr, radixBase = 10, compareFn = defaultCompare) {
  arr = Array.from(arr)
  if (arr.length <= 1) return arr
  let max = arr[0]
  let min = arr[1]
  for (let i = 0, len = arr.length; i < len; i++) {
    if (compareFn(arr[i], max) === Compare.BIGGER_THEN) {
      max = arr[i]
    } else if (compareFn(arr[i], min) === Compare.LESS_THEN) {
      min = arr[i]
    }
  }

  for (let radix = 1; ((max - min) / (radixBase ** (radix - 1))) >= 1; radix++) {
    arr = countingSortForRadix(arr, radixBase, radix, min)
  }
  return arr
}

function countingSortForRadix (arr, radixBase, radix, min) {
  const buckets = new Array(radixBase)
  for (let i = 0, len = buckets.length; i < len; i++) {
    buckets[i] = 0
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    const bucketIndex = Math.floor((arr[i] - min) / (radixBase**(radix - 1)) % radixBase)
    buckets[bucketIndex]++
  }
  for (let i = 1, len = buckets.length; i < len; i++) {
    buckets[i] += buckets[i - 1]
  }
  const aux = []
  for (let len = arr.length, i = len - 1; i >= 0; i--) {
    const bucketIndex = Math.floor((arr[i] - min) / (radixBase**(radix - 1)) % radixBase)
    const index = --buckets[bucketIndex]
    aux[index] = arr[i]
  }
  console.log(aux)
  return aux
}
```

### 13.2 搜索算法
#### 13.2.1 顺序搜索
时间复杂度O(n)
```
function sequentialSearch (arr, value, compareFn = defaultCompare) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (compareFn(arr[i], value) === 0) {
      return i
    }
  }
  return DOES_NOT_EXIST
}c
```

#### 13.2.2 二分搜索
二分搜索需要先对数据进行排序，最好直接传入已排序好的数据，提高性能。
时间复杂度O(logn)
```
function binarySearch (arr, value, isSort = false, compareFn = defaultCompare) {
  isSort && (arr = quickSort(arr))
  let letfIndex = 0
  let rightIndex = arr.length - 1
  while (letfIndex <= rightIndex) {
    const middleIndex = Math.floor((letfIndex + rightIndex) / 2)
    const element = arr[middleIndex]
    if (compareFn(element, value) === Compare.LESS_THEN) {
      letfIndex = middleIndex + 1
    } else if (compareFn(element, value) === Compare.BIGGER_THEN) {
      rightIndex = middleIndex - 1
    } else {
      return middleIndex
    }
  }
  return DOES_NOT_EXIST
}
```

#### 13.2.3 内插搜索
内插搜索时二分搜的变种，二分搜索忽略了要搜索的数值在数据中的位置，而内插搜索需要考虑。
时间复杂度O(logn)
```
function interpolationSearch (arr, value, isSort = false, compareFn = defaultCompare) {
  isSort && (arr = quickSort(arr))
  let leftIndex = 0
  let rightIndex = arr.length - 1
  while (leftIndex <= rightIndex && arr[leftIndex] <= value && value <= arr[rightIndex]) {
    const delta = (value - arr[leftIndex]) / (arr[rightIndex] - arr[leftIndex])
    const position = leftIndex + Math.floor((rightIndex - leftIndex) * delta)
    const element = arr[position]
    if (compareFn(element, value) === Compare.LESS_THEN) {
      leftIndex = position + 1
    } else if (compareFn(element, value) === Compare.BIGGER_THEN) {
      rightIndex = position - 1
    } else {
      return position
    }
  }
  return DOES_NOT_EXIST
}
```

### 13.3 随机算法
Fisher-Yates随机算法
```
function shuffle (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [arr[randomIndex], arr[i]] = [arr[i], arr[randomIndex]]
  }
  return arr
}
```