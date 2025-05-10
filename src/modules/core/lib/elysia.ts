import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { oauth2 } from "elysia-oauth2";

export const elysia = new Elysia({ name: "middleware" });

const jwtBodySchema = t.Object({
	id: t.String(),
	email: t.String(),
	exp: t.Number(),
});

export const elysiaV1Middleware = elysia
	.use(cookie())
	.use(
		jwt<"jwt", typeof jwtBodySchema>({
			name: "jwt",
			secret: process.env.JWT_SECRET || "your-secret-key",
		}),
	)
	.use(
		oauth2({
			Google: [
				process.env.GOOGLE_CLIENT_ID!,
				process.env.GOOGLE_CLIENT_SECRET!,
				process.env.GOOGLE_REDIRECT_URI!,
			],
		}),
	);
