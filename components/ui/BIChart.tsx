"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
);

/** Brand palette pulled from the design tokens. */
export const CRIMSON = "#B30B3F";
export const CRIMSON_LIGHT = "#D11248";
export const CHARCOAL = "#2D2D2D";

/**
 * Mounts its children only once they scroll into view, so a freshly-mounted
 * Chart.js canvas plays its entry animation exactly when the user sees it.
 */
function RevealOnView({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full">
      {shown ? children : null}
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

/** Multi-axis line chart: revenue (left) vs. operational efficiency (right). */
export function RevenueEfficiencyChart() {
  const data: ChartData<"line"> = {
    labels: MONTHS,
    datasets: [
      {
        label: "Revenue (₹L)",
        data: [42, 48, 51, 58, 67, 74, 85, 96],
        borderColor: CRIMSON,
        backgroundColor: "rgba(179,11,63,0.10)",
        yAxisID: "y",
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: CRIMSON,
        borderWidth: 2.5,
      },
      {
        label: "Efficiency (%)",
        data: [61, 64, 66, 71, 76, 79, 84, 89],
        borderColor: CHARCOAL,
        backgroundColor: "rgba(45,45,45,0.05)",
        yAxisID: "y1",
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        pointBackgroundColor: CHARCOAL,
        borderWidth: 2,
        borderDash: [5, 4],
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1400, easing: "easeOutQuart" },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, font: { family: "var(--font-poppins)" } },
      },
      tooltip: { backgroundColor: CHARCOAL, padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: "rgba(45,45,45,0.5)" } },
      y: {
        type: "linear",
        position: "left",
        grid: { color: "rgba(45,45,45,0.06)" },
        ticks: { color: CRIMSON },
      },
      y1: {
        type: "linear",
        position: "right",
        grid: { drawOnChartArea: false },
        ticks: { color: "rgba(45,45,45,0.5)" },
        min: 40,
        max: 100,
      },
    },
  };

  return (
    <RevealOnView>
      <Line data={data} options={options} />
    </RevealOnView>
  );
}

/** Doughnut: where revenue quietly leaks before BI surfaces it. */
export function LeakageChart() {
  const data: ChartData<"doughnut"> = {
    labels: ["Unbilled work", "Pricing gaps", "Silent churn", "Captured"],
    datasets: [
      {
        data: [7, 5, 6, 82],
        backgroundColor: [CRIMSON, CRIMSON_LIGHT, "#E8638A", "rgba(45,45,45,0.08)"],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    animation: { animateRotate: true, duration: 1400, easing: "easeOutQuart" },
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, font: { family: "var(--font-poppins)" } },
      },
      tooltip: {
        backgroundColor: CHARCOAL,
        padding: 10,
        cornerRadius: 8,
        callbacks: { label: (c) => ` ${c.label}: ${c.parsed}%` },
      },
    },
  };

  return (
    <RevealOnView>
      <Doughnut data={data} options={options} />
    </RevealOnView>
  );
}

/** Bar: hours reclaimed each week as reporting gets automated. */
export function HoursSavedChart() {
  const data: ChartData<"bar"> = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Manual hours / week",
        data: [22, 16, 9, 4],
        backgroundColor: "rgba(45,45,45,0.12)",
        borderRadius: 6,
        categoryPercentage: 0.55,
      },
      {
        label: "Hours reclaimed",
        data: [4, 10, 17, 22],
        backgroundColor: CRIMSON,
        borderRadius: 6,
        categoryPercentage: 0.55,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1400, easing: "easeOutQuart" },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, font: { family: "var(--font-poppins)" } },
      },
      tooltip: { backgroundColor: CHARCOAL, padding: 10, cornerRadius: 8 },
    },
    scales: {
      x: { stacked: true, grid: { display: false }, ticks: { color: "rgba(45,45,45,0.5)" } },
      y: { stacked: true, grid: { color: "rgba(45,45,45,0.06)" }, ticks: { color: "rgba(45,45,45,0.5)" } },
    },
  };

  return (
    <RevealOnView>
      <Bar data={data} options={options} />
    </RevealOnView>
  );
}
