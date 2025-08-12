# Python 编译与运行

Python 通常使用 [CPython](https://www.python.org) 或者 [PyPy](https://pypy.org)。

Python 作为脚本语言，没有通常意义上的编译，而是使用解释器运行。

不过，因为字节码的设定，可以先生成字节码来加速运行（文件名为 `foo.py`）：

```sh
python3 -c "import py_compile; py_compile.compile('foo.py', 'foo', doraise=True)"
```

输出的执行代码为 `foo.pyc` 需要和源码一同解释运行：

```sh
python3 foo.py
```
