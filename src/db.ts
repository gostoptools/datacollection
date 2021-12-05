import 'dotenv/config';

import express from 'express';
import { validate } from 'express-jsonschema';
import mongoose from 'mongoose';
import passport from 'passport';

import Game from './models/game';
import Result from './models/result';
import User from './models/user';
import { adminOnly, loggedIn } from './perms';
import {
	addSchema,
	parseResultQuery,
	resultQuerySchema,
	validationMiddleWare,
} from './queries';

/*
 * mongodb credentials
 * Password + URI
 */

const password = process.env.DB_PASSWORD;

export const uri =
	process.env.NODE_ENV === 'production'
		? `mongodb+srv://junikim:${password}@hwatudatacollection1.umf8y.mongodb.net/hwatugame?retryWrites=true&w=majority`
		: `mongodb+srv://junikim:${password}@hwatudatacollectiondev.umf8y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose
	.connect(uri)
	.then(() => console.log('connected to db'))
	.catch((e) => console.error('failed', e));

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

router.get('/all/', adminOnly, function (req, res) {
	if (process.env.NODE_ENV === 'production') {
		res.setHeader('Content-disposition', 'attachment; filename= hwatu.json');
	}
	Result.find({}).exec((err, data) => res.json(data));
});

router.get('/user/delete', adminOnly, (req, res) => {
	const email = req.query.email;
	if (!email) {
		res.status(400).json({ failure: "invalid 'email' get parameter." });
		return;
	}
	User.findOneAndDelete({ email: email as string }, (err: any, data: any) => {
		if (err) res.status(500).json({ failure: err });
		else {
			if (data) {
				res.status(200).json({ message: `Deleted user ${email as string}` });
			} else {
				res
					.status(404)
					.json({ message: `Nonexistent user ${email as string}` });
			}
		}
	});
});

router.get('/user/allow', adminOnly, async (req, res) => {
	const email = req.query.email;
	console.log(email);
	if (!email)
		res.status(400).json({ failure: "invalid 'email' get parameter." });
	User.findOne({ email: email as string }, (err: any, data: any) => {
		if (!data) {
			const user = new User({ email: email });
			user
				.save()
				.then((_) =>
					res.status(200).json({ message: `Added user ${email as string}` })
				)
				.catch((e) => res.status(500).json({ failure: e }));
		} else {
			res.status(200).json({ message: 'User account already exists.' });
		}
	});
});

router.get('/user/all', (req, res) => {
	User.find({}).exec((err, data) => res.json(data.map((x) => x.email)));
});

// supply previous as a query parameter.
router.post(
	'/search/result',
	validate({ body: resultQuerySchema }),
	async function (req, res) {
		const query: any = parseResultQuery(req.body);
		let condition: any = {};
		if (req.body.previous) {
			const id = new ObjectId(req.body.previous.id);
			if ((await Result.findById(id)) === null) {
				res.status(404).json({ message: `id ${id} is not in the db.` });
				return;
			}
			condition = [
				{ _id: { $gt: id }, createdAt: req.body.previous.createdAt },
				{ createdAt: { $lt: req.body.previous.createdAt } },
			];
		}
		Result.find(query)
			.or(condition)
			.sort({ createdAt: -1, _id: 1 })
			.limit(25)
			.exec(async (err, data) => {
				res.send(data);
			});
	}
);

router.post(
	'/add/',
	loggedIn,
	validate({ body: addSchema }),
	async function (req, res) {
		const game = new Game();
		const tags = req.body.tags;
		game.tags = tags;
		let results;
		try {
			results = await Promise.all(
				req.body.result.map(async (g: any) => {
					const user = await User.findOne({ email: g.user }).exec();
					if (!user) {
						throw `No user with email ${g.user} found.`;
					}
					let r = new Result({
						ppeok: g.ppeok,
						eat_ppeok: g.eat_ppeok,
						shake: g.shake,
						poktan: g.poktan,
						gwang_bak: g.gwang_bak,
						pi_bak: g.pi_bak,
						tap: g.tap,
						first: g.first,
						game: game._id,
						won: g.won,
						tags,
						user: g.user,
					});
					return r;
				})
			);
		} catch (e) {
			return res.status(404).json({ failure: e });
		}
		try {
			await Promise.all(results.map((r: any) => r.save()));
			await game.save();
		} catch (e) {
			console.log('happens wtf?');
			return res.status(500).json({ failure: e });
		}
		res.status(200).json({ message: 'Successful!' });
	}
);

export default router;
