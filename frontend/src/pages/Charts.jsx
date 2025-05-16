"use client";
import { useEffect, useRef } from "react";

export const BarChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const values = [22, 14, 25, 27, 15, 22, 33, 20, 42, 23, 30, 20];
    const lineValues = [30, 25, 35, 30, 40, 35, 45, 40, 35, 30, 40, 35];

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = (chartWidth / months.length) * 0.6;
    const barSpacing = chartWidth / months.length - barWidth;
    const maxValue = Math.max(...values, ...lineValues) * 1.2;

    ctx.beginPath();
    ctx.strokeStyle = "#e5e7eb";
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    const gridLines = 5;
    const gridSpacing = chartHeight / gridLines;
    ctx.textAlign = "right";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#9ca3af";

    for (let i = 0; i <= gridLines; i++) {
      const y = canvas.height - padding - i * gridSpacing;
      ctx.beginPath();
      ctx.strokeStyle = "#e5e7eb";
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
      ctx.fillText(((i * maxValue) / gridLines).toFixed(0), padding - 10, y + 4);
    }

    for (let i = 0; i < months.length; i++) {
      const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
      const barHeight = (values[i] / maxValue) * chartHeight;
      const y = canvas.height - padding - barHeight;

      ctx.fillStyle = "#34d399";
      ctx.fillRect(x, y, barWidth, barHeight);

      const lx = x + barWidth / 2;
      const ly = canvas.height - padding - (lineValues[i] / maxValue) * chartHeight;

      if (i > 0) {
        const prevX = padding + (i - 1) * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
        const prevY = canvas.height - padding - (lineValues[i - 1] / maxValue) * chartHeight;
        ctx.strokeStyle = "#3b82f6";
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.fillStyle = "#3b82f6";
      ctx.arc(lx, ly, 3, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#6b7280";
      ctx.textAlign = "center";
      ctx.fillText(months[i], x + barWidth / 2, canvas.height - padding + 15);
    }
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export const DonutChart = () => (
  <div className="w-24 h-24 rounded-full border-[10px] border-blue-500 border-t-green-500 border-b-purple-500"></div>
);
