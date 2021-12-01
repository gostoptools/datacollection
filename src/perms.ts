import 'dotenv/config';

import express from 'express';

export const adminOnly: express.RequestHandler = (req, res, next) => {
	if (process.env.NODE_ENV !== 'production') {
		next();
		return;
	}
	if (req.user) {
		const u = req.user as any;
		const email = process.env.HWATU_ADMIN;
		if (u.email !== email) {
			res.status(401).json({ message: 'Not admin.' });
		} else {
			next();
		}
	} else {
		res.status(401).json({ message: 'Not admin.' });
	}
};

export const loggedIn: express.RequestHandler = (req, res, next) => {
	if (req.user || process.env.NODE_ENV !== 'production') {
		next();
	} else {
		res.status(401).json({ message: 'You must be logged in.' });
	}
};
