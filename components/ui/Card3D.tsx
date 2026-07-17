'use strict';

'use client';

import React from 'react';
import Tilt3D from '../animations/Tilt3D';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'navy' | 'glass';
  glowColor?: 'blue' | 'yellow' | 'none';
  tilt?: boolean;
  maxRotation?: number;
  style?: React.CSSProperties;
}

export default function Card3D({
  children,
  className = '',
  variant = 'light',
  glowColor = 'none',
  tilt = true,
  maxRotation = 10,
  style = {},
}: Card3DProps) {
  // Configuración de estilos base para las variantes
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return {
          background: 'linear-gradient(145deg, #1e293b, #0f172a)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        };
      case 'navy':
        return {
          background: 'linear-gradient(145deg, #0b1528, #070d1a)',
          color: '#ffffff',
          border: '1px solid rgba(59, 130, 246, 0.15)',
        };
      case 'glass':
        return {
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#0f172a',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        };
      case 'light':
      default:
        return {
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
        };
    }
  };

  const glowClass = {
    blue: 'glow-card-blue',
    yellow: 'glow-card-yellow',
    none: '',
  }[glowColor];

  const cardContent = (
    <div
      className={`card-3d-inner ${glowClass} ${className}`}
      style={{
        ...getVariantStyles(),
        borderRadius: '16px',
        padding: '24px',
        width: '100%',
        height: '100%',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        ...style,
      }}
    >
      {children}
    </div>
  );

  if (tilt) {
    return (
      <Tilt3D maxRotation={maxRotation} className="w-full h-full">
        {cardContent}
      </Tilt3D>
    );
  }

  return cardContent;
}
