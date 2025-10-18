import{H as y,aL as v,j as x,K as g,v as s,P as h,x as d,ag as V,ah as w,R as k,Q as a,S as c,a9 as B,X as M,aj as $,a4 as A,y as q,A as o,z as C,B as f,a3 as S,aM as j,_ as K}from"#entry";import{r as I}from"./DOfhXivz.js";const L=["data-disabled","data-read-only","aria-label","tabindex"],N=["data-border","tabindex","onKeydown"],z={class:"multivalues--label truncate"},P=Object.assign({name:"LibMultiValues",inheritAttrs:!1},{__name:"WMultiValues",props:y({label:{type:String,required:!1},disabled:{type:Boolean,required:!1,default:!1},readonly:{type:Boolean,required:!1,default:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1,default:!1}},{modelValue:{type:Array,default:()=>[]},modelModifiers:{}}),emits:["update:modelValue"],setup(e){const r=v(["item"]),n=e,i=x(()=>!n.disabled&&!n.readonly),l=g(e,"modelValue",{type:Array,default:()=>[]}),b=u=>{i.value&&I(l.value,u)};return(u,D)=>l.value&&l.value?.length>0?(d(),s("div",k({key:0,class:a(c)(`
		multivalues
		group
		flex
		flex-initial
		items-center
		justify-center
		gap-1
		overflow-x-scroll
		scrollbar-hidden
	`,a(r).attrs?.class),"data-disabled":e.disabled,"data-read-only":e.readonly,"aria-label":`Values for ${e.label}`,tabindex:e.disabled?-1:0},{...a(r).attrs,class:void 0}),[(d(!0),s(V,null,w(l.value,t=>(d(),s("div",{"data-border":e.border,class:M(a(c)(`
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
			`,a(r).itemAttrs?.class)),tabindex:i.value?0:void 0,key:t,onKeydown:B($(m=>a(A)(t.toString()),["ctrl","prevent"]),["c"])},[q("span",z,C(t),1),o(K,{class:"multivalues--remove-button !p-0 text-sm !leading-none","aria-label":`Remove ${t}`,border:!1,disabled:e.disabled||e.readonly,onClick:m=>b(t)},{default:f(()=>[o(S,null,{default:f(()=>[o(a(j))]),_:1})]),_:1},8,["aria-label","disabled","onClick"])],42,N))),128))],16,L)):h("",!0)}});export{P as default};
