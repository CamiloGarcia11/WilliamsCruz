'use client';

import React from 'react';

const CIRCLES = [
  { size: 6,  x: '12%', y: '18%', color: '#3b82f6', duration: 18, delay: 0,   driftX: 30,  driftY: 20  },
  { size: 4,  x: '45%', y: '8%',  color: '#94a3b8', duration: 22, delay: 2,   driftX: -20, driftY: 35  },
  { size: 8,  x: '78%', y: '25%', color: '#3b82f6', duration: 25, delay: 4,   driftX: 25,  driftY: -15 },
  { size: 5,  x: '30%', y: '65%', color: '#94a3b8', duration: 20, delay: 1.5, driftX: -35, driftY: 25  },
  { size: 7,  x: '88%', y: '55%', color: '#3b82f6', duration: 28, delay: 3,   driftX: -20, driftY: -30 },
  { size: 3,  x: '55%', y: '80%', color: '#94a3b8', duration: 19, delay: 5,   driftX: 40,  driftY: -20 },
  { size: 5,  x: '8%',  y: '50%', color: '#3b82f6', duration: 24, delay: 2.5, driftX: 15,  driftY: 30  },
  { size: 6,  x: '65%', y: '42%', color: '#94a3b8', duration: 21, delay: 6,   driftX: -25, driftY: -25 },
  { size: 4,  x: '38%', y: '35%', color: '#3b82f6', duration: 26, delay: 3.5, driftX: 30,  driftY: 15  },
];

export default function SubtleGridBg() {
  const keyframes = `
    @keyframes subtleGridPulse {
      0%, 100% { opacity: 0.035; }
      50% { opacity: 0.06; }
    }
    ${CIRCLES.map((_, i) => `
    @keyframes drift${i} {
      0%, 100% {
        transform: translate(0px, 0px) scale(1);
        opacity: 0.04;
      }
      25% {
        transform: translate(${CIRCLES[i].driftX * 0.6}px, ${CIRCLES[i].driftY * 0.4}px) scale(1.15);
        opacity: 0.06;
      }
      50% {
        transform: translate(${CIRCLES[i].driftX}px, ${CIRCLES[i].driftY}px) scale(1);
        opacity: 0.035;
      }
      75% {
        transform: translate(${CIRCLES[i].driftX * 0.3}px, ${CIRCLES[i].driftY * 0.8}px) scale(1.1);
        opacity: 0.055;
      }
    }`).join('\n')}
  `;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />

      {/* Grid pattern using a repeating radial-gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, #94a3b8 0.8px, transparent 0.8px)',
          backgroundSize: '48px 48px',
          opacity: 0.04,
          animation: 'subtleGridPulse 8s ease-in-out infinite',
        }}
      />

      {/* Secondary offset grid for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, #3b82f6 0.5px, transparent 0.5px)',
          backgroundSize: '48px 48px',
          backgroundPosition: '24px 24px',
          opacity: 0.03,
          animation: 'subtleGridPulse 12s ease-in-out infinite',
          animationDelay: '4s',
        }}
      />

      {/* Floating circles */}
      {CIRCLES.map((circle, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: circle.x,
            top: circle.y,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            borderRadius: '50%',
            backgroundColor: circle.color,
            opacity: 0.04,
            animation: `drift${i} ${circle.duration}s ease-in-out infinite`,
            animationDelay: `${circle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
