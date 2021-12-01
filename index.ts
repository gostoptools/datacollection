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
		saveUninitialized: false,
		cookie: {
			secure: process.env.NODE_ENV === 'production',
		},
		store: MongoStore.create({ mongoUrl: uri, ttl: 24 * 60 * 60 }),
	})
);
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.use('/api', authRouter);
app.use('/api', dbRouter);
app.use('/', express.static(path.join(__dirname, '/client/public')));

app.use(validationMiddleWare);

app.get('/api', (req, res) =>
	res.sendFile(path.resolve(__dirname, 'welcome.txt'))
);

const server = app.listen(port, () => {
	console.log('listening at port', port);
});

export default server;
