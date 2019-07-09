## 1 前言
浏览器的滚动条样式固定，有时候跟我们项目十分不符合，这时候就需要我们自定义滚动条的样式了，目前暂时只有谷歌浏览器支持自定义滚动条。

## 2 通过三个伪类选择器修改滚动条样式
滚动条由三部分样式组成，分别是：
```
element::-webkit-scrollbar //滚动条整体样式
element::-webkit-scrollbar-track //滚动条内部滑轨
element::-webkit-scrollbar-thumb //滚动条内部滑块
```
element表示需要修改滚动条的元素，例如想修改整个页面的滚动条，那element就是body元素。

## 3 修改页面所有元素的横向纵向滚动条样式
首先在页面中定义一个较长的元素来查看效果。
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <style>
            #app {
                height:3000px;
            }
        </style>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
```
此时滚动条样式：
![](https://user-gold-cdn.xitu.io/2019/7/9/16bd7007cc3c0aed?w=49&h=307&f=png&s=456)
然后定义所有元素滚动条样式。
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <style>
            #app {
            	height: 3000px;
            }

            *::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 8px;/*定义纵向滚动条宽度*/
                height: 8px;/*定义横向滚动条高度*/
            }

            *::-webkit-scrollbar-thumb {
                /*滚动条内部滑块*/
                border-radius: 8px;
                background-color: hsla(220, 4%, 58%, 0.3);
                transition: background-color 0.3s;
            }

            *::-webkit-scrollbar-thumb:hover {
                /*鼠标悬停滚动条内部滑块*/
                background: #bbb;
            }

            *::-webkit-scrollbar-track {
                /*滚动条内部轨道*/
                background: #ededed;
            }
        </style>
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>

```
此时效果：

![](https://user-gold-cdn.xitu.io/2019/7/9/16bd704cc6327189?w=67&h=302&f=png&s=809)

效果图看起来不太明显，各位小伙伴自己用浏览器打开，效果会更加直观。

## 4 使用SCSS简写CSS样式
SCSS写多了之后总觉得CSS代码太多了，不够简洁，下面给出SCSS简化后的代码，只包含样式部分（还没有学习SCSS的小伙伴[看这里](https://juejin.im/post/5cf488ea518825378867758f)）。
```
* {
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: hsla(220, 4%, 58%, 0.3);
    transition: background-color 0.3s;

    &:hover {
      background: #bbb;
    }
  }

  &::-webkit-scrollbar-track {
    background: #ededed;
  }
}
```
## 5 交流
如果这篇文章帮到你了，觉得不错的话来点个Star吧。