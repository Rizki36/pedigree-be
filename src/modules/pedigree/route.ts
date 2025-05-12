import type { Animal } from "../../../prisma/generated/client";
import { PrismaClient } from "../../../prisma/generated/client";
import { elysia } from "../core/lib/elysia";
import { treeQuery } from "./model";

type Node = Animal & {
	hasNextNodes: boolean;
	nodes: [Node | null, Node | null];
	isCircular: boolean; // property to mark circular dependencies
	isSameParentGender: boolean; // property to mark if both parents are of the same gender
};

const db = new PrismaClient();

// recursive function to get the animal tree
async function getAnimalTree(
	id: string,
	level: number,
	userId: string,
	ancestors: Set<string> = new Set(), // Track ancestors to detect circular references
): Promise<Node | null> {
	if (level <= 0) return null;

	// Check if this animal is already in our ancestry path (circular reference)
	const isCircular = ancestors.has(id);

	// Clone the ancestors set and add current ID for child calls
	const currentPath = new Set(ancestors);
	currentPath.add(id);

	const animal = await db.animal.findUnique({
		where: { id },
	});

	if (!animal) return null;

	// If this is a circular reference, don't go deeper to prevent infinite recursion
	if (isCircular) {
		return {
			...animal,
			hasNextNodes: false, // Don't show "has more" indicator for circular refs
			nodes: [null, null],
			isCircular: true,
			isSameParentGender: false,
		};
	}

	// Continue with the normal tree traversal
	const [fatherNode, motherNode] = await Promise.all([
		animal.fatherId
			? getAnimalTree(animal.fatherId, level - 1, userId, currentPath)
			: Promise.resolve(null),
		animal.motherId
			? getAnimalTree(animal.motherId, level - 1, userId, currentPath)
			: Promise.resolve(null),
	]);

	// Check if both parents exist and have the same gender
	let isSameParentGender = false;

	if (animal.fatherId && animal.motherId) {
		// Fetch both parents to check their gender
		const [father, mother] = await Promise.all([
			db.animal.findUnique({
				where: { id: animal.fatherId, userId },
				select: { gender: true },
			}),
			db.animal.findUnique({
				where: { id: animal.motherId, userId },
				select: { gender: true },
			}),
		]);

		// If both parents exist and have the same gender, mark it
		if (father && mother && father.gender === mother.gender) {
			isSameParentGender = true;
		}
	}

	return {
		...animal,
		hasNextNodes: !!animal.motherId || !!animal.fatherId,
		nodes: [fatherNode, motherNode],
		isCircular: false,
		isSameParentGender,
	};
}

export const pedigreeRoute = elysia.group("/pedigree", (app) => {
	return app.get(
		"/tree",
		async ({ query, store }) => {
			const { level, animal_id_eq, visited_ids } = query;

			const userId = store.user?.id!;

			const nodes: Node[] = [];
			const animalTree = await getAnimalTree(
				animal_id_eq,
				level,
				userId,
				new Set(visited_ids || []),
			);
			if (animalTree) nodes.push(animalTree);

			return { docs: nodes };
		},
		{
			query: treeQuery,
			isSignIn: true,
		},
	);
});
