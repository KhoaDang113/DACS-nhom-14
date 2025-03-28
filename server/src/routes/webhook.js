const webhookRouter = require("express").Router();
const { handleWebHook } = require("../controllers/WebhookController");

webhookRouter.post("/", handleWebHook);
module.exports = webhookRouter;
