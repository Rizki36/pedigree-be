import { t } from "elysia";
import { Gender } from "../../../prisma/generated/client";

export const listAnimalQuery = t.Object({
	id_eq: t.Optional(t.String()),
	id_ne: t.Optional(t.String()),
	limit: t.Optional(t.Number()),
	search: t.Optional(t.String()),
	gender_eq: t.Optional(t.String()),
	animal_type_code_eq: t.Optional(t.String()),
});

export const updateAnimalBody = t.Object({
	id: t.String(),
	code: t.Optional(t.String()),
	name: t.Optional(t.String()),
	dateOfBirth: t.Optional(t.Nullable(t.Date())),
	diedAt: t.Optional(t.Nullable(t.Date())),
	animalTypeCode: t.Optional(t.String()),
	motherId: t.Optional(t.Nullable(t.String())),
	fatherId: t.Optional(t.Nullable(t.String())),
	note: t.Optional(t.Nullable(t.String())),
	gender: t.Optional(t.Nullable(t.Enum(Gender))),
});

export const createAnimalBody = t.Object({
	code: t.String(),
	name: t.String(),
	dateOfBirth: t.Optional(t.Date()),
	diedAt: t.Optional(t.Date()),
	animalTypeCode: t.String(),
	gender: t.Optional(t.Nullable(t.Enum(Gender))),
});

export const deleteAnimalBody = t.Object({
	id: t.String(),
});
