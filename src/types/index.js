// 图片类型
export const ImageType = {
  JPG: 'image/jpeg',
  PNG: 'image/png',
  GIF: 'image/gif',
  WEBP: 'image/webp'
};

// 导出格式类型
export const ExportFormat = {
  PNG: 'png',
  SVG: 'svg',
  JSON: 'json'
};

// 批量处理状态
export const BatchStatus = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// 预设模板类型
export const PresetType = {
  PIXEL_8BIT: '8bit',
  PIXEL_16BIT: '16bit',
  LOW_POLY: 'lowPoly',
  RETRO: 'retro',
  MINIMAL: 'minimal'
};

// 颜色调整参数类型
export const ColorAdjustment = {
  BRIGHTNESS: 'brightness',
  CONTRAST: 'contrast',
  SATURATION: 'saturation',
  HUE: 'hue'
};

// 图片数据类型
export const ImageData = {
  name: String,
  data: String,
  processedData: String
};

// 像素数据类型
export const PixelData = {
  width: Number,
  height: Number,
  pixels: Array
};