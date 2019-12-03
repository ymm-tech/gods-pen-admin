# 码良管理后台
 
<p align="center"><a href="https://godspen.ymm56.com/" target="_blank" rel="noopener noreferrer"><img width="200" src="https://godspen.ymm56.com/doc/logo.png"></a></p>

<p align="center">
  <a href="https://godspen.ymm56.com/"><img src="https://img.shields.io/github/license/ymm-tech/gods-pen" alt="License"></a>
  <a href="https://godspen.ymm56.com/"><img src="https://img.shields.io/github/package-json/v/ymm-tech/gods-pen"></a>

</p>


##  :house: 官网
  
  官网： https://godspen.ymm56.com/

  使用手册： https://godspen.ymm56.com/doc/cookbook/introduce.html

  在线体验： https://godspen.ymm56.com/admin/#/home
  
  私有部署： https://godspen.ymm56.com/doc/cookbook/install.html


![](https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm_1539588655850.png)


 <p style="font-size:18px;" align="center">:point_right: `喜欢别忘了加star支持我们，你的支持是我们坚持的动力` :point_left:</p>

## 项目构成

码良系统由3个项目构成，分别是 [gods-pen-server](https://github.com/ymm-tech/gods-pen-server) 码良服务端、

[gods-pen-admin](https://github.com/ymm-tech/gods-pen-admin) 

码良管理后台以及于7月份就已经开源的 [gods-pen](https://github.com/ymm-tech/gods-pen) 码良编辑器。


## 详细部署文档

https://godspen.ymm56.com/doc/cookbook/source.html

### 安装依赖

```bash
yarn
```

### 开发

```bash
npm run dev
```

### 打包

``` bash
npm run build
```

### 配置说明

配置文件位于 src/config/ 下，default.js 为默认配置，请不要修改

开发配置:

local.js 为本地开发环境使的配置，一般情况下保持默认即可。

在本地开发调试时，三个 web 项目（admin、editor、view）和一个 node 项目（api）都是在独立运行的，因此需要配置每个服务的本地访问地址，以使项目之间能互相调用/请求，四个服务的默认端口号分别为 8567、8565、8566、7051，因此默认配置如 local.js

构建/部署配置：

production.js 为构建阶段使用的配置，默认留空，全部使用了 default.js 配置，原因如下

对于三个 web 项目（admin、editor、view），在构建完成后，web 项目不在是分别启动服务，一般来说，会将所有静态资源文件部署在同一个（nginx）服务下，因此，web 项目的访问路径就是域名加项目名，如 xxxx.com/admin，xxxx.com/editor， 如无更换一级路径要求，无需再进行配置

对于 api 服务，服务启动以后，本地/内部访问地址为 http://127.0.0.1:7051/api, 如果最终能通过 nginx 反代等操作使之与 web 服务**同域名同端口**号，则也可以不用配置 API_PATH。否则，请将 API_PATH 配置为 api 服务**外部实际访问路径**，如 http://xxxx.com:7051/api

总之，所有的 XX_PATH 配置都应该与实际访问地址一致，其中特殊的是在与本服务同端口同域名时，可写成相对地址（即默认配置的值）。  
