'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '..', 'coach-engine.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox);
const evaluate = sandbox.window.OverloadCoach.evaluate;

test('does not invent readiness when recovery is missing or stale', () => {
  assert.equal(evaluate({ today:'2026-11-19' }).readiness, null);
  assert.equal(evaluate({ today:'2026-11-19', recoveries:[{date:'2026-11-10',sleep:8,energy:5,stress:1,soreness:1}] }).readiness, null);
});

test('does not calculate readiness from an incomplete check-in', () => {
  const result = evaluate({ today:'2026-11-19', recoveries:[{date:'2026-11-19',sleep:'',energy:5,stress:1,soreness:1}] });
  assert.equal(result.readiness, null);
  assert.equal(result.recoveryComplete, false);
});
test('scores recent recovery check-ins and reports contributing flags', () => {
  const result = evaluate({ today:'2026-11-19', recoveries:[{date:'2026-11-19',sleep:4,energy:2,stress:4,soreness:4}] });
  assert.equal(result.readiness, 40);
  assert.deepEqual(Array.from(result.readinessReasons), ['short sleep','low energy','elevated stress','high soreness']);
});

test('compares recent and previous seven-day workout frequency', () => {
  const workouts = ['2026-11-19','2026-11-18','2026-11-17','2026-11-16','2026-11-10','2026-11-09'].map(date=>({date}));
  const result = evaluate({ today:'2026-11-19', workouts });
  assert.equal(result.last7, 4);
  assert.equal(result.previous7, 2);
});

test('counts only foods logged for today and uses saved targets', () => {
  const result = evaluate({
    today:'2026-11-19',
    settings:{calories:3000,protein:150},
    foods:[{date:'2026-11-19',cal:900,pro:60},{date:'2026-11-18',cal:500,pro:30}]
  });
  assert.equal(result.intake.calories, 900);
  assert.equal(result.intake.protein, 60);
  assert.equal(result.caloriePercent, 30);
  assert.equal(result.proteinPercent, 40);
});
