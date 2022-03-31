import dotenv from 'dotenv';
import express from 'express';
import './db';
import studentRouter from './api/students';
import usersRouter from './api/users';
import landlordsRouter from './api/landlords';
import bodyParser from "body-parser";
import passport from './api/authenticate';
import accomodationRouter from './api/accomodations';

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(express.json());

app.use('/api/students', studentRouter);
app.use('/api/users', usersRouter);
app.use('/api/landlords', landlordsRouter);
app.use('/api/accomodations', accomodationRouter)

//For protected routes
//app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(passport.initialize());


let server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});

module.exports = server;