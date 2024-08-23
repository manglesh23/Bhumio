const fs = require("fs");
const path = require("path");

const uploadfile = async (req, res) => {
  try {
    // if (!req.file) {
    //   console.log("error got");
    //   throw new Error("PDF File unavailable");
    // }
    // // console.log("file uploaded");
    // // console.log("Uploaded File in Req:-", req.file);
    // res.status(200).json({file:req.file, message: "File Uploaded" });

    const filePath = path.join(__dirname, "..", "dataFile",'example.pdf');
    console.log("path:-", filePath);
    const chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);

      // Save the PDF to the server (you can also save it to a database or S3, depending on your needs)
      fs.writeFileSync(`${filePath}`, pdfBuffer);

      res.status(200).send("PDF saved successfully");
    });

    req.on("error", (err) => {
      console.error("Error receiving PDF:", err);
      res.status(500).send("Error saving PDF");
    });
  } catch (e) {
    return {
      error: true,
      details: e,
    };
  }
};

module.exports = { uploadfile };
