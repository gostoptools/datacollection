import 'dotenv/config';

import express from 'express';
import { validate } from 'express-jsonschema';
import mongoose from 'mongoose';
import passport from 'passport';

import Game from './models/game';
import Result from './models/result';
import User from './models/user';
import { adminOnly, loggedIn } from './perms';
import { addSchema, parseResultQuery, resultQuerySchema } from './queries';

/*
 * mongodb credentials
 * Password + URI
 */

const password = process.env.DB_PASSWORD;

export const uri = `mongodb+srv://junikim:${password}@hwatudatacollection1.umf8y.mongodb.net/hwatugame?retryWrites=true&w=majority`;

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

// supply previous as a query parameter.
router.post(
	'/search/result',
	loggedIn,
	validate({ body: resultQuerySchema }),
	async function (req, res) {
		const query: any = parseResultQuery(req.body);
		if (req.body.previous) {
			const id = new ObjectId(req.body.previous);
			query._id = { $gt: id };
			if ((await Result.findById(id)) === null) {
				res.status(404).json({ message: `id ${id} is not in the db.` });
				return;
			}
		}
		Result.find(query)
			.sort({ createdAt: -1 })
			.limit(25)
			.exec(async (err, data) => {
				const d = await Promise.all(
					data.map(async (x: any) => {
						const user = await User.findById(x.user);
						const res = { ...x._doc };
						res.user = user?.email;
						return res;
					})
				);
				res.send(d);
			});
	}
);

router.post('/add/', validate({ body: addSchema }), async function (req, res) {
	const game = new Game();
	const tags = req.body.tags;
	game.tags = tags;

	let statuscode = undefined;
	try {
		const results = await Promise.all(
			req.body.result.map(async (g: any) => {
				const user = await User.findOne({ email: g.user }).exec();
				if (!user) {
					statuscode = 404;
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
					user,
				});
				return r;
			})
		);
		await Promise.all(results.map((r: any) => r.save()));
		await game.save();
	} catch (e) {
		res.status(statuscode || 500).json({ failure: e });
		return;
	}
	res.status(200).json({ message: 'Successful!' });
});

export default router;
