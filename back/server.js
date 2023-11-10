require("dotenv").config();

const cors = require("@koa/cors");
const Koa = require("koa");
const { koaBody } = require("koa-body");
const static = require("koa-static");
const path = require("path");
const Router = require("koa-router");
const WebSocket = require("ws");
const sequelize = require("./database.js");
const User = require("./models/user");
const addUser = require("./actions/addUser");
const addMessage = require("./actions/addMessage");
const findUserMessages = require("./actions/findUserMessages");
const moveFile = require("./actions/moveFile");
const router = new Router();
const server = new WebSocket.Server({ port: 7000 });
const app = new Koa();

const start = async () => {
  try {
    await sequelize.sync();

    app.use(cors());
    app.use(koaBody({ multipart: true }));

    const staticPath = path.join(__dirname, "public");
    app.use(static(staticPath));

    router.get("/", async (ctx) => {
      ctx.body = "Welcome to server!";
    });

    const audioExtensions = [
      "mp3", "wav", "ogg", "flac", "aac", "m4a", "aiff", "au", "wma", "alac", "amr"
    ];
    
    const videoExtensions = [
      "mp4", "avi", "mkv", "mov", "wmv", "flv", "webm", "m4v", "mpg", "mpeg", "3gp", "f4v", "m2ts", "m4p", "mj2", "mts", "ogv", "qt", "vob"
    ];
    
    router.post("/messages", async (ctx) => {
      try {
        const { user, message } = ctx.request.body;
        const { userId } = JSON.parse(user);
        const { text, location } = JSON.parse(message);

        const files = ctx.request.files;
        let filePaths = {};

        try {
          if (files.file) {
            const fileExtension = files.file.originalFilename.split('.').pop().toLowerCase();

            if (audioExtensions.includes(fileExtension)) {
              filePaths.audio = await moveFile(files.file, 'audio');
            } else if (videoExtensions.includes(fileExtension)) {
              filePaths.video = await moveFile(files.file, 'video');
            } else {
              filePaths.file = await moveFile(files.file, 'files');
            }
          }

          if (files.audio) {
            filePaths.audio = await moveFile(files.audio, "audio");
          }

          if (files.video) {
            filePaths.video = await moveFile(files.video, "video");
          }
        } catch (error) {
          console.error("Failed to move file:", error);
        }

        const newMessage = await addMessage({
          userId,
          text,
          location,
          ...filePaths,
        });
        ctx.body = newMessage;
      } catch (error) {
        console.error(error);
        ctx.status = 500;
        ctx.body = { error: "При сохранении сообщения произошла ошибка" };
      }
    });

    app.use(router.routes()).use(router.allowedMethods());

    server.on("connection", (socket) => {
      socket.send(JSON.stringify({ text: "Welcome to the WebSocket server!" }));

      socket.on("message", async (instance) => {
        const { type } = JSON.parse(instance);
        console.log(`Received message: ${instance}`);
        let response;

        if (type === "signin") {
          const { user } = JSON.parse(instance);
          const { name, password } = user;
          const data = await addUser(name, password);
          if (!data) {
            response = {
              type: "signin_response",
              data: {
                success: false,
                error: "User with this name already exists",
              },
            };
          } else {
            response = {
              type: "signin_response",
              data: {
                success: true,
                user: data,
              },
            };
          }
          socket.send(JSON.stringify(response));
        }

        if (type === "login") {
          const { user } = JSON.parse(instance);
          const { name, password } = user;
          const data = await User.findOne({ where: { name, password } });

          if (data) {
            const userMessages = await findUserMessages(data.id);

            response = {
              type: "login_response",
              data: {
                success: true,
                user: data,
                messages: userMessages,
              },
            };
          } else {
            response = {
              type: "login_response",
              data: {
                success: false,
                error: "User not found, please check your username or password",
              },
            };
          }
          socket.send(JSON.stringify(response));
        }
      });

      socket.on("close", () => {
        console.log("Client disconnected");
      });

      socket.on("error", (error) => {
        console.error(`Error: ${error}`);
      });
    });

    const port = 7070;
    app.listen(port, function () {
      console.log("Server running on http://localhost:7070");
    });
  } catch (e) {
    console.log(e);
  }
};

start();
