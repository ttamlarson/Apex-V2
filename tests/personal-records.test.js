const test=require('node:test');
const assert=require('node:assert/strict');
const PR=require('../personal-records.js');
test('tracks best bench press, squat and deadlift loads from saved workouts',()=>{
 const records=PR.calculate([
  {date:'2026-11-01',exercises:[{name:'Bench Press',sets:[{weight:'80',reps:'8'},{weight:'85',reps:'5'}]},{name:'Squat',sets:[{weight:'100',reps:'5'}]}]},
  {date:'2026-11-05',exercises:[{name:'Barbell Bench Press',sets:[{weight:'82.5',reps:'8'}]},{name:'Conventional Deadlift',sets:[{weight:'140',reps:'3'}]}]}
 ]);
 assert.equal(records.bench.weight,85);assert.equal(records.bench.date,'2026-11-01');assert.equal(records.squat.weight,100);assert.equal(records.deadlift.weight,140);
});
test('recognises big-three naming variants but excludes accessory variants',()=>{
 const records=PR.calculate([{date:'2026-11-02',exercises:[{name:'Flat Bench Press',sets:[{weight:90,reps:4}]},{name:'High Bar Squat',sets:[{weight:120,reps:5}]},{name:'Sumo Deadlift',sets:[{weight:160,reps:2}]},{name:'Dumbbell Bench Press',sets:[{weight:40,reps:8}]},{name:'Romanian Deadlift',sets:[{weight:100,reps:8}]},{name:'Hack Squat',sets:[{weight:150,reps:10}]}]}]);
 assert.equal(records.bench.weight,90);assert.equal(records.squat.weight,120);assert.equal(records.deadlift.weight,160);
});
test('ignores blank, zero, negative and non-numeric loads',()=>{
 const records=PR.calculate([{date:'2026-11-03',exercises:[{name:'Squat',sets:[{weight:'',reps:5},{weight:0,reps:5},{weight:-5,reps:5},{weight:'heavy',reps:5}]}]}]);assert.equal(records.squat,null);
});
test('only emits records that exceed previous bests',()=>{
 const previous={bench:{weight:100},squat:{weight:140},deadlift:null};
 const next={bench:{key:'bench',label:'Bench Press',weight:102.5},squat:{key:'squat',label:'Squat',weight:140},deadlift:{key:'deadlift',label:'Deadlift',weight:180}};
 const achieved=PR.newRecords(previous,next);assert.deepEqual(achieved.map(x=>x.key),['bench','deadlift']);assert.equal(achieved[0].previous,100);assert.equal(achieved[1].previous,null);
});
test('equal-weight repeats do not create a new PR and latest date is retained',()=>{
 const records=PR.calculate([{date:'2026-11-01',exercises:[{name:'Deadlift',sets:[{weight:180,reps:2}]}]},{date:'2026-11-04',exercises:[{name:'Deadlift',sets:[{weight:180,reps:3}]}]}]);assert.equal(records.deadlift.weight,180);assert.equal(records.deadlift.date,'2026-11-04');assert.equal(records.deadlift.reps,3);
});
