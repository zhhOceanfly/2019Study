记录学习《学习JavaScript数据结构与算法》过程中的知识点与心得。

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
