const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const runSocket = require("./socket");
const { activeUsers, addActiveUser, removeActiveUser } = require("./activeUsers");

dotenv.config();

const app = require("./app");

const DB = process.env.DATABASE_URL;
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

runSocket(server, activeUsers, addActiveUser, removeActiveUser);

mongoose.set("strictQuery", false);
mongoose.connect(DB)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    });
  })
  .catch(err => {
    console.log(err)
  });
