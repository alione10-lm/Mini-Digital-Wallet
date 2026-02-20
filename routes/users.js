import fs from "fs";
import {
  createUser,
  deleteUser,
  getAllusers,
  getUserById,
  updateUser,
} from "../controllers/users.js";

export const usersRoutes = async (req, res) => {
  const urlParts = req.url.split("/");
  const id = parseInt(urlParts[2]);

  if (req.method === "GET" && req.url.endsWith("users")) {
    getAllusers(req, res);
  }

  if (req.method === "GET" && urlParts[1] === "users" && id) {
    getUserById(req, res);
  }

  if (req.method === "POST" && req.url.endsWith("users")) {
    createUser(req, res);
  }
  if (req.method === "DELETE" && urlParts[1] === "users" && id) {
    deleteUser(req, res);
  }
  if (req.method === "PUT" && urlParts[1] === "users" && id) {
    updateUser(req, res);
  }
};
