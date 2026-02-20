import fs from "fs";

import { fileURLToPath } from "url";
import path, { parse } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const raw = fs.readFileSync(path.join(__dirname, "../data/data.json"), "utf8");
let data = JSON.parse(raw);

export const getAllwallets = async (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data.wallets));
};

export const createWallet = async (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    console.log(JSON.parse(body));

    const parsed = JSON.parse(body);

    parsed.wallet_id = crypto.randomUUID();
    parsed.sold = 0;

    if (!parsed.name || !parsed.user_id) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "all fields are required !" }));
      return;
    }

    if (!data.users.some((u) => u.id === parsed.user_id)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "invalid id ! no user found with this id " }),
      );
      return;
    }

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "created !", wallet: parsed }));

    data.wallets.push(parsed);
    fs.writeFileSync(
      path.join(__dirname, "../data/data.json"),
      JSON.stringify(data, null, 2),
    );
  });
};

export const updateWallet = async (req, res) => {
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);

  const walletNdx = data.wallets.findIndex((wallet) => wallet.id === id);

  if (walletNdx === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "wallet not found" }));
  } else {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const parsed = JSON.parse(body);

      data.wallets[walletNdx] = { ...data.wallets[walletNdx], ...parsed };

      fs.writeFileSync(
        path.join(__dirname, "../data/data.json"),
        JSON.stringify(data, null, 2),
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "updated !",
          wallet: data.wallets[walletNdx],
        }),
      );
    });
  }
};

export const deleteWallet = async (req, res) => {
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);

  const walletNdx = data.wallets.findIndex((wallet) => wallet.id === id);

  if (walletNdx === -1) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "wallet not found !" }));
  } else {
    data.wallets.slice(walletNdx, 1);
    fs.writeFileSync(
      path.join(__dirname, "../data/data.json"),
      JSON.stringify(data, null, 2),
    );
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "deleted !" }));
  }
};

export const deposit = (req, res) => {
  const urlParts = req.url.split("/");
  const id = urlParts[2];

  console.log(data.wallets.every((w) => w.wallet_id == id));

  // if (data.wallets.some((w) => w.wallet_id !== id)) {
  //   res.writeHead(200, { "Content-Type": "application/json" });
  //   res.end(JSON.stringify({ message: "invalid wallet id  !" }));
  // }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  res.on("end", () => {
    const parsed = JSON.parse(body);
    console.log(body);

    data.wallets.forEach((wallet) => {
      wallet.id === id
        ? { ...wallet, sold: wallet.sold + parsed.amount }
        : wallet;
    });
    console.log(data.wallets);
    fs.writeFileSync(
      path.join(__dirname, "../data/data.json"),
      JSON.stringify(data, null, 2),
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "updated !",
        wallet: data.wallets[walletNdx],
      }),
    );
  });

  fs.writeFileSync(
    path.join(__dirname, "../data/data.json"),
    JSON.stringify(data, null, 2),
  );
};

export const withdraw = (req, res) => {
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);

  if (!data.wallets.some((w) => w.id === id)) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "invalid user id  !" }));
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  res.on("end", () => {
    const parsed = JSON.parse(body);

    data.wallets.forEach((wallet) => {
      wallet.id === id
        ? { ...wallet, sold: wallet.sold - parsed.amount }
        : wallet;
    });

    fs.writeFileSync(
      path.join(__dirname, "../data/data.json"),
      JSON.stringify(data, null, 2),
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        message: "updated !",
        wallet: data.wallets[walletNdx],
      }),
    );
  });

  fs.writeFileSync(
    path.join(__dirname, "../data/data.json"),
    JSON.stringify(data, null, 2),
  );
};
