import swagger from "@elysiajs/swagger";
import Elysia, { t } from "elysia";
import { animalRoute } from "./modules/animal/route";
import cors from "@elysiajs/cors";
import { animalTypeRoute } from "./modules/animalType/route";
import { authRoute } from "./modules/auth/route";

const app = new Elysia()
	.use(cors())
	.use(swagger())
	.onError(({ error, code }) => {
		if (code === "NOT_FOUND") return;
		console.error(error);
	})
	.get("/", () => "Hello Elysia")
	.group("/v1", (app) => {
		return app.use(authRoute).use(animalRoute).use(animalTypeRoute);
	})
	.listen(3011);

export default app;
