import React, { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import axios from "axios";
// const fs = require("fs");
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfEditor = ({ filename }) => {
  console.log("File Name:-", filename);
  const [pdfBytes, setPdfBytes] = useState(null);
  //   const viewerRef = useRef();
  const [editablePdfBytes, setEditablePdfBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [show, setShow] = useState(false);

  const [pdfFile, setPdfFile] = useState();

  useEffect(() => {
    const fetchPdf = async () => {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/pdf/example.pdf",
        headers: {},
        responseType: "arraybuffer",
      };

      let response = await axios(config);
      console.log(response);
      console.log("Response url:-", response.config.url);
      setPdfFile(response.config.url);

      setPdfBytes(response.data);
    };
    fetchPdf();
  }, [filename]);

  const handleLoadPdf = async () => {
    setShow(true);
  };

  const handleSave = async () => {
    try {
      console.log("save pdf file");
      console.log("pdf file url:-", pdfFile);
      console.log(pdfBytes);

      const pdfDoc = await PDFDocument.load(pdfBytes);
      const editedPdfBytes = await pdfDoc.save();
      const formData = new FormData();

      formData.append(
        "pdf",
        new Blob([editedPdfBytes], { type: "application/pdf" }),
        "example.pdf"
      );

      console.log("Form Data:-", formData);
      for (let pair of formData.entries()) {
        console.log(`for loop ${pair[0]}`, pair[1]);
      }

      // let data = new FormData();
      // data.append(
      //   "file",
      //   fs.createReadStream("/C:/Users/Manglesh yadav/Downloads/example.pdf")
      // );

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      let response = await axios(config);
      console.log(response);
    } catch (e) {
      return {
        error: true,
        details: e,
      };
    }
  };

  return (
    <div>
      <button onClick={handleLoadPdf}>Load</button>
      <button onClick={handleSave}>Save PDF</button>
      {/* <embed src={URL.createObjectURL(new Blob([pdfBytes]))} width="600" height="800" /> */}
      {show && (
        <div>
          <iframe src={pdfFile} width="100%" height="800px" />
        </div>
      )}
    </div>
  );
};

export default PdfEditor;
