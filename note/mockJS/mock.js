import Mock from 'mockjs';

const data1 = [];
//数据模板'name|min-max':value
let row1 = {
	'string|1-9': 'string',
	'number|1-9': 1,
	'boolean|1-9': false,
	'undefined|1-9': undefined,
	'null|1-9': null,
	'object|1-9': {
		object1: 'object1',
		object2: 'object2',
		object3: 'object3'
	},
	'array|1-9': ['array1', 'array2'],
	'function|1-9': () => 'function'
};
data1.push(row1);
//数据模板'name|count':value
let row2 = {
	'string|3': 'string',
	'number|3': 1,
	'boolean|3': false, //	1/3的概率为!value
	'undefined|3': undefined,
	'null|3': null,
	'object|3': {
		object1: 'object1',
		object2: 'object2',
		object3: 'object3'
	},
	'array|3': ['array1', 'array2'],
	'function|3': () => 'function'
};
data1.push(row2);
//数据模板'name|min-max.dmin-dmax':value
let row3 = {
	'string|1-9.1-9': 'string',
	'number|1-9.1-9': 1, //只有数值起作用
	'boolean|1-9.1-9': false,
	'undefined|1-9.1-9': undefined,
	'null|1-9.1-9': null,
	'object|1-9.1-9': {
		object1: 'object1',
		object2: 'object2',
		object3: 'object3'
	},
	'array|1-9.1-9': ['array1', 'array2'],
	'function|1-9.1-9': () => 'function'
};
data1.push(row3);
//数据模板'name|min-max.count':value
let row4 = {
	'string|1-9.3': 'string',
	'number|1-9.3': 1, //只有数值起作用
	'boolean|1-9.3': false,
	'undefined|1-9.3': undefined,
	'null|1-9.3': null,
	'object|1-9.3': {
		object1: 'object1',
		object2: 'object2',
		object3: 'object3'
	},
	'array|1-9.3': ['array1', 'array2'],
	'function|1-9.3': () => 'function'
};
data1.push(row4);
//数据模板'name|count.dmin-dmax':value
let row5 = {
	'string|3.1-9': 'string',
	'number|3.1-9': 1, //只有数值起作用
	'boolean|3.1-9': false,
	'undefined|3.1-9': undefined,
	'null|3.1-9': null,
	'object|3.1-9': {
		object1: 'object1',
		object2: 'object2',
		object3: 'object3'
	},
	'array|3.1-9': ['array1', 'array2'],
	'function|3.1-9': () => 'function'
};
data1.push(row5);
//数据模板'name|count.dcount':value
let row6 = {
	'string|3.3': 'string',
	'number|3.3': 1, //只有数值起作用
	'boolean|3.3': false,
	'undefined|3.3': undefined,
	'null|3.3': null,
	'object|3.3': {
		object1: 'object1',
		object2: 'object2',
		object3: 'object3'
	},
	'array|3.3': ['array1', 'array2'],
	'function|3.3': () => 'function'
};
data1.push(row6);
//数据模板'name|+step':value
let row7 = {
	'string|+3': 'string',
	'number|+3': 1, //只有数值起作用
	'boolean|+3': false,
	'undefined|+3': undefined,
	'null|+3': null,
	'object|+3': {
		object1: 'object1',
		object2: 'object2',
		object3: 'object3'
	},
	'array|+2': ['array1', 'array2'],
	'function|+3': () => 'function'
};
data1.push(row7);
Mock.mock('/Get/list1', 'post', data1);
 
const Random = Mock.Random // Mock.Random 是一个工具类，用于生成各种随机数据
 
let data2 = [] // 用于接受生成数据的数组
let size = [
  '300x250', '250x250', '240x400', '336x280', 
  '180x150', '720x300', '468x60', '234x60', 
  '88x31', '120x90', '120x60', '120x240', 
  '125x125', '728x90', '160x600', '120x600', 
  '300x600'
] // 定义随机值
for(let i = 0; i < 10; i ++) { // 可自定义生成的个数
  let template = {
    'Boolean': Random.boolean, // 可以生成基本数据类型
    'Natural': Random.natural(1, 100), // 生成1到100之间自然数
    'Integer': Random.integer(1, 100), // 生成1到100之间的整数
    'Float': Random.float(0, 100, 0, 5), // 生成0到100之间的浮点数,小数点后尾数为0到5位
    'Character': Random.character(), // 生成随机字符串,可加参数定义规则
    'String': Random.string(2, 10), // 生成2到10个字符之间的字符串
    'Range': Random.range(0, 10, 6), // 生成一个随机数组
    'Date': Random.date(), // 生成一个随机日期,可加参数定义日期格式
    'Image': Random.image(Random.size, '#02adea', 'Hello'), // Random.size表示将从size数据中任选一个数据
    'Color': Random.color(), // 生成一个颜色随机值
    // 'Paragraph':Random.paragraph(2, 5), //生成2至5个句子的文本
    'Name': Random.name(), // 生成姓名
    'Url': Random.url(), // 生成web地址
    'Address': Random.province() // 生成地址
  }
  data2.push(template)
}
 
Mock.mock('/Get/list2', 'post', data2) // 根据数据模板生成模拟数据