import { t } from "elysia";

export const listAnimalTypeQuery = t.Object({
	code_eq: t.Optional(t.String()),
});
