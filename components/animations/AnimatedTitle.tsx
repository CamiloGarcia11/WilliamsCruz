'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  children: React.ReactNode;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export default function AnimatedTitle({
  children,
  tag = 'h2',
  className = '',
  style = {},
  delay = 0,
}: AnimatedTitleProps) {
  // Mapear de forma segura al componente animado correspondiente
  const Tag = motion[tag] as any;

  return (
    <Tag
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.16, 1, 0.3, 1], // Curva premium de deceleración suave
      }}
      className={className}
      style={{
        ...style,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </Tag>
  );
}
