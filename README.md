# gk-comments-h5

> h5端点赞评论组件包

组件基于antd-mobile的UI风格进行界面布局设计，由评论区/评论工具栏/评论面板构成；
支持评论区快速定位、点赞点踩、发表评论（上传图片、@人）、评论区展示功能；

### 📅 版本历史

- 1.0.0 2021/12/30
  - 支持移动端h5引入评论点赞功能


### 🧩 基础核心依赖

- TypeScript
- axios
- antd-mobile

### 🧩 功能模块

- 点赞点踩
- 发表评论（上传图片、@人）

### 🎉 使用

#### 🛎️ 安装

```shell
yarn add gk-comments-h5 -D

```

or

```
npm i -D gk-comments-h5
```

### ☘️ 目录结构

```

│  .babelrc
│  LICENSE
│  list.txt
│  package-lock.json
│  package.json
│  README.md
│  tsconfig.json
│  typings.d.ts
│  webpack.config.js
│  yarn-error.log
│  yarn.lock
│  
├─dist       
│                      
├─public
│      index.html
└─src
    │  index.d.ts
    │  index.js
    │  index.less
    │  index.tsx
    │  
    ├─assets
    │      at.svg
    │      comment.svg
    │      diancai-active.svg
    │      diancai.svg
    │      dianzan-active.svg
    │      dianzan.svg
    │      img.svg
    │      
    ├─declare
    │      define.d.ts
    │      define.ts
    │      
    └─service
        │  config.js
        │  index.js
        │  
        └─apis
                comment.js
                
...
```

### 🧭 指令

- `yarn tree`  
  显示目录树

- `yarn install`  
  安装依赖

- `yarn build`  
  构建 npm 包

### 🛎️ 编译环境变量参数说明

- BUILD_ENV 数据库连接环境，接口域名
  - local: 本地开发，相对路径，会走 node 的转发代理
  - dev: dev 域名
  - test: test 域名
  - uat: uat 域名
  - prod: prod 域名

### npm 包名

- gk-comments-h5@1.0.0

### 适配项目

- 仅支持移动端
- 使用 typescript 编写，且与前端框架解耦，支持 js 或 ts 项目的编写环境，也支持各种语言框架(React/Vue/Angular/JQuery)的集成

### 问题反馈

- 钉钉联系 @谭嘉

## 引用完整流程

### h5端系统

1. 安装依赖

```shell
yarn add gk-comments-h5 -D
// or
npm i gk-comments-h5 -D
```

2. 入口文件引入

```javascript
import GkComments from 'gk-comments-h5'

const Demo = () => {
    let config = {
    //评论中心的key
    commentKey: 'abcdefg',
    commentUrl: 'http://test.com/api/appraise',
    targetId: '123456',
    targetPerson: '测试员',
    targetPersonId: '1234567'
}
    return (
        <div>
            <GkComments
                url={config.commentUrl}
                commentKey={config.commentKey}
                target={{
                    targetId: config.targetId,
                    targetPerson: config.targetPerson,
                    targetPersonId: config.targetPersonId,
                }}
            />
        </div>
    )
}
```

## API 文档-属性

### url

评价中心的接口请求域名地址

### commentKey

应用唯一key值，需要与后端协定

### target

目标源对象

#### targetId

需要评论的指定数据id

#### targetPerson

指定数据的创建人姓名

#### targetPersonId

指定数据的创建人id


