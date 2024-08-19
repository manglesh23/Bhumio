const path = require("path");

const getfile = async (req, res) => {
  try {
    let filename = req.params.filename;
    const filePath = path.join(__dirname,'..', "dataFile", filename);
    console.log(__dirname);
    console.log("File path:-", filePath);
    res.sendFile(filePath);
    // res.status(200).json({ msg: `${fileName}` });
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

module.exports = { getfile };
