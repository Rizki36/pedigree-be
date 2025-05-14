import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { oauth2 } from "elysia-oauth2";

const jwtBodySchema = t.Object({
	id: t.String(),
	email: t.String(),
	exp: t.Number(),
});

export const elysia = new Elysia({ name: "elysia-v1" })
	.state({
		user: null as null | { id: string; email: string },
	})
	.use(cookie())
	.use(
		jwt<"jwt", typeof jwtBodySchema>({
			name: "jwt",
			secret: process.env.JWT_SECRET || "your-secret-key",
		}),
	)
	.use(
		oauth2(
			{
				Google: [
					process.env.GOOGLE_CLIENT_ID!,
					process.env.GOOGLE_CLIENT_SECRET!,
					process.env.GOOGLE_REDIRECT_URI!,
				],
			},
			process.env.NODE_ENV === "development"
				? {}
				: {
						cookie: {
							// defaults
							secure: true,
							sameSite: "None",
							path: "/",
							httpOnly: true,
							maxAge: 60 * 30, // 30 min
							domain: process.env.DOMAIN,
						},
					},
		),
	)
	.macro({
		isSignIn(enabled: boolean) {
			if (!enabled) return;

			return {
				async beforeHandle({ status, jwt, cookie: { authToken }, store }) {
					if (!authToken.value) {
						return status(401, {
							authenticated: false,
						});
					}

					const payload = await jwt.verify(authToken.value);
					if (!payload) {
						return status(401, {
							authenticated: false,
						});
					}

					store.user = {
						id: payload.id,
						email: payload.email,
					};
				},
			};
		},
	});
