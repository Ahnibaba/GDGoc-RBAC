const express = require("express")
const { getAllUsers, deleteUser } = require("../controllers/usersController")
const authMiddleware = require("../middleware/auth")

const usersRouter = express.Router()

usersRouter.get("/", authMiddleware, getAllUsers)
usersRouter.post("/delete", authMiddleware, deleteUser)

module.exports = usersRouter