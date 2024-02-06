const db = await Deno.openKv();

// await db.set(["visits"], new Deno.KvU64(0n));s

const res = await db.get(["visits"]);

console.log(res);

await db.atomic().sum(["visits"], 1n).commit();
