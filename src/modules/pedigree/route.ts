import type { Animal } from "../../../prisma/generated/client";
import { PrismaClient } from "../../../prisma/generated/client";
import { elysia } from "../core/lib/elysia";
import { getTreeQuery } from "./model";
import { PedigreeService } from "./service";

const prisma = new PrismaClient();
const pedigreeService = new PedigreeService(prisma);

export const pedigreeRoute = elysia.group("/pedigree", (app) => {
	return app.get(
		"/tree",
		async ({ query, store }) => {
			const userId = store.user?.id!;
			return pedigreeService.getTree({
				query,
				userId,
			});
		},
		{
			query: getTreeQuery,
			isSignIn: true,
		},
	);
});
