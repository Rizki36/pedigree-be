import { t } from "elysia";

export const treeQuery = t.Object({
	level: t.Number(),
	animal_id_eq: t.String(),
});
