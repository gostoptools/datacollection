import mongoose from 'mongoose';

// import Result from './result';

/*
 * Game Schema and methods
 */
interface Game {
	tags: [String];
}

const gameSchema = new mongoose.Schema<Game>(
	{
		tags: { type: [String], required: true },
	},
	{ timestamps: true }
);

gameSchema.query.byTag = function (name: string) {
	return this.where({ tags: name });
};

// gameSchema.methods.results = function() { return Result.find({game : this}) }

const GameModel = mongoose.model('game', gameSchema);
export default GameModel;
