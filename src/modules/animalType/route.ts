import Elysia from "elysia";
import { AnimalType } from "../../../prisma/generated/client/index.js";
import { listAnimalTypeQuery } from "./model.js";

export const animalTypeRoute = new Elysia({ prefix: "/animal-type" }).get(
	"/list",
	async () => {
		// fill with AnimalType enum
		const docs: {
			code: string;
			name: string;
		}[] = Object.values(AnimalType).map((animalType) => ({
			code: animalType,
			name: animalType,
		}));

		return {
			docs,
		};
	},
	{
		query: listAnimalTypeQuery,
	},
);
