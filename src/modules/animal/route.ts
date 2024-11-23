import Elysia, { t } from "elysia";
import {
  createAnimalBody,
  deleteAnimalQuery,
  listAnimalQuery,
  updateAnimalBody,
} from "./model";
import { Prisma, PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export const animalRoute = new Elysia({ prefix: "/animal" })
  .put(
    "",
    async ({ body }) => {
      const animal = await db.animal.update({
        data: {
          ...(body.code && { code: body.code }),
          ...(body.name && { name: body.name }),
          ...(body.diedAt && { diedAt: body.diedAt }),
          ...(body.dateOfBirth && { dateOfBirth: body.dateOfBirth }),
        },
        where: {
          id: body.id,
        },
      });

      return {
        doc: animal,
      };
    },
    {
      body: updateAnimalBody,
    }
  )
  .post(
    "",
    async ({ body }) => {
      const animal = await db.animal.create({
        data: body,
      });

      return {
        doc: animal,
      };
    },
    {
      body: createAnimalBody,
    }
  )
  .delete(
    "",
    async ({ query }) => {
      const animal = await db.animal.delete({
        where: {
          id: query.id_eq,
        },
      });

      return {
        doc: animal,
      };
    },
    {
      query: deleteAnimalQuery,
    }
  )
  .get(
    "/list",
    async ({ query }) => {
      const limit = query.limit ?? 20;

      const where: Prisma.AnimalFindManyArgs["where"] = {};
      if (query.id_eq) where.id = query.id_eq;
      if (query.search)
        where.OR = [
          { code: { contains: query.search } },
          { name: { contains: query.search } },
        ];
      if (query.gender_eq === "MALE") where.gender = { equals: "MALE" };
      if (query.gender_eq === "FEMALE") where.gender = { equals: "FEMALE" };

      const animals = await db.animal.findMany({ where, take: limit });

      return {
        docs: animals,
        limit,
      };
    },
    {
      query: listAnimalQuery,
    }
  );
