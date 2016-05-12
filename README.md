# Flask Angular1.x Starter

一个基于Flask和Angualr1.x的项目脚手架

## 快速启动

### 安装后端环境和依赖
```sh
$ virtualenv .venv
$ source .venv/bin/activate  # activate.fish for fish shell
$ pip install -r requirements.txt
```
### 创建数据库和账户

```sh
$ python manage.py create_db
$ python manage.py create_admin
```

### 初始化前端构建环境
```sh
$ cd client/src/vendor
$ npm install
$ cd client
$ npm install
$ gulp
```

### 启动应用

```sh
$ python manage.py runserver
```
现在可以访问应用 [http://localhost:5000/](http://localhost:5000/)


## 后端代码测试

不生成覆盖率

```sh
$ python manage.py test
```

生成覆盖率

```sh
$ python manage.py cov
```
