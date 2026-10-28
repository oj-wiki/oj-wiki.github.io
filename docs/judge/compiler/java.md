# Java 编译器

Java 编译器通常使用 [openJDK](https://openjdk.org)。

一个最基础的例子为（文件为 `Main.java`）：

```sh
javac ./Main.java
```

输出的字节码文件为 `Main.class`。

```sh
java Main
```

## 进阶配置

基础方式并不能处理 `Main` class 里定义多个 `class` 的情况，可以使用 `jar` 打包运行。

```sh
javac -encoding utf8 ./Main.java
jar cvf Main.jar *.class
```

输出文件为 `Main.jar`，使用以下方式执行。

```sh
java -jar Main.jar
```

## OJ 配置要点

编译和运行时应使用相互兼容且明确的 JDK/JRE 版本。平台需公布 Java 版本及默认堆大小；沙箱的进程内存限制还包括 JVM 本身和本地内存，不能简单等同于 `-Xmx`。若需设置堆上限，应为类元数据、线程栈和运行时开销预留空间。

运行时通常以 `java Main` 或 `java -jar Main.jar` 启动。编译阶段应设置字符编码和输出目录，避免把上次提交留下的 `.class` 文件混入本次结果；清理工作区后再编译可避免陈旧字节码造成误判。
