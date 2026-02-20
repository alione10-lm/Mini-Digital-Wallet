import {
  createWallet,
  deleteWallet,
  deposit,
  withdraw,
  getAllwallets,
  updateWallet,
} from "../controllers/wallets.js";

export const walletsRoutes = (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  const parts = pathname.split("/").filter(Boolean);
  const id = parts[1]; // wallet_id

  // /wallets/:id/deposit
  if (
    req.method === "PUT" &&
    parts.length === 3 &&
    parts[0] === "wallets" &&
    parts[2] === "deposit"
  ) {
    return deposit(req, res);
  }

  // /wallets/:id/withdraw
  if (
    req.method === "PUT" &&
    parts.length === 3 &&
    parts[0] === "wallets" &&
    parts[2] === "withdraw"
  ) {
    return withdraw(req, res);
  }

  // GET /wallets
  if (req.method === "GET" && parts.length === 1 && parts[0] === "wallets") {
    return getAllwallets(req, res);
  }

  // POST /wallets
  if (req.method === "POST" && parts.length === 1 && parts[0] === "wallets") {
    return createWallet(req, res);
  }

  // DELETE /wallets/:id
  if (req.method === "DELETE" && parts.length === 2 && parts[0] === "wallets") {
    return deleteWallet(req, res);
  }

  // PUT /wallets/:id (update)
  if (req.method === "PUT" && parts.length === 2 && parts[0] === "wallets") {
    return updateWallet(req, res);
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
};
