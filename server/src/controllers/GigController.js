const gigModel = require("../models/gigs.model");

const createGig = async (req, res) => {
  try {
    const gig = new gigModel(req.body);
    await gig.save();
    res.status(201).json({ message: "Gig created successfully", gig });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteGig = async (req, res) => {
  try {
    const idGig = req.params.id;
    const gig = await gigModel.findById(idGig);
    if (!gig) {
      return res.status(200).json({ message: "Gig not found" });
    }
    if (req.UserID === gig.UserID.toString()) {
      // bug userIDuserID
      await gigModel.deleteOne({ _id: idGig });
      return res.send({
        error: false,
        message: "Gig had been successfully deleted!",
      });
    }
    throw CustomException(
      "Invalid request! Cannot delete other user gigs!",
      403
    );
  } catch (error) {
    return res.status(500).send({
      message: "Server error",
    });
  }
};

const getGig = async (req, res) => {
  try {
    let git = gigModel.findOne(req.body.us);
  } catch (error) {
    return res.send(500, { message: "Server error" });
  }
};

// const getGigs = async (req, res) => {
//   try {
//   } catch (error) {
//     return res.status(500).send("Server error: ", error);
//   }
// };

module.exports = { createGig, deleteGig };
