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

// Define type for status distribution query result
type StatusDistributionItem = {
	gender: "MALE" | "FEMALE" | null;
	status: "alive" | "dead";
	count: bigint;
};

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
						animalTypeCode: body.animalTypeCode,
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
				const skip = query.skip ?? 0;

				if (skip > 0 && query.cursor)
					throw new Error("Cannot use cursor and skip at the same time");

				const where: Prisma.AnimalFindManyArgs["where"] = {};
				if (query.search)
					where.OR = [
						{ code: { contains: query.search, mode: "insensitive" } },
						{ name: { contains: query.search, mode: "insensitive" } },
					];
				if (query.id_eq) where.id = query.id_eq;
				if (query.id_ne) where.id = { not: query.id_ne };
				if (query.animal_type_code_eq)
					where.animalTypeCode = query.animal_type_code_eq;

				// Enhanced gender filter with OTHER option
				if (query.gender_eq === "MALE") where.gender = { equals: "MALE" };
				if (query.gender_eq === "FEMALE") where.gender = { equals: "FEMALE" };
				if (query.gender_eq === "OTHER") where.gender = null;

				// status filter
				if (query.status_eq === "ALIVE") where.diedAt = null;
				if (query.status_eq === "DEAD") where.diedAt = { not: null };

				// Cursor-based pagination with limit+1 to check if more data exists
				const paginationParams: Prisma.AnimalFindManyArgs = {
					where,
					take: limit + 1, // Take one extra item to check if there are more
					orderBy: { createdAt: "desc" },
				};

				// Add cursor if provided
				if (query.cursor) {
					paginationParams.skip = 1; // Skip the cursor
					paginationParams.cursor = {
						id: query.cursor,
					};
				} else {
					paginationParams.skip = skip; // Use skip if no cursor
				}

				const animals = await db.animal.findMany(paginationParams);

				// Check if we got more items than the requested limit
				const hasMore = animals.length > limit;

				// Remove the extra item if it exists
				if (hasMore) animals.pop();

				// Get the id of the last item for next cursor
				const nextCursor =
					animals.length > 0 ? animals[animals.length - 1].id : null;

				return {
					docs: animals,
					limit,
					nextCursor,
					hasMore,
				};
			},
			{
				query: listAnimalQuery,
			},
		)
		.get("/stat/require-to-add-parent", async () => {
			const fatherCount = await db.animal.count({
				where: {
					fatherId: null,
				},
			});

			const motherCount = await db.animal.count({
				where: {
					motherId: null,
				},
			});

			return {
				doc: {
					father: fatherCount,
					mother: motherCount,
				},
			};
		})
		.get("/stat/require-to-add-gender", async () => {
			const count = await db.animal.count({
				where: {
					gender: null,
				},
			});

			return {
				doc: {
					count,
				},
			};
		})
		.get("/stat/require-to-dob", async () => {
			const count = await db.animal.count({
				where: {
					dateOfBirth: null,
				},
			});
			return {
				doc: {
					count,
				},
			};
		})
		.get("/tree/status-distribution", async ({ query }) => {
			// Get total count
			const totalCount = await db.animal.count();

			const statusDistribution = await db.$queryRaw<StatusDistributionItem[]>`
				SELECT 
				gender, 
				CASE WHEN "diedAt" IS NULL THEN 'alive' ELSE 'dead' END as status,
				COUNT(*) as count
				FROM "Animal"
				GROUP BY gender, (CASE WHEN "diedAt" IS NULL THEN 'alive' ELSE 'dead' END)
			`;

			// Process the grouped data
			const maleCount = {
				total: 0,
				alive: 0,
				dead: 0,
			};

			const femaleCount = {
				total: 0,
				alive: 0,
				dead: 0,
			};

			const otherCount = {
				total: 0,
				alive: 0,
				dead: 0,
			};

			// Populate the counts from query results
			for (const item of statusDistribution) {
				if (item.gender === "MALE") {
					maleCount.total += Number(item.count);
					if (item.status === "alive") {
						maleCount.alive = Number(item.count);
					} else {
						maleCount.dead = Number(item.count);
					}
				} else if (item.gender === "FEMALE") {
					femaleCount.total += Number(item.count);
					if (item.status === "alive") {
						femaleCount.alive = Number(item.count);
					} else {
						femaleCount.dead = Number(item.count);
					}
				} else if (item.gender === null) {
					otherCount.total += Number(item.count);
					if (item.status === "alive") {
						otherCount.alive = Number(item.count);
					} else {
						otherCount.dead = Number(item.count);
					}
				}
			}

			return {
				doc: {
					maleCount,
					femaleCount,
					otherCount,
				},
			};
		});
});
