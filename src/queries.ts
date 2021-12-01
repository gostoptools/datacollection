import express from 'express';
import { validate } from 'express-jsonschema';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const validationMiddleWare: express.ErrorRequestHandler = (
	err,
	req,
	res,
	next
) => {
	let responseData;
	if (err.name === 'JsonSchemaValidation') {
		// Log the error however you please
		res.status(400);
		responseData = {
			statusText: 'Bad Request',
			jsonSchemaValidation: true,
			validations: err.validations,
		};
		if (req.xhr || req.get('Content-Type') === 'application/json') {
			res.json(responseData);
		}
	} else {
		next(err);
	}
};

/*
 * JSON Schema for the /api/add endpoint.
 * This endpoint accepts JSON and adds the corresponding data to the db.
 */
export const addSchema = {
	type: 'object',
	properties: {
		result: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					user: { type: 'string', required: true },
					won: { type: 'number', required: true },
					shake: { type: 'number' },
					poktan: { type: 'number' },
					ppeok: { type: 'number' },
					eat_ppeok: { type: 'number' },
					gwang_bak: { type: 'boolean' },
					pi_bak: { type: 'boolean' },
					first: { type: 'boolean', required: true },
					tap: { type: 'boolean', required: true },
				},
			},
			required: true,
		},
		tags: { type: 'array', items: { type: 'string' }, required: true },
	},
} as const;

/*
 * JSON Schema for the /api/search/result endpoint.
 * Accepts JSON and returns a
 */
export const resultQuerySchema = {
	type: 'object',
	properties: {
		won: { type: 'boolean' },
		previous: {
			type: 'object',
			properties: {
				id: {
					type: 'string',
					minLength: 24,
					maxLength: 24,
				},
				createdAt: {
					type: 'string',
					format: 'date-time',
				},
			},
		},

		// almost never happen more than once
		shake: { type: 'boolean' },
		poktan: { type: 'boolean' },

		// can happen multiple times
		ppeok: { type: 'number' },
		eat_ppeok: { type: 'number' },

		// all of the bak (can only happen once)
		gwang_bak: { type: 'boolean' },
		pi_bak: { type: 'boolean' },

		first: { type: 'boolean' },
		tap: { type: 'boolean' },

		tags: { type: 'array', items: { type: 'string' } },
	},
} as const;

export const parseResultQuery = (body: any) => {
	const query: any = {};
	if (body.won !== undefined) query.won = body.won ? { $gt: 0 } : { $lt: 0 };
	if (body.tap !== undefined) query.tap = body.tap;
	if (body.first !== undefined) query.first = body.first;
	if (body.gwang_bak !== undefined) query.gwang_bak = body.gwang_bak;
	if (body.pi_bak !== undefined) query.pi_bak = body.pi_bak;

	if (body.poktan !== undefined) query.poktan = body.poktan ? { $gt: 0 } : 0;
	if (body.shake !== undefined) query.shake = body.shake ? { $gt: 0 } : 0;
	if (body.ppeok) query.ppeok = { $gte: body.ppeok };
	if (body.eat_ppeok) query.eat_ppeok = { $gte: body.eat_ppeok };

	if (body.tags) query.tags = { $in: body.tags };
	return query;
};
