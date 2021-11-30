import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

import authRouter from './src/auth';
import dbRouter, { uri } from './src/db';
import { validationMiddleWare } from './src/queries';
import MongoStore from 'connect-mongo';
import path from 'path';

const port = process.env.PORT || 3000;
const app: express.Application = express();

app.use(
	cors({
		origin: process.env.FRONTEND!,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
		allowedHeaders: ['Content-Type'],
	})
);

app.disable('X-Powered-By');

app.use(
	session({
		secret: 'something',
		resave: false,
		saveUninitialized: true,
		cookie: {
			sameSite: 'none',
			secure: true,
		},
		store: MongoStore.create({ mongoUrl: uri, ttl: 24 * 60 * 60 }),
	})
);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(validationMiddleWare);

app.use('/api', authRouter);
app.use('/api/', dbRouter);
app.use('/', express.static(path.join(__dirname, '/client/public')));

app.get('/', (req, res) =>
	res.send('Welcome to the hwatu data collection API!')
);

const server = app.listen(port, () => {
	console.log('listening at port', port);
});

export default server;
