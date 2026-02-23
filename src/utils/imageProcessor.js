// 图像处理工具函数

/**
 * 读取文件为DataURL
 * @param {File} file - 图片文件
 * @returns {Promise<string>} - DataURL字符串
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

/**
 * 批量读取文件
 * @param {FileList} files - 文件列表
 * @returns {Promise<Array>} - 包含name和data的对象数组
 */
export const batchReadFiles = (files) => {
  const filePromises = Array.from(files).map(file => {
    return readFileAsDataURL(file).then(data => ({
      name: file.name,
      data
    }));
  });
  return Promise.all(filePromises);
};

/**
 * 计算颜色距离
 * @param {Array} color1 - [r, g, b]
 * @param {Array} color2 - [r, g, b]
 * @returns {number} - 颜色距离
 */
export const colorDistance = (color1, color2) => {
  const [r1, g1, b1] = color1;
  const [r2, g2, b2] = color2;
  return Math.sqrt(
    Math.pow(r1 - r2, 2) +
    Math.pow(g1 - g2, 2) +
    Math.pow(b1 - b2, 2)
  );
};

/**
 * 颜色量化（减少颜色数量）
 * @param {Array} colors - 颜色数组 [r, g, b]
 * @param {number} maxColors - 最大颜色数量
 * @returns {Array} - 量化后的颜色数组
 */
export const quantizeColors = (colors, maxColors) => {
  if (colors.length <= maxColors) {
    return colors;
  }

  // 使用简单的K-means聚类算法
  let centroids = colors.slice(0, maxColors);
  let clusters = Array(maxColors).fill().map(() => []);

  // 迭代10次
  for (let i = 0; i < 10; i++) {
    // 清空聚类
    clusters = Array(maxColors).fill().map(() => []);

    // 分配颜色到最近的中心点
    colors.forEach(color => {
      let minDistance = Infinity;
      let closestCentroid = 0;

      centroids.forEach((centroid, index) => {
        const distance = colorDistance(color, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = index;
        }
      });

      clusters[closestCentroid].push(color);
    });

    // 更新中心点
    centroids = clusters.map(cluster => {
      if (cluster.length === 0) {
        return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
      }

      const sum = cluster.reduce((acc, color) => {
        return [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]];
      }, [0, 0, 0]);

      return [
        Math.round(sum[0] / cluster.length),
        Math.round(sum[1] / cluster.length),
        Math.round(sum[2] / cluster.length)
      ];
    });
  }

  return centroids;
};

/**
 * 找到最接近的颜色
 * @param {Array} color - [r, g, b]
 * @param {Array} palette - 颜色 palette
 * @returns {Array} - 最接近的颜色 [r, g, b]
 */
export const findClosestColor = (color, palette) => {
  let minDistance = Infinity;
  let closestColor = color;

  palette.forEach(paletteColor => {
    const distance = colorDistance(color, paletteColor);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = paletteColor;
    }
  });

  return closestColor;
};

/**
 * 调整图像亮度
 * @param {number} r - 红色通道
 * @param {number} g - 绿色通道
 * @param {number} b - 蓝色通道
 * @param {number} brightness - 亮度调整值 (-100 到 100)
 * @returns {Array} - 调整后的颜色 [r, g, b]
 */
export const adjustBrightness = (r, g, b, brightness) => {
  const factor = 1 + brightness / 100;
  return [
    Math.min(255, Math.max(0, Math.round(r * factor))),
    Math.min(255, Math.max(0, Math.round(g * factor))),
    Math.min(255, Math.max(0, Math.round(b * factor)))
  ];
};

/**
 * 调整图像对比度
 * @param {number} r - 红色通道
 * @param {number} g - 绿色通道
 * @param {number} b - 蓝色通道
 * @param {number} contrast - 对比度调整值 (-100 到 100)
 * @returns {Array} - 调整后的颜色 [r, g, b]
 */
export const adjustContrast = (r, g, b, contrast) => {
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  return [
    Math.min(255, Math.max(0, Math.round(factor * (r - 128) + 128))),
    Math.min(255, Math.max(0, Math.round(factor * (g - 128) + 128))),
    Math.min(255, Math.max(0, Math.round(factor * (b - 128) + 128)))
  ];
};

/**
 * 调整图像饱和度
 * @param {number} r - 红色通道
 * @param {number} g - 绿色通道
 * @param {number} b - 蓝色通道
 * @param {number} saturation - 饱和度调整值 (-100 到 100)
 * @returns {Array} - 调整后的颜色 [r, g, b]
 */
export const adjustSaturation = (r, g, b, saturation) => {
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  const factor = 1 + saturation / 100;
  return [
    Math.min(255, Math.max(0, Math.round(gray + factor * (r - gray)))),
    Math.min(255, Math.max(0, Math.round(gray + factor * (g - gray)))),
    Math.min(255, Math.max(0, Math.round(gray + factor * (b - gray))))
  ];
};

/**
 * 生成SVG字符串
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} pixelSize - 像素块大小
 * @param {ImageData} imageData - 图像数据
 * @returns {string} - SVG字符串
 */
export const generateSVG = (width, height, pixelSize, imageData) => {
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  const data = imageData.data;

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3] / 255;

      if (a > 0) {
        svg += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="rgb(${r}, ${g}, ${b})" opacity="${a}" />`;
      }
    }
  }

  svg += '</svg>';
  return svg;
};

/**
 * 生成JSON像素数据
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {number} pixelSize - 像素块大小
 * @param {ImageData} imageData - 图像数据
 * @returns {Object} - 像素数据对象
 */
export const generateJSON = (width, height, pixelSize, imageData) => {
  const data = imageData.data;
  const pixels = [];

  for (let y = 0; y < height; y += pixelSize) {
    const row = [];
    for (let x = 0; x < width; x += pixelSize) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      row.push({ r, g, b });
    }
    if (row.length > 0) pixels.push(row);
  }

  return {
    width: pixels[0]?.length || 0,
    height: pixels.length,
    pixels
  };
};