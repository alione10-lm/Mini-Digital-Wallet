import http from "http";
import fs from "fs";
import { usersRoutes } from "./routes/users.js";
import { walletsRoutes } from "./routes/wallets.js";

const raw = fs.readFileSync("./data/data.json", "utf8");
const data = JSON.parse(raw);

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  // get all users
  usersRoutes(req, res);
  walletsRoutes(req, res);
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// const server = http.createServer((req, res) => {
//   res.setHeader("Content-Type", "application/json");

//   console.log(req);

//   // 🔹 GET ALL USERS
//   if (req.method === "GET" && req.url === "/users") {
//     return res.end(JSON.stringify(users));
//   }

//   // 🔹 CREATE USER
//   if (req.method === "POST" && req.url === "/users") {
//     let body = "";

//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });

//     req.on("end", () => {
//       const data = JSON.parse(body);

//       if (!data.name) {
//         res.writeHead(400);
//         return res.end(JSON.stringify({ message: "Name is required" }));
//       }

//       const newUser = {
//         id: idCounter++,
//         name: data.name,
//       };

//       users.push(newUser);

//       res.writeHead(201);
//       res.end(JSON.stringify(newUser));
//     });
//   }

//   // 🔹 GET USER BY ID
//   if (req.method === "GET" && req.url.startsWith("/users/")) {
//     const id = parseInt(req.url.split("/")[2]);
//     const user = users.find((u) => u.id === id);

//     if (!user) {
//       res.writeHead(404);
//       return res.end(JSON.stringify({ message: "User not found" }));
//     }

//     return res.end(JSON.stringify(user));
//   }

//   // 🔹 UPDATE USER
//   if (req.method === "PUT" && req.url.startsWith("/users/")) {
//     const id = parseInt(req.url.split("/")[2]);
//     let body = "";

//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });

//     req.on("end", () => {
//       const data = JSON.parse(body);
//       const user = users.find((u) => u.id === id);

//       if (!user) {
//         res.writeHead(404);
//         return res.end(JSON.stringify({ message: "User not found" }));
//       }

//       user.name = data.name || user.name;

//       res.end(JSON.stringify(user));
//     });
//   }

//   // 🔹 DELETE USER
//   if (req.method === "DELETE" && req.url.startsWith("/users/")) {
//     const id = parseInt(req.url.split("/")[2]);
//     const index = users.findIndex((u) => u.id === id);

//     if (index === -1) {
//       res.writeHead(404);
//       return res.end(JSON.stringify({ message: "User not found" }));
//     }

//     users.splice(index, 1);

//     res.end(JSON.stringify({ message: "User deleted" }));
//   }

//   // 🔹 404
//   res.writeHead(404);
//   res.end(JSON.stringify({ message: "Route not found" }));
// });
