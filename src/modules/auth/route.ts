import { t } from "elysia";
import { PrismaClient } from "../../../prisma/generated/client";
import { elysiaV1Middleware } from "../core/lib/elysia";

const prisma = new PrismaClient();

export const authRoute = elysiaV1Middleware.group("/auth", (app) => {
	return app
		.get("/google", async ({ oauth2, redirect }) => {
			const url = oauth2.createURL("Google", ["email", "profile"]);
			url.searchParams.set("access_type", "offline");

			return redirect(url.href);
		})
		.get(
			"/google/callback",
			async ({ oauth2, jwt, cookie, set, redirect }) => {
				try {
					// Get token from Google
					const tokens = await oauth2.authorize("Google");
					const accessToken = tokens.accessToken();

					// Get user info
					const userResponse = await fetch(
						"https://www.googleapis.com/oauth2/v2/userinfo",
						{
							headers: {
								Authorization: `Bearer ${accessToken}`,
							},
						},
					);

					const googleUser = await userResponse.json();

					if (!googleUser.id || !googleUser.email || !googleUser.name) {
						set.status = 400;
						return { error: "Incomplete user data from Google" };
					}

					// Find or create user in database
					let user = await prisma.user.findUnique({
						where: { googleId: googleUser.id },
					});

					if (user) {
						// Update user data in case it changed
						user = await prisma.user.update({
							where: { id: user.id },
							data: {
								name: googleUser.name,
								email: googleUser.email,
								profilePictureUrl: googleUser.picture,
							},
						});
					} else {
						user = await prisma.user.create({
							data: {
								email: googleUser.email,
								name: googleUser.name,
								googleId: googleUser.id,
								profilePictureUrl: googleUser.picture,
							},
						});
					}

					// Create JWT token
					const token = await jwt.sign({
						id: user.id,
						email: user.email,
						exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
					});

					// Set cookie and redirect to frontend
					cookie.authToken.value = token;
					cookie.authToken.httpOnly = process.env.NODE_ENV === "production";
					cookie.authToken.secure = process.env.NODE_ENV === "production";
					cookie.authToken.maxAge = 60 * 60 * 24 * 7; // 7 days

					return redirect(process.env.FRONTEND_URL || "http://localhost:3010");
				} catch (error) {
					console.error("Google auth error:", error);
					set.status = 500;
					return { error: "Authentication failed" };
				}
			},
			{
				cookie: t.Cookie({
					authToken: t.Optional(
						t.String({
							description: "JWT token for authentication",
							example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
						}),
					),
				}),
			},
		)
		.get("/me", async ({ jwt, cookie }) => {
			// Verify token from cookie
			const payload = await jwt.verify(cookie.authToken.value);
			if (!payload) return { authenticated: false };

			// Return user info
			const user = await prisma.user.findUnique({
				where: { id: payload.id },
				select: { id: true, email: true, name: true, profilePictureUrl: true },
			});

			return { authenticated: true, user };
		})
		.post("/logout", ({ cookie }) => {
			// Clear cookie
			cookie.authToken.remove();
			return { message: "Logged out" };
		});
});
