import{r as e}from"./Cfpk3IOQ.js";import{Ht as t,Nt as n,On as r,_ as i,b as a,et as o,mt as s,qt as c,tr as l,v as u,vn as d,xt as f,y as p}from"./Car86Ubo.js";import{t as m}from"./BuJ-z5Um.js";import{Q as h,o as g}from"#entry";import{t as _}from"./JCXPeO0D.js";var v=e({default:()=>T}),y=[`data-value`,`aria-valuenow`,`aria-valuemin`,`aria-valuemax`,`aria-label`],b={class:`progress-bar--label-wrapper relative flex-1 z-3`,"aria-hidden":`true`},x={class:`progress-bar--bottom-label text-black dark:text-white absolute inset-0 flex justify-center px-2`},S={class:`truncate`},C={class:`progress-bar--top-label pointer-events-none absolute inset-0 flex justify-center transition-all duration-500 text-white [clip-path:inset(0_calc(100%-var(--progress))_0_0)] px-2`},w={class:`truncate`},T=Object.assign({name:`WProgressBar`,inheritAttrs:!1},{__name:`WProgressBar`,props:{label:{type:String,required:!1},progress:{type:Number,required:!0},autohideOnComplete:{type:Number,required:!1,default:-1},keepSpaceWhenHidden:{type:Boolean,required:!1,default:!1},clamp:{type:Array,required:!1,default:()=>[0,100]}},setup(e){let v=n(),T=e,E=d(`visible`),D=null;function O(e=!1,t){let n=T.progress>=100||T.progress<0;if(!(T.autohideOnComplete>-1&&n)){D=null,E.value=`visible`;return}let r=T.keepSpaceWhenHidden?`pseudo`:`hidden`;if(e)E.value=r,D=r;else if(D!==r){D=r;let e=setTimeout(()=>{E.value=r},T.autohideOnComplete);t||h(),t(()=>clearTimeout(e))}}return O(!0),t([()=>[T.progress,T.keepSpaceWhenHidden,T.autohideOnComplete]],(e,t,n)=>{O(!1,n)}),(t,n)=>(s(),u(m,null,{default:c(()=>[E.value===`hidden`?p(``,!0):(s(),a(`div`,o({key:0,class:r(_)(`
			progress-bar
			w-[200px]
			whitespace-nowrap
			overflow-x-scroll
			scrollbar-hidden
			rounded-sm
			flex
			relative
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
			before:content-['']
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
		`,E.value===`pseudo`&&`
			after:opacity-0
			before:opacity-0
		`,r(v).class),"data-value":e.progress,role:`progressbar`,"aria-valuenow":r(g)(e.progress,e.clamp[0]??0,e.clamp[1]??100),"aria-valuemin":e.clamp[0]??0,"aria-valuemax":e.clamp[1]??100,"aria-label":e.label},{...r(v),class:void 0},{style:`--progress: ${r(g)(e.progress,e.clamp[0]??0,e.clamp[1]??100)}%;`}),[i(`div`,b,[n[0]||=i(`span`,{class:`before:content-vertical-holder`},null,-1),E.value===`visible`?(s(),u(m,{key:0},{default:c(()=>[f(t.$slots,`default`,{},()=>[i(`div`,x,[i(`div`,S,l(e.label??``),1)])])]),_:3})):p(``,!0),E.value===`visible`?(s(),u(m,{key:1},{default:c(()=>[f(t.$slots,`default`,{},()=>[i(`div`,C,[i(`div`,w,l(e.label??``),1)])])]),_:3})):p(``,!0)])],16,y))]),_:3}))}});export{T as n,v as t};