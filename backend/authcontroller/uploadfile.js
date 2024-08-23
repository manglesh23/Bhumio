const fs = require("fs");
const path = require("path");

const uploadfile = async (req, res) => {
  try {
    if (!req.file) {
      console.log("error got");
      throw new Error("PDF File unavailable");
    }

    res.status(200).json({ file: req.file, message: "File Uploaded" });
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

module.exports = { uploadfile };
