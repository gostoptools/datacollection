import mongoose from 'mongoose';

import Game from './game';
import User from './user';

const ObjectId = mongoose.Schema.Types.ObjectId;

/*
 * Result Schema and Methods
 */
export interface Result {
	ppeok: number;
	eat_ppeok: number;
	gwang_bak: boolean;
	pi_bak: boolean;
	first: boolean;
	tap: boolean;
	poktan: number;
	shake: number;
	tags: [string];
	user: string;
	game: typeof ObjectId;
	won: number;
	pi: number;
}

const resultSchema = new mongoose.Schema<Result>(
	{
		ppeok: { type: Number, default: 0 },
		eat_ppeok: {
			type: Number,
			default: 0,
		},
		gwang_bak: { type: Boolean, default: false },
		pi_bak: { type: Boolean, default: false },
		first: { type: Boolean, default: false },
		tap: { type: Boolean, default: false },
		poktan: { type: Number, default: 0 },
		shake: { type: Number, default: 0 },
		user: { type: String, required: true },
		pi: { type: Number },
		game: { type: ObjectId, required: true },
		won: { type: Number, required: true },
		tags: { type: [String] },
	},

	{ timestamps: true }
);

resultSchema.query.won = function () {
	return this.where({ won: { $gt: 0 } });
};
resultSchema.query.lost = function () {
	return this.where({ won: { $gt: 0 } });
};

const ResultModel = mongoose.model('result', resultSchema);
export default ResultModel;
