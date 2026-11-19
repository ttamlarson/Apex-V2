/* OVERLOAD adaptive coaching engine.
 * Transparent, deterministic recommendations from user-entered app records.
 * This module does not make medical claims or infer missing data.
 */
(() => {
  'use strict';
  const number = value => {
    const parsed = value === null || value === undefined || value === '' ? 0 : Number(String(value).replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : 0;
  };
  const dateDistance = (date, today) => {
    if (!date) return Infinity;
    const from = new Date(String(date).slice(0,10) + 'T12:00:00');
    const to = new Date(String(today).slice(0,10) + 'T12:00:00');
    if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime())) return Infinity;
    return Math.floor((to - from) / 86400000);
  };
  const evaluate = ({ workouts = [], recoveries = [], foods = [], settings = {}, today = new Date().toISOString().slice(0,10) } = {}) => {
    const recovery = [...recoveries].filter(item => item && item.date).sort((a,b) => String(b.date).localeCompare(String(a.date)))[0] || null;
    const recoveryAge = recovery ? dateDistance(recovery.date, today) : Infinity;
    let readiness = null;
    const reasons = [];
    const recoveryComplete = !!recovery && number(recovery.sleep) > 0 && number(recovery.energy) > 0 && number(recovery.stress) > 0 && number(recovery.soreness) > 0;
    if (recovery && recoveryComplete && recoveryAge >= 0 && recoveryAge <= 3) {
      readiness = 100;
      const sleep = number(recovery.sleep), energy = number(recovery.energy), stress = number(recovery.stress), soreness = number(recovery.soreness);
      if (sleep > 0 && sleep < 5) { readiness -= 25; reasons.push('short sleep'); }
      else if (sleep > 0 && sleep < 6.5) { readiness -= 12; reasons.push('sleep below 6.5 hours'); }
      if (energy > 0 && energy <= 2) { readiness -= 15; reasons.push('low energy'); }
      if (stress >= 4) { readiness -= 10; reasons.push('elevated stress'); }
      if (soreness >= 4) { readiness -= 10; reasons.push('high soreness'); }
      readiness = Math.max(0, Math.min(100, readiness));
    }
    const recent = Array.isArray(workouts) ? workouts : [];
    const last7 = recent.filter(w => { const age = dateDistance(w && w.date, today); return age >= 0 && age < 7; }).length;
    const previous7 = recent.filter(w => { const age = dateDistance(w && w.date, today); return age >= 7 && age < 14; }).length;
    const foodToday = (Array.isArray(foods) ? foods : []).filter(f => f && f.date === today);
    const intake = foodToday.reduce((total, food) => ({
      calories: total.calories + number(food.cal ?? food.calories),
      protein: total.protein + number(food.pro ?? food.protein)
    }), { calories: 0, protein: 0 });
    const calorieTarget = Math.max(1, number(settings.calories));
    const proteinTarget = Math.max(1, number(settings.protein));
    const lastWorkout = [...recent].filter(w => w && w.date).sort((a,b) => String(b.date).localeCompare(String(a.date)))[0] || null;
    const recommendations = [];
    if (readiness === null) recommendations.push({ type:'recovery', title:'Recovery data needed', detail: !recovery ? 'Log sleep, energy, stress and soreness to establish a readiness baseline.' : recoveryAge > 3 ? 'Your latest check-in is older than three days. Add a current check-in to refresh the brief.' : recoveryAge < 0 ? 'The latest check-in is dated in the future. Correct its date before using readiness.' : 'Complete sleep, energy, stress and soreness fields to calculate readiness.' });
    else if (readiness < 60) recommendations.push({ type:'recovery', title:'Prioritise recovery today', detail:'Your latest check-in recorded ' + reasons.join(', ') + '. Consider rest, mobility or a lighter technique session rather than chasing load.' });
    else if (readiness < 80) recommendations.push({ type:'training', title:'Keep effort controlled', detail:'Your latest check-in recorded ' + reasons.join(' and ') + '. Keep a few reps in reserve and adjust if warm-ups feel unusually difficult.' });
    else recommendations.push({ type:'training', title:'Recovery signals look favourable', detail:'Your latest check-in has no major flags in this simple indicator. Follow your planned session and let performance guide load.' });
    if (last7 >= 4 && last7 > previous7 * 1.5) recommendations.push({ type:'load', title:'Training frequency has increased', detail:last7 + ' sessions in the last 7 days versus ' + previous7 + ' in the previous week. Watch performance and recovery before adding volume.' });
    else if (last7 === 0) recommendations.push({ type:'training', title:'Restart with a manageable session', detail:'No workouts are logged in the last 7 days. Begin with a familiar programme and build consistency before increasing volume.' });
    return {
      today, recoveryAge, recoveryComplete, readiness, readinessReasons: reasons, last7, previous7,
      calorieTarget, proteinTarget, intake,
      caloriePercent: Math.round(intake.calories / calorieTarget * 100),
      proteinPercent: Math.round(intake.protein / proteinTarget * 100),
      lastWorkout,
      recommendations
    };
  };
  window.OverloadCoach = Object.freeze({ evaluate });
})();
