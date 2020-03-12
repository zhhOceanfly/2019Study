# README

Node.js的出现让前端工程师可以服务端争得一席之地，除了服务端之外Node.js在中台也占据着重要的地位，可以说Node.js是前端人进阶路上必备的技能之一了。而前端工程师学习Node.js成本很低，语法就是js的语法，只需要熟悉一下Node.js的API即可轻松上手。

## 推荐阅读路线

* [Node.js基础知识——常用API](https://juejin.im/post/5d6e5a2851882554841c3f3b)：有耐心的话最好先过一遍基础知识，觉得基础知识太枯燥可以从Node.js快速入门看起，遇到不会的API再回来查看基础知识。
* [Node.js快速入门——实现一个服务器](https://juejin.im/post/5d6e58ec5188257b3e23f251)：Node.js手把手入门教程。
* [express快速入门——实现一个服务器](https://juejin.im/post/5d74c6c76fb9a06b317b86be)：Node.js的一个框架，可以加快我们的开发速度。

## 前言

Node.js是一个基于 Chrome V8 引擎的 JavaScript 运行环境。大白话说Node.js就是一个软件，他可以运行js/ts文件，使电脑充当一台服务器。

Node.js实现一台服务器至少需要实现以下功能：

* 响应静态资源请求
* 根据不同的请求url返回不同的内容
* 获得前端发送的get请求的参数
* 获得前端发送的post请求的参数

Node.js的安装十分容易，在[官网](http://nodejs.cn/)下载安装即可，安装完成后在终端中用node -v测试是否完成安装。如下图所示即安装成功。

![](https://user-gold-cdn.xitu.io/2019/9/7/16d0bff22a7c4df3?w=1223&h=639&f=png&s=10334)

## 准备工作

创建一个static文件夹用来存放静态资源，server.js用于写服务器代码。 ![](https://user-gold-cdn.xitu.io/2019/9/7/16d0c14ca23fc7da?w=297&h=331&f=png&s=4568)

## 1 响应静态资源请求

客户端第一次向服务器发起的请求index.html文件的请求就是静态资源请求，所有的html、css、js等文件都属于静态资源。

Node.js在响应静态资源的请求上不同于其他后端语言，如PHP，PHP本身不响应静态资源，而是通过Apache处理静态资源的响应，PHP只处理数据的请求，而Node.js则是既要处理静态资源的请求又要处理数据的请求。

![](https://user-gold-cdn.xitu.io/2019/9/7/16d0bfb09755f2d8?w=960&h=720&f=jpeg&s=47536) 那么我们首实现用Node.js来响应静态资源请求。

```text
// 首先引入http，fs，path模块
const http = require('http')
const fs = require('fs')
const path = require('path')

// 创建一个服务器
const server = http.createServer((req, res) => {
  // 请求地址以'/static'开头的为请求静态资源
  if(req.url.startsWith('/static')) {
    // 通过请求url获得对应文件的路径
    let pathStr = path.join(__dirname,req.url)
    // 读取文件内容并返回
    fs.readFile(pathStr,{encoding: 'utf8'}, (err,fileContent) => {
      if(err) {
        // 设置响应状态码为404
        res.writeHead(404)
        res.end('查找不到资源，请检查您的url是否正确')
      } else {
        res.end(fileContent)
      }
    })
  }
})
// 启动服务器并监听3000端口，启动成功后向控制台写入 服务器启动成功！
server.listen(3000,() => {
  console.log('服务器启动成功！') 
})
```

接着在终端中先进入server.js文件所在路径，然后使用node+文件名来运行js文件。

![](https://user-gold-cdn.xitu.io/2019/9/7/16d0c3f0096375a5?w=1223&h=639&f=png&s=12497) 在浏览器按照资源所在路径访问静态资源，测试是否能正确返回静态资源。 ![](https://user-gold-cdn.xitu.io/2019/9/7/16d0c42153ef8049?w=556&h=154&f=png&s=3589) ![](https://user-gold-cdn.xitu.io/2019/9/7/16d0c4228a546211?w=544&h=154&f=png&s=3629) 思路也是非常简单，首先通过请求的url拼接出文件的绝对路径，然后将文件内容读取出来并返回客户端即可，有了思路之后只需要记一下API就可以了。

## 2 根据不同的请求url返回不同的内容

我们刚刚只处理了静态资源的请求，现在访问其他路径不会有任何反应，因为我们还没有对其他请求url做处理。

接下来我们做一个登陆注册功能，分别处理/login、/register路径，并对未处理的url返回404。

```text
const server = http.createServer((req, res) => {
  // 请求地址以'/static'开头的为请求静态资源
  if(req.url.startsWith('/static')) {
    // 通过请求url获得对应文件的路径
    let pathStr = path.join(__dirname,req.url)
    fs.readFile(pathStr,{encoding: 'utf8'}, (err,fileContent) => {
      if(err) {
        res.writeHead(404)
        res.end('查找不到资源，请检查您的url是否正确')
      } else {
        res.end(fileContent)
      }
    })
  } else if (/(^\/login$)|(^\/login\?.*$)/ig.test(req.url)) {
    // 匹配/login或者/login?xxx的url
    res.end('login')
  } else if(/(^\/register$)|(^\/register\?.*$)/ig.test(req.url)) {
    // 匹配/register或者/register?xxx的url
    res.end('register')
  } else {
    // 未处理的url返回404
    res.writeHead(404)
    res.end()
  }
})
```

访问 localhost:3000/login或localhost:3000/login?xxxx时可以看到返回了数据。 ![](https://user-gold-cdn.xitu.io/2019/9/7/16d0c703135f36f1?w=375&h=112&f=png&s=2926) ![](https://user-gold-cdn.xitu.io/2019/9/7/16d0c716d23fe189?w=696&h=149&f=png&s=4187) [!--!\[\]\(https://user-gold-cdn.xitu.io/2019/9/7/16d0c704383cd9bb?w=444&h=104&f=png&s=3035\)--](https://github.com/zhhOceanfly/2019Study/tree/65c0f527730fdae65a977bb6de65f27550ae9c11/note/Node.js快速入门/!--![]%28https:/user-gold-cdn.xitu.io/2019/9/7/16d0c704383cd9bb?w=444&h=104&f=png&s=3035%29--/README.md) 而访问未处理的url时则报404错误。 ![](https://user-gold-cdn.xitu.io/2019/9/7/16d0c7056cbbb301?w=689&h=590&f=png&s=9318)

## 3 获得前端发送的get请求的参数

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

接下来解析GET请求参数需要用到url模块，先引入

```text
const url = require('url')
```

然后对匹配/login的规则进行修改

```text
else if (/(^\/login$)|(^\/login\?.*$)/ig.test(req.url)) {
    // 匹配/login或者/login?xxx的url
    // 設置响应数据类型
    res.setHeader('Content-Type','text/plain;charset=utf8')
    // 判断请求是否为GET
    if (req.method === 'GET') {
      // 获得参数
      const params = url.parse(req.url, true).query
      // 假装读取了数据库，用户名为admin，密码为123则登陆成功
      if(params.username === 'admin' && params.password === '123') {
        res.end('登录成功！')
      } else {
        res.end('您的账号或密码有误，请重试')
      }
    }
    res.end('login')
}
```

![](https://user-gold-cdn.xitu.io/2019/9/8/16d0e6ed513d9d3f?w=462&h=176&f=png&s=4695)

![](https://user-gold-cdn.xitu.io/2019/9/8/16d0e6f011014376?w=668&h=116&f=png&s=3836)

## 4 获得前端发送的post请求的参数

将index.html中的表格提交方式改为POST请求

```text
<form action='/login' method='POST'>
```

接下来解析POST请求参数需要用到querystring模块，先引入

```text
const querystring = require('querystring')
```

然后继续对匹配/login的规则进行修改

post请求的参数是放在http请求体中的，Node.js接收http请求体的数据是采用事件监听的方式接收的，收到一部分http请求体的数据会触发一次data事件，全部接收完会触发end事件，我们先接收所有数据然后对数据格式化提取出我们想要的参数

```text
else if (/(^\/login$)|(^\/login\?.*$)/ig.test(req.url)) {
    // 匹配/login或者/login?xxx的url
    // 設置响应数据类型
    res.setHeader('Content-Type','text/plain;charset=utf8')
    // 判断请求是否为GET
    if (req.method === 'GET') {
      // 获得GET参数
      const params = url.parse(req.url, true).query
      // 假装读取了数据库，用户名为admin，密码为123则登陆成功
      if(params.username === 'admin' && params.password === '123') {
        res.end('登录成功！')
      } else {
        res.end('您的账号或密码有误，请重试')
      }
    } else if (req.method === 'POST') {
      // 获得POST参数
      let paramsStr = ''
      req.on('data', thunk=> {
        // thunk为http请求体中的一部分数据
        paramsStr += thunk
      })
      // 全部接收完触发end事件
      req.on('end', () => {
        const params = querystring.parse(paramsStr)
        // 假装读取了数据库，用户名为admin，密码为123则登陆成功
        if(params.username === 'admin' && params.password === '123') {
          res.end('登录成功！')
        } else {
          res.end('您的账号或密码有误，请重试')
        }
      })
    }
}
```

再次在index.html中登录

![](https://user-gold-cdn.xitu.io/2019/9/8/16d0e79591730401?w=389&h=95&f=png&s=2854) 此时的参数存放在http的请求体中

![](https://user-gold-cdn.xitu.io/2019/9/8/16d0e79b0ec01720?w=830&h=519&f=png&s=19610)

## 5 交流

正在学前端的小伙伴们，欢迎来掘金阅读我的其他文章，让我们一起进步吧 [更多前端教程](https://juejin.im/user/5cf4885751882524156c97c5/posts)

