import React, { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import axios from "axios";
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
        // responseType: "arraybuffer",
      };

      let response = await axios(config);

      console.log("Response:-", response.config.url);
      setPdfFile(response.config.url);
      //   const arrayBuffer = await response.data.arrayBuffer();
      setPdfBytes(response.data);
    };
    fetchPdf();
  }, [filename]);

  const handleLoadPdf = async () => {
    setShow(true);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("file", new Blob([pdfBytes], { type: "application/pdf" }));

    await fetch(`/pdf/${filename}`, {
      method: "POST",
      body: formData,
    });
  };

  return (
    <div>
      <button onClick={handleLoadPdf}>Load</button>
      <button onClick={handleSave}>Save PDF</button>
      {/* <embed src={URL.createObjectURL(new Blob([pdfBytes]))} width="600" height="800" /> */}
      {show && (
        <div>
          <iframe src={pdfFile} width="100%" height="500px" />
        </div>
      )}
    </div>
  );
};

export default PdfEditor;
