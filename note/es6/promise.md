# promise

promise对象是ES6提供的一个队列对象，可用于处理回调地狱问题。

## 1 Promise的用法

首先先看一个ES5中常见的回调地狱。

```text
$.ajax({
    url:xx,
    success:function() {
        $.ajax({    //完成第一个请求的时候发起第二个请求
            url:xx.
            success:function() {
                $.ajax({    //完成第二个请求的时候发起第三个请求
                    url:xx.
                    success:function() {
                        $.ajax({
                            //继续发起下一次请求
                        });
                    }
                });
            }
        });
    }
});
```

有一系列请求，他们需要前一个请求发送完毕时才可以发起请求，当嵌套多层请求时，代码的可读性和可维护性大大减低。通过Promise可以有效的解决这个问题。

### 1.1 概念

promise是一个先进先出的队列，向这个队列中依次添加多个任务（每个ajax请求可以视为一个任务），执行完毕的任务会被推出队列，然后执行下一个任务。

promise存在三个状态，分别是pending\(任务等待或进行中\)、fulfilled\(任务成功完成，准备执行下一个任务\)、rejected\(任务完成但失败了，不执行下一个任务\)。状态只能由pedding转为fulfilled/rejected，且不可逆。

Promise对象接收一个函数作为一个任务推进队列中，函数有resolve和reject两个参数，调用resolve\(\)表示将状态由pedding转为fulfilled，调用reject\(\)表示将状态由pedding转为rejected。下面看一个列子。

```text
new Promise(function(resolve,reject) {
    setTimeout(function() {
        var ran=Math.random();
        if(ran<0.5) {
            resolve(ran);
        }
        else {
            reject(ran);
        }
    },1000);
})
.then(function(ran) {
    console.log(ran+'大于0.5');
},function(ran) {
    console.log(ran+'小于0.5');
});
```

在上面的例子中，先定义了一个Promise对象，设置了一个定时器，在1秒之后随机一个0-1的数，数值小于0.5时，调用resolve\(\)方法将状态由pedding转为fulfilled，数值大于0.5则调用reject\(\)方法，将状态由pedding转为rejected。

一旦状态由pedding转为fulfilled或rejected时，Promise对象将当前任务推出队列，同时执行下一个任务，下一个任务通过Promise对象的then方法传入，then方法接收两个函数，上一个任务的状态为fulfilled时执行第一个函数，上一个任务的状态为rejected时执行第二个函数。第二个参数可以不传入。

### 1.2 promise改写回调地狱

通过then方法可以将回调地狱改写为:

```text
new Promise(function(resolve,reject){
    $.ajax({        //第一个请求
        url:xx,
        success:function({
            resolve();
        });
    })
})
.then({             //完成第一个请求的时候发起第二个请求
    $.ajax({
        url:xx,
        success:function({
            resolve();
        });
    })
})
.then({             //完成第二个请求的时候发起第三个请求
    $.ajax({
        url:xx,
        success:function({
            resolve();
        });
    })
})
```

## 2 Promise提供的方法

除了then\(\),Promise还提供了一些常用的静态方法。

### 2.1 all\(\)

有时候，我们希望在执行某个任务之前，必须要先执行其他的几个任务，不使用promise的时候，我们会使用一个参数作为进度条,下面是例子

```text
//不使用Promise
var prog=0;     //定义进度条，prog满100时，执行第三个任务
$.ajax({            //第一个任务
    url:xx
    success:function() {
        prog+=50;   //进度条增加50
        next();     //查看prog是否满100，满了则执行第三个任务
    }
});
$.ajax({            //第二个任务
    url:xx
    success:function() {
        prog+=50;   //进度条增加50
        next();     //查看prog是否满100，满了则执行第三个任务
    }
});
function next() {
    if(prog==100) {
        $.ajax({    //第一个任务与第二个任务同时完成后，才执行第三个任务

        });
    }
}
```

Promise提供了一个静态方法all，该方法接收一个Promise数组，数组内的所有任务同时执行，只有所有任务执行完毕时，才将状态由pedding转为fulfilled。

```text
//使用Promise
let promiseArr=[];
let promise1=new Promise(function(resolve,reject) {
    $.ajax({            //第一个任务
        url:xx
        success:function() {
        }
    });
});
promiseArr.push(promise1);
let promise2=new Promise(function(resolve,reject) {
    $.ajax({            //第二个任务
        url:xx
        success:function() {
        }
    });
});
promiseArr.push(promise2);
Promise.all(promiseArr)
.then(function() {
    $.ajax({    //第一个任务与第二个任务同时完成后，才执行第三个任务

    });
});
```

### 2.2race\(\)

race也是Promise的静态方法，用法与all\(\)类似，也是接收一个Promise数组，不同点是all\(\)方法是等数组中的所有任务同时执行，且所有任务执行完毕才将状态由pedding转为fulfilled，race\(\)方法是数组中的所有任务同时执行，有一个任务执行完毕时，就将状态由pedding转为fulfilled。

### 2.3resolve\(\)

recolve\(\)方法接收一个变量，根据变量的类型有不同的表现

* 接收一个Promise对象，直接将该Promise对象返回。
* 接收一个带有then方法的对象，将对象转换为Promise对象后执行then方法。
* 接收的变量不是Promise对象也没有then方法，返回resolve状态的Promsie对象。

  **2.4reject\(\)**

  reject\(\)方法直接返回一个reject状态的Promise对象。

更多ES6精髓如模块化请看[ES6快速入门](./)。

