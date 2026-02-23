import React, { useState, useRef } from 'react';
import { batchReadFiles } from '../utils/imageProcessor';

const ImageUploader = ({ onImageUpload, onBatchUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const dropRef = useRef(null);

  const handleSingleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('请上传图片文件');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBatchUpload = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (imageFiles.length === 0) {
        setError('请至少上传一个图片文件');
        setTimeout(() => setError(''), 3000);
        return;
      }
      
      batchReadFiles(imageFiles).then(images => {
        onBatchUpload(images);
      }).catch(err => {
        setError('文件读取失败');
        setTimeout(() => setError(''), 3000);
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (files.length === 1) {
        // 单张上传
        handleSingleUpload({ target: { files } });
      } else {
        // 批量上传
        handleBatchUpload({ target: { files } });
      }
    }
  };

  return (
    <div className="upload-section">
      <h2>上传图片</h2>
      
      {/* 拖拽上传区域 */}
      <div
        ref={dropRef}
        className={`drag-drop-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p>拖拽图片到此处上传</p>
        <p className="drag-hint">支持单张或多张图片</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="upload-options">
        <div className="single-upload">
          <label htmlFor="image-upload">选择单张图片：</label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleSingleUpload}
          />
        </div>
        <div className="batch-upload">
          <label htmlFor="batch-upload">批量上传：</label>
          <input
            type="file"
            id="batch-upload"
            accept="image/*"
            multiple
            onChange={handleBatchUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;