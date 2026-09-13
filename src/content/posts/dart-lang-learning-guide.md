---
title: Dart 编程语言不详细学习指北
date: 2020-10-30 16:34:24
cover: https://cdn.jsdelivr.net/gh/mahoo12138/js-css-cdn/hexo-images/cover/flutter.png
tags: 
- Dart
categories: 
- 学习笔记
---

本文章是博主在[此网站](https://www.dartcn.com/)学习 Dart 语言时所摘录的一些重要内容，用于快速掌握 Dart 语言，详细完整内容请点击原网页。

## 重要概念

+ Dart 万物皆对象，并且所有的对象都是对应一个 *类* 的实例。
+ 尽管 Dart 是强类型的，但是 Dart 可以**推断类型**，所以类型注释是可选的。
+ Dart 支持**顶级函数**（例如 `main（）` ）， 同样函数绑定在类或对象上（分别是 *静态函数* 和 *实例函数* ）。 以及支持函数内创建函数 （ *嵌套* 或 *局部函数* ） 。
+ 类似地， Dart 支持*顶级变量* ， 同样变量绑定在类或对象上（静态变量和实例变量）。 实例变量有时称为字段或属性。
+ Dart **没有关键字** “public” ， “protected” 和 “private” 。 如果标识符以下划线（_）开头，则它相对于库是私有的。

## 操作符

+ `~/`：返回除法运算的整数值；
+ `is`  ：当对象是相应类型时返回 **true**；
+ `is!` ：当对象不是相应类型时返回 **true**；
+ `a ?? b`：如果 **a** 为非空，则返回其值；否则，计算并返回 **b** 的值；
+ `a ??= b`：在变量 **a** 为 **null** 时赋值；
+ `...`：可把 **list**、**set**、**map** 字面量里的元素插入到一个集合中，对象可为空，则使用`...?`；

## 变量和常量

如果对象不限定为单个类型，可以指定为 `对象类型` 或 `动态类型`：

```dart
dynamic name = 'Mahoo12138';
```

**未初始化的变量默认值是** `null`。即使变量是数字类型默认值也是 null，因为在 Dart 中一切都是对象，数字类型也不例外：

```dart
int lineCount;
assert(lineCount == null);
```

>  在生产环境代码中 `assert()` 函数会被忽略，不会被调用。 在开发过程中, `assert(condition)` 会在非 `true` 的条件下抛出异常

 **Final 变量的值只能被设置一次； Const 变量在编译时就已经固定 (Const 变量是隐式 Final 的类型)，常量如果是类级别的，请使用 `static const`**

## 类与函数

+ Dart 使用 `class` 关键字表示一个类，对象具有由函数和数据（分别为方法和实例变量）组成的成员，未初始化实例变量的默认值为 “**null**”。

+ **抽象类不能被实例化**，可以通过实例化继承自该抽象类的子类使用，当然也能使用`implement`直接当作接口（implement 并不局限于抽象类，普通类同样可以），使用接口时，需要将接口内的方法和属性需要全部定义或重写，接口的作用个人理解成是一种具体代码之间的规范化。

+ 类中的 `final` 关键字修饰的变量**不能被修改**，而且**必须被构造函数初始化**。

+ 类中的`static`关键字修饰的变量为静态变量，**其固属于这个类，并不属于类的实例**，不能用 `this` 访问到；`static`关键字修饰的函数即为静态函数，类似于静态变量：

  ```dart
  class Person {
    static String name = 'mahoo12138';
    static show() {
      print(name);
    }
  }
  main(){
      print(Person.name);
      Person.show();
      var p = Person();
      // print(p.name);	！报错
      // p.show();		！报错
  }
  
  >> 输出
  mahoo12138
  mahoo12138
  ```

+ 构造函数的名称可以是类名 `ClassName` 或者类名和标识符 `ClassName.identifier` 。 其中构造函数名称是“ClassName”的函数叫**类名构造函数**；构造函数名称是“ClassName.identifier”的函数叫**命名构造函数**。

+ **默认构造函数**——在没有声明构造函数的情况下， Dart 会提供一个默认的构造函数。 默认构造函数没有参数并会调用父类的无参构造函数。

### 构造函数不被继承
子类不会继承父类的构造函数。 子类不声明构造函数，那么它就只有默认构造函数 (匿名，没有参数) : 

```dart
class Point {
  num x, y;
    
  Point(num x, num y) {
    this.x = x;
    this.y = y;
  }
  // 语法糖
  Point(this.x, this.y);
  // 命名构造函数  
  Point.origin() {
    x = 0;
    y = 0;
  }
}

var p1 = Point(2, 2);
var p2 = Point.fromJson({'x': 1, 'y': 2});
var p3 = Point.origin();
```

### 调用父类非默认构造函数

默认情况下，子类的构造函数会自动调用父类的默认构造函数（未命名，无参数），如果父类中没有匿名无参的构造函数， 则需要手工调用父类的其他构造函数。 在当前构造函数冒号 (`:`) 之后，函数体之前，声明调用父类构造函数：

```dart
class Person {
  String firstName;
    
  Person.fromJson(Map data) {
    print('in Person');
  }
}

class Employee extends Person {
  // Person 没有默认构造函数
  // 必须使用 super.fromJson(data).调用父类的命名构造函数
  Employee.fromJson(Map data) : super.fromJson(data) {
    print('in Employee');
  }
}

void main() {
  var emp = new Employee.fromJson({});
  // 输出
  // in Person
  // in Employee
}
```

### 构造函数的调用顺序

+ 子类的构造函数中执行的操作顺序如下：

    1. **初始化列表**

    2. 父类的无参构造函数

    3. 本类的无参构造函数

    ```dart
    void main() {
      var result = new TestChild.area(3, 4);
      print('面积为：${result.area}');
      // Print:
      // Test 空参构造
      // TestChild 有参构造
      // 面积为：6.0
    }
    
    class Test {
      num width;
      num height;
      num area;
    
      // 必须加上空参构造，如果注释掉 它的子类会报错
      Test() {
        print('Test 空参构造');
      }
    
      Test.area(width, height)
          : width = width,
            height = height,
            area = width * height {
        print('Test 有参构造');
      }
    }
    
    class TestChild extends Test {
    
      num width;
      num height;
      num area;
    
      TestChild() {
        print('TestChild 空参构造');
      }
    
      TestChild.area(num width, num height)
        : area = (width * height)/2 {
        print('TestChild 有参构造');
      }
    }
    ```

### 重定向构造函数

+ 有时构造函数的唯一目的是重定向到同一个类中的另一个构造函数。重定向构造函数的主体是空的，构造函数调用出现在冒号`:`之后：

    ```dart
    void main() {
      var result = new Test(4, true, '数字', 10);
      var result1 = new Test.test1(4, true);
      var result2 = new Test.test2(1,false,'mahoo')
      
    }
    
    class Test {
      num a;
      bool b;
      String c;
      num d;
      // 主构造函数
      Test(this.a, this.b, this.c, this.d);
    
      // 委托给主构造函数
      Test.test1(num x,bool y) : this(x, y,'', 0);
      Test.test2(num a,bool b, String c) : this(a, b, c, 0);
      Test.test3(num a,bool b, String c,num d) : this(a, b, c, d);
    }
    ```

+ 要在运行时获取对象的类型，可以使用Object类的 `runtimeType` 属性，该属性返回一个Type对象

    ```dart
    var a = 10;
    print('a 的类型是： ${a.runtimeType}'); // a 的类型是： int
    ```

+ Dart和Java一样，使用 `extends` 关键字，表示一个类继承另一个类。

+ 使用`static`关键字修饰的类范围的变量。静态变量（类变量）对于类范围的状态和常量很有用。**静态变量在使用之前不会初始化。**

+ 使用 `abstract` 修饰符定义抽象类（**无法实例化的类**）。抽象类对于**定义接口非常有用**，通常还有一些实现。如果希望抽象类看起来是可实例化的，请定义工厂构造函数。

### 工厂构造函数

当执行构造函数并不总是创建这个类的一个新实例时，则使用 factory 关键字。 例如，一个工厂构造函数可能会返回一个 cache 中的实例， 或者可能返回一个子类的实例。

工厂构造函数是通过代码来决定返回的实例对象；工厂构造函数类似于 **static** 静态成员，无法访问 **this** 指针；一般需要依赖其他类型构造函数：

```dart
class People {
  String name;
  int age, sex;
  static People _cache;

  People() {
    print('Dart --> People()');
  }

  People.fromMap(map) {
    this.name = map['name'];
    this.age = map['age'];
    this.sex = map['sex'];
    print('Dart --> People.fromMap($map) --> $name, $age, $sex');
  }

  factory People.map(map) {
    // 当不存在缓存的实例 People 时则创建并返回
    if (People._cache == null) {
      People._cache = new People.fromMap(map);
      print('Dart --> People.map($map) --> ${map['name']}, ${map['age']}, ${map['sex']} --> People._cache == null');
    }
    print('Dart --> People.map($map) --> ${map['name']}, ${map['age']}, ${map['sex']}');
    return People._cache;
  }

  factory People.fromJson(json) => People();
}

void main() {
  Map map = {'name': 'Mahoo12138', 'age': 20, 'sex': 0};
  People people = People.map(map);
  print('People.name=${people.name}, age=${people.age}, sex=${people.sex}, hashCode=${people.hashCode}');
  // 输出中，people 和 people2 的 hashcode 是相同的
  People people2 = People.map(map);
  print('People2.name=${people2.name}, age=${people2.age}, sex=${people2.sex}, hashCode=${people2.hashCode}');

  People people3 = People.fromMap(map);
  print('People3.name=${people3.name}, age=${people3.age}, sex=${people3.sex}, hashCode=${people3.hashCode}');

  People people4 = People.fromJson(map);
  print('People4.name=${people4.name}, age=${people4.age}, sex=${people4.sex}, hashCode=${people4.hashCode}');
}

```

工厂构造函数还可以实现单例：

```dart
class Singleton {
  static final Singleton _singleton = Singleton.internal();
  // 工厂构造函数
  factory Singleton() => _singleton;
  // 命名构造函数
  Singleton.internal();
}
```

## Typedef

目前，typedef 只能使用在函数类型上，对函数类型的对象做一个别名，例如：

 ```dart
typedef Compare = int Function(Object a, Object b);

void main() {
  int fun(Object a, Object b) => 0;
  assert(fun is Compare);
}
 ```

`int Function(Object a, Object b);`为一个函数类型的对象的类型信息。

## Runes

Runes 对象是一个 32位 字符对象，用来表示一个字。这样设计也是考虑兼容 **UTF-16** 四个字节的情况。

我们来看一个示例，打开网页[CopyChar – Copy special characters to your clipboard](https://copychar.cc/emoji/)，选择一个 Emoji 小丑，编辑代码：

```dart
String a = '🤡';
String b = '你是🤡';
print(a.length);
print(a.runes.length);
print(b.length);
print(b.runes.length);

>> 输出
2 // 标识占 2 个 16 位字符
1 // 表示占 1 个 32 位字符
4
3
```

由此可知，**runes** 是一个 32 位字符对象，联系到实际的开发，例如在一款实时聊天的软件中，用户输入 **emoji** 表情时，如果使用字符串的 **length** 方法就会造成统计字符数量出现错误，这时 **runes** 的作用就体现出来了。

常用的 API：

```dart
/// 操作 32-bit Unicode 字符
Runes b = new Runes('\u{1f596} \u9EC4');
var c = String.fromCharCodes(b);
// or String c = '\u{1f596} \u9EC4'	如果非4个数值，需要用 {}包裹
print(c);

>> 输出
🖖 黄
    
/// 返回 16-bit code units 的 codeUnitAt codeUnits
var a = '🤡';
print(a.codeUnitAt(0));
print(a.codeUnits);

>> 输出
55358			// 第 1 位的 10 进制数值
[55358, 56609]	// 显示 2 位的 10 进制数值

/// 返回 32-bit Unicode 的 runes
var a = '🤡';
print(a.runes);

>> 输出
(129313)
```



 

