import type { Prisma } from "../../../prisma/generated/client";
import { PrismaClient } from "../../../prisma/generated/client";
import { isUndefined } from "../common/utils";
import { elysia } from "../core/lib/elysia";
import {
	createAchievementBody,
	deleteAchievementBody,
	listAchievementQuery,
	updateAchievementBody,
} from "./model";

const db = new PrismaClient();

export const achievementRoute = elysia.group("/achievement", (app) => {
	return app
		.patch(
			"",
			async ({ body, store }) => {
				const userId = store.user?.id!;

				const achievement = await db.achievement.update({
					data: {
						...(!isUndefined(body.name) && { name: body.name }),
						...(!isUndefined(body.issuedBy) && { issuedBy: body.issuedBy }),
						...(!isUndefined(body.issuedAt) && { issuedAt: body.issuedAt }),
						...(!isUndefined(body.note) && { note: body.note }),
					},
					where: {
						id: body.id,
						userId,
					},
				});

				return {
					doc: achievement,
				};
			},
			{
				body: updateAchievementBody,
				isSignIn: true,
			},
		)
		.post(
			"",
			async ({ body, store }) => {
				const userId = store.user?.id!;

				const achievement = await db.achievement.create({
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
			},
			{
				body: createAchievementBody,
				isSignIn: true,
			},
		)
		.delete(
			"",
			async ({ body, store }) => {
				const userId = store.user?.id!;

				const achievement = await db.achievement.delete({
					where: {
						id: body.id,
						userId,
					},
				});

				return {
					doc: achievement,
				};
			},
			{
				body: deleteAchievementBody,
				isSignIn: true,
			},
		)
		.get(
			"/list",
			async ({ query, store }) => {
				const userId = store.user?.id!;

				const where: Prisma.AchievementFindManyArgs["where"] = {
					userId,
				};

				if (query.animal_id_eq) where.animalId = query.animal_id_eq;

				const achievements = await db.achievement.findMany({ where });

				return {
					docs: achievements,
				};
			},
			{
				query: listAchievementQuery,
				isSignIn: true,
			},
		);
});
