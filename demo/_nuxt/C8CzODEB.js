import{Y as w,L as V,A as c,U as A,V as B,M as D,k as o,N as x,Q as M,R as $,z as f,ag as p,au as C,b5 as q,Z as I,B as K,C as R,D as v,E as g,W as E,T as L,a1 as N,i as k,l as W,a6 as j}from"./CXTw713-.js";function F(e,...i){for(const u of i){const r=e.indexOf(u);r>-1&&e.splice(r,1)}return e}const O=["data-disabled","data-read-only","aria-label"],S=["data-border","tabindex","onKeydown","onFocus"],T={class:"multivalues--label truncate"},H=Object.assign({name:"WMultiValues",inheritAttrs:!1},{__name:"WMultiValues",props:$({disabled:{type:Boolean,required:!1},readonly:{type:Boolean,required:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1},label:{type:String,required:!1},itemAttrs:{type:Object,required:!1}},{modelValue:{type:Array,default:()=>[]},modelModifiers:{}}),emits:["update:modelValue"],setup(e){const i=w(),u=e,r=W(()=>!u.disabled&&!u.readonly),t=V(e,"modelValue",{type:Array,default:()=>[]}),s=k([]),a=k(0);function b(l){r.value&&(F(t.value,l),t.value.length>0&&(a.value>=t.value.length&&(a.value=t.value.length-1),j(()=>{s.value[a.value]?.focus()})))}function h(l){if(u.disabled)return;const n=t.value.length;n!==0&&(l.key==="ArrowRight"?(a.value=(a.value+1)%n,s.value[a.value]?.focus(),l.preventDefault()):l.key==="ArrowLeft"?(a.value=(a.value-1+n)%n,s.value[a.value]?.focus(),l.preventDefault()):l.key==="Delete"||l.key==="Backspace"?r.value&&(b(t.value[a.value]),l.preventDefault()):l.key==="Home"?(a.value=0,s.value[a.value]?.focus(),l.preventDefault()):l.key==="End"&&(a.value=n-1,s.value[a.value]?.focus(),l.preventDefault()))}return(l,n)=>t.value&&t.value?.length>0?(f(),c("div",D({key:0,role:"list",class:o(x)(`
		multivalues
		group
		flex
		flex-initial
		items-center
		justify-center
		gap-1
		overflow-x-scroll
		scrollbar-hidden
	`,o(i)?.class),"data-disabled":e.disabled,"data-read-only":e.readonly,"aria-label":e.label?`Values for ${e.label}`:void 0},{...o(i),class:void 0},{onKeydown:h}),[(f(!0),c(A,null,B(t.value,(d,m)=>(f(),c("div",{role:"listitem","data-border":e.border,class:I(o(x)(`
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
				leading-none
				focus-outline
				outlined:outline-offset-0
			`,!(e.disabled||e.readonly)&&`
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
			`,e.itemAttrs?.class)),tabindex:r.value?a.value===m?0:-1:void 0,key:d,ref_for:!0,ref_key:"itemRefs",ref:s,onKeydown:p(C(y=>o(q)(d.toString()),["ctrl","prevent"]),["c"]),onFocus:y=>a.value=m},[K("span",T,R(d),1),v(N,{class:"multivalues--remove-button !p-0 text-sm !leading-none","aria-label":`Remove ${d}`,border:!1,disabled:e.disabled||e.readonly,tabindex:"-1",onClick:y=>b(d)},{default:g(()=>[v(E,null,{default:g(()=>[v(o(L))]),_:1})]),_:1},8,["aria-label","disabled","onClick"])],42,S))),128))],16,O)):M("",!0)}});export{H as default};
