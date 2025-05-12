import type { Prisma, PrismaClient } from "../../../prisma/generated/client";
import type {
	createAnimalBody,
	deleteAnimalBody,
	listAnimalQuery,
	updateAnimalBody,
} from "./model";

type StatusDistributionItem = {
	gender: "MALE" | "FEMALE" | null;
	status: "alive" | "dead";
	count: bigint;
};

export class AnimalService {
	prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async getAnimalList(args: {
		query: typeof listAnimalQuery.static;
		userId: string;
	}) {
		const { query, userId } = args;

		const limit = query.limit ?? 20;
		const skip = query.skip ?? 0;

		if (skip > 0 && query.cursor)
			throw new Error("Cannot use cursor and skip at the same time");

		const where: Prisma.AnimalFindManyArgs["where"] = {
			userId,
		};
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

		const animals = await this.prisma.animal.findMany(paginationParams);

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
	}

	async updateAnimal(args: {
		body: typeof updateAnimalBody.static;
	}) {
		const { body } = args;

		const animal = await this.prisma.animal.update({
			data: {
				code: typeof body.code === "undefined" ? undefined : body.code,
				name: typeof body.name === "undefined" ? undefined : body.name,
				diedAt: typeof body.diedAt === "undefined" ? undefined : body.diedAt,
				dateOfBirth:
					typeof body.dateOfBirth === "undefined"
						? undefined
						: body.dateOfBirth,
				animalTypeCode:
					typeof body.animalTypeCode === "undefined"
						? undefined
						: body.animalTypeCode,
				motherId:
					typeof body.motherId === "undefined" ? undefined : body.motherId,
				fatherId:
					typeof body.fatherId === "undefined" ? undefined : body.fatherId,
				note: typeof body.note === "undefined" ? undefined : body.note,
				gender: typeof body.gender === "undefined" ? undefined : body.gender,
			},
			where: {
				id: body.id,
			},
		});

		return {
			doc: animal,
		};
	}

	async createAnimal(args: {
		body: typeof createAnimalBody.static;
		userId: string;
	}) {
		const { body, userId } = args;
		const animal = await this.prisma.animal.create({
			data: {
				code: body.code,
				name: body.name,
				gender: body.gender,
				animalTypeCode: body.animalTypeCode,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		});

		return {
			doc: animal,
		};
	}

	async deleteAnimal(args: {
		body: typeof deleteAnimalBody.static;
	}) {
		const { body } = args;

		const animal = await this.prisma.animal.delete({
			where: {
				id: body.id,
			},
		});

		return {
			doc: animal,
		};
	}

	async getStatRequireToAddParent(args: {
		userId: string;
	}) {
		const { userId } = args;

		const fatherCount = await this.prisma.animal.count({
			where: {
				fatherId: null,
				userId,
			},
		});

		const motherCount = await this.prisma.animal.count({
			where: {
				motherId: null,
				userId,
			},
		});

		return {
			doc: {
				father: fatherCount,
				mother: motherCount,
			},
		};
	}

	async getStatRequireToAddGender(args: {
		userId: string;
	}) {
		const { userId } = args;

		const count = await this.prisma.animal.count({
			where: {
				gender: null,
				userId,
			},
		});

		return {
			doc: {
				count,
			},
		};
	}

	async getStatRequireToAddDOB(args: {
		userId: string;
	}) {
		const { userId } = args;

		const count = await this.prisma.animal.count({
			where: {
				dateOfBirth: null,
				userId,
			},
		});
		return {
			doc: {
				count,
			},
		};
	}

	async getTreeStatusDistribution(args: {
		userId: string;
	}) {
		const { userId } = args;

		const statusDistribution = await this.prisma.$queryRaw<
			StatusDistributionItem[]
		>`
				SELECT 
				gender, 
				CASE WHEN "diedAt" IS NULL THEN 'alive' ELSE 'dead' END as status,
				COUNT(*) as count
				FROM "Animal"
                WHERE "userId" = ${userId}
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
	}
}
