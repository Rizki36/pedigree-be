import { PrismaClient } from "../../../prisma/generated/client";
import { elysia } from "../core/lib/elysia";
import {
	createAchievementBody,
	deleteAchievementBody,
	listAchievementQuery,
	updateAchievementBody,
} from "./model";
import { AchievementService } from "./service";

const prisma = new PrismaClient();
const achievementService = new AchievementService(prisma);

export const achievementRoute = elysia.group("/achievement", (app) => {
	return app
		.patch(
			"",
			async ({ body, store }) => {
				return achievementService.updateAchievement({
					body,
					userId: store.user?.id!,
				});
			},
			{
				body: updateAchievementBody,
				isSignIn: true,
			},
		)
		.post(
			"",
			async ({ body, store }) => {
				return achievementService.createAchievement({
					body,
					userId: store.user?.id!,
				});
			},
			{
				body: createAchievementBody,
				isSignIn: true,
			},
		)
		.delete(
			"",
			async ({ body, store }) => {
				return achievementService.deleteAchievement({
					body,
					userId: store.user?.id!,
				});
			},
			{
				body: deleteAchievementBody,
				isSignIn: true,
			},
		)
		.get(
			"/list",
			async ({ query, store }) => {
				return achievementService.getAchievementList({
					query,
					userId: store.user?.id!,
				});
			},
			{
				query: listAchievementQuery,
				isSignIn: true,
			},
		);
});
