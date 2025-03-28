const { Webhook } = require("svix");
const User = require("../models/user.model");
const dotenv = require("dotenv");
dotenv.config();

const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET_KEY;

if (!SIGNING_SECRET) {
  throw new Error(
    "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env"
  );
}
const handleWebHook = async (req, res) => {
  try {
    const svixHeaders = req.headers;
    const payloadString = JSON.stringify(req.body);

    const wh = new Webhook(SIGNING_SECRET);
    const evt = wh.verify(payloadString, svixHeaders);

    const { id, ...atributes } = evt.data;
    const evenType = evt.type;
    if (evenType === "user.created") {
      const nameUser = `${atributes.first_name} ${atributes.last_name}`;
      console.log(nameUser);
      const user = new User({
        name: nameUser,
        email: atributes.email_addresses[0]?.email_address,
        role: "customer",
        googleId: atributes.external_accounts[0]?.google_id,
        facebookId:
          atributes.external_accounts.find(
            (acc) => acc.provider === "oauth_facebook"
          )?.id || null,
        isLocked: false,
      });

      await user.save();
      console.log("User is created ");
    }
    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { handleWebHook };
