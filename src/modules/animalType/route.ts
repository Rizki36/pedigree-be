import Elysia, { t } from "elysia";
import { listAnimalTypeQuery } from "./model";
import { Prisma, PrismaClient } from "../../../prisma/generated/client";

const db = new PrismaClient();

export const animalTypeRoute = new Elysia({ prefix: "/animal-type" }).get(
  "/list",
  async ({ query }) => {
    const where: Prisma.AnimalTypeFindManyArgs["where"] = {};
    if (query.code_eq) where.code = query.code_eq;
    const animalTypes = await db.animalType.findMany({ where });

    return {
      docs: animalTypes,
    };
  },
  {
    query: listAnimalTypeQuery,
  }
);
