const gigRouter = require("express").Router();
const gitController = require("../controllers/GigController");
const authMiddleware = require("../middlewares/authMiddleware");

gigRouter.post("/create", gitController.createGig);
gigRouter.delete("/delete/:id", authMiddleware, gitController.deleteGig);

module.exports = gigRouter;
