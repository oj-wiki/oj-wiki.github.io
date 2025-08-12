# Rust 语言编译器

[Rust](https://www.rust-lang.org) 作为编译型语言，拥有官方提供的编译器实现。

编译命令为（文件名为 `foo.rs`）：

```sh
rustc -O -o foo foo.rs
```

生成的可执行文件为 `foo` 可直接运行。

Rust 需要编译器缓存，指定 `TMP=/tmp` 环境变量。
