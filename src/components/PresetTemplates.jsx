import React from 'react';
import { PresetType } from '../types';

const PresetTemplates = ({ onPresetSelect }) => {
  const presets = [
    {
      id: PresetType.PIXEL_8BIT,
      name: '8位像素',
      description: '经典8位游戏风格',
      settings: {
        pixelSize: 8,
        colorCount: 16,
        brightness: 0,
        contrast: 20,
        saturation: 30
      }
    },
    {
      id: PresetType.PIXEL_16BIT,
      name: '16位像素',
      description: 'SNES风格像素艺术',
      settings: {
        pixelSize: 4,
        colorCount: 64,
        brightness: 0,
        contrast: 10,
        saturation: 20
      }
    },
    {
      id: PresetType.LOW_POLY,
      name: '低多边形',
      description: '几何风格像素化',
      settings: {
        pixelSize: 12,
        colorCount: 8,
        brightness: -10,
        contrast: 30,
        saturation: 10
      }
    },
    {
      id: PresetType.RETRO,
      name: '复古风格',
      description: '怀旧复古像素艺术',
      settings: {
        pixelSize: 6,
        colorCount: 32,
        brightness: -15,
        contrast: 25,
        saturation: 40
      }
    },
    {
      id: PresetType.MINIMAL,
      name: '极简风格',
      description: '简约现代像素艺术',
      settings: {
        pixelSize: 10,
        colorCount: 4,
        brightness: 10,
        contrast: 15,
        saturation: -20
      }
    }
  ];

  return (
    <section className="presets-section">
      <h2>预设模板</h2>
      <div className="presets-grid">
        {presets.map(preset => (
          <div 
            key={preset.id} 
            className="preset-card"
            onClick={() => onPresetSelect(preset.settings)}
          >
            <h3>{preset.name}</h3>
            <p>{preset.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PresetTemplates;