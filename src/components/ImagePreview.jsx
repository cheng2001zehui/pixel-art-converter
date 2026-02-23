import React from 'react';

const ImagePreview = ({ originalCanvasRef, pixelCanvasRef, isProcessing, image }) => {
  if (!image) return null;

  return (
    <section className="preview-section">
      <div className="preview-container">
        <div className="original-preview">
          <h3>原图</h3>
          <canvas ref={originalCanvasRef} className="original-canvas" />
        </div>
        <div className="pixel-preview">
          <h3>像素化效果</h3>
          {isProcessing ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>处理中...</p>
            </div>
          ) : (
            <canvas ref={pixelCanvasRef} className="pixel-canvas" />
          )}
        </div>
      </div>
    </section>
  );
};

export default ImagePreview;