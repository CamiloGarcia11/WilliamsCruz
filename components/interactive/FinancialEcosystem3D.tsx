'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
  scale: number;
  depth: number;
}

export default function FinancialEcosystem3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States for HUD overlay
  const [phase, setPhase] = useState<'analizando' | 'intereses' | 'optimizando' | 'completado'>('analizando');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = containerRef.current?.clientWidth || 480);
    let height = (canvas.height = containerRef.current?.clientHeight || 420);

    let time = 0;
    let localPhase: 'analizando' | 'intereses' | 'optimizando' | 'completado' = 'analizando';
    let phaseTime = 0;

    // Damped tilt angles for parallax mouse interaction
    let rotX = -0.65; // base tilt elevation (looking down from above)
    let rotY = 0.65;  // base tilt azimuth
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Drag-to-rotate state
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let startRotX = rotX;
    let startRotY = rotY;

    // Particle with trail history
    class TrailParticle {
      x: number;
      y: number;
      z: number;
      startX: number;
      startY: number;
      startZ: number;
      targetX: number;
      targetY: number;
      targetZ: number;
      color: string;
      size: number;
      progress: number;
      speed: number;
      history: Point3D[];
      maxHistory: number;

      constructor(x: number, y: number, z: number, tx: number, ty: number, tz: number, color: string, speed: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.startX = x;
        this.startY = y;
        this.startZ = z;
        this.targetX = tx;
        this.targetY = ty;
        this.targetZ = tz;
        this.color = color;
        this.size = Math.random() * 2 + 1.5;
        this.progress = 0;
        this.speed = speed;
        this.history = [];
        this.maxHistory = 6;
      }

      update() {
        // Save history
        this.history.push({ x: this.x, y: this.y, z: this.z });
        if (this.history.length > this.maxHistory) {
          this.history.shift();
        }

        this.progress += this.speed;
        if (this.progress > 1) this.progress = 1;

        // Path calculation with sinus noise (curving flow)
        const t = this.progress;
        const wave = Math.sin(t * Math.PI * 3) * 12;
        
        this.x = this.startX * (1 - t) + this.targetX * t + wave * Math.cos(t * Math.PI);
        this.y = this.startY * (1 - t) + this.targetY * t + Math.cos(t * Math.PI * 2) * 6;
        this.z = this.startZ * (1 - t) + this.targetZ * t + wave * Math.sin(t * Math.PI);
      }

      isDone() {
        return this.progress >= 1;
      }
    }

    let particles: TrailParticle[] = [];

    // Projection mathematics
    const project = (x: number, y: number, z: number): ProjectedPoint => {
      // Apply mouse parallax rotation if not dragging
      const currRotX = isDragging ? rotX : rotX + mouse.y * 0.2;
      const currRotY = isDragging ? rotY : rotY + mouse.x * 0.25;

      // Rotate Y
      const cosY = Math.cos(currRotY);
      const sinY = Math.sin(currRotY);
      let x1 = x * cosY - z * sinY;
      let z1 = x * sinY + z * cosY;

      // Rotate X
      const cosX = Math.cos(currRotX);
      const sinX = Math.sin(currRotX);
      let y2 = y * cosX - z1 * sinX;
      let z2 = y * sinX + z1 * cosX;

      // Projection
      const fov = 400;
      const dist = 380;
      const scale = fov / (dist + z2);

      return {
        x: x1 * scale + width / 2,
        y: y2 * scale + height / 2,
        scale,
        depth: z2,
      };
    };

    // Draw 3D prisms representing nodes
    const drawPrism = (
      cx: number,
      cy: number,
      cz: number,
      w: number,
      h: number,
      d: number,
      color: string,
      strokeColor: string
    ) => {
      const vertices: Point3D[] = [
        { x: cx - w/2, y: cy - h/2, z: cz - d/2 },
        { x: cx + w/2, y: cy - h/2, z: cz - d/2 },
        { x: cx + w/2, y: cy + h/2, z: cz - d/2 },
        { x: cx - w/2, y: cy + h/2, z: cz - d/2 },
        { x: cx - w/2, y: cy - h/2, z: cz + d/2 },
        { x: cx + w/2, y: cy - h/2, z: cz + d/2 },
        { x: cx + w/2, y: cy + h/2, z: cz + d/2 },
        { x: cx - w/2, y: cy + h/2, z: cz + d/2 },
      ];

      const projected = vertices.map(v => project(v.x, v.y, v.z));

      const faces = [
        [0, 1, 2, 3], // Front
        [1, 5, 6, 2], // Right
        [5, 4, 7, 6], // Back
        [4, 0, 3, 7], // Left
        [4, 5, 1, 0], // Top
        [3, 2, 6, 7], // Bottom
      ];

      const sortedFaces = faces
        .map((face, index) => {
          const avgDepth = (projected[face[0]].depth + projected[face[1]].depth + projected[face[2]].depth + projected[face[3]].depth) / 4;
          return { face, index, depth: avgDepth };
        })
        .sort((a, b) => b.depth - a.depth);

      sortedFaces.forEach(({ face }) => {
        ctx.beginPath();
        ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(projected[face[i]].x, projected[face[i]].y);
        }
        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    // Draw 3D pointed crystals representing capital growth
    const drawCrystal = (
      cx: number,
      cy: number,
      cz: number,
      w: number,
      h: number,
      d: number,
      color1: string,
      color2: string
    ) => {
      const vertices: Point3D[] = [
        { x: cx - w/2, y: cy, z: cz - d/2 },
        { x: cx + w/2, y: cy, z: cz - d/2 },
        { x: cx + w/2, y: cy, z: cz + d/2 },
        { x: cx - w/2, y: cy, z: cz + d/2 },
        { x: cx, y: cy - h, z: cz },
      ];

      const projected = vertices.map(v => project(v.x, v.y, v.z));

      const faces = [
        [0, 1, 4],
        [1, 2, 4],
        [2, 3, 4],
        [3, 0, 4],
      ];

      faces.forEach((face) => {
        ctx.beginPath();
        ctx.moveTo(projected[face[0]].x, projected[face[0]].y);
        ctx.lineTo(projected[face[1]].x, projected[face[1]].y);
        ctx.lineTo(projected[face[2]].x, projected[face[2]].y);
        ctx.closePath();

        const grad = ctx.createLinearGradient(
          projected[face[0]].x,
          projected[face[0]].y,
          projected[face[2]].x,
          projected[face[2]].y
        );
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
    };

    // Animation Loop
    const animate = () => {
      time += 0.4;
      phaseTime += 1;

      // Gentle auto-rotation when not dragging
      if (!isDragging) {
        rotY += 0.0012;
      }

      // Dark theme background
      ctx.fillStyle = '#0f172a'; // Deep navy blue
      ctx.fillRect(0, 0, width, height);

      // Damp mouse coordinates
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw Grid Floor (electric blue lines with low opacity)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
      ctx.lineWidth = 1;
      const cellSize = 30;
      const cellCount = 6;
      for (let i = -cellCount; i <= cellCount; i++) {
        // Z lines
        const p1 = project(i * cellSize, 80, -cellCount * cellSize);
        const p2 = project(i * cellSize, 80, cellCount * cellSize);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // X lines
        const p3 = project(-cellCount * cellSize, 80, i * cellSize);
        const p4 = project(cellCount * cellSize, 80, i * cellSize);
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
      }

      // STATE MACHINE PROGRESSION
      if (localPhase === 'analizando') {
        const pct = Math.min(Math.round((phaseTime / 90) * 100), 100);
        setProgress(pct);
        if (phaseTime > 110) {
          localPhase = 'intereses';
          setPhase('intereses');
          phaseTime = 0;
        }
      } else if (localPhase === 'intereses') {
        // Red interest streams flow from right (Bank Interests) to Center (Ley de Vivienda)
        if (phaseTime % 4 === 0 && phaseTime < 100) {
          particles.push(
            new TrailParticle(
              120, 20, 80, // High interest node
              0, 15, 0,    // Central optimization node
              '#ef4444',   // Red crimson representing debt/interests
              0.02
            )
          );
        }
        if (phaseTime > 150) {
          localPhase = 'optimizando';
          setPhase('optimizando');
          phaseTime = 0;
          particles = [];
        }
      } else if (localPhase === 'optimizando') {
        // Surging gold/blue data stream towards Left-Back (Savings/Capital Reduction)
        if (phaseTime % 2 === 0 && phaseTime < 100) {
          const color = Math.random() > 0.4 ? '#fbbf24' : '#3b82f6'; // Gold or blue
          particles.push(
            new TrailParticle(
              0, 15, 0,      // Start center
              -110, 20, 110,  // Target Savings node
              color,
              0.025
            )
          );
        }
        if (phaseTime > 160) {
          localPhase = 'completado';
          setPhase('completado');
          phaseTime = 0;
        }
      } else if (localPhase === 'completado') {
        if (phaseTime > 240) {
          localPhase = 'analizando';
          setPhase('analizando');
          phaseTime = 0;
          particles = [];
        }
      }

      // Draw particle trails
      particles.forEach((p) => {
        p.update();
        
        // Draw history trail
        if (p.history.length > 1) {
          ctx.beginPath();
          const startProj = project(p.history[0].x, p.history[0].y, p.history[0].z);
          ctx.moveTo(startProj.x, startProj.y);
          for (let i = 1; i < p.history.length; i++) {
            const proj = project(p.history[i].x, p.history[i].y, p.history[i].z);
            ctx.lineTo(proj.x, proj.y);
          }
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.3;
          ctx.lineWidth = p.size * startProj.scale;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Draw main head particle
        const headProj = project(p.x, p.y, p.z);
        ctx.beginPath();
        ctx.arc(headProj.x, headProj.y, p.size * headProj.scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });
      particles = particles.filter(p => !p.isDone());

      // NODES RENDERING
      
      // 1. Right Node: "CRÉDITO HIPOTECARIO" (Unoptimized bank status)
      const rightNodeCol = localPhase === 'analizando' || localPhase === 'intereses' 
        ? 'rgba(239, 68, 68, 0.15)' 
        : 'rgba(30, 41, 59, 0.5)';
      const rightNodeStroke = localPhase === 'analizando' || localPhase === 'intereses' 
        ? '#ef4444' 
        : 'rgba(255,255,255,0.1)';
      drawPrism(120, 20, 80, 30, 8, 30, rightNodeCol, rightNodeStroke);
      
      const pRightText = project(120, 20, 80);
      ctx.fillStyle = localPhase === 'analizando' || localPhase === 'intereses' ? '#ef4444' : 'rgba(255,255,255,0.3)';
      ctx.font = '9px monospace';
      ctx.fillText('CRÉDITO BANCO', pRightText.x - 32, pRightText.y - 10);
      ctx.fillText('INT. ALTOS', pRightText.x - 24, pRightText.y + 18);

      // 2. Left Node: "ESTUDIO DE LEY" (Analyzing node)
      drawPrism(-120, 20, -40, 30, 8, 30, 'rgba(30, 41, 59, 0.5)', 'rgba(255,255,255,0.1)');
      const pLeftText = project(-120, 20, -40);
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '9px monospace';
      ctx.fillText('LEY 546/99', pLeftText.x - 24, pLeftText.y - 10);

      // 3. Left-Back Node: "AHORRO A CAPITAL" (Target optimized payments)
      const leftBackCol = localPhase === 'optimizando' || localPhase === 'completado'
        ? 'rgba(245, 158, 11, 0.15)' // Gold glow
        : 'rgba(30, 41, 59, 0.5)';
      const leftBackStroke = localPhase === 'optimizando' || localPhase === 'completado'
        ? '#fbbf24'
        : 'rgba(255,255,255,0.1)';
      drawPrism(-110, 20, 110, 40, 8, 40, leftBackCol, leftBackStroke);
      
      const pLeftBackText = project(-110, 20, 110);
      ctx.fillStyle = localPhase === 'optimizando' || localPhase === 'completado' ? '#fbbf24' : 'rgba(255,255,255,0.3)';
      ctx.fillText('AHORRO CAPITAL', pLeftBackText.x - 38, pLeftBackText.y - 10);

      // Draw stylized gold housing/pillars crystal cluster on the platform
      drawCrystal(-120, 16, 100, 8, 20, 8, 'rgba(146, 64, 14, 0.8)', '#f59e0b');
      drawCrystal(-100, 16, 120, 10, 28, 10, 'rgba(146, 64, 14, 0.8)', '#f59e0b');
      
      if (localPhase === 'optimizando' || localPhase === 'completado') {
        const scaleGrow = localPhase === 'completado' ? 1 : Math.min(phaseTime / 80, 1);
        drawCrystal(-125, 16, 125, 12, 45 * scaleGrow, 12, 'rgba(180, 83, 9, 0.9)', '#fbbf24');
        drawCrystal(-95, 16, 95, 11, 36 * scaleGrow, 11, 'rgba(180, 83, 9, 0.9)', '#fbbf24');
      }

      // 4. Central Node: "ABONO INTELIGENTE" (Ley de Vivienda card)
      let centerCol = 'rgba(30, 41, 59, 0.7)';
      let centerStroke = 'rgba(255, 255, 255, 0.2)';
      if (localPhase === 'intereses') {
        const pulse = Math.sin(time * 0.25) * 0.2 + 0.6;
        centerCol = `rgba(245, 158, 11, ${pulse * 0.4})`;
        centerStroke = `rgba(245, 158, 11, ${pulse})`;
      } else if (localPhase === 'optimizando' || localPhase === 'completado') {
        centerCol = 'rgba(59, 130, 246, 0.25)';
        centerStroke = '#3b82f6';
      }

      // Card height pulses slightly
      const bounce = Math.sin(time * 0.08) * 3;
      drawPrism(0, 10 + bounce, 0, 40, 2, 50, centerCol, centerStroke);
      
      const pCenter = project(0, 10 + bounce, 0);
      ctx.strokeStyle = centerStroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pCenter.x, pCenter.y, 6 * pCenter.scale, 0, Math.PI * 2);
      ctx.stroke();

      // 5. Scan laser sweep (viability analysis)
      if (localPhase === 'analizando') {
        const sweepZ = -120 + (phaseTime / 90) * 240;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)'; // golden-yellow laser
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const leftSweep = project(-140, 20, sweepZ);
        const rightSweep = project(140, 20, sweepZ);
        ctx.moveTo(leftSweep.x, leftSweep.y);
        ctx.lineTo(rightSweep.x, rightSweep.y);
        ctx.stroke();
      }

      // 6. HUD text holograms overlays
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';

      // Left HUD status
      const pStatusHUD = project(-180, -60, -40);
      if (localPhase === 'analizando') {
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`ESTUDIO: ANALIZANDO... [${progress}%]`, pStatusHUD.x, pStatusHUD.y);
      } else {
        ctx.fillStyle = '#3b82f6';
        ctx.fillText('ESTUDIO: COMPLETADO [100%]', pStatusHUD.x, pStatusHUD.y);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText('PROCESO DE LEY: VIABLE', pStatusHUD.x, pStatusHUD.y + 12);
      }

      // Center confirmation HUD (optimizando / completado)
      if (localPhase === 'completado') {
        const pConfirmHUD = project(0, -60 + bounce, 0);
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.font = 'bold 11px monospace';

        ctx.shadowBlur = 12;
        ctx.shadowColor = '#fbbf24';
        ctx.fillText('REDUCCIÓN: CONFIRMADA', pConfirmHUD.x, pConfirmHUD.y);
        ctx.fillText('ABONO OPTIMIZADO', pConfirmHUD.x, pConfirmHUD.y + 14);
        ctx.shadowBlur = 0;
        ctx.textAlign = 'start';
      }

      // Right metric panel
      const pMetricHUD = project(110, -60, -20);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '8px monospace';
      ctx.fillText('TIEMPO AHORTADO', pMetricHUD.x, pMetricHUD.y);
      
      const pulseRate = Math.sin(time * 0.2) * 0.15 + 0.85;
      ctx.fillStyle = localPhase === 'completado'
        ? `rgba(251, 191, 36, ${pulseRate})`
        : 'rgba(255,255,255,0.6)';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('-84 MESES', pMetricHUD.x, pMetricHUD.y + 15);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      canvas.style.cursor = 'grabbing';
      startX = e.clientX;
      startY = e.clientY;
      startRotX = rotX;
      startRotY = rotY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;

      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        rotY = startRotY + dx * 0.008;
        rotX = startRotX + dy * 0.008;

        // clamp vertical rotation
        if (rotX > 0.1) rotX = 0.1;
        if (rotX < -Math.PI / 2 + 0.1) rotX = -Math.PI / 2 + 0.1;
      } else {
        mouse.targetX = x;
        mouse.targetY = y;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      canvas.style.cursor = 'grab';
    };

    // Mobile touch events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startRotX = rotX;
        startRotY = rotY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        rotY = startRotY + dx * 0.008;
        rotX = startRotX + dy * 0.008;

        if (rotX > 0.1) rotX = 0.1;
        if (rotX < -Math.PI / 2 + 0.1) rotX = -Math.PI / 2 + 0.1;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      width = canvas.width = containerRef.current.clientWidth;
      height = canvas.height = containerRef.current.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#0f172a', // Matches deep navy theme of Susfinanzas
        overflow: 'hidden',
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

      {/* Tiny overlay info panel */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.2)',
          padding: '6px 10px',
          borderRadius: '6px',
          color: '#ffffff',
          fontFamily: 'monospace',
          fontSize: '9px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>LEY 546/99</span> | PLAZO: {phase.toUpperCase()}
      </div>
    </div>
  );
}
