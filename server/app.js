const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const recordRouter = require("./routes/record");
const starRouter = require("./routes/star");
const surveyRouter = require("./routes/survey");
const logRouter = require("./routes/log");
const noticeRouter = require("./routes/notice");

const app = express();

const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api/user", userRouter);
app.use("/api/record", recordRouter);
app.use("/api/star", starRouter);
app.use("/api/survey", surveyRouter);
app.use("/api/log", logRouter);
app.use("/api/notice", noticeRouter);
app.use("*", indexRouter);

module.exports = app;
