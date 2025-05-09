import Elysia from "elysia";
import { AnimalType } from "../../../prisma/generated/client";
import { listAnimalTypeQuery } from "./model";

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
