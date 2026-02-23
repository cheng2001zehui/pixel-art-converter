import { useState, useRef, useEffect } from 'react'
import './App.css'
import ImageUploader from './components/ImageUploader'
import ImagePreview from './components/ImagePreview'
import ControlsPanel from './components/ControlsPanel'
import ExportPanel from './components/ExportPanel'
import BatchProcessor from './components/BatchProcessor'
import PresetTemplates from './components/PresetTemplates'
import { quantizeColors, findClosestColor, adjustBrightness, adjustContrast, adjustSaturation } from './utils/imageProcessor'

function App() {
  // 状态管理
  const [image, setImage] = useState(null)
  const [pixelSize, setPixelSize] = useState(10)
  const [colorCount, setColorCount] = useState(16)
  const [outputWidth, setOutputWidth] = useState(800)
  const [outputHeight, setOutputHeight] = useState(600)
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [batchImages, setBatchImages] = useState([])
  
  // 引用
  const canvasRef = useRef(null)
  const originalCanvasRef = useRef(null)

  // 处理图片上传
  const handleImageUpload = (imageData) => {
    setImage(imageData)
  }

  // 处理批量上传
  const handleBatchUpload = (images) => {
    setBatchImages(images)
  }

  // 处理批量处理
  const handleProcessBatch = () => {
    console.log('Processing batch:', batchImages.length, 'images')
  }

  // 应用预设模板
  const handlePresetSelect = (settings) => {
    setPixelSize(settings.pixelSize)
    setColorCount(settings.colorCount)
    setBrightness(settings.brightness)
    setContrast(settings.contrast)
    setSaturation(settings.saturation)
  }

  // 像素化处理核心逻辑
  const pixelateImage = () => {
    if (!image || !canvasRef.current || !originalCanvasRef.current) return

    setIsProcessing(true)

    const originalCanvas = originalCanvasRef.current
    const pixelCanvas = canvasRef.current
    const ctx = pixelCanvas.getContext('2d')
    const originalCtx = originalCanvas.getContext('2d')

    const img = new Image()
    img.onload = () => {
      try {
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

        // 收集所有颜色
        const colors = []
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          colors.push([r, g, b])
        }

        // 颜色量化
        const colorPalette = quantizeColors(colors, colorCount)

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

            // 应用颜色调整
            let [adjustedR, adjustedG, adjustedB] = [r, g, b]
            
            if (brightness !== 0) {
              [adjustedR, adjustedG, adjustedB] = adjustBrightness(adjustedR, adjustedG, adjustedB, brightness)
            }
            
            if (contrast !== 0) {
              [adjustedR, adjustedG, adjustedB] = adjustContrast(adjustedR, adjustedG, adjustedB, contrast)
            }
            
            if (saturation !== 0) {
              [adjustedR, adjustedG, adjustedB] = adjustSaturation(adjustedR, adjustedG, adjustedB, saturation)
            }

            // 应用颜色量化
            const closestColor = findClosestColor([adjustedR, adjustedG, adjustedB], colorPalette)

            // 绘制像素块
            ctx.fillStyle = `rgb(${closestColor[0]}, ${closestColor[1]}, ${closestColor[2]})`
            ctx.fillRect(x, y, pixelSize, pixelSize)
          }
        }
      } catch (error) {
        console.error('Error processing image:', error)
      } finally {
        setIsProcessing(false)
      }
    }
    img.src = image
  }

  // 当参数变化时重新处理图像
  useEffect(() => {
    if (image) {
      pixelateImage()
    }
  }, [image, pixelSize, colorCount, outputWidth, outputHeight, brightness, contrast, saturation])

  return (
    <div className="App">
      <header className="App-header">
        <h1>图片转像素工具</h1>
        <p>将普通图片转换为像素艺术效果</p>
      </header>
      
      <main>
        {/* 图片上传 */}
        <ImageUploader 
          onImageUpload={handleImageUpload} 
          onBatchUpload={handleBatchUpload} 
        />

        {/* 批量处理 */}
        <BatchProcessor 
          batchImages={batchImages} 
          onProcessBatch={handleProcessBatch} 
        />

        {/* 预设模板 */}
        <PresetTemplates onPresetSelect={handlePresetSelect} />

        {/* 图片预览 */}
        <ImagePreview 
          originalCanvasRef={originalCanvasRef} 
          pixelCanvasRef={canvasRef} 
          isProcessing={isProcessing} 
          image={image} 
        />

        {/* 参数调整 */}
        <ControlsPanel
          pixelSize={pixelSize}
          setPixelSize={setPixelSize}
          colorCount={colorCount}
          setColorCount={setColorCount}
          outputWidth={outputWidth}
          setOutputWidth={setOutputWidth}
          outputHeight={outputHeight}
          setOutputHeight={setOutputHeight}
          brightness={brightness}
          setBrightness={setBrightness}
          contrast={contrast}
          setContrast={setContrast}
          saturation={saturation}
          setSaturation={setSaturation}
        />

        {/* 导出面板 */}
        <ExportPanel 
          canvasRef={canvasRef} 
          pixelSize={pixelSize} 
          image={image} 
        />
      </main>
      
      <footer className="App-footer">
        <p>© 2026 图片转像素工具 | 一个功能强大的像素艺术生成器</p>
      </footer>
    </div>
  )
}

export default App