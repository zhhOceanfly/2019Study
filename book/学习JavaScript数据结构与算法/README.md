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
