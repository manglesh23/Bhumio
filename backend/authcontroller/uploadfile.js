const uploadfile = async (req, res) => {
  try {
    console.log("file uploaded");
      console.log("Uploaded File in Req:-",req.file);
      res.status(200).json({message:"File Uploaded"});
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

module.exports = { uploadfile };
