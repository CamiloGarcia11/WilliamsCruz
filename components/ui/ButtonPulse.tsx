'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ButtonPulseProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  className?: string;
  pulse?: boolean;
  style?: React.CSSProperties;
}

export default function ButtonPulse({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  pulse = true,
  style = {},
}: ButtonPulseProps) {
  // Configuración de estilos según variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
          border: 'none',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#2563eb',
          border: '2px solid #2563eb',
          boxShadow: 'none',
        };
      case 'white':
        return {
          background: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 4px 14px rgba(255, 255, 255, 0.25)',
          border: 'none',
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: '#0f172a',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
          border: 'none',
          fontWeight: '700',
        };
    }
  };

  const buttonStyle = {
    ...getVariantStyles(),
    padding: '14px 28px',
    borderRadius: '30px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    outline: 'none',
    position: 'relative' as const,
    overflow: 'visible' as const,
    ...style,
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className={className}>
      {/* Círculo de pulso en el fondo (Solo si pulse es true y es variante primaria/secundaria) */}
      {pulse && (variant === 'primary' || variant === 'secondary') && (
        <motion.div
          animate={{
            scale: [1, 1.25, 1.4],
            opacity: [0.6, 0.2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '30px',
            background: style.background || (variant === 'primary' ? 'var(--accent-yellow)' : 'var(--accent-blue)'),
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Botón principal */}
      <motion.button
        type={type}
        onClick={onClick}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.98 }}
        style={{
          ...buttonStyle,
          zIndex: 1,
        }}
        className="font-bold tracking-wide"
      >
        {children}
      </motion.button>
    </div>
  );
}
