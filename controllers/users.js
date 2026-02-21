import crypto from "crypto";
import {
  getBodyData,
  getData,
  saveData,
  sendResponse,
} from "../utils/helpers.js";

export const getAllusers = async (req, res) => {
  try {
    const data = getData();
    sendResponse(res, 200, data.users);
  } catch (err) {
    sendResponse(res, 500, { message: "Failed to load users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.url.split("/")[2];
    const data = getData();
    const user = data.users.find((u) => String(u.id) === String(id));

    if (user) {
      sendResponse(res, 200, user);
    } else {
      sendResponse(res, 404, { message: "User not found" });
    }
  } catch (err) {
    sendResponse(res, 500, { message: "An error occurred" });
  }
};

export const createUser = async (req, res) => {
  try {
    const parsed = await getBodyData(req);
    const data = getData();

    if (!parsed.name) {
      return sendResponse(res, 400, { message: "Name is required" });
    }

    const newUser = {
      ...parsed,
      id: crypto.randomUUID(),
    };

    data.users.push(newUser);
    saveData(data);

    sendResponse(res, 201, { message: "created !", user: newUser });
  } catch (err) {
    sendResponse(res, 400, { message: "Invalid JSON or Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.url.split("/")[2];
    const data = getData();
    const index = data.users.findIndex((u) => String(u.id) === String(id));

    if (index === -1) {
      return sendResponse(res, 404, { message: "User not found" });
    }

    data.users.splice(index, 1);
    saveData(data);

    sendResponse(res, 200, { message: "deleted !" });
  } catch (err) {
    sendResponse(res, 500, { message: "Failed to delete user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.url.split("/")[2];
    const data = getData();
    const index = data.users.findIndex((u) => String(u.id) === String(id));

    if (index === -1) {
      return sendResponse(res, 404, { message: "User not found" });
    }

    const parsed = await getBodyData(req);
    data.users[index] = {
      ...data.users[index],
      ...parsed,
      id: data.users[index].id,
    };

    saveData(data);
    sendResponse(res, 200, { message: "updated !", user: data.users[index] });
  } catch (err) {
    sendResponse(res, 400, { message: "Invalid JSON or Update Failed" });
  }
};
