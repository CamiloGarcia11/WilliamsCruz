'use client';

import React, { useEffect, useRef } from 'react';

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  char: string;
  charColor: string;
}

export default function FloatingNetwork3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = containerRef.current?.clientWidth || 600);
    let height = (canvas.height = containerRef.current?.clientHeight || 400);

    const nodes: Node3D[] = [];
    const nodeCount = 35;
    const chars = ['$', '%', '546', 'Ley', 'Ahorro', 'Capital'];
    const colors = ['rgba(59, 130, 246, 0.45)', 'rgba(245, 158, 11, 0.45)', 'rgba(255, 255, 255, 0.3)'];

    // Initialize 3D nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
        z: (Math.random() - 0.5) * 500,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2, // slight upward drift
        vz: (Math.random() - 0.5) * 0.4,
        char: Math.random() > 0.6 ? chars[Math.floor(Math.random() * chars.length)] : '',
        charColor: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Camera variables for mouse parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const project = (x: number, y: number, z: number) => {
      // Parallax rotation based on mouse coordinates
      const rotY = mouse.x * 0.15;
      const rotX = mouse.y * 0.15;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      let y2 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;

      const fov = 350;
      const distance = 400;
      const scale = fov / (distance + z2);
      
      return {
        x: x1 * scale + width / 2,
        y: y2 * scale + height / 2,
        scale,
        depth: z2,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Damp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Update node positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        // Wrap around limits
        if (n.x < -300) n.x = 300;
        if (n.x > 300) n.x = -300;
        if (n.y < -300) n.y = 300;
        if (n.y > 300) n.y = -300;
        if (n.z < -300) n.z = 300;
        if (n.z > 300) n.z = -300;
      });

      // Project all nodes
      const projected = nodes.map(n => ({
        proj: project(n.x, n.y, n.z),
        node: n,
      }));

      // Draw connection lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dz = nodes[i].z - nodes[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Connect if close enough
          if (dist < 150) {
            const p1 = projected[i].proj;
            const p2 = projected[j].proj;

            // Faint linear link
            const alpha = (1 - dist / 150) * 0.18;
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes and characters
      projected.forEach(({ proj, node }) => {
        if (proj.scale <= 0) return;

        // Draw node dot
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 2 * proj.scale, 0, Math.PI * 2);
        ctx.fill();

        // Draw glowing floating financial text/symbols
        if (node.char) {
          ctx.fillStyle = node.charColor;
          ctx.font = `${Math.floor(9 * proj.scale)}px monospace`;
          ctx.fillText(node.char, proj.x + 6, proj.y + 3);
        }
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
