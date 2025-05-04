import { t } from "elysia";

export const listAchievementQuery = t.Object({});

export const updateAchievementBody = t.Object({
	id: t.String(),
	name: t.Optional(t.String()),
	issuedBy: t.Optional(t.String()),
	issuedAt: t.Optional(t.Date()),
	note: t.Optional(t.Nullable(t.String())),
});

export const createAchievementBody = t.Object({
	name: t.String(),
	issuedBy: t.Optional(t.String()),
	issuedAt: t.Optional(t.Date()),
	note: t.Optional(t.Nullable(t.String())),
});

export const deleteAchievementBody = t.Object({
	id: t.String(),
});
