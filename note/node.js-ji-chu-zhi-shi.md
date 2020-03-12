# README

记录Node.js常用的API。

## 推荐阅读路线

* [Node.js基础知识——常用API](https://juejin.im/post/5d6e5a2851882554841c3f3b)：有耐心的话最好先过一遍基础知识，觉得基础知识太枯燥可以从Node.js快速入门看起，遇到不会的API再回来查看基础知识。
* [Node.js快速入门——实现一个服务器](https://juejin.im/post/5d6e58ec5188257b3e23f251)：Node.js手把手入门教程。
* [express快速入门——实现一个服务器](https://juejin.im/post/5d74c6c76fb9a06b317b86be)：Node.js的一个框架，可以加快我们的开发速度。

## 1 Buffer类

原生JavaScript中没有处理二进制数据流的机制，而服务端有处理二进制数据流的需求，对此，nodeJS引入了Buffer类来处理二进制数据。

### 1.1 实例化方法

#### 1.1.1 Buffer.alloc\(size\[, fill\[, encoding\]\]\)

```text
// 创建一个长度为3，值为0的Buffer
const buf1 = Buffer.alloc(3)
console.log(buf1)
// 输出：<Buffer 00 00 00>

// 创建一个长度为3，值为16的Buffer
const buf2 = Buffer.alloc(3, 16)
console.log(buf2)
// 输出：<Buffer 10 10 10>

//encoding是编码方式，默认为utf8
```

#### 1.1.2 Buffer.from\(array\)

```text
// 接收一个整数数组，返回一个buffer对象
const buf = Buffer.from([1, 2, 3])
console.log(buf)
// 输出<Buffer 00 02 03>
```

#### 1.1.3 Buffer.from\(string\[, encoding\]\)

```text
// 接收一个字符串，返回一个buffer对象，encoding是编码方式，默认为utf8
const buf = Buffer.from('Hello World!')
console.log(buf.toString())
// 输出Hello World!
```

### 1.2 静态方法

#### 1.2.1 Buffer.isEncoding\(encoding\)

```text
// 判断是否支持某种编码方式
console.log(Buffer.isEncoding('utf8')) //输出true
console.log(Buffer.isEncoding('ascii')) //输出true
console.log(Buffer.isEncoding('base64')) //输出true
```

#### 1.2.2 Buffer.isBuffer\(obj\)

```text
// 判断是否为Buffer对象
console.log(Buffer.isBuffer(Buffer.alloc(3)))   // 输出true
console.log(Buffer.isBuffer('000')) // 输出false
```

#### 1.2.3 Buffer.byteLength\(string\[, encoding\]\)

```text
// 返回指定编码方式的字符串长度
const str = '\u00bd + \u00bc = \u00be' // Unicode编码的字符串
console.log(str.length) // Unicode编码的字符串长度为9
console.log(Buffer.byteLength(str,'utf8')) // utf8编码的字符串长度为12
```

#### 1.2.4 Buffer.concat\(list\[, totalLength\]\)

```text
// 合并传入的buffer数组，totalLength表示最终返回的buffer的长度
const buf1 = Buffer.alloc(1, 1)
const buf2 = Buffer.alloc(1, 2)
const buf3 = Buffer.alloc(1, 3)
const buf4 = Buffer.concat([buf1, buf2, buf3])
console.log(buf4)
// 输出<Buffer 01 02 03>
const buf5 = Buffer.concat([buf1, buf2, buf3], 2)
console.log(buf5)
// 输出<Buffer 01 02>
const buf6 = Buffer.concat([buf1, buf2, buf3], 4)
console.log(buf6)
// 输出<Buffer 01 02 03 00>
```

### 1.3 实例方法

#### 1.3.1 buf.write\(string\[, offset\[, length\]\]\[, encoding\]\)

```text
// 向buffer写入内容，offset为开始写入的位置，length为写入的长度，encoding为写入内容的编码方式
const buf = Buffer.alloc(10);
buf.write('hello',1 , 4) //在1的位置开始写入前4位的'hello'
console.log(buf)
// 输出<Buffer 00 68 65 6c 6c 00 00 00 00 00>
console.log(buf.toString())
// 输出hell
```

#### 1.3.2 buf.slice\(\[start\[, end\]\]\)

```text
// 截取buffer的一部分,start是开始位置，不传则复制整个buf，end为结束位置，不传则截取到最后一位
const buf1 = Buffer.from('Hello World!')
const buf2 = buf1.slice(1, 5)
const buf3 = buf1.slice(1)
const buf4 = buf1.slice()
console.log(buf2.toString())
console.log(buf3.toString())
console.log(buf4.toString())
// 输出ello  
//     ello World!
//     Hello World!
```

#### 1.3.3 buf.toString\(\[encoding\[, start\[, end\]\]\]\)

```text
// 将二进制数据流转换为字符串，encoding是编码方式，start与end效果同slice类似
const buf = Buffer.from('Hello World!')
console.log(buf.toString('utf8',1,5))
console.log(buf.toString('utf8',1))
console.log(buf.toString('utf8'))
// 输出ello  
//     ello World!
//     Hello World!
```

## 2 path - 操作路径对象

path不在全局作用域中，需要先引入再使用

```text
const path = require('path')
```

### 2.1 方法

#### 2.1.1 path.basename\(path\[, ext\]\)

```text
// 获得文件名及文件后缀，ext是文件后缀，若ext与实际文件后缀匹配则不输出文件后缀，否则忽略ext
const basename1 = path.basename('/a/b/c/d/index.html')
const basename2 = path.basename('/a/b/c/d/index.html','.html')
const basename3 = path.basename('/a/b/c/d/index.html','.css') // 第二个参数会被忽略
console.log(basename1, basename2, basename3)
// 输出index.html  index  index.html
```

**2.1.2 path.dirname\(path\)**

```text
// 获得不带文件名的文件路径
const dirname = path.dirname('/a/b/c/d/index.html')
console.log(dirname)
// 输出 /a/b/c/d
```

#### 2.1.3 path.extname\(path\)

```text
// 获得文件后缀名
const extname = path.extname('/a/b/c/d/index.html')
console.log(extname)
// 输出 .html
```

#### 2.1.4 path.parse\(path\)

```text
// 将路径字符串转换为路径对象
const pathObj = path.parse('E:\\a\\b\\c\\d\\index.html')
console.log(pathObj)
/* 输出
 * { 
 *  root: 'E:\\', // 文件根目录
 *  dir: 'E:\\a\\b\\c\\d', // 不带文件名的文件路径
 *  base: 'index.html', // 文件名
 *  ext: '.html', // 文件后缀
 *  name: 'index' // 不带后缀的文件名
 * }
 */
```

#### 2.1.5 path.format\(pathObj\)

```text
// 将路径对象转换为路径字符串
const pathObj = {
  root: 'E:\\',
  dir: 'E:\\a\\b\\c\\d',
  base: 'index.html',
  ext: '.html',
  name: 'index'
}
console.log(path.format(pathObj))
// 输出 E:\a\b\c\d\index.html
// 注意：路径对象的每个属性不是必须的，提供了dir属性时会忽略root属性，提供了base属性时会忽略ext与name属性
```

#### 2.1.6 path.isAbsolute\(path\)

```text
// 判断路径是否是绝对路径
console.log(path.isAbsolute('E:/a/b/c/d\index.html'))
console.log(path.isAbsolute('./a/b/c/d\index.html'))
// 输出 true false
```

#### 2.1.7 path.join\(\[...paths\]\)

```text
// 接收一组路径，并拼接为一个路径，../表示返回上一级目录，./表示同级目录
console.log(path.join('/a/b/c/d','../','./','index.html'))
// 输出 \a\b\c\index.html
```

#### 2.1.8 path.relative\(from, to\)

```text
// 接收两个路径，返回第一个路径到第二个路径的相对路径
const to = 'C:\\orandea\\test\\aaa'
const from = 'C:\\orandea\\impl\\bbb'
console.log(path.relative(to, from))
// 输出 ..\..\impl\bbb
```

### 2.2 属性

#### 2.2.1 path.delimiter

```text
// 环境变量分隔符
console.log(path.delimiter)
// windows下输出; Linux下是:
```

#### 2.2.2 path.sep

```text
// 路径分隔符
console.log(path.sep)
// windows下输出\ Linux下是/
```

## 3 fs - 操作文件对象

fs不在全局作用域中，需要先引入再使用

```text
const path = require('fs')
```

### 3.1 fs.readFile\(path\[, options\], callback\)

首先在同级目录中创建文件text.text，内容为Hello World!，稍后打印出来

```text
// 异步读取文件内容
// 第一个参数为目标文件路径
// 第二个参数为可选参数，指定读取出来的字符编码(encoding)及读写权限(flag),不指定字符编码时，默认输出二进制字节流
// 第三个参数为读取成功后的回调函数
// 回调函数有两个参数，第一个参数是错误参数，为null表示未发生错误，第二个参数为读取出来的内容字符串
fs.readFile(path.join('./text.text'),{encoding: 'utf8'}, (err,fileContent) => {
  if(err !== null) {
    // 输出错误信息
    console.log(err.stack)
  } else {
    // 输出utf8编码的Hello World!
    console.log(fileContent)
  }
})
```

### 3.2 fs.readFileSync\(path\[, options\]\)

```text
// 同步读取文件内容，同步执行时没有回调函数，需要自定处理错误，函数返回文件内容
try {
  const fileContent = fs.readFileSync(path.join('./text.tet'),{encoding: 'utf8'})
  // 输出utf8编码的Hello World!
  console.log(fileContent)
} catch(err) {
  console.log('写入文件发送错误，请检查文件路径')
}
```

### 3.3 fs.writeFile\(path, data\[, options\], callback\)

```text
// 异步写入文件内容
// path与options参数同上，第二个参数data为写入的内容，回调函数只有一个错误对象参数err
fs.writeFile(path.join('./text.text'), 'Hello World!!!', {encoding: 'utf8'}, err => {
  if(err !== null) {
    console.error(err.stack)
  }
})
// 再次查看text.text文件会发现内容改为了Hello World!!
```

### 3.4 fs.writeFileSync\(path, data\[, options\]\)

```text
// 同步写入文件内容
try {
  fs.writeFileSync('./text.text','Hello World!!!',{encoding: 'utf8'})
} catch (err) {
  console.log('写入文件发送错误，请检查文件路径')
}
// 再次查看text.text文件会发现内容改为了Hello World!!!
```

### 3.5 文件对象

#### 3.5.1 获取文件对象

**3.5.1.1 fs.stat\(path, callback\)**

```text
// 异步获取文件对象
// 回调函数的第二个参数即为文件对象
fs.stat('./text.text',(err, stat) => {
  if(err) {
    console.log(err.stack)
  } else {
    console.log(stat)
  }
})
```

**3.5.1.2 fs.statSync\(path\)**

```text
// 同步获取文件对象
try {
  const stat = fs.statSync('./text.text')
  console.log(stat)
} catch (err) {
  console.log('写入文件发送错误，请检查文件路径')
}
```

#### 3.5.2 文件对象方法

**3.5.2.1 stats.isDirectory\(\)**

```text
// 判断当前文件对象是否是文件目录
```

**3.5.2.2 stats.isFile\(\)**

```text
// 判读单当前文件对象是否是常规文件
```

#### 3.5.3 文件对象属性

**3.5.3.1 birthtime**

```text
// 文件创建时间
```

**3.5.3.2 atime**

```text
// 文件访问时间
```

**3.5.3.3 mtime**

```text
// 文件修改时间（指文件数据被修改）
```

**3.5.3.4ctime**

```text
// 文件修改时间（指文件访问权限被修改）
```

### 3.6 fs.mkdir\(path\[, options\], callback\)

```text
// 异步创建一个文件目录，第二个参数可以通过recursive设置是否同时创建子文件夹

// 不存在a文件夹的时候会报错
fs.mkdir('./a/b',err => {
  if(err) {
    console.log(err.stack)
  }
})
// 设置第二个参数，在不存在a目录的时候自动创建a目录，然后在a目录中创建b目录
fs.mkdir('./a/b/c', {recursive: true}, err => {
  if(err) {
    console.log(err.stack)
  }
})
```

### 3.7 fs.mkdirSync\(path\[, options\]\)

```text
// 同步创建文件夹
try {
  fs.mkdirSync('./a/b', {recursive: true})
} catch (err) {
  console.log('创建文件夹错误')
}
```

### 3.8 fs.readdir\(path\[, options\], callback\)

```text
// 异步读取一个目录下的所有文件及文件夹
// __dirname是当前文件所在目录的路径
fs.readdir(__dirname,(err, files) => {
    if(err) {
        console.log(err.stack)
    } else {
        // 输出指定目录下的所有文件名及文件夹名组成的数组
        console.log(files)
    }
})
```

### 3.9 fs.readdirSync\(path\[, options\]\)

```text
// 同步读取一个目录下的所有文件及文件夹
try {
  const files = fs.readdirSync(__dirname)
  console.log(files)
} catch (err) {
  console.log('读取文件夹错误')
}
```

### 3.10 fs.rmdir\(path, callback\)

```text
// 异步删除空文件夹
fs.rmdir('./a', err => {
  if(err) {
    console.log(err.stack)
  }
})
// 注意：只能删除空的文件夹，想要删除非空文件夹可以使用递归
```

### 3.11 fs.rmdirSync\(path\)

```text
// 同步删除空文件夹
try {
  fs.rmdirSync('./a')
} catch (err) {
  console.log('删除文件夹失败')
}
```

## 4 全局属性及方法

### 4.1 \_\_dirname

```text
// 当前文件所在的目录的路径
console.log(__dirname)
// 输出 E:\demo\node
```

### 4.2 \_\_filename

```text
// 当前文件的路径
console.log(__filename)
// 输出 E:\demo\node\node\global.js
```

## 5 http - 操作网络请求

http模块需要先引入再使用

```text
const http = require('http')
```

### 5.1 创建一个服务器并监听一个端口

```text
// 创建一个http server对象，用于监听某个端口，制作一个服务器
const server = http.createServer((req, res) => {
    // 返回响应并设置返回的内容
    res.end('Hello World!')
})
// 监听3000端口
server.listen(3000)
// 此时在浏览器中访问localhost:3000即可看到返回的内容
```

![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b24d54125ff5?w=347&h=96&f=png&s=2660)

### 5.2 http.createServer参数中的req对象

req（request）对象是http的请求对象，是http.IncomingMessage的实例，我们可以在req对象中获得请求头部，请求体中的参数等信息。

### 5.2 http.createServer参数中的res对象

res（response）对象是http的响应对象，是http.ServerResoponse的实例，我们可以通过res的方法设置响应信息。

#### 5.2.1 res.write\(\)

```text
// 写入响应内容
const server = http.createServer((req, res) => {
    // 设置返回的内容
    res.write('Hello World!')
    // 返回响应
    res.end()
})
```

![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b24d54125ff5?w=347&h=96&f=png&s=2660)

#### 5.2.2 res.setHeader\(\)

```text
// 设置响应头部
const server = http.createServer((req, res) => {
    // 设置内容类型为text/plain，编码方式为utf-8
    res.setHeader('Content-Type', 'text/plain; charset=utf8')
    // 返回响应并设置返回的内容
    res.end('Hello World!')
})
```

![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b2fc0ad5ec6d?w=851&h=555&f=png&s=24387)

#### 5.2.3 res.writeHead\(\)

```text
// 设置响应状态码
const server = http.createServer((req, res) => {
    // 设置响应状态码为404
    res.writeHead(404)
    // 返回响应并设置返回的内容
    res.end('Hello World!')
})
```

![](https://user-gold-cdn.xitu.io/2019/9/7/16d0b349365de8b6?w=849&h=241&f=png&s=11742)

## 6 url - 解析url模块，多用于获得get请求的参数

url需要先引入再使用

```text
const url = require('url')
```

```text
// 请求url可以通过req对象获得
const server = http.createServer((req, res) => {
    // 请求地址url
    console.log(req.url)
    res.end()
})
```

### 6.1 url.parse\(urlString\[, parseQueryString\]\)

```text
// 获取前端发送的get请求的参数
// 第一个参数为url，第二个参数为是否将参数由字符串转换为对象
const urlString = 'localhost:3000?username=admin&password=123'
// 重点看query参数，query参数是前端发送的参数
console.log(url.parse(urlString).query)
// 输出 username=admin&password=123

console.log(url.parse(urlString, true).query)
/* 输出 
 * { 
 *  username: 'admin', 
 *  password: '123' 
 * }
 */
```

## 7 querystring - 解析url模块，多用于获得post请求参数

url需要先引入再使用

```text
const querystring = require('querystring')
```

### 7.1 querystring.parse\(str\)

```text
// 获得前端发送的post请求的参数
const paramsStr = 'username=admin&password=123'
console.log(querystring.parse(paramsStr))
/* 输出 
 * { 
 *  username: 'admin', 
 *  password: '123' 
 * }
 */
```

## 8 交流

正在学前端的小伙伴们，欢迎来掘金阅读我的其他文章，让我们一起进步吧 [更多前端教程](https://juejin.im/user/5cf4885751882524156c97c5/posts)

