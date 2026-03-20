/**
 * Health Score Service
 * Each metric is scored 0–20, total = 0–100.
 * Thresholds are simplified and not medically authoritative.
 */

const WEIGHTS = {
  steps:       20,
  sleep:       20,
  heart_rate:  20,
  calories:    20,
  water:       20,
};

// ─── Individual scorers ──────────────────────────────────────────────────────

function scoreSteps(steps) {
  if (steps >= 10000) return { score: 20, level: 'good' };
  if (steps >= 8000)  return { score: 16, level: 'good' };
  if (steps >= 6000)  return { score: 12, level: 'average' };
  if (steps >= 4000)  return { score: 8,  level: 'average' };
  if (steps >= 2000)  return { score: 4,  level: 'poor' };
  return { score: 0, level: 'poor' };
}

function scoreSleep(hours) {
  if (hours >= 7 && hours <= 9)  return { score: 20, level: 'good' };
  if (hours >= 6 && hours < 7)   return { score: 14, level: 'average' };
  if (hours > 9 && hours <= 10)  return { score: 14, level: 'average' };
  if (hours >= 5 && hours < 6)   return { score: 8,  level: 'poor' };
  if (hours > 10)                return { score: 8,  level: 'poor' };
  return { score: 2, level: 'poor' };
}

function scoreHeartRate(bpm) {
  // Resting heart rate
  if (bpm >= 50 && bpm <= 70)  return { score: 20, level: 'good' };
  if (bpm > 70 && bpm <= 80)   return { score: 15, level: 'good' };
  if (bpm > 80 && bpm <= 90)   return { score: 10, level: 'average' };
  if (bpm > 90 && bpm <= 100)  return { score: 6,  level: 'poor' };
  if (bpm < 50)                return { score: 10, level: 'average' }; // athletic
  return { score: 2, level: 'poor' };
}

function scoreCalories(cals) {
  // 1800–2500 kcal is a reasonable general range
  if (cals >= 1800 && cals <= 2500) return { score: 20, level: 'good' };
  if (cals >= 1500 && cals < 1800)  return { score: 14, level: 'average' };
  if (cals > 2500 && cals <= 3000)  return { score: 14, level: 'average' };
  if (cals >= 1200 && cals < 1500)  return { score: 8,  level: 'poor' };
  if (cals > 3000)                  return { score: 8,  level: 'poor' };
  return { score: 2, level: 'poor' };
}

function scoreWater(litres) {
  if (litres >= 2.5)              return { score: 20, level: 'good' };
  if (litres >= 2.0)              return { score: 15, level: 'good' };
  if (litres >= 1.5)              return { score: 10, level: 'average' };
  if (litres >= 1.0)              return { score: 5,  level: 'poor' };
  return { score: 0, level: 'poor' };
}

// ─── Category ────────────────────────────────────────────────────────────────

function getCategory(score) {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Improvement';
  if (score >= 30) return 'Poor';
  return 'Critical';
}

// ─── Recommendations ─────────────────────────────────────────────────────────

function buildRecommendations(input, breakdown) {
  const recs = [];

  if (breakdown.steps.level !== 'good') {
    const gap = Math.max(0, 10000 - input.steps);
    recs.push(
      input.steps < 4000
        ? 'Try a short 20-minute walk — every step counts toward your goal.'
        : `You're ${gap.toLocaleString()} steps from 10,000. A 30-minute walk gets you there.`
    );
  }

  if (breakdown.sleep.level !== 'good') {
    if (input.sleep_hours < 7)
      recs.push('Aim for 7–8 hours of sleep. Try a consistent bedtime routine to improve sleep quality.');
    else
      recs.push('Sleeping more than 9 hours regularly can signal fatigue. Check with a doctor if you feel unrested.');
  }

  if (breakdown.heart_rate.level !== 'good') {
    if (input.heart_rate > 90)
      recs.push('Your resting heart rate is elevated. Try stress-reduction techniques like deep breathing or meditation.');
    else if (input.heart_rate > 80)
      recs.push('Moderate cardio (30 min, 3×/week) can improve your resting heart rate over time.');
  }

  if (breakdown.calories.level !== 'good') {
    if (input.calories < 1500)
      recs.push('Calorie intake seems low. Ensure you\'re eating balanced meals to fuel your body properly.');
    else if (input.calories > 2500)
      recs.push('Calorie intake is above average. Consider tracking meals to stay within your personal target range.');
  }

  if (breakdown.water.level !== 'good') {
    const gap = (2.5 - input.water_intake).toFixed(1);
    recs.push(`Drink ${gap}L more water today. Carry a reusable bottle — it makes a big difference.`);
  }

  if (recs.length === 0) {
    recs.push('Outstanding! Keep up these healthy habits. Consider adding strength training for the next level.');
  }

  return recs;
}

// ─── Main export ─────────────────────────────────────────────────────────────

function computeHealthScore(input) {
  const breakdown = {
    steps:      scoreSteps(input.steps),
    sleep:      scoreSleep(input.sleep_hours),
    heart_rate: scoreHeartRate(input.heart_rate),
    calories:   scoreCalories(input.calories),
    water:      scoreWater(input.water_intake),
  };

  const health_score =
    breakdown.steps.score +
    breakdown.sleep.score +
    breakdown.heart_rate.score +
    breakdown.calories.score +
    breakdown.water.score;

  const category = getCategory(health_score);
  const recommendations = buildRecommendations(input, breakdown);

  return {
    health_score,
    category,
    recommendations,
    breakdown: {
      steps:      breakdown.steps.score,
      sleep:      breakdown.sleep.score,
      heart_rate: breakdown.heart_rate.score,
      calories:   breakdown.calories.score,
      water:      breakdown.water.score,
    },
  };
}

module.exports = { computeHealthScore };
