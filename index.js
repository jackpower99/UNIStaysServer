import dotenv from 'dotenv';
import express from 'express';
import './db';
import studentRouter from './api/students';
import usersRouter from './api/users';
import bodyParser from "body-parser";
import passport from './api/authenticate';

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use('/api/students', studentRouter);
app.use('/api/users', usersRouter);

//For protected routes
//app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(passport.initialize());


let server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

module.exports = server;