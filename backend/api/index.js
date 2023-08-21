const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const path = require('path');

const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const trainRouter = require('./routes/train.routes');
const roleRouter = require('./routes/role.routes');
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, 'http://localhost'],
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use(cookieParser());

app.use('/', userRouter);
app.use('/', authRouter);
app.use('/', trainRouter);
app.use('/', roleRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
