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

      console.log("Response:-", response);
      //   const arrayBuffer = await response.data.arrayBuffer();
      setPdfBytes(response.data);
    };
    fetchPdf();
  }, [filename]);

  const handleLoadPdf = async () => {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    setPdfDoc(pdfDoc);
    setEditablePdfBytes(await pdfDoc.save()); // Save initial state

    // const form = pdfDoc.getForm();
  };

  const handleEdit = async () => {
    console.log("edit pdf");
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log(pdfDoc);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    // firstPage.drawText("Edited text", {
    //   x: 50,
    //   y: height - 50,
    //   size: 30,
    //   //   color: pdfLib.rgb(0, 0, 0),
    // });

    // const editedPdfBytes = await pdfDoc.save();
    // // setPdfBytes(editedPdfBytes);
    // setEditablePdfBytes(editedPdfBytes);
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
      {editablePdfBytes && (
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js`}
        >
          <Viewer
            fileUrl={URL.createObjectURL(
              new Blob([editablePdfBytes], { type: "application/pdf" })
            )}
          />
        </Worker>
      )}
    </div>
  );
};

export default PdfEditor;
