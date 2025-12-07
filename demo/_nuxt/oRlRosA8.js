import{H as y,j as v,J as x,v as s,N as g,x as d,a7 as h,a8 as V,P as w,O as a,a2 as k,U as p,aa as B,y as $,A as o,z as M,B as c,ap as A}from"./DVXjeaI0.js";import{r as q}from"./DOfhXivz.js";import{u as C}from"./Cn0dpc25.js";import{c as N}from"./CD0Jx8XC.js";import{t as m}from"./DeCVlzJk.js";import S from"./CoDCRfl4.js";import j from"./BOOMfXGw.js";import"./yRW9QxNd.js";import"./BpX0FRyY.js";const I=["data-disabled","data-read-only","aria-label","tabindex"],K=["data-border","tabindex","onKeydown"],z={class:"multivalues--label truncate"},W=Object.assign({name:"LibMultiValues",inheritAttrs:!1},{__name:"WMultiValues",props:y({label:{type:String,required:!1},disabled:{type:Boolean,required:!1,default:!1},readonly:{type:Boolean,required:!1,default:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1,default:!1}},{modelValue:{type:Array,default:()=>[]},modelModifiers:{}}),emits:["update:modelValue"],setup(e){const r=C(["item"]),i=e,n=v(()=>!i.disabled&&!i.readonly),l=x(e,"modelValue",{type:Array,default:()=>[]}),f=u=>{n.value&&q(l.value,u)};return(u,D)=>l.value&&l.value?.length>0?(d(),s("div",w({key:0,class:a(m)(`
		multivalues
		group
		flex
		flex-initial
		items-center
		justify-center
		gap-1
		overflow-x-scroll
		scrollbar-hidden
	`,a(r).attrs?.class),"data-disabled":e.disabled,"data-read-only":e.readonly,"aria-label":`Values for ${e.label}`,tabindex:e.disabled?-1:0},{...a(r).attrs,class:void 0}),[(d(!0),s(h,null,V(l.value,t=>(d(),s("div",{"data-border":e.border,class:p(a(m)(`
				multivalues--item
				flex-basis-0
				min-w-2
				flex
				max-w-fit
				flex-1
				items-center
				gap-0.5
				overflow-hidden
				px-1
				text-xs
				leading-none`,!(e.disabled||e.readonly)&&`
				group-focus:text-accent-500
				focus:text-accent-500`,e.border&&`
				rounded-sm
				border-neutral-400
				border
				focus:border-accent-400
			`,e.border&&(e.disabled||e.readonly)&&`
				border-neutral-200
				focus:border-neutral-200
				dark:border-neutral-800
				dark:focus:border-neutral-800
			`,a(r).itemAttrs?.class)),tabindex:n.value?0:void 0,key:t,onKeydown:k(B(b=>a(N)(t.toString()),["ctrl","prevent"]),["c"])},[$("span",z,M(t),1),o(j,{class:"multivalues--remove-button !p-0 text-sm !leading-none","aria-label":`Remove ${t}`,border:!1,disabled:e.disabled||e.readonly,onClick:b=>f(t)},{default:c(()=>[o(S,null,{default:c(()=>[o(a(A))]),_:1})]),_:1},8,["aria-label","disabled","onClick"])],42,K))),128))],16,I)):g("",!0)}});export{W as default};
