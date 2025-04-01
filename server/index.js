const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const svix = require("svix");
const app = express();

//Import routes
const webhookRouter = require("./src/routes/webhook");
const gigRouter = require("./src/routes/gigs");
const sitRouter = require("./src/routes/site");
dotenv.config();

app.use(cors());
app.use(morgan("common"));
app.use(express.json());
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL);
    console.log("Mongoose connect success");
  } catch (error) {
    console.log("error: ", error);
  }
};

connect();

//Routes
app.use("/api/webhooks", webhookRouter);
app.use("/gigs", gigRouter);
app.use("/", sitRouter);

const port = 5000;
app.listen(port, () => {
  console.log(`Server listen in port ${port}`);
});
