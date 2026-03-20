import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

const categoryColors = {
  Excellent:          { bg: '#d1fae5', text: '#065f46', bar: '#10b981' },
  Good:               { bg: '#dbeafe', text: '#1e40af', bar: '#3b82f6' },
  'Needs Improvement':{ bg: '#fef9c3', text: '#854d0e', bar: '#eab308' },
  Poor:               { bg: '#ffedd5', text: '#9a3412', bar: '#f97316' },
  Critical:           { bg: '#fee2e2', text: '#991b1b', bar: '#ef4444' },
};

export default function ScoreCard({ result }) {
  const { health_score, category, recommendations, breakdown } = result;
  const colors = categoryColors[category] || categoryColors['Poor'];

  const radarData = {
    labels: ['Steps', 'Sleep', 'Heart Rate', 'Calories', 'Water'],
    datasets: [
      {
        label: 'Your Score',
        data: [
          breakdown.steps,
          breakdown.sleep,
          breakdown.heart_rate,
          breakdown.calories,
          breakdown.water,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        min: 0, max: 20,
        ticks: { stepSize: 5, display: false },
        grid: { color: 'rgba(0,0,0,0.08)' },
        pointLabels: { font: { size: 13 } },
      },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="score-card">
      {/* Hero score */}
      <div className="score-hero" style={{ background: colors.bg }}>
        <div className="score-ring" style={{ borderColor: colors.bar }}>
          <span className="score-number" style={{ color: colors.text }}>{health_score}</span>
          <span className="score-max">/100</span>
        </div>
        <div>
          <span className="category-badge" style={{ background: colors.bar, color: '#fff' }}>
            {category}
          </span>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="breakdown">
        <h3>Metric Breakdown</h3>
        {[
          { label: 'Steps',       value: breakdown.steps      },
          { label: 'Sleep',       value: breakdown.sleep      },
          { label: 'Heart Rate',  value: breakdown.heart_rate },
          { label: 'Calories',    value: breakdown.calories   },
          { label: 'Water',       value: breakdown.water      },
        ].map(({ label, value }) => (
          <div key={label} className="bar-row">
            <span className="bar-label">{label}</span>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{ width: `${(value / 20) * 100}%`, background: colors.bar }}
              />
            </div>
            <span className="bar-score">{value}/20</span>
          </div>
        ))}
      </div>

      {/* Radar chart */}
      <div className="radar-wrap">
        <Radar data={radarData} options={radarOptions} />
      </div>

      {/* Recommendations */}
      <div className="recommendations">
        <h3>Personalized Recommendations</h3>
        <ul>
          {recommendations.map((rec, i) => (
            <li key={i}>
              <span className="rec-icon">💡</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
