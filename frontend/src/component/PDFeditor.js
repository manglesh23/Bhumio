import React, { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import axios from "axios";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PdfEditor = ({ filename }) => {
  console.log("File Name:-", filename);
  const [pdfBytes, setPdfBytes] = useState(null);

  const [show, setShow] = useState(false);

  const [pdfFile, setPdfFile] = useState();

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
      toast.error("Please Load The PDF File");
      return;
    }
    try {
      console.log("pdf file url:-", pdfFile);
      console.log("pdfbyt:-", pdfBytes);

      const pdfDoc = await PDFDocument.load(pdfBytes);
      console.log("pdf doc:-", pdfDoc);

      const form = pdfDoc.getForm();
      const fields = form.getFields();
      console.log("field count", fields.length);

      const fieldData = {};

      fields.forEach((field) => {
        const fieldName = field.getName();
        const fieldType = field.constructor.name;

        if (fieldType === "PDFTextField") {
          const value = field.getText();
          console.log(value);
          fieldData[fieldName] = value;
        } else if (fieldType === "PDFCheckBox") {
          const isChecked = field.isChecked();
          fieldData[fieldName] = isChecked;
          console.log(isChecked);
        } else if (fieldType === "PDFRadioGroup") {
          const selectedOption = field.getSelected();
          fieldData[fieldName] = selectedOption;
          console.log(selectedOption);
        } else if (fieldType === "PDFDropdown") {
          const selectedOption = field.getSelected();
          fieldData[fieldName] = selectedOption;
          console.log(selectedOption);
        } else {
          fieldData[fieldName] = "Unsupported field type";
        }
      });

      console.log("Filed Data:-", fieldData);

      const editedPdfBytes = await pdfDoc.save();
      console.log("edited pdf bytes:-", editedPdfBytes.length);
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
      setShow(false);
      toast.success("File has been saved successfully");
    } catch (e) {
      console.error("error while saving pdf:-", e);
      toast.error("Failed to save");
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
        Load PDF
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
