import type { Prisma, PrismaClient } from "../../../prisma/generated/client";
import type {
	createAchievementBody,
	deleteAchievementBody,
	listAchievementQuery,
	updateAchievementBody,
} from "./model";

export class AchievementService {
	prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async updateAchievement(args: {
		body: typeof updateAchievementBody.static;
		userId?: string;
	}) {
		const { body, userId } = args;

		const achievement = await this.prisma.achievement.update({
			data: {
				name: typeof body.name === "undefined" ? undefined : body.name,
				issuedBy:
					typeof body.issuedBy === "undefined" ? undefined : body.issuedBy,
				issuedAt:
					typeof body.issuedAt === "undefined" ? undefined : body.issuedAt,
				note: typeof body.note === "undefined" ? undefined : body.note,
			},
			where: {
				id: body.id,
				userId,
			},
		});

		return {
			doc: achievement,
		};
	}

	async createAchievement(args: {
		body: typeof createAchievementBody.static;
		userId: string;
	}) {
		const { body, userId } = args;

		const achievement = await this.prisma.achievement.create({
			data: {
				name: body.name,
				issuedBy: body.issuedBy,
				issuedAt: body.issuedAt,
				note: body.note,
				user: {
					connect: {
						id: userId,
					},
				},
				animal: {
					connect: {
						id: body.animalId,
					},
				},
			},
		});

		return {
			doc: achievement,
		};
	}

	async deleteAchievement(args: {
		body: typeof deleteAchievementBody.static;
		userId: string;
	}) {
		const { body, userId } = args;

		const achievement = await this.prisma.achievement.delete({
			where: {
				id: body.id,
				userId,
			},
		});

		return {
			doc: achievement,
		};
	}

	async getAchievementList(args: {
		query: typeof listAchievementQuery.static;
		userId: string;
	}) {
		const { query, userId } = args;

		const where: Prisma.AchievementFindManyArgs["where"] = {
			userId,
		};

		if (query.animal_id_eq) where.animalId = query.animal_id_eq;

		const achievements = await this.prisma.achievement.findMany({ where });

		return {
			docs: achievements,
		};
	}
}
