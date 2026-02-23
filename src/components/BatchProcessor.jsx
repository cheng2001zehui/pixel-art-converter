import React, { useState } from 'react';
import { BatchStatus } from '../types';

const BatchProcessor = ({ batchImages, onProcessBatch }) => {
  const [status, setStatus] = useState(BatchStatus.IDLE);
  const [progress, setProgress] = useState(0);

  const handleProcessBatch = () => {
    setStatus(BatchStatus.PROCESSING);
    setProgress(0);

    // 模拟批量处理过程
    const total = batchImages.length;
    let current = 0;

    const processNext = () => {
      if (current < total) {
        // 模拟处理时间
        setTimeout(() => {
          current++;
          setProgress(Math.round((current / total) * 100));
          processNext();
        }, 500);
      } else {
        setStatus(BatchStatus.COMPLETED);
        setTimeout(() => {
          setStatus(BatchStatus.IDLE);
          setProgress(0);
        }, 2000);
      }
    };

    processNext();
    onProcessBatch();
  };

  if (batchImages.length === 0) return null;

  return (
    <section className="batch-section">
      <h2>批量处理</h2>
      <div className="batch-info">
        <p>已上传 {batchImages.length} 张图片</p>
        {status === BatchStatus.PROCESSING && (
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">处理中：{progress}%</p>
          </div>
        )}
        {status === BatchStatus.COMPLETED && (
          <div className="success-message">
            <p>批量处理完成！</p>
          </div>
        )}
      </div>
      <div className="batch-preview">
        {batchImages.map((img, index) => (
          <div key={index} className="batch-image-item">
            <img src={img.data} alt={img.name} className="batch-image-thumbnail" />
            <p className="batch-image-name">{img.name}</p>
          </div>
        ))}
      </div>
      {status === BatchStatus.IDLE && (
        <button 
          onClick={handleProcessBatch} 
          className="batch-process-btn"
        >
          处理 {batchImages.length} 张图片
        </button>
      )}
    </section>
  );
};

export default BatchProcessor;