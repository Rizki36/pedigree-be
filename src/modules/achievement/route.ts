import type { Prisma } from "../../../prisma/generated/client";
import { PrismaClient } from "../../../prisma/generated/client";
import { isUndefined } from "../common/utils";
import { elysiaV1Middleware } from "../core/lib/elysia";
import {
	createAchievementBody,
	deleteAchievementBody,
	listAchievementQuery,
	updateAchievementBody,
} from "./model";

const db = new PrismaClient();

export const achievementRoute = elysiaV1Middleware.group(
	"/achievement",
	(app) => {
		return app
			.patch(
				"",
				async ({ body }) => {
					const achievement = await db.achievement.update({
						data: {
							...(!isUndefined(body.name) && { name: body.name }),
							...(!isUndefined(body.issuedBy) && { issuedBy: body.issuedBy }),
							...(!isUndefined(body.issuedAt) && { issuedAt: body.issuedAt }),
							...(!isUndefined(body.note) && { note: body.note }),
						},
						where: {
							id: body.id,
						},
					});

					return {
						doc: achievement,
					};
				},
				{
					body: updateAchievementBody,
				},
			)
			.post(
				"",
				async ({ body, jwt, cookie }) => {
					// Verify token from cookie
					const payload = await jwt.verify(cookie.authToken.value);
					if (!payload) return { authenticated: false };

					const achievement = await db.achievement.create({
						data: {
							name: body.name,
							issuedBy: body.issuedBy,
							issuedAt: body.issuedAt,
							note: body.note,
							user: {
								connect: {
									id: payload.id,
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
				},
			)
			.delete(
				"",
				async ({ body }) => {
					const achievement = await db.achievement.delete({
						where: {
							id: body.id,
						},
					});

					return {
						doc: achievement,
					};
				},
				{
					body: deleteAchievementBody,
				},
			)
			.get(
				"/list",
				async ({ query }) => {
					const where: Prisma.AchievementFindManyArgs["where"] = {};

					const achievements = await db.achievement.findMany({ where });

					return {
						docs: achievements,
					};
				},
				{
					query: listAchievementQuery,
				},
			);
	},
);
