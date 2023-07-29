## pdf转html的前端服务

## Feature

- 上传文件
- 下载文件

## 原理

本地上传后，文件会放在运行时的uploads目录

上传成功后，会执行脚本运行转化命令

转化完成的html会存放在html目录

## 转化服务的接入

是基于 [pdf2htmlex]('https://hub.docker.com/r/pdf2htmlex/pdf2htmlex/tags')

将编译之后的转化服务，作为基础镜像

然后和node服务一起运行
