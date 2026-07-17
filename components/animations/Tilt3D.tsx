'use strict';

'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // Grados máximos de rotación (por defecto 15)
  scaleOnHover?: number; // Escala al pasar el cursor (por defecto 1.02)
}

export default function Tilt3D({
  children,
  className = '',
  maxRotation = 12,
  scaleOnHover = 1.03,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Valores de movimiento relativos (de 0 a 1) para la posición del mouse en la tarjeta
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Configuramos el resorte (spring) para movimientos ultra-fluidos y orgánicos
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  
  const rotateXSpring = useSpring(
    useTransform(mouseY, [0, 1], [maxRotation, -maxRotation]),
    springConfig
  );
  const rotateYSpring = useSpring(
    useTransform(mouseX, [0, 1], [-maxRotation, maxRotation]),
    springConfig
  );
  
  const scaleSpring = useSpring(isHovered ? scaleOnHover : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculamos la posición relativa del mouse dentro de la tarjeta (de 0 a 1)
    const relativeX = (e.clientX - rect.left) / width;
    const relativeY = (e.clientY - rect.top) / height;
    
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Resetear al centro con transiciones suaves
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: scaleSpring,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={`depth-card ${className}`}
    >
      <div style={{ transform: 'translateZ(10px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}
