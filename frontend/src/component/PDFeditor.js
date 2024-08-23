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
  const [text, setText] = useState();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
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
        console.log("On Load Length:-", response.data.length);
      } catch (e) {
        console.error("fetch error:-", e);
      }
    };

    fetchPdf();
  }, [filename]);

  const handleLoadPdf = async () => {
    setShow(true);
  };

  const handleSave = async () => {
    if (!show) {
      toast.error("Load the file first");
      return;
    }
    try {
      console.log("save pdf file");
      console.log("pdf file url:-", pdfFile);
      console.log("pdfbyt:-", pdfBytes);

      const pdfDoc = await PDFDocument.load(pdfBytes);
      console.log("pdf doc:-", pdfDoc);

      const form = pdfDoc.getForm();
      const fields = form.getFields();
      console.log("field count", fields.length);

      for (const field of fields) {
        const fieldName = field.getName();
        const fieldType = field.constructor.name;

        console.log(`Field Name: ${fieldName}, Field Type: ${fieldType}`);

        if (fieldType === "PDFTextField") {
          const textField = form.getTextField(fieldName);
          const value = textField.getText();
          textField.setText("");
          console.log(`Value for ${fieldName}: ${value}`);
        } else if (fieldType === "PDFCheckBox") {
          const checkBox = form.getCheckBox(fieldName);
          checkBox.check();
        } else if (fieldType === "PDFRadioGroup") {
          const radioGroup = form.getRadioGroup(fieldName);

          // Log the available options
          const options = radioGroup.getOptions();
          console.log(`Available options for ${fieldName}:`, options);

          // Select a valid option from the available ones
          if (options.includes("YES")) {
            radioGroup.select("YES"); // Example selection
          } else {
            console.log(`Skipping ${fieldName}, no valid option selected`);
          }
        } else if (fieldType === "PDFDropdown") {
          const dropdown = form.getDropdown(fieldName);
          dropdown.select("Dropdown Option");
        } else if (fieldType === "PDFButton") {
          console.log(`Skipping button: ${fieldName}`);
        } else {
          console.log(`Unhandled field type: ${fieldType}`);
        }
      }

      const editedPdfBytes = await pdfDoc.save();
      console.log("edited pdf bytes:-", editedPdfBytes.length);

      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
        },
        body: editedPdfBytes,
      });

      if (response.ok) {
        console.log("PDF saved successfully");
        toast.success("PDF Saved");
      } else {
        console.error("Error saving PDF");
      }

      // const formData = new FormData();

      // formData.append(
      //   "pdf",
      //   new Blob([editedPdfBytes], { type: "application/pdf" }),
      //   "example.pdf"
      // );

      // console.log("Form Data:-", formData);
      // for (let pair of formData.entries()) {
      //   console.log(`for loop ${pair[0]}`, pair[1]);
      // }

      // // let data = new FormData();
      // // data.append(
      // //   "file",
      // //   fs.createReadStream("/C:/Users/Manglesh yadav/Downloads/example.pdf")
      // // );

      // let config = {
      //   method: "post",
      //   maxBodyLength: Infinity,
      //   url: "http://localhost:8000/upload",
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      //   data: formData,
      // };

      // let response = await axios(config);
      // console.log("File Saved:-", response);

      // toast.success("File has been saved successfully");
    } catch (e) {
      console.error("error while saving pdf:-", e);
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
