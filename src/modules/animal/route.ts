import {
	createAnimalBody,
	deleteAnimalBody,
	listAnimalQuery,
	updateAnimalBody,
} from "./model";
import { PrismaClient } from "../../../prisma/generated/client";
import { elysia } from "../core/lib/elysia";
import { AnimalService } from "./service";

const prisma = new PrismaClient();
const animalService = new AnimalService(prisma);

export const animalRoute = elysia.group("/animal", (app) => {
	return app
		.patch(
			"",
			async ({ body }) => {
				return animalService.updateAnimal({
					body,
				});
			},
			{
				body: updateAnimalBody,
				isSignIn: true,
			},
		)
		.post(
			"",
			async ({ body, jwt, cookie, status }) => {
				const payload = await jwt.verify(cookie.authToken.value);
				if (!payload) return status(401);

				return animalService.createAnimal({
					body,
					userId: payload.id,
				});
			},
			{
				body: createAnimalBody,
				isSignIn: true,
			},
		)
		.delete(
			"",
			async ({ body }) => {
				return animalService.deleteAnimal({
					body,
				});
			},
			{
				body: deleteAnimalBody,
				isSignIn: true,
			},
		)
		.get(
			"/list",
			async ({ query, store }) => {
				return animalService.getAnimalList({
					query,
					userId: store.user?.id!,
				});
			},
			{
				query: listAnimalQuery,
				isSignIn: true,
			},
		)
		.get(
			"/stat/require-to-add-parent",
			async ({ cookie, jwt, status }) => {
				const payload = await jwt.verify(cookie.authToken.value);
				if (!payload) return status(401);

				return animalService.getStatRequireToAddParent({
					userId: payload.id,
				});
			},
			{
				isSignIn: true,
			},
		)
		.get(
			"/stat/require-to-add-gender",
			async ({ cookie, jwt, status }) => {
				const payload = await jwt.verify(cookie.authToken.value);
				if (!payload) return status(401);

				return animalService.getStatRequireToAddGender({
					userId: payload.id,
				});
			},
			{
				isSignIn: true,
			},
		)
		.get(
			"/stat/require-to-add-dob",
			async ({ cookie, jwt, status }) => {
				const payload = await jwt.verify(cookie.authToken.value);
				if (!payload) return status(401);

				return animalService.getStatRequireToAddDOB({
					userId: payload.id,
				});
			},
			{
				isSignIn: true,
			},
		)
		.get(
			"/tree/status-distribution",
			async ({ cookie, jwt, status }) => {
				const payload = await jwt.verify(cookie.authToken.value);
				if (!payload) return status(401);

				return animalService.getTreeStatusDistribution({
					userId: payload.id,
				});
			},
			{
				isSignIn: true,
			},
		);
});
