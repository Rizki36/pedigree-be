import type { Prisma } from "../prisma/generated/client";
import { PrismaClient } from "../prisma/generated/client";
import { Gender, AnimalType, Animal } from "../prisma/generated/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Configuration
const ANIMAL_NAMES = {
	DOG: ["Max", "Buddy", "Charlie", "Rocky", "Luna", "Bella", "Lucy", "Daisy"],
	CAT: ["Oliver", "Leo", "Milo", "Simba", "Lily", "Lola", "Nala", "Kitty"],
	BIRD: ["Kiwi", "Rio", "Sunny", "Sky", "Tweety", "Pepper", "Azure", "Tiki"],
	FISH: [
		"Nemo",
		"Bubbles",
		"Finn",
		"Goldie",
		"Splash",
		"Coral",
		"Dory",
		"Gills",
	],
	REPTILE: [
		"Rex",
		"Spike",
		"Ziggy",
		"Draco",
		"Coco",
		"Sunny",
		"Scales",
		"Kiwi",
	],
	OTHER: [
		"Fluffy",
		"Tiny",
		"Shadow",
		"Oreo",
		"Peanut",
		"Cookie",
		"Patch",
		"Lucky",
	],
};

async function generateRandomAnimals(count: number, userId: string) {
	console.log(`Generating ${count} random animals...`);

	// Get existing animals to use as potential parents
	const existingAnimals = await prisma.animal.findMany({
		select: { id: true, gender: true, animalTypeCode: true },
	});

	const maleDogs = existingAnimals.filter(
		(a) => a.gender === "MALE" && a.animalTypeCode === "DOG",
	);
	const femaleDogs = existingAnimals.filter(
		(a) => a.gender === "FEMALE" && a.animalTypeCode === "DOG",
	);
	// Add similar filters for other animal types if needed

	// Create animals in batches
	const batchSize = 50;
	let created = 0;

	while (created < count) {
		const batch: Prisma.AnimalCreateManyInput[] = [];
		const currentBatchSize = Math.min(batchSize, count - created);

		for (let i = 0; i < currentBatchSize; i++) {
			// Pick a random animal type
			const animalType = faker.helpers.arrayElement(
				Object.values(AnimalType),
			) as AnimalType;

			// 80% chance of having a gender, 20% chance of being null
			const gender = faker.datatype.boolean(0.8)
				? faker.helpers.arrayElement(Object.values(Gender))
				: null;

			// Generate a random code with prefix based on animal type
			const code = `${animalType.substring(0, 3)}-${faker.string.alphanumeric(6).toUpperCase()}`;

			// Get appropriate name for the animal type
			const name = faker.helpers.arrayElement(ANIMAL_NAMES[animalType]);

			// 70% chance of having a dateOfBirth
			const dateOfBirth = faker.datatype.boolean(0.7)
				? faker.date.past({ years: 5 }) // Up to 5 years in the past
				: null;

			// 20% chance of being dead
			const diedAt =
				dateOfBirth && faker.datatype.boolean(0.2)
					? faker.date.between({ from: dateOfBirth, to: new Date() })
					: null;

			// 30% chance of having a note
			const note = faker.datatype.boolean(0.3) ? faker.lorem.sentence() : null;

			// For dogs, try to assign parents of the same type
			let fatherId: string | null = null;
			let motherId: string | null = null;

			if (animalType === "DOG" && faker.datatype.boolean(0.6)) {
				// 60% chance of having parents for dogs
				if (maleDogs.length > 0) {
					fatherId = faker.helpers.arrayElement(maleDogs).id;
				}
				if (femaleDogs.length > 0) {
					motherId = faker.helpers.arrayElement(femaleDogs).id;
				}
			}

			// add 1 second to the createdAt date to ensure uniqueness
			const createdAt = new Date(Date.now() - i * 1000);

			batch.push({
				code,
				name,
				gender,
				fatherId,
				motherId,
				note,
				dateOfBirth,
				diedAt,
				animalTypeCode: animalType,
				userId,
				createdAt: createdAt,
				updatedAt: createdAt,
			});
		}

		// Create the batch
		await prisma.animal.createMany({
			data: batch,
			skipDuplicates: true,
		});

		created += currentBatchSize;
		console.log(`Created ${created} out of ${count} animals`);

		// Update existing animals for future batches
		if (created < count) {
			const newAnimals = await prisma.animal.findMany({
				select: { id: true, gender: true, animalTypeCode: true },
				orderBy: { createdAt: "desc" },
				take: created,
			});

			const newMaleDogs = newAnimals.filter(
				(a) => a.gender === "MALE" && a.animalTypeCode === "DOG",
			);
			const newFemaleDogs = newAnimals.filter(
				(a) => a.gender === "FEMALE" && a.animalTypeCode === "DOG",
			);

			maleDogs.push(...newMaleDogs);
			femaleDogs.push(...newFemaleDogs);
		}
	}

	console.log("Random animal generation complete!");
}

// Main function
async function main() {
	try {
		// Get the count from command line arguments
		const count = Number.parseInt(process.argv[2]) || 10;

		// Get or create a user for these animals
		let user = await prisma.user.findFirst();

		if (!user) {
			user = await prisma.user.create({
				data: {
					name: "Test User",
					email: "test@example.com",
				},
			});
			console.log("Created a new user for animals");
		}

		await generateRandomAnimals(count, user.id);
	} catch (error) {
		console.error("Error generating animals:", error);
	} finally {
		await prisma.$disconnect();
	}
}

main();
