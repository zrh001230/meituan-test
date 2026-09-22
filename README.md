# 心晴 Mood Space · 美团测试

记录此刻，慢慢晴朗。

React + TypeScript + Vite 构建的中文情绪记录产品。当前初始版支持心情评分、日记、本地持久化、记录删除、基础回顾统计及一分钟呼吸练习，适配手机与桌面。

## 本地开发

```sh
npm install
npm run dev
```

## 公开链接

https://meituan-test.mood-space.workers.dev

## 构建与 Cloudflare 部署

构建命令：`npm run build`，产物目录：`dist`。

```sh
npm run deploy
```

Cloudflare 项目名固定为 `meituan-test`。后续执行同一部署命令更新已有项目，不更改项目名或账户子域名，以保持访问链接不变。

日记仅保存在当前浏览器，不会同步到服务器。本产品不提供诊断或治疗。
