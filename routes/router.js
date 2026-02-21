import {
  createUser,
  deleteUser,
  getAllusers,
  getUserById,
  updateUser,
} from "../controllers/users.js";

import {
  createWallet,
  deleteWallet,
  deposit,
  withdraw,
  getAllwallets,
  updateWallet,
  getAllTransactions,
} from "../controllers/wallets.js";

export const router = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const parts = pathname.split("/").filter(Boolean);
  const resource = parts[0];
  const id = parts[1];

  // --------------Users ---------------------
  if (resource === "users") {
    if (req.method === "GET" && !id) return getAllusers(req, res);
    if (req.method === "GET" && id) return getUserById(req, res);
    if (req.method === "POST") return createUser(req, res);
    if (req.method === "DELETE" && id) return deleteUser(req, res);
    if (req.method === "PUT" && id) return updateUser(req, res);
  }

  // ---------------Wallets -----------------
  if (resource === "wallets") {
    if (req.method === "PUT" && parts[2] === "deposit")
      return deposit(req, res);
    if (req.method === "PUT" && parts[2] === "withdraw")
      return withdraw(req, res);

    if (!id) {
      if (req.method === "GET") return getAllwallets(req, res);
      if (req.method === "POST") return createWallet(req, res);
    }
    if (id && parts.length === 2) {
      if (req.method === "DELETE") return deleteWallet(req, res);
      if (req.method === "PUT") return updateWallet(req, res);
    }
  }

  // ---------------Transactions -----------------
  if (resource === "transactions") {
    if (req.method === "GET") {
      return getAllTransactions(req, res);
    }
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
};
