import swagger from "@elysiajs/swagger";
import Elysia, { t } from "elysia";
import { animalRoute } from "./modules/animal/route";
import cors from "@elysiajs/cors";
import { animalTypeRoute } from "./modules/animalType/route";
import { authRoute } from "./modules/auth/route";
import { achievementRoute } from "./modules/achievement/route";
import { pedigreeRoute } from "./modules/pedigree/route";
import { rateLimit } from "elysia-rate-limit";

const app = new Elysia()
	.use(rateLimit())
	.use(cors())
	.use(swagger())
	.onError(({ error, code }) => {
		if (code === "NOT_FOUND") return;
		console.error(error);
	})
	.get("/", () => "Hello Elysia")
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
