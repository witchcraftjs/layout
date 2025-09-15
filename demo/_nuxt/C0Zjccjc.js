import{H as y,j as v,J as x,v as s,M as g,x as d,a0 as h,a1 as V,O as p,N as a,Y as w,T as k,a3 as B,y as M,A as o,z as $,B as m,ar as A}from"./9MspHWnN.js";import{r as q}from"./DOfhXivz.js";import{u as C}from"./DZ0AOZlX.js";import{c as N}from"./CD0Jx8XC.js";import{t as c}from"./CudCRF6p.js";import S from"./b9rTLZqA.js";import j from"./CYLspzcf.js";import"./B39yYSFt.js";import"./BhoX2VZY.js";import"./QnU64Ice.js";import"./C0K3EOEW.js";const I=["data-disabled","data-read-only","aria-label","tabindex"],K=["data-border","tabindex","onKeydown"],z={class:"multivalues--label truncate"},Y=Object.assign({name:"LibMultiValues",inheritAttrs:!1},{__name:"WMultiValues",props:y({label:{type:String,required:!1},disabled:{type:Boolean,required:!1,default:!1},readonly:{type:Boolean,required:!1,default:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1,default:!1}},{modelValue:{type:Array,default:()=>[]},modelModifiers:{}}),emits:["update:modelValue"],setup(e){const r=C(["item"]),i=e,n=v(()=>!i.disabled&&!i.readonly),l=x(e,"modelValue",{type:Array,default:()=>[]}),f=u=>{n.value&&q(l.value,u)};return(u,D)=>l.value&&l.value?.length>0?(d(),s("div",p({key:0,class:a(c)(`
		multivalues
		group
		flex
		flex-initial
		items-center
		justify-center
		gap-1
		overflow-x-scroll
		scrollbar-hidden
	`,a(r).attrs?.class),"data-disabled":e.disabled,"data-read-only":e.readonly,"aria-label":`Values for ${e.label}`,tabindex:e.disabled?-1:0},{...a(r).attrs,class:void 0}),[(d(!0),s(h,null,V(l.value,t=>(d(),s("div",{"data-border":e.border,class:k(a(c)(`
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
			`,a(r).itemAttrs?.class)),tabindex:n.value?0:void 0,key:t,onKeydown:w(B(b=>a(N)(t.toString()),["ctrl","prevent"]),["c"])},[M("span",z,$(t),1),o(j,{class:"multivalues--remove-button !p-0 text-sm !leading-none","aria-label":`Remove ${t}`,border:!1,disabled:e.disabled||e.readonly,onClick:b=>f(t)},{default:m(()=>[o(S,null,{default:m(()=>[o(a(A))]),_:1})]),_:1},8,["aria-label","disabled","onClick"])],42,K))),128))],16,I)):g("",!0)}});export{Y as default};
