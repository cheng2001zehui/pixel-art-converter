import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [image, setImage] = useState(null)
  const [pixelSize, setPixelSize] = useState(10)
  const [colorCount, setColorCount] = useState(16)
  const [outputWidth, setOutputWidth] = useState(800)
  const [outputHeight, setOutputHeight] = useState(600)
  const [isProcessing, setIsProcessing] = useState(false)
  const [batchImages, setBatchImages] = useState([])
  
  const canvasRef = useRef(null)
  const originalCanvasRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBatchUpload = (e) => {
    const files = Array.from(e.target.files)
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve({ name: file.name, data: event.target.result })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imagePromises).then(images => {
      setBatchImages(images)
    })
  }

  const pixelateImage = () => {
    if (!image || !canvasRef.current || !originalCanvasRef.current) return

    setIsProcessing(true)

    const originalCanvas = originalCanvasRef.current
    const pixelCanvas = canvasRef.current
    const ctx = pixelCanvas.getContext('2d')
    const originalCtx = originalCanvas.getContext('2d')

    const img = new Image()
    img.onload = () => {
      // 绘制原始图像
      originalCanvas.width = img.width
      originalCanvas.height = img.height
      originalCtx.drawImage(img, 0, 0)

      // 设置输出画布尺寸
      pixelCanvas.width = outputWidth
      pixelCanvas.height = outputHeight

      // 计算缩放比例
      const scaleX = outputWidth / img.width
      const scaleY = outputHeight / img.height
      const scale = Math.min(scaleX, scaleY)

      // 计算实际绘制尺寸
      const drawWidth = img.width * scale
      const drawHeight = img.height * scale
      const offsetX = (outputWidth - drawWidth) / 2
      const offsetY = (outputHeight - drawHeight) / 2

      // 绘制缩小的图像
      ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, drawWidth, drawHeight)

      // 获取缩小后的图像数据
      const imageData = ctx.getImageData(0, 0, outputWidth, outputHeight)
      const data = imageData.data

      // 像素化处理
      for (let y = 0; y < outputHeight; y += pixelSize) {
        for (let x = 0; x < outputWidth; x += pixelSize) {
          // 计算当前块的平均颜色
          let r = 0, g = 0, b = 0, count = 0
          
          for (let py = 0; py < pixelSize && y + py < outputHeight; py++) {
            for (let px = 0; px < pixelSize && x + px < outputWidth; px++) {
              const index = ((y + py) * outputWidth + (x + px)) * 4
              r += data[index]
              g += data[index + 1]
              b += data[index + 2]
              count++
            }
          }

          r = Math.floor(r / count)
          g = Math.floor(g / count)
          b = Math.floor(b / count)

          // 绘制像素块
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
          ctx.fillRect(x, y, pixelSize, pixelSize)
        }
      }

      setIsProcessing(false)
    }
    img.src = image
  }

  const exportAsPNG = () => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'pixel-art.png'
    link.href = dataURL
    link.click()
  }

  const exportAsSVG = () => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`

    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        const a = data[index + 3] / 255

        if (a > 0) {
          svg += `<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="rgb(${r}, ${g}, ${b})" opacity="${a}" />`
        }
      }
    }

    svg += '</svg>'

    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'pixel-art.svg'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportAsJSON = () => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const width = canvas.width
    const height = canvas.height
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    const pixels = []
    for (let y = 0; y < height; y += pixelSize) {
      const row = []
      for (let x = 0; x < width; x += pixelSize) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]
        row.push({ r, g, b })
      }
      if (row.length > 0) pixels.push(row)
    }

    const jsonData = JSON.stringify({ width: pixels[0]?.length || 0, height: pixels.length, pixels }, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'pixel-art.json'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
  }

  const processBatch = () => {
    // 批量处理逻辑
    console.log('Processing batch:', batchImages.length, 'images')
  }

  useEffect(() => {
    if (image) {
      pixelateImage()
    }
  }, [image, pixelSize, colorCount, outputWidth, outputHeight])

  return (
    <div className="App">
      <header className="App-header">
        <h1>图片转像素工具</h1>
      </header>
      
      <main>
        <section className="upload-section">
          <h2>上传图片</h2>
          <div className="upload-options">
            <div className="single-upload">
              <label htmlFor="image-upload">选择单张图片：</label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
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
              {batchImages.length > 0 && (
                <button onClick={processBatch} className="batch-process-btn">
                  处理 {batchImages.length} 张图片
                </button>
              )}
            </div>
          </div>
        </section>

        {image && (
          <section className="preview-section">
            <div className="preview-container">
              <div className="original-preview">
                <h3>原图</h3>
                <canvas ref={originalCanvasRef} className="original-canvas" />
              </div>
              <div className="pixel-preview">
                <h3>像素化效果</h3>
                {isProcessing ? (
                  <div className="loading">处理中...</div>
                ) : (
                  <canvas ref={canvasRef} className="pixel-canvas" />
                )}
              </div>
            </div>
          </section>
        )}

        <section className="controls-section">
          <h2>参数调整</h2>
          <div className="controls">
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
            
            <div className="control-group">
              <label htmlFor="output-width">输出宽度：{outputWidth}px</label>
              <input
                type="number"
                id="output-width"
                min="100"
                max="2000"
                value={outputWidth}
                onChange={(e) => setOutputWidth(parseInt(e.target.value))}
              />
            </div>
            
            <div className="control-group">
              <label htmlFor="output-height">输出高度：{outputHeight}px</label>
              <input
                type="number"
                id="output-height"
                min="100"
                max="2000"
                value={outputHeight}
                onChange={(e) => setOutputHeight(parseInt(e.target.value))}
              />
            </div>
          </div>
        </section>

        {image && (
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
        )}
      </main>
    </div>
  )
}

export default App