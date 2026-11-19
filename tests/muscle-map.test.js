const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('muscle-map.js','utf8');
const context = { window:{} };
vm.runInNewContext(source,context);
const map = context.window.OverloadMuscleMap;

test('maps common compound exercises to primary and secondary muscles',()=>{
  const result=map.mapWorkout({exercises:[{name:'Bench Press',sets:[{},{},{}]},{name:'Barbell Row',sets:[{},{}]}]});
  assert.equal(result.totals.chest,3);
  assert.equal(result.totals.triceps,1.35);
  assert.equal(result.totals.upperBack,2);
  assert.equal(result.totals.lats,1.6);
});
test('maps lower-body exercises and ignores unknown movements',()=>{
  const result=map.mapWorkout({exercises:[{name:'Squat',sets:[{},{},{}]},{name:'Mystery Movement',sets:[{},{}]}]});
  assert.equal(result.totals.quads,3);
  assert.equal(result.totals.glutes,1.95);
  assert.equal(result.groups.length,4);
});
test('weekly map only counts completed or fully logged sets in the last seven days',()=>{
  const result=map.mapWeekly([
    {date:'2026-11-19',exercises:[{name:'Bench Press',sets:[{done:true},{weight:80,reps:8},{weight:0,reps:0}]}]},
    {date:'2026-11-12',exercises:[{name:'Squat',sets:[{done:true}]}]},
    {date:'2026-11-18',exercises:[{name:'Leg Curl',sets:[{done:false,weight:30,reps:10}]}]}
  ],'2026-11-19');
  assert.equal(result.totals.chest,2);
  assert.equal(result.totals.triceps,.9);
  assert.equal(result.totals.quads,0);
  assert.equal(result.totals.hamstrings,1);
});
test('unknown exercise names are reported as unmapped rather than guessed',()=>{
  assert.equal(map.contributions('Novel Machine Movement'),null);
});
