import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import path from 'path';
import { Command } from 'commander';
import { __dirname } from './helpers/get-url';
import { log } from './helpers/log';
import watchFileChange from './helpers/watch';
import { getExportDefault } from './helpers/resolver';

// const program = new Command();
// program.option('-f, --file <char>');

// program.parse();

// /**
//  * 解析命令行参数
//  */
// const options = program.opts();

// /**
//  * 创建express实例
//  */
// const app = express();

// /**
//  * 允许跨域
//  */
// app.use(cors({ origin: '*' }));

// /**
//  * 静态资源目录
//  */
// app.use(express.static(path.join(__dirname, '../dist')));

// /**
//  * 创建服务器实例
//  */
// const httpServer = createServer(app);

// const io = new Server(httpServer);

// /**
//  * 监听 mock 文件变化并重新加载 httpServer
//  */
// // watchFileChange(httpServer, options, io);

// io.on('connection', function (socket) {
//   console.log('client connected', socket.id);
// });

// const adminSpace = io.of('/admin');

// // 客户端连接列表
// let clients = ['192.168.1.2', '192.168.1.3'];

// adminSpace.on('connection', function (socket) {
//   // admin 向 client 广播

//   // 获取客户端列表
//   socket.on('getClient', function () {
//     socket.emit('client', clients);
//   });

//   // 执行 JS 代码
//   socket.on('executeJSProxy', function (msg) {
//     console.log('executeJSProxy', '🚀');
//     io.emit('executeJS', msg);
//   });
// });

// const { BRIDGE_MOCK_PORT = 3000 } = process.env;

// const port = BRIDGE_MOCK_PORT || 3000;

// httpServer.listen(port, function () {
//   log(`正在监听 *:${port}, admin控制台访问地址： http://localhost:${port}?port=${port}`);
// });
