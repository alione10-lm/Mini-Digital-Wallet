import fs from "fs";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const raw = fs.readFileSync(path.join(__dirname, "../data/data.json"), "utf8");
let data = JSON.parse(raw);

export const getAllusers = async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data.users));
};

export const getUserById = async (req, res) => {
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);

  const user = data.users.find((u) => u.id === id);

  if (user) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User not found" }));
  }
};

export const createUser = async (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    console.log(JSON.parse(body));

    const parsed = JSON.parse(body);
    parsed.id = crypto.randomUUID();

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "created !", user: parsed }));

    data.users.push(parsed);
    fs.writeFileSync(
      path.join(__dirname, "../data/data.json"),
      JSON.stringify(data, null, 2),
    );
  });
};

export const deleteUser = async (req, res) => {
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);

  const userNdx = data.users.findIndex((user) => user.id === id);

  if (userNdx === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "user not found !" }));
  } else {
    data.users.slice(userNdx, 1);
    fs.writeFileSync(
      path.join(__dirname, "../data/data.json"),
      JSON.stringify(data, null, 2),
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "deleted !" }));
  }
};

export const updateUser = async (req, res) => {
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);

  const userNdx = data.users.findIndex((user) => user.id === id);

  if (userNdx === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "user not found" }));

    return;
  } else {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsed = JSON.parse(body);

      data.users[userNdx] = { ...data.users[userNdx], ...parsed };

      fs.writeFileSync(
        path.join(__dirname, "../data/data.json"),
        JSON.stringify(data, null, 2),
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "updated !", user: data.users[userNdx] }),
      );
    });
  }
};
