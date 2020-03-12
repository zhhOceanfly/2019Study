# README

[express](http://www.expressjs.com.cn/)是基于Node.js平台的，web开发框架。他对Node.js搭建服务器的常用操作封装了一套简易的API，使我们可以快速的搭建出一个服务器。同时express引入了中间件的概念，可以让我们更好的组织代码。

## 推荐阅读路线

* [Node.js基础知识——常用API](https://juejin.im/post/5d6e5a2851882554841c3f3b)：有耐心的话最好先过一遍基础知识，觉得基础知识太枯燥可以从Node.js快速入门看起，遇到不会的API再回来查看基础知识。
* [Node.js快速入门——实现一个服务器](https://juejin.im/post/5d6e58ec5188257b3e23f251)：Node.js手把手入门教程。
* [express快速入门——实现一个服务器](https://juejin.im/post/5d74c6c76fb9a06b317b86be)：Node.js的一个框架，可以加快我们的开发速度。

## 前言

express实现一台服务器至少需要实现以下功能：

* 响应静态资源请求
* 根据不同的请求url返回不同的内容
* 获得前端发送的get请求的参数
* 获得前端发送的post请求的参数

## 准备工作

创建一个static文件夹用来存放静态资源，server.js用于写服务器代码。 ![](https://user-gold-cdn.xitu.io/2019/9/7/16d0c14ca23fc7da?w=297&h=331&f=png&s=4568)

```text
// express是一个第三方包，需要先下载再引用
在终端中输入npm i express --save进行安装
```

没有报错则安装成功。 ![](https://user-gold-cdn.xitu.io/2019/9/8/16d10b71797edfac?w=1223&h=639&f=png&s=22374)

## 1 创建一个服务器

```text
// 使用express创建一个服务器十分简单
// 引入express
const express = require('express')

const app = express()
// 第一个参数表示路由为/home时执行第二个参数的方法(如localhost:3000/home则执行，localhost:3000/index则不执行)
app.use('/home', (req, res) => {
  res.send('home')
})
// 第一个参数直接传入一个函数时，表示任何路由都可以执行该函数
app.use((req, res) => {
  res.send('any')
})
// 监听3000端口并在运行成功后向控制台输入服务器启动成功！
app.listen(3000, () => {
  console.log('服务器启动成功！')
})
```

```text
// 在终端通过 node + 文件名运行js/ts文件
```

![](https://user-gold-cdn.xitu.io/2019/9/8/16d10bded0e02524?w=1223&h=639&f=png&s=8515) 在浏览器中访问localhost:3000/home即可看到返回的home，访问其他路径时，返回的都是any。

![](https://user-gold-cdn.xitu.io/2019/9/8/16d10c1cb73a9bed?w=448&h=109&f=png&s=2866)

![](https://user-gold-cdn.xitu.io/2019/9/8/16d10e6840afa8fa?w=436&h=113&f=png&s=2906)

## 2 中间件

express中的中间件其实就是一个函数，它是响应客户端请求过程中的一个环节。中间件有三个参数，第一个参数是req\(request\)请求对象，第二个参数是res\(response\)响应对象，第三个参数是next函数，调用时会跳转到下一个中间件。

下面我们定义三个中间件，第一个中间件记录用户访问服务器的时间，第二个中间件记录用户访问的url，第三个中间件调用send方法向客户端发回响应信息。

```text
const app = express()

app.use('/home', (req, res, next) => {
  console.log(`在控制台中记录用户访问服务器的时间：${new Date()}`)
  next()
})
app.use('/home', (req, res, next) => {
  console.log(`在控制台中记录用户访问的url：${req.baseUrl}`)
  next()
})
app.use('/home', (req, res) => {
  res.send('home')
})

app.listen(3000, () => {
  console.log('服务器启动成功！')
})
```

在浏览器中访问localhost:3000/home，然后查看终端 ![](https://user-gold-cdn.xitu.io/2019/9/8/16d10dd5830b5182?w=1223&h=639&f=png&s=11976) 上面的代码可以表示为：

![](https://user-gold-cdn.xitu.io/2019/9/8/16d10e389b181de9?w=960&h=720&f=png&s=8777)

## 3 实现完整的服务器功能

一个完整的服务器需要实现前言中提到的所有功能，接下来我们来一一实现。

### 3.1 响应静态资源请求

```text
// express提供了一个内置的中间件为我们处理静态资源的请求
// 接收一个字符串参数，表示作为静态资源的目录，static目录中的所有静态资源都可以被访问了
const static = express.static('static')
app.use(static)
```

![](https://user-gold-cdn.xitu.io/2019/9/8/16d110b78bbd698f?w=431&h=155&f=png&s=3588)

```text
// 如果不想暴露文件的存储位置，也可以增加一个参数指定虚拟路径，此时访问资源需要携带/a/b/c前缀
const static = express.static('static')
app.use('/a/b/c',static)
```

直接访问静态资源的时候不再能拿到静态资源了。 ![](https://user-gold-cdn.xitu.io/2019/9/8/16d1112c9cd8da0e?w=432&h=115&f=png&s=3103) 路由需要加上/a/b/c的前缀才能正确拿到文件

![](https://user-gold-cdn.xitu.io/2019/9/8/16d111375e8a3ec7?w=497&h=116&f=png&s=3452)

### 3.2 根据不同的请求url返回不同的内容

根据不同的请求url放回不同的内容主要依靠app.use\(\)方法的第一个参数，第一个参数与路由匹配时则指定第二个参数传入的函中间件数。

```text
// 请求url为localhost:3000/login或localhost:3000/login?xxx的时候都会使第二个参数传入的中间件执行
app.use('/login', (req, res) => {
  res.send('login')
})
```

### 3.3 获得前端发送的get请求的参数

首先我们在index.html中创建一个表单，用于提交登陆信息，信息提交到/login，方式为GET

```text
<form action='/login' method='GET'>
    <label>
        用户名：
        <input type='text' name='username' placeholder='请输入用户名'/>
    </label>
    <br>
    <label>
        密码：
        <input type="password" name='password' placeholder='请输入密码' />
    </label>
    <br>
    <input type='submit' value='提交'>
</form>
```

然后对匹配/login的规则进行修改

app.get\(\)方法只匹配请求方式为GET的请求，而app.use\(\)方法则匹配任意请求方式的请求，除此之外还有app.post\(\)方法只匹配请求方式为POST的请求，app.put\(\)方法只匹配请求方式为put0的请求，app.delete\(\)方法只匹配请求方式为DELETE的请求。

```text
app.get('/login', (req, res) => {
  // req.query中存放get请求的参数
  console.log(req.query)
   // 假装读取了数据库，用户名为admin，密码为123则登陆成功
  if(req.query.username === 'admin' && req.query.password === '123') {
    res.send('登录成功！')
  } else {
    res.send('您的账号或密码有误，请重试')
  }
})
```

在浏览器中打开index.html并输入账号与密码 ![](https://user-gold-cdn.xitu.io/2019/9/8/16d111fe63b544cd?w=418&h=170&f=png&s=4302)

![](https://user-gold-cdn.xitu.io/2019/9/8/16d1120539cd9480?w=726&h=122&f=png&s=4122)

### 3.4 获得前端发送的post请求的参数

将index.html中的表格提交方式改为POST请求

```text
<form action='/login' method='POST'>
```

接下来解析POST请求参数需要用到body-parser中间件

```text
// 引入body-parser模块
const bodyParser = require('body-parser')
// 构造bodyParser中间件
const urlencodedParser = bodyParser.urlencoded({
  extended: false
})
// 使用中间件
app.use(urlencodedParser)
```

然后继续对匹配/login的规则进行修改

```text
app.post('/login', (req, res) => {
  // req.body中存放post请求的参数
  console.log(req.body)
   // 假装读取了数据库，用户名为admin，密码为123则登陆成功
  if(req.body.username === 'admin' && req.body.password === '123') {
    res.send('登录成功！')
  } else {
    res.send('您的账号或密码有误，请重试')
  }
})
```

再次在index.html中登录

![](https://user-gold-cdn.xitu.io/2019/9/8/16d0e79591730401?w=389&h=95&f=png&s=2854) 此时的参数存放在http的请求体中

![](https://user-gold-cdn.xitu.io/2019/9/8/16d0e79b0ec01720?w=830&h=519&f=png&s=19610)

## 4 交流

正在学前端的小伙伴们，欢迎来掘金阅读我的其他文章，让我们一起进步吧 [更多前端教程](https://juejin.im/user/5cf4885751882524156c97c5/posts)

