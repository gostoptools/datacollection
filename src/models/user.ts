import mongoose from 'mongoose';

import Result from './result';

/*
 * User Schema and methods
 */
export interface User {
	email: string;
	displayName: string;
	id: string;
	points: number;
}

const userSchema = new mongoose.Schema<User>({
	email: { type: String, required: true },
	displayName: { type: String, required: true },
	id: { type: String, required: true },
	points: { type: Number, default: 0 },
});

const UserModel = mongoose.model('user', userSchema);
export default UserModel;
