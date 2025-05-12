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
	.use(cors())
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
