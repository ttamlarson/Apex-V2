/* OVERLOAD muscle-load mapping. Deterministic exercise-to-muscle estimates. */
(() => {
  'use strict';
  const GROUPS = [
    { id:'chest', label:'Chest', view:'front' },
    { id:'frontDelts', label:'Front delts', view:'front' },
    { id:'sideDelts', label:'Side delts', view:'front' },
    { id:'rearDelts', label:'Rear delts', view:'back' },
    { id:'triceps', label:'Triceps', view:'back' },
    { id:'biceps', label:'Biceps', view:'front' },
    { id:'forearms', label:'Forearms', view:'front' },
    { id:'abs', label:'Abs', view:'front' },
    { id:'obliques', label:'Obliques', view:'front' },
    { id:'upperBack', label:'Upper back', view:'back' },
    { id:'lats', label:'Lats', view:'back' },
    { id:'lowerBack', label:'Lower back', view:'back' },
    { id:'glutes', label:'Glutes', view:'back' },
    { id:'quads', label:'Quadriceps', view:'front' },
    { id:'hamstrings', label:'Hamstrings', view:'back' },
    { id:'calves', label:'Calves', view:'back' }
  ];
  const RULES = [
    [/bench press|chest press|push.?up|push up|chest fly|pec deck|cable press|dip/, {chest:1,triceps:.45,frontDelts:.4}],
    [/overhead press|shoulder press|military press|arnold press/, {frontDelts:1,sideDelts:.5,triceps:.4}],
    [/lateral raise|upright row/, {sideDelts:1}],
    [/face pull|reverse fly|rear delt/, {rearDelts:1,upperBack:.4}],
    [/row|pulldown|pull.?up|chin.?up|lat prayer|straight.?arm pulldown/, {lats:.8,upperBack:1,biceps:.45,rearDelts:.35}],
    [/curl|preacher|hammer curl/, {biceps:1,forearms:.35}],
    [/tricep|skull crusher|close.?grip bench/, {triceps:1,chest:.2}],
    [/squat|leg press|hack squat|lunge|split squat|step.?up/, {quads:1,glutes:.65,hamstrings:.25,abs:.15}],
    [/deadlift|romanian|rdl|good morning|hip hinge/, {hamstrings:1,glutes:.8,lowerBack:.6,upperBack:.2,forearms:.15}],
    [/leg extension/, {quads:1}],
    [/leg curl|hamstring curl/, {hamstrings:1}],
    [/hip thrust|glute bridge|kickback|abduction/, {glutes:1,hamstrings:.2}],
    [/calf raise|seated calf/, {calves:1}],
    [/shrug/, {upperBack:1,forearms:.1}],
    [/back extension/, {lowerBack:1,glutes:.4,hamstrings:.3}],
    [/crunch|sit.?up|plank|ab wheel|leg raise/, {abs:1,obliques:.35}],
    [/wood.?chop|side bend|pallof/, {obliques:1,abs:.35}],
    [/wrist|reverse curl|farmer.?carry/, {forearms:1,upperBack:.15}]
  ];
  const empty = () => Object.fromEntries(GROUPS.map(g => [g.id,0]));
  function contributions(name) {
    const text = String(name || '').toLowerCase().replace(/[–—]/g,'-');
    const rule = RULES.find(([pattern]) => pattern.test(text));
    return rule ? rule[1] : null;
  }
  function addExercise(totals, exercise, countMode='planned') {
    const mapping = contributions(exercise && exercise.name);
    if (!mapping) return;
    const sets = Array.isArray(exercise.sets) ? exercise.sets : [];
    const count = countMode === 'logged'
      ? sets.filter(s => s && (s.done || (Number(s.weight)>0 && Number(s.reps)>0))).length
      : sets.length;
    Object.entries(mapping).forEach(([muscle,share]) => { totals[muscle] += count * share; });
  }
  function mapWorkout(workout, countMode='planned') {
    const totals = empty();
    (workout && Array.isArray(workout.exercises) ? workout.exercises : []).forEach(ex => addExercise(totals,ex,countMode));
    const rounded = Object.fromEntries(Object.entries(totals).map(([key,value])=>[key,Math.round(value*100)/100]));
    return { totals:rounded, groups: GROUPS.map(g=>({...g,sets:Math.round(rounded[g.id]*10)/10})).filter(g=>g.sets>0).sort((a,b)=>b.sets-a.sets) };
  }
  function mapWeekly(workouts, today=new Date().toISOString().slice(0,10)) {
    const totals = empty();
    const end = new Date(today+'T12:00:00');
    (Array.isArray(workouts)?workouts:[]).forEach(workout=>{
      const date = new Date(String(workout && workout.date || '').slice(0,10)+'T12:00:00');
      const age = Math.floor((end-date)/86400000);
      if(!Number.isFinite(age)||age<0||age>=7)return;
      (workout.exercises||[]).forEach(ex=>addExercise(totals,ex,'logged'));
    });
    const rounded = Object.fromEntries(Object.entries(totals).map(([key,value])=>[key,Math.round(value*100)/100]));
    return { totals:rounded, groups:GROUPS.map(g=>({...g,sets:Math.round(rounded[g.id]*10)/10})).filter(g=>g.sets>0).sort((a,b)=>b.sets-a.sets) };
  }
  window.OverloadMuscleMap = Object.freeze({ GROUPS, contributions, mapWorkout, mapWeekly });
})();