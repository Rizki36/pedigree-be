import type { Animal } from "../../../prisma/generated/client/index.js";
import { PrismaClient } from "../../../prisma/generated/client/index.js";
import { elysia } from "../core/lib/elysia.js";
import { getTreeQuery } from "./model.js";
import { PedigreeService } from "./service.js";

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
