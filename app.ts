import { Hono } from "https://deno.land/x/hono@v4.0.0-rc.2/mod.ts";
import {
  cors,
  serveStatic,
} from "https://deno.land/x/hono@v4.0.0-rc.2/middleware.ts";
import { streamSSE } from "https://deno.land/x/hono@v4.0.0-rc.2/helper.ts";

interface ILastVisit {
  city: string;
  country: string;
  flag: string;
}

const app = new Hono();
const db = await Deno.openKv();
app.use(cors());

app.get("/", serveStatic({ path: "./index.html" }));

app.post("/visit", async (c) => {
  const { city, country, flag } = await c.req.json<ILastVisit>();
  await db
    .atomic()
    .set(["lastVisit"], { city, country, flag })
    .sum(["visits"], 1n)
    .commit();

  return c.json({ message: "ok" });
});

let count = 0;

app.get("/visit", async (c) => {
  return streamSSE(c, async (stream) => {
    const visitsKey = ["lastVisit"];
    const keyLists = [visitsKey];
    const watcher = db.watch(keyLists);

    for await (const entry of watcher) {
      const value = entry[0].value;

      if (value !== null)
        await stream.writeSSE({
          data: JSON.stringify(value),
          event: "visit-update",
          id: String(count++),
        });
    }
  });
});

Deno.serve(app.fetch);
