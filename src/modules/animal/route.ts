import {
	createAnimalBody,
	deleteAnimalBody,
	listAnimalQuery,
	updateAnimalBody,
} from "./model.js";
import { PrismaClient } from "../../../prisma/generated/client/index.js";
import { elysia } from "../core/lib/elysia.js";
import { AnimalService } from "./service.js";

const prisma = new PrismaClient();
const animalService = new AnimalService(prisma);

export const animalRoute = elysia.group("/animal", (app) => {
	return app
		.patch(
			"",
			async ({ body, store }) => {
				return animalService.updateAnimal({
					body,
					userId: store.user?.id!,
				});
			},
			{
				body: updateAnimalBody,
				isSignIn: true,
			},
		)
		.post(
			"",
			async ({ body, store }) => {
				return animalService.createAnimal({
					body,
					userId: store.user?.id!,
				});
			},
			{
				body: createAnimalBody,
				isSignIn: true,
			},
		)
		.delete(
			"",
			async ({ body, store }) => {
				return animalService.deleteAnimal({
					body,
					userId: store.user?.id!,
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
			async ({ store }) => {
				return animalService.getStatRequireToAddParent({
					userId: store.user?.id!,
				});
			},
			{
				isSignIn: true,
			},
		)
		.get(
			"/stat/require-to-add-gender",
			async ({ store }) => {
				return animalService.getStatRequireToAddGender({
					userId: store.user?.id!,
				});
			},
			{
				isSignIn: true,
			},
		)
		.get(
			"/stat/require-to-add-dob",
			async ({ store }) => {
				return animalService.getStatRequireToAddDOB({
					userId: store.user?.id!,
				});
			},
			{
				isSignIn: true,
			},
		)
		.get(
			"/tree/status-distribution",
			async ({ store }) => {
				return animalService.getTreeStatusDistribution({
					userId: store.user?.id!,
				});
			},
			{
				isSignIn: true,
			},
		);
});
