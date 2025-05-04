import type { Animal } from "../../../prisma/generated/client";
import { PrismaClient } from "../../../prisma/generated/client";
import { elysiaV1Middleware } from "../core/lib/elysia";
import { treeQuery } from "./model";

type Node = Animal & {
	hasNextNodes: boolean;
	nodes: [Node | null, Node | null];
};

const db = new PrismaClient();

// recursive function to get the animal tree
async function getAnimalTree(id: string, level: number): Promise<Node | null> {
	if (level <= 0) return null;

	const animal = await db.animal.findUnique({
		where: { id },
	});

	if (!animal) return null;

	const [motherNode, fatherNode] = await Promise.all([
		animal.motherId ? await getAnimalTree(animal.motherId, level - 1) : null,
		animal.fatherId ? await getAnimalTree(animal.fatherId, level - 1) : null,
	]);

	return {
		...animal,
		hasNextNodes: !!animal.motherId || !!animal.fatherId,
		nodes: [fatherNode, motherNode],
	};
}

export const pedigreeRoute = elysiaV1Middleware.group("/pedigree", (app) => {
	return app.get(
		"/tree",
		async ({ query }) => {
			const { level, animal_id_eq } = query;

			const nodes: Node[] = [];
			const animalTree = await getAnimalTree(animal_id_eq, level);
			if (animalTree) nodes.push(animalTree);

			return { docs: nodes };
		},
		{
			query: treeQuery,
		},
	);
});
