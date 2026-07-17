'use client';

import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Shape3D {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;
  vy: number;
  size: number;
  type: 'cube' | 'pyramid' | 'prism';
  color: string;
}

export default function Floating3DGeometries() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = containerRef.current?.clientWidth || 800);
    let height = (canvas.height = containerRef.current?.clientHeight || 450);

    let time = 0;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Camera parameters
    const rotX = -0.5; // looking slightly downwards
    const rotY = 0.4;  // looking slightly sideways

    // 3D shapes definition
    const shapes: Shape3D[] = [];
    const shapeCount = 12;
    const types: ('cube' | 'pyramid' | 'prism')[] = ['cube', 'pyramid', 'prism'];
    const colors = ['#3b82f6', '#fbbf24', '#ffffff']; // Electric Blue, Gold, White

    for (let i = 0; i < shapeCount; i++) {
      shapes.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 400,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI,
        vrx: (Math.random() - 0.5) * 0.015,
        vry: (Math.random() - 0.5) * 0.015,
        vrz: (Math.random() - 0.5) * 0.015,
        vy: -0.2 - Math.random() * 0.3, // slow upward drift
        size: 15 + Math.random() * 20,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // 3D Projection math
    const project = (x: number, y: number, z: number) => {
      // Rotate camera by base + mouse parallax
      const currRotY = rotY + mouse.x * 0.15;
      const currRotX = rotX + mouse.y * 0.12;

      const cosY = Math.cos(currRotY);
      const sinY = Math.sin(currRotY);
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;

      const cosX = Math.cos(currRotX);
      const sinX = Math.sin(currRotX);
      let y2 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;

      const fov = 400;
      const distance = 420;
      const scale = fov / (distance + z2);

      return {
        x: x1 * scale + width / 2,
        y: y2 * scale + height / 2,
        scale,
        depth: z2,
      };
    };

    // Draw lines of a projected 3D shape
    const drawShape = (s: Shape3D) => {
      // Define vertices based on shape type
      let vertices: Point3D[] = [];
      let edges: number[][] = [];

      if (s.type === 'cube') {
        const d = s.size / 2;
        vertices = [
          { x: -d, y: -d, z: -d },
          { x: d, y: -d, z: -d },
          { x: d, y: d, z: -d },
          { x: -d, y: d, z: -d },
          { x: -d, y: -d, z: d },
          { x: d, y: -d, z: d },
          { x: d, y: d, z: d },
          { x: -d, y: d, z: d },
        ];
        edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // front
          [4, 5], [5, 6], [6, 7], [7, 4], // back
          [0, 4], [1, 5], [2, 6], [3, 7], // columns
        ];
      } else if (s.type === 'pyramid') {
        const d = s.size / 2;
        vertices = [
          { x: -d, y: d, z: -d },
          { x: d, y: d, z: -d },
          { x: d, y: d, z: d },
          { x: -d, y: d, z: d },
          { x: 0, y: -d, z: 0 }, // top tip
        ];
        edges = [
          [0, 1], [1, 2], [2, 3], [3, 0], // base
          [0, 4], [1, 4], [2, 4], [3, 4], // sides
        ];
      } else { // prism / flat hexagonal coin
        const r = s.size / 2;
        vertices = [];
        // Top cap (6 vertices)
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          vertices.push({ x: Math.cos(angle) * r, y: -4, z: Math.sin(angle) * r });
        }
        // Bottom cap (6 vertices)
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          vertices.push({ x: Math.cos(angle) * r, y: 4, z: Math.sin(angle) * r });
        }
        // Define edges
        edges = [];
        for (let i = 0; i < 6; i++) {
          edges.push([i, (i + 1) % 6]); // top cap edges
          edges.push([i + 6, ((i + 1) % 6) + 6]); // bottom cap edges
          edges.push([i, i + 6]); // side columns
        }
      }

      // Rotate shape vertices
      const cosX = Math.cos(s.rx), sinX = Math.sin(s.rx);
      const cosY = Math.cos(s.ry), sinY = Math.sin(s.ry);
      const cosZ = Math.cos(s.rz), sinZ = Math.sin(s.rz);

      const rotatedVertices = vertices.map((v) => {
        // Rotate Z
        let x1 = v.x * cosZ - v.y * sinZ;
        let y1 = v.x * sinZ + v.y * cosZ;

        // Rotate Y
        let x2 = x1 * cosY - v.z * sinY;
        let z2 = x1 * sinY + v.z * cosY;

        // Rotate X
        let y3 = y1 * cosX - z2 * sinX;
        let z3 = y1 * sinX + z2 * cosX;

        // Translate to shape position
        return {
          x: x2 + s.x,
          y: y3 + s.y,
          z: z3 + s.z,
        };
      });

      // Project vertices
      const projected = rotatedVertices.map((v) => project(v.x, v.y, v.z));

      // Draw edges
      ctx.beginPath();
      edges.forEach(([idx1, idx2]) => {
        const p1 = projected[idx1];
        const p2 = projected[idx2];
        if (p1.scale > 0 && p2.scale > 0) {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      });
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Draw points
      projected.forEach((p) => {
        if (p.scale > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.fill();
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.5;

      // Damp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw moving wireframe grid at the bottom (scrolling floor)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)'; // Electric blue grid
      ctx.lineWidth = 1;
      const gridZOffset = (time * 0.8) % 40;
      const sizeX = 400;
      const cellSize = 40;
      const gridY = 160;

      for (let z = -320; z <= 320; z += cellSize) {
        const currZ = z - gridZOffset;
        const p1 = project(-sizeX, gridY, currZ);
        const p2 = project(sizeX, gridY, currZ);
        if (p1.scale > 0 && p2.scale > 0) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      for (let x = -sizeX; x <= sizeX; x += cellSize) {
        const p1 = project(x, gridY, -320);
        const p2 = project(x, gridY, 320);
        if (p1.scale > 0 && p2.scale > 0) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Update shapes
      shapes.forEach((s) => {
        s.rx += s.vrx;
        s.ry += s.vry;
        s.rz += s.vrz;
        s.y += s.vy;

        // Wrap boundaries
        if (s.y < -300) {
          s.y = 250;
          s.x = (Math.random() - 0.5) * 600;
          s.z = (Math.random() - 0.5) * 400;
        }

        drawShape(s);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      mouse.targetX = x;
      mouse.targetY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = containerRef.current.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        opacity: 0.35, // High contrast visible shapes
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
