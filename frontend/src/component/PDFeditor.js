import React, { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import axios from "axios";
// const fs = require("fs");
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      console.log("File Saved:-", response);

      toast.success("File has been saved successfully");
    } catch (e) {
      return {
        error: true,
        details: e,
      };
    }
  };

  return (
    <div>
      <button
        onClick={handleLoadPdf}
        style={{
          backgroundColor: "#4CAF50", // Green
          border: "none",
          color: "white",
          padding: "10px 20px",
          textAlign: "center",
          textDecoration: "none",
          display: "inline-block",
          fontSize: "16px",
          margin: "4px 2px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Load
      </button>
      <button
        onClick={handleSave}
        style={{
          backgroundColor: "#008CBA", // Blue
          border: "none",
          color: "white",
          padding: "10px 20px",
          textAlign: "center",
          textDecoration: "none",
          display: "inline-block",
          fontSize: "16px",
          margin: "4px 300px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Save PDF
      </button>
      <ToastContainer />

      {show && (
        <div>
          <iframe src={pdfFile} width="100%" height="800px" />
        </div>
      )}
    </div>
  );
};

export default PdfEditor;
