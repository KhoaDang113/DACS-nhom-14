const siteRouter = require("express").Router();
const siteController = require("../controllers/SiteController");

siteRouter.get("/api/category", siteController.getAllCategory);

module.exports = siteRouter;
