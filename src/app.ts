import swagger from "@elysiajs/swagger";
import Elysia, { t } from "elysia";
import { animalRoute } from "./modules/animal/route";
import cors from "@elysiajs/cors";
import { animalTypeRoute } from "./modules/animalType/route";
import { authRoute } from "./modules/auth/route";
import { achievementRoute } from "./modules/achievement/route";
import { pedigreeRoute } from "./modules/pedigree/route";
import { rateLimit } from "elysia-rate-limit";
import logixlysia from "logixlysia";

const app = new Elysia()
	.use(
		rateLimit({
			duration: 60 * 1000, // 1 minute
			max: 300, // max 300 requests per duration
		}),
	)
	.use(
		logixlysia({
			config: {
				showStartupMessage: true,
				startupMessageFormat: "simple",
				timestamp: {
					translateTime: "yyyy-mm-dd HH:MM:ss",
				},
				ip: true,
				logFilePath: `./logs/${new Date().toISOString().split("T")[0]}.log`, // per day
				customLogFormat:
					"🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}",
				logFilter: {
					level: ["ERROR", "WARNING"],
					status: [500, 404],
				},
			},
		}),
	)
	.use(
		cors({
			origin:
				process.env.NODE_ENV === "development"
					? "*"
					: [
							"https://pedigree.devfitra.com",
							"https://www.pedigree.devfitra.com",
						], // Allow specific domains for production
			methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
			allowedHeaders: ["Content-Type", "Authorization"], // Restrict allowed headers
			credentials: true, // Enable if you need cookies/auth to be included
			maxAge: 86400, // Cache preflight requests (in seconds, e.g., 1 day)
		}),
	)
	.use(swagger())
	.onError(({ error, code }) => {
		if (code === "NOT_FOUND") return;
		console.error(error);
	})
	.get("/", () => {
		return "Hello Elysia";
	})
	.group("/v1", (app) => {
		return app
			.use(authRoute)
			.use(animalRoute)
			.use(animalTypeRoute)
			.use(achievementRoute)
			.use(pedigreeRoute);
	})
	.listen(3011);

export default app;
