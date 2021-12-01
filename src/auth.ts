import 'dotenv/config';

import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import User from './models/user';

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL:
				process.env.NODE_ENV === 'production'
					? 'https://hwatu-datacollection.herokuapp.com/api/auth/google/callback'
					: 'http://lvh.me:3000/api/auth/google/callback',
		},

		async function (accessToken, refreshToken, profile, cb) {
			const profileemails = profile.emails;
			const email = profileemails ? profileemails[0].value : '';
			User.findOne({ email }, async function (err: any, user: any) {
				// error out if no emails given.
				if (err || email === '') {
					return cb(err);
				}
				const newuser = new User({
					displayName: profile.displayName,
					email,
					id: profile.id,
				});
				if (!user) {
					// not authorized.
					if (email === process.env.HWATU_ADMIN) {
						newuser.save(function (err) {
							if (err) console.log('newuser: ', err);
							return cb(err, newuser);
						});
					} else {
						return cb(err);
					}
				} else {
					if (!user.displayName || !user.id) {
						await User.findOneAndUpdate(
							{ email },
							{ displayName: profile.displayName, id: profile.id }
						);
						return cb(err, newuser);
					}
					return cb(err, user);
				}
			});
		}
	)
);

// serialization
passport.serializeUser(function (user: any, done) {
	done(null, user);
});
passport.deserializeUser(function (user: any, done) {
	done(null, user);
});

const router = express.Router();

router.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
	'/auth/google/callback',
	passport.authenticate('google'),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	}
);

router.get('/login', (req, res) => res.redirect('/api/auth/google'));
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/user', (req, res) => {
	res.status(200).json(req.user ? req.user : {});
});

export default router;
