// frontend/src/components/PDFViewer.js
import React, { useEffect, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';

function PDFViewer({ fileId }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    async function fetchAndRenderPDF() {
      try {
        const response = await fetch(`/api/files/view/${fileId}`);
        if (!response.ok) {
          throw new Error("Không thể tải PDF");
        }
        const arrayBuffer = await response.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);

        const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1 });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        console.error("Lỗi render PDF:", err);
      }
    }

    if (fileId) {
      fetchAndRenderPDF();
    }
  }, [fileId]);

  // Tắt chuột phải để giảm bớt việc lưu ảnh
  const handleContextMenu = (e) => e.preventDefault();

  return (
    <div onContextMenu={handleContextMenu} style={{ border: "1px solid #ccc" }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default PDFViewer;