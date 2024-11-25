import { t } from "elysia";

export const listAnimalQuery = t.Object({
  id_eq: t.Optional(t.String()),
  limit: t.Optional(t.Number()),
  search: t.Optional(t.String()),
  gender_eq: t.Optional(t.String()),
});

export const updateAnimalBody = t.Object({
  id: t.String(),
  code: t.Optional(t.String()),
  name: t.Optional(t.String()),
  dateOfBirth: t.Optional(t.Date()),
  diedAt: t.Optional(t.Date()),
});

export const createAnimalBody = t.Object({
  code: t.String(),
  name: t.String(),
  dateOfBirth: t.Optional(t.Date()),
  diedAt: t.Optional(t.Date()),
});

export const deleteAnimalBody = t.Object({
  id: t.String(),
});
