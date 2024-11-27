import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { animalRoute } from "./modules/animal/route";
import cors from "@elysiajs/cors";
import { animalTypeRoute } from "./modules/animalType/route";

const app = new Elysia()
  .use(cors())
  .use(swagger())
  .onError(({ error, code }) => {
    if (code === "NOT_FOUND") return;

    console.error(error);
  })
  .get("/", () => "Hello Elysia")
  .group("/v1", (app) => {
    return app.use(animalRoute).use(animalTypeRoute);
  })
  .listen(3011);

export default app;
