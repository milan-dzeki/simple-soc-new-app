const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const path = require("path");
const globalErrorHandler = require("./controllers/errorController");

// routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const profileRouter = require("./routes/profileRoutes");
const photoAlbumRouter = require("./routes/photoAlbumRoutes");
const activityLogRouter = require("./routes/activityLogRoutes");
const friendsRouter = require("./routes/friendsRoutes");
const postRouter = require("./routes/postRoutes");
const settingsRouter = require("./routes/settingsRoutes");
const notificationRouter = require("./routes/notificationRoutes");
const chatRouter = require("./routes/chatRoutes");
const countryStateCItyRouter = require("./routes/countryStateCityRoutes");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.use("/api/v0/auth", authRouter);
app.use("/api/v0/user", userRouter);
app.use("/api/v0/profile", profileRouter);
app.use("/api/v0/photoAlbum", photoAlbumRouter);
app.use("/api/v0/activity", activityLogRouter);
app.use("/api/v0/friends", friendsRouter);
app.use("/api/v0/post", postRouter);
app.use("/api/v0/settings", settingsRouter);
app.use("/api/v0/notification", notificationRouter);
app.use("/api/v0/chat", chatRouter);
app.use("/api/v0/csc", countryStateCItyRouter);

const reactBuild = path.resolve(__dirname, "frontend", "build")
app.use(express.static(reactBuild));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl}`, 404))
// });



app.use(globalErrorHandler);

module.exports = app;