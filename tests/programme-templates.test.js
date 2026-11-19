'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Templates=require('../programme-templates.js');
const plans={
 'Upper A':[['Bench Press',3,'6–8']],
 'Lower A':[['Squat',3,'6–8']],
 'Upper B':[['Overhead Press',3,'6–8']],
 'Lower B':[['Deadlift',3,'5']],
 'Push Day':[['Bench Press',3,'6–8']],
 'Pull Day':[['Row',3,'8–10']],
 'Leg Day':[['Squat',3,'8–10']]
};
test('creates editable Upper / Lower and Push / Pull / Legs defaults',()=>{
 const templates=Templates.createDefaults(plans);
 assert.equal(templates.length,2);
 assert.deepEqual(templates.map(x=>x.name),['Upper / Lower','Push / Pull / Legs']);
 assert.deepEqual(templates[0].days.map(x=>x.name),['Upper A','Lower A','Upper B','Lower B']);
 assert.deepEqual(templates[1].days.map(x=>x.name),['Push Day','Pull Day','Leg Day']);
 assert.equal(templates[0].days[0].exercises[0].name,'Bench Press');
});
test('clone returns independent editable programme data',()=>{
 const source=Templates.createDefaults(plans)[0];
 const copy=Templates.clone(source);
 copy.days[0].exercises[0].name='Incline Bench Press';
 assert.equal(source.days[0].exercises[0].name,'Bench Press');
});
