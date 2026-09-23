# 豆丁健身 (douding-fitness) - 全栈微信小程序

全栈健身打卡、减脂饮食记录与 AI 智能减脂助手微信小程序。

---

## 目录结构

```
douding-fitness/
├── client/          # 前端小程序 (uni-app + Vue 3 + TS + Vite + Pinia + Wot Design Uni)
├── server/          # 后端 API 服务 (Node.js + Express + TS + Prisma + SQLite)
└── docs/            # 项目技术选型与规范文档
```

---

## 常用命令

### 1. 前端小程序 (client)
```bash
cd client
pnpm dev:mp-weixin    # 启动开发监听与热更新 (输出至 dist/dev/mp-weixin)
pnpm build:mp-weixin  # 生产打包
```

### 2. 后端服务 (server)
```bash
cd server
pnpm dev              # 启动本地开发服务 (http://localhost:3000)
pnpm prisma:studio    # 打开本地数据库可视化后台
pnpm build            # 编译 TypeScript
pnpm start            # 运行编译后的生产服务
```

---

## 微信开发者工具预览说明
1. 打开 **微信开发者工具**。
2. 导入项目目录：`d:\douding-fitness\client\dist\dev\mp-weixin`。
3. AppID 自动识别为：`wx606fc804e012e441`。
4. 右上角「详情」->「本地设置」勾选 **“不校验合法域名、web-view、TLS版本以及HTTPS证书”**。
