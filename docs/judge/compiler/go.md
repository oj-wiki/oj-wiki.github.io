# GO 编译器

[GO 编译器](https://go.dev) 通常以不同版本作为区分。

编译命令为：

```sh
go build -o foo foo.go
```

可以使用 `-p 1` 命令行参数，或者 `GOMAXPROCS=1` 环境变量限制并行度来减少多线程编译对系统的影响。

编译结果文件为 `foo`：

```sh
./foo
```

需要注意的是， GO 编译器需要编译缓存，可以使用 `GOCACHE=/tmp` 等指定一个可写入目录。
