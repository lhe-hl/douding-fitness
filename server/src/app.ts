import express from 'express';
import cors from 'cors';
import { config } from './config';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// 基础中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由挂载
app.use('/api', apiRouter);

// 全局异常捕获中间件
app.use(errorHandler);

// 启动服务
app.listen(config.port, () => {
  console.log(`[豆丁健身 Server] 服务已启动: http://localhost:${config.port}`);
  console.log(`[豆丁健身 Server] 健康检查: http://localhost:${config.port}/api/health`);
});

export default app;
