require('dotenv').config();

const cors = require('@koa/cors');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const static = require('koa-static');
const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const WebSocket = require('ws');
const sequelize = require('./database.js');
const User = require('./public/models/user');
const Message = require('./public/models/message');
const addUser = require('./public/actions/addUser');
const addMessage = require('./public/actions/addMessage');
const findUserMessages = require('./public/actions/findUserMessages');
const router = new Router();
const server = new WebSocket.Server({ port: 7000 });
const app = new Koa();

const start = async () => {
  try {
    await sequelize.sync();

    app.use(cors());
    app.use(koaBody({
      multipart: true,
    }));
    // Установите путь к папке со статическими файлами
    const staticPath = path.join(__dirname, 'public');
    app.use(static(staticPath));

    router.get('/', async (ctx) => {
      ctx.body = 'Welcome to server!';
    });

    router.post('/messages', async (ctx) => {
        try {
          console.log(ctx.request.body)
          const request  = JSON.parse(ctx.request.body.message);
          console.log('message', request)

          // Получение данных из запроса
          const { text, location, video, audio, file } = request.message;
          const { userId } = request.user;
          console.log('audio', audio);
        // Создание сообщения в базе данных
          const newMessage = await addMessage(userId, text, video, audio, location, file);

        // Сохранение аудио и видео файлов на сервере
        if (video) {
          const videoPath = path.join(__dirname, '..', 'public', 'video', path.basename(video));
          fs.renameSync(video, videoPath);
        }
        if (audio) {
          const audioPath = path.join(__dirname, '..', 'public', 'audio', path.basename(audio));
          fs.renameSync(audio, audioPath);
        }
        console.log('message', newMessage);
        // ctx.body = newMessage;
          ctx.body = 'Server response';
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'An error occurred while saving the message' };
      }
    });

    app.use(router.routes()).use(router.allowedMethods());

    server.on('connection', (socket) => {
      console.log('Client connected');

      // Отправка приветственного сообщения клиенту
      socket.send(JSON.stringify({text: 'Welcome to the WebSocket server!'}));

      // Обработчик события 'instance'
      socket.on('message', async (instance) => {
        const { type } = JSON.parse(instance);
        console.log(`Received message: ${instance}`);
        let response;

        if (type === 'signin') {
          const { user } = JSON.parse(instance);
          const { name, password } = user;
          const data = await addUser(name, password);
          if (!data) {
            response = {
              type: 'signin_response',
              data: {
                success: false,
                error: 'User with this name already exists',
              }
            };
          } else {
            response = {
              type: 'signin_response',
              data: {
                success: true,
                user: data,
              }
            };
          }
          socket.send(JSON.stringify(response));
        }

        if (type === 'login') {
          const { user } = JSON.parse(instance);
          const { name, password } = user;
          const data = await User.findOne({ where: { name, password } });

          if (data) {
            const userMessages = await findUserMessages(data.id);
            console.log('userMessages', userMessages)
            response = {
              type: 'login_response',
              data: {
                success: true,
                user: data,
                messages: userMessages,
              }
            };
          } else {
            response = {
              type: 'login_response',
              data: {
                success: false,
                error: 'User not found, please check your username or password',
              }
            };
          }
          socket.send(JSON.stringify(response));
        }
      });

      // Обработчик события 'close'
      socket.on('close', () => {
        console.log('Client disconnected');
      });

      // Обработчик события 'error'
      socket.on('error', (error) => {
        console.error(`Error: ${error}`);
      });
    });

    const port = 7070;
    app.listen(port, function () {
      console.log('Server running on http://localhost:7070');
    });
  } catch (e) {
    console.log(e);
  }


};

start();

