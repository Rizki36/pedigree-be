import type { Animal, PrismaClient } from "../../../prisma/generated/client";
import type { getTreeQuery } from "./model";

type TreeNode = Animal & {
	hasNextNodes: boolean;
	nodes: [TreeNode | null, TreeNode | null];
	isCircular: boolean; // property to mark circular dependencies
	isSameParentGender: boolean; // property to mark if both parents are of the same gender
};

// recursive function to get the pedigree tree
async function getPedigreeTree(
	id: string,
	level: number,
	userId: string,
	prisma: PrismaClient,
	ancestors: Set<string> = new Set(), // Track ancestors to detect circular references
): Promise<TreeNode | null> {
	if (level <= 0) return null;

	// Check if this animal is already in our ancestry path (circular reference)
	const isCircular = ancestors.has(id);

	// Clone the ancestors set and add current ID for child calls
	const currentPath = new Set(ancestors);
	currentPath.add(id);

	const animal = await prisma.animal.findUnique({
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
			? getPedigreeTree(animal.fatherId, level - 1, userId, prisma, currentPath)
			: Promise.resolve(null),
		animal.motherId
			? getPedigreeTree(animal.motherId, level - 1, userId, prisma, currentPath)
			: Promise.resolve(null),
	]);

	// Check if both parents exist and have the same gender
	let isSameParentGender = false;

	if (animal.fatherId && animal.motherId) {
		// Fetch both parents to check their gender
		const [father, mother] = await Promise.all([
			prisma.animal.findUnique({
				where: { id: animal.fatherId, userId },
				select: { gender: true },
			}),
			prisma.animal.findUnique({
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

export class PedigreeService {
	prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	getTree = async (args: {
		query: typeof getTreeQuery.static;
		userId: string;
	}) => {
		const { userId, query } = args;
		const { level, animal_id_eq, visited_ids } = query;

		const nodes: TreeNode[] = [];
		const animalTree = await getPedigreeTree(
			animal_id_eq,
			level,
			userId,
			this.prisma,
			new Set(visited_ids || []),
		);
		if (animalTree) nodes.push(animalTree);

		return { docs: nodes };
	};
}
