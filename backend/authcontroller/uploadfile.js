const uploadfile = async (req, res) => {
  try {
    if (!req.file) {
      console.log("error got");
      throw new Error("PDF File unavailable");
    }
    // console.log("file uploaded");
    // console.log("Uploaded File in Req:-", req.file);
    res.status(200).json({ message: "File Uploaded" });
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

module.exports = { uploadfile };
