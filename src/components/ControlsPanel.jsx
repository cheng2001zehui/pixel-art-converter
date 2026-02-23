import React from 'react';

const ControlsPanel = ({
  pixelSize,
  setPixelSize,
  colorCount,
  setColorCount,
  outputWidth,
  setOutputWidth,
  outputHeight,
  setOutputHeight,
  brightness,
  setBrightness,
  contrast,
  setContrast,
  saturation,
  setSaturation
}) => {
  return (
    <section className="controls-section">
      <h2>参数调整</h2>
      <div className="controls">
        {/* 像素块大小 */}
        <div className="control-group">
          <label htmlFor="pixel-size">像素块大小：{pixelSize}px</label>
          <input
            type="range"
            id="pixel-size"
            min="1"
            max="50"
            value={pixelSize}
            onChange={(e) => setPixelSize(parseInt(e.target.value))}
          />
        </div>
        
        {/* 颜色数量 */}
        <div className="control-group">
          <label htmlFor="color-count">颜色数量：{colorCount}</label>
          <input
            type="range"
            id="color-count"
            min="2"
            max="256"
            value={colorCount}
            onChange={(e) => setColorCount(parseInt(e.target.value))}
          />
        </div>
        
        {/* 输出宽度 */}
        <div className="control-group">
          <label htmlFor="output-width">输出宽度：{outputWidth}px</label>
          <input
            type="number"
            id="output-width"
            min="100"
            max="2000"
            value={outputWidth}
            onChange={(e) => setOutputWidth(parseInt(e.target.value) || 100)}
          />
        </div>
        
        {/* 输出高度 */}
        <div className="control-group">
          <label htmlFor="output-height">输出高度：{outputHeight}px</label>
          <input
            type="number"
            id="output-height"
            min="100"
            max="2000"
            value={outputHeight}
            onChange={(e) => setOutputHeight(parseInt(e.target.value) || 100)}
          />
        </div>
        
        {/* 亮度调整 */}
        <div className="control-group">
          <label htmlFor="brightness">亮度：{brightness}%</label>
          <input
            type="range"
            id="brightness"
            min="-100"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
          />
        </div>
        
        {/* 对比度调整 */}
        <div className="control-group">
          <label htmlFor="contrast">对比度：{contrast}%</label>
          <input
            type="range"
            id="contrast"
            min="-100"
            max="100"
            value={contrast}
            onChange={(e) => setContrast(parseInt(e.target.value))}
          />
        </div>
        
        {/* 饱和度调整 */}
        <div className="control-group">
          <label htmlFor="saturation">饱和度：{saturation}%</label>
          <input
            type="range"
            id="saturation"
            min="-100"
            max="100"
            value={saturation}
            onChange={(e) => setSaturation(parseInt(e.target.value))}
          />
        </div>
      </div>
    </section>
  );
};

export default ControlsPanel;