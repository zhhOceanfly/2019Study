ES6中提供了一个关键字class允许我们声明一个类，通过关键字extends来实现类的继承，ES6中的类是一个语法糖，本质上还是由ES5的语法实现的，下面我们来详解ES6中的类与继承。
## 类
### 1.构造函数
先来看一下ES5中是如何定义一个类的
```
//ES5
function Person(name,age) {	//构造函数
    this.name=name;
    this.age=age;
    this.showName=function() {	
        console.log(this.name);
    }
}
var person=new Person('李雷',20);
person.showName();   //输出李雷
```
ES5中，将一个方法写成一个构造函数以此来实现类。
```
//ES6
class Person {
    constructor (name='李雷',age=20) {	//构造函数
    	this.name=name;
    	this.age=age;
        this.showName = function() {
            console.log(this.name);
        }
    }
}
const person=new Person('李雷',20);
person.showName();   //输出李雷
```
ES6中，使用关键字class声明一个类，在类中constructor函数是一个构造函数，用法与ES5类似。

注意：class跟let/const一样，是不存在变量声明提前的，调用class必须放在声明class之后。constructor函数若未定义，会自动生成一个方法体为空的constructor函数。

### 2 公有方法
ES5中的共有方法是定义在原型链上的，ES6则是直接写在类中，但它的原理依然是定义在原型链上的。
```
//ES5
function Person(name,age) {	//构造函数
    this.name=name;
    this.age=age;
}
Person.prototype.showName=function() {	
    console.log(this.name);
}
var person=new Person('李雷',20);
person.showName();   //输出李雷
```
```
//ES6
class Person {
    constructor (name='李雷',age=20) {	//构造函数
    	this.name=name;
    	this.age=age;
    }
    showName() {
        console.log(this.name);
    }
}
const person=new Person('李雷',20);
person.showName();   //输出李雷
```
### 3静态属性/方法
静态属性/方法是使用类名.属性名/方法名调用的，在JS中一切皆对象的思想，方法也不例外，方法也是一个对象，那么定义静态属性/方法的方式就很简单了，下面看例子。
```
//ES5
function Person() { //构造函数
}
Person._name='人';
Person.show=function() {
    console.log('Hello World');
}
console.log(Person._name);  //输出人
Person.show(); //输出Hello World
```
```
//ES6
class Person {
    constructor () {	//构造函数
    }
    static show() {
        console.log('Hello World');
    }
}
Person._name='人';
console.log(Person._name);
Person.show();   //输出Hello World
```
ES6中class内只允许声明静态方法，不允许声明静态属性。使用关键字static声明静态方法。静态属性的声明方式与ES5的声明方式相同。
## 继承
ES5中的继承首先要执行父类方法，然后将原型对象指向父类的原型对象，最后修正原型对象的constructor属性，使其指回子类构造函数，比较麻烦，ES6中采用关键字extends实现继承,使用super调用父类的构造函数。
```
//ES5
function Person(name) { //Person类
	this.name = name;
}
Person.prototype.showName = function() {//原型链上定义方法
	console.log(this.name);
}

function Student(name, age) {   //Student类
	Person.call(this, name);
	this.age = age;
}
Student.prototype=Person.prototype; //修改Student的原型对象
Student.prototype.constructor=Student;//修正Student的原型对象的constructor属性,完成继承
var student = new Student('李雷', 20);
student.showName(); //输出李雷
```
```
//ES6
class Person {
    constructor (name) {	//Person类
		this.name=name;
	}
	showName() {
		console.log(this.name);
	}
}
class Student extends Person{ //Student类继承至Person类
	constructor(name,age) {
		super(name);
		this.age=age;
		
	}
}
const student=new Student('李雷',20);
student.showName();
```
## 小结
JS一直不方便书写OOP代码，这会导致我们写出几千行的js文件，使用ES6书写OOP代码配合模块化，可以让我们梳理出更好的项目结构。<!--更多ES6精髓如模块化请看[ES6快速入门]()。-->