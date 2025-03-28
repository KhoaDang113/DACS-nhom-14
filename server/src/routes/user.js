const userRouter = require("express").Router();

const userController = require("../controllers/UserController");
const user = require("../model/user");

userRouter.get("/", userController.showAllUser);

module.exports = userRouter;
