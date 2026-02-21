import http from "http";
import fs from "fs";

import { router } from "./routes/router.js";

const raw = fs.readFileSync("./data/data.json", "utf8");
const data = JSON.parse(raw);

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  router(req, res);
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
