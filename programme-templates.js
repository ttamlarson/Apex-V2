(function(root,factory){
 if(typeof module==='object'&&module.exports)module.exports=factory();
 else root.OverloadProgrammeTemplates=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const groups=[
  {id:'upper-lower',name:'Upper / Lower',description:'Four-day split · Upper body and lower body',days:['Upper A','Lower A','Upper B','Lower B']},
  {id:'push-pull-legs',name:'Push / Pull / Legs',description:'Three-day split · Push, pull and legs',days:['Push Day','Pull Day','Leg Day']}
 ];
 function createDefaults(plans){
  return groups.map(group=>({
   id:group.id,name:group.name,description:group.description,
   days:group.days.map((name,index)=>({
    id:group.id+'-'+index,name,
    exercises:(plans[name]||[]).map(([exercise,sets,target])=>({name:exercise,sets:Number(sets)||3,target:String(target||'8–12')}))
   }))
  }));
 }
 function clone(template){return JSON.parse(JSON.stringify(template))}
 return {createDefaults,clone};
});
