(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 if(root)root.OverloadPR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const lifts=[
  {key:'bench',label:'Bench Press',aliases:['bench press','barbell bench press','flat bench press','competition bench press']},
  {key:'squat',label:'Squat',aliases:['squat','barbell squat','back squat','high bar squat','low bar squat']},
  {key:'deadlift',label:'Deadlift',aliases:['deadlift','conventional deadlift','sumo deadlift']}
 ];
 const normalize=value=>String(value||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
 function calculate(workouts){
  const result={bench:null,squat:null,deadlift:null};
  (Array.isArray(workouts)?workouts:[]).forEach(workout=>{
   (Array.isArray(workout&&workout.exercises)?workout.exercises:[]).forEach(exercise=>{
    const name=normalize(exercise&&exercise.name),lift=lifts.find(item=>item.aliases.includes(name));
    if(!lift)return;
    (Array.isArray(exercise.sets)?exercise.sets:[]).forEach(set=>{
     const weight=Number(String(set&&set.weight!==undefined?set.weight:'').replace(',','.'));
     if(!Number.isFinite(weight)||weight<=0)return;
     const reps=Number(String(set&&set.reps!==undefined?set.reps:'').replace(',','.'));
     const candidate={key:lift.key,label:lift.label,weight,date:String(workout.date||''),reps:Number.isFinite(reps)&&reps>0?reps:null};
     const current=result[lift.key];
     if(!current||candidate.weight>current.weight||(candidate.weight===current.weight&&candidate.date>current.date))result[lift.key]=candidate;
    });
   });
  });
  return result;
 }
 function newRecords(previous,next){
  return lifts.map(lift=>{
   const before=previous&&previous[lift.key],after=next&&next[lift.key];
   return after&&(!before||after.weight>before.weight)?{...after,previous:before?before.weight:null}:null;
  }).filter(Boolean);
 }
 return {lifts,calculate,newRecords,normalize};
});
