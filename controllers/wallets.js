import crypto from "crypto";
import {
  getBodyData,
  getData,
  saveData,
  sendResponse,
} from "../utils/helpers.js";

export const getAllwallets = async (req, res) => {
  try {
    const data = getData();
    sendResponse(res, 200, data.wallets);
  } catch (err) {
    sendResponse(res, 500, { message: "Failed to load wallets" });
  }
};

export const createWallet = async (req, res) => {
  try {
    const data = getData();
    const parsed = await getBodyData(req);

    if (!parsed.name || !parsed.user_id) {
      return sendResponse(res, 400, { message: "all fields are required !" });
    }

    if (!data.users.some((u) => u.id === parsed.user_id)) {
      return sendResponse(res, 400, { message: "invalid user_id!" });
    }

    const newWallet = {
      wallet_id: crypto.randomUUID(),
      name: parsed.name,
      user_id: parsed.user_id,
      sold: 0,
    };

    data.wallets.push(newWallet);
    saveData(data);

    sendResponse(res, 201, { message: "created !", wallet: newWallet });
  } catch (err) {
    sendResponse(res, 400, { message: "Invalid JSON or Server Error" });
  }
};

export const updateWallet = async (req, res) => {
  try {
    const id = req.url.split("/")[2];
    const data = getData();
    const index = data.wallets.findIndex((w) => w.wallet_id === id);

    if (index === -1) {
      return sendResponse(res, 404, { message: "wallet not found" });
    }

    const parsed = await getBodyData(req);

    data.wallets[index] = { ...data.wallets[index], ...parsed };
    saveData(data);

    sendResponse(res, 200, {
      message: "updated !",
      wallet: data.wallets[index],
    });
  } catch (err) {
    sendResponse(res, 400, { message: "Update failed" });
  }
};

export const deleteWallet = async (req, res) => {
  try {
    const id = req.url.split("/")[2];
    const data = getData();
    const index = data.wallets.findIndex((w) => w.wallet_id === id);

    if (index === -1) {
      return sendResponse(res, 404, { message: "wallet not found !" });
    }

    data.wallets.splice(index, 1);
    saveData(data);
    sendResponse(res, 200, { message: "deleted !" });
  } catch (err) {
    sendResponse(res, 500, { message: "Delete failed" });
  }
};

export const deposit = async (req, res) => {
  try {
    const id = req.url.split("/")[2];
    const data = getData();
    const index = data.wallets.findIndex((w) => w.wallet_id === id);

    if (index === -1) {
      return sendResponse(res, 404, { message: "wallet not found" });
    }

    const { amount } = await getBodyData(req);
    data.wallets[index].sold += Number(amount);

    const newTransaction = {
      transaction_id: crypto.randomUUID(),
      wallet_id: id,
      amount: Number(amount),
      type: "DEPOSIT",
      date: new Date().toISOString(),
    };

    if (!data.transactions) data.transactions = [];
    data.transactions.push(newTransaction);

    saveData(data);
    sendResponse(res, 200, {
      message: "Deposit successful",
      wallet: data.wallets[index],
    });
  } catch (err) {
    sendResponse(res, 400, { message: "Deposit failed" });
  }
};

export const withdraw = async (req, res) => {
  try {
    const id = req.url.split("/")[2];
    const data = getData();
    const index = data.wallets.findIndex((w) => w.wallet_id === id);

    if (index === -1) {
      return sendResponse(res, 404, { message: "wallet not found" });
    }

    const { amount } = await getBodyData(req);

    if (data.wallets[index].sold < amount) {
      return sendResponse(res, 400, { message: "Insufficient balance" });
    }

    data.wallets[index].sold -= Number(amount);

    const newTransaction = {
      transaction_id: crypto.randomUUID(),
      wallet_id: id,
      amount: Number(amount),
      type: "WITHDRAW",
      date: new Date().toISOString(),
    };

    if (!data.transactions) data.transactions = [];
    data.transactions.push(newTransaction);

    saveData(data);
    sendResponse(res, 200, {
      message: "Withdraw successful",
      wallet: data.wallets[index],
    });
  } catch (err) {
    sendResponse(res, 400, { message: "Withdraw failed" });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const data = getData();
    sendResponse(res, 200, data.transactions || []);
  } catch (err) {
    sendResponse(res, 500, { message: "Failed to load transactions" });
  }
};
