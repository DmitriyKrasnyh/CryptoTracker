import React, { useRef, useEffect } from 'react';

interface SparklineProps {
  data: number[];
  color: string;
  height?: number;
  width?: number;
}

const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  color, 
  height = 30, 
  width = 100 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Find min and max values to normalize
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    // If all values are the same, draw a horizontal line
    if (range === 0) {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      const y = height / 2;
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      return;
    }

    // Draw the sparkline
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;

    // Create gradient for area below line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, `${color}30`); // Semi-transparent
    gradient.addColorStop(1, `${color}05`); // Almost transparent

    // Draw path
    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw area below line
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data, color, height, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="sparkline"
    />
  );
};

export default Sparkline;