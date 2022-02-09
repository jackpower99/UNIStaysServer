import dotenv from 'dotenv';
import express from 'express';
import './db';
import studentRouter from './api/students';
import usersRouter from './api/users';
import bodyParser from "body-parser";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use('/api/students', studentRouter);
app.use('/api/users', usersRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(
  session({
    secret: "ilikecake",
    resave: true,
    saveUninitialized: true,
  })
);


let server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

module.exports = server;