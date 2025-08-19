# Java 编译器

Java 编译器通常使用 [openJDK](https://openjdk.org)。

一个最基础的例子为（文件为 `Main.java`）：

```sh
javac ./Main.java
```

输出的可执行文件（字节码）为 `java.class`。

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
