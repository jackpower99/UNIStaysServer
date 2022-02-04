import dotenv from 'dotenv';
import express from 'express';
import './db';
import studentRouter from './api/students';
import bodyParser from "body-parser";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use('/api/students', studentRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

let server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

module.exports = server;