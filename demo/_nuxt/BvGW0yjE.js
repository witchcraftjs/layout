import{r as m,Y as x,L as B,x as n,B as d,aU as f,v as c,N as b,P as q,O as v,y as u,A as g,Q as h,z as y}from"./DVXjeaI0.js";import{t as C}from"./DeCVlzJk.js";import{g as O}from"./BpX0FRyY.js";const S=["id","data-value","title","aria-valuenow","aria-valuemin","aria-valuemax"],N={class:"procgress-bar--label-wrapper relative flex-1"},T=["for"],H={class:"truncate"},W={key:0,class:"progress-bar--label contrast-label pointer-events-none absolute inset-0 flex justify-center transition-all duration-500 [clip-path:inset(0_0_0_var(--progress))] dark:hidden"},$={class:"truncate"},j=Object.assign({name:"LibProgressBar",inheritAttrs:!1},{__name:"WProgressBar",props:{id:{type:String,required:!1},disabled:{type:Boolean,required:!1,default:!1},readonly:{type:Boolean,required:!1,default:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1,default:!1},label:{type:String,required:!1},progress:{type:Number,required:!0},autohideOnComplete:{type:Number,required:!1,default:-1},keepSpaceWhenHidden:{type:Boolean,required:!1,default:!1},clamp:{type:Array,required:!1,default:()=>[0,100]}},setup(e){const p=(s,i,w)=>Math.min(Math.max(s,i),w),k=O(),a=e,r=m(!1),t=m(!1);let o,l;return a.autohideOnComplete>-1&&(a.progress>=100||a.progress<0)&&(a.keepSpaceWhenHidden?(r.value=!1,t.value=!0):(r.value=!0,t.value=!1)),x([()=>a.progress,()=>a.keepSpaceWhenHidden,()=>a.autohideOnComplete],()=>{if(a.autohideOnComplete>-1&&(a.progress>=100||a.progress<0))if(a.keepSpaceWhenHidden){if(l===1)return;clearTimeout(o),l=1,o=setTimeout(()=>{l=0,r.value=!1,t.value=!0},a.autohideOnComplete)}else{if(l===2)return;clearTimeout(o),l=2,o=setTimeout(()=>{l=0,r.value=!0,t.value=!1},a.autohideOnComplete)}else clearTimeout(o),r.value=!1,t.value=!1},{immediate:!1}),(s,i)=>(n(),B(f,null,{default:d(()=>[r.value?b("",!0):(n(),c("div",q({key:0,id:e.id??v(k),class:v(C)(`
			progress-bar
			w-[200px]
			whitespace-nowrap
			overflow-x-scroll
			scrollbar-hidden
			rounded-sm
			flex
			text-fg
			relative
			before:content-['']
			text-sm
			min-w-[50px]
			after:shadow-inner
			after:shadow-black/50
			after:content-['']
			after:absolute
			after:inset-0
			after:pointer-events-none
			after:z-2
			after:transition-all
			before:shadow-inner
			before:shadow-black/50
			before:rounded-sm
			before:bg-bars-gradient
			before:animate-slideBgInf
			before:[background-size:15px_15px]
			before:absolute
			before:w-[var(--progress)]
			before:top-0 before:bottom-0 before:left-0
			before:transition-all
			before:z-1
			before:duration-500
		`,t.value&&`
			after:opacity-0
			before:opacity-0
		`,s.$attrs.class),"data-value":e.progress,title:e.label,role:"progressbar","aria-valuenow":p(e.progress,e.clamp[0]??0,e.clamp[1]??100),"aria-valuemin":e.clamp[0]??0,"aria-valuemax":e.clamp[1]??100},{...s.$attrs,class:void 0},{style:`--progress: ${p(e.progress,e.clamp[0]??0,e.clamp[1]??100)}%;`}),[u("div",N,[i[0]||(i[0]=u("span",{class:"before:content-vertical-holder"},null,-1)),g(f,null,{default:d(()=>[h(s.$slots,"default",{},()=>[t.value?b("",!0):(n(),c("label",{key:0,for:e.id,class:"text-bg absolute inset-0 flex justify-center"},[u("div",H,y(e.label??""),1)],8,T))])]),_:3}),g(f,null,{default:d(()=>[h(s.$slots,"default",{},()=>[t.value?b("",!0):(n(),c("label",W,[u("div",$,y(e.label??""),1)]))])]),_:3})])],16,S))]),_:3}))}});export{j as default};
