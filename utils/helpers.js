import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, "../data/data.json");

const getData = () => JSON.parse(fs.readFileSync(dataPath, "utf8"));
const saveData = (data) =>
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

const getBodyData = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(JSON.parse(body));
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
};

const sendResponse = (res, status, data) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

export { getData, saveData, getBodyData, sendResponse };
