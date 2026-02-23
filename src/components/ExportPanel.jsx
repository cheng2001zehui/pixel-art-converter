import React from 'react';
import { generateSVG, generateJSON } from '../utils/imageProcessor';

const ExportPanel = ({ canvasRef, pixelSize, image }) => {
  if (!image) return null;

  const exportAsPNG = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = dataURL;
    link.click();
  };

  const exportAsSVG = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height);
    
    const svg = generateSVG(width, height, pixelSize, imageData);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'pixel-art.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height);
    
    const jsonData = generateJSON(width, height, pixelSize, imageData);
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'pixel-art.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="export-section">
      <h2>导出</h2>
      <div className="export-buttons">
        <button onClick={exportAsPNG} className="export-btn">
          导出为PNG
        </button>
        <button onClick={exportAsSVG} className="export-btn">
          导出为SVG
        </button>
        <button onClick={exportAsJSON} className="export-btn">
          导出为JSON
        </button>
      </div>
    </section>
  );
};

export default ExportPanel;