import {
	createAnimalBody,
	deleteAnimalBody,
	listAnimalQuery,
	updateAnimalBody,
} from "./model";
import { type Prisma, PrismaClient } from "../../../prisma/generated/client";
import { isUndefined } from "../common/utils";
import { elysiaV1Middleware } from "../core/lib/elysia";

const db = new PrismaClient();

export const animalRoute = elysiaV1Middleware.group("/animal", (app) => {
	return app
		.patch(
			"",
			async ({ body }) => {
				const animal = await db.animal.update({
					data: {
						...(!isUndefined(body.code) && { code: body.code }),
						...(!isUndefined(body.name) && { name: body.name }),
						...(!isUndefined(body.diedAt) && { diedAt: body.diedAt }),
						...(!isUndefined(body.dateOfBirth) && {
							dateOfBirth: body.dateOfBirth,
						}),
						...(!isUndefined(body.animalTypeCode) && {
							animalTypeCode: body.animalTypeCode,
						}),
						...(!isUndefined(body.motherId) && {
							motherId: body.motherId,
						}),
						...(!isUndefined(body.fatherId) && {
							fatherId: body.fatherId,
						}),
						...(!isUndefined(body.note) && {
							note: body.note,
						}),
						...(!isUndefined(body.gender) && {
							gender: body.gender,
						}),
					},
					where: {
						id: body.id,
					},
				});

				return {
					doc: animal,
				};
			},
			{
				body: updateAnimalBody,
			},
		)
		.post(
			"",
			async ({ body, jwt, cookie }) => {
				// Verify token from cookie
				const payload = await jwt.verify(cookie.authToken.value);
				if (!payload) return { authenticated: false };

				const animal = await db.animal.create({
					data: {
						code: body.code,
						name: body.name,
						gender: body.gender,
						animalType: {
							connect: {
								code: body.animalTypeCode,
							},
						},
						user: {
							connect: {
								id: payload.id,
							},
						},
					},
				});

				return {
					doc: animal,
				};
			},
			{
				body: createAnimalBody,
			},
		)
		.delete(
			"",
			async ({ body }) => {
				const animal = await db.animal.delete({
					where: {
						id: body.id,
					},
				});

				return {
					doc: animal,
				};
			},
			{
				body: deleteAnimalBody,
			},
		)
		.get(
			"/list",
			async ({ query }) => {
				const limit = query.limit ?? 20;

				const where: Prisma.AnimalFindManyArgs["where"] = {};
				if (query.search)
					where.OR = [
						{ code: { contains: query.search } },
						{ name: { contains: query.search } },
					];
				if (query.id_eq) where.id = query.id_eq;
				if (query.id_ne) where.id = { not: query.id_ne };
				if (query.animal_type_code_eq)
					where.animalTypeCode = query.animal_type_code_eq;
				if (query.gender_eq === "MALE") where.gender = { equals: "MALE" };
				if (query.gender_eq === "FEMALE") where.gender = { equals: "FEMALE" };

				const animals = await db.animal.findMany({ where, take: limit });

				return {
					docs: animals,
					limit,
				};
			},
			{
				query: listAnimalQuery,
			},
		);
});
