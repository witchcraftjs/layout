import{aT as w,b6 as V,G as f,f as B,az as A,ag as $,aR as o,aP as x,B as p,af as D,as as c,bn as M,bp as q,y as K,aj as C,z as I,aJ as R,K as v,bl as g,W as j,g as W,s as z,ax as h,x as E,ai as F}from"./BIYrkOIG.js";function L(e,...i){for(const u of i){const r=e.indexOf(u);r>-1&&e.splice(r,1)}return e}const N=["data-disabled","data-read-only","aria-label"],O=["data-border","tabindex","onKeydown","onFocus"],S={class:"multivalues--label truncate"},T=Object.assign({name:"WMultiValues",inheritAttrs:!1},{__name:"WMultiValues",props:D({disabled:{type:Boolean,required:!1},readonly:{type:Boolean,required:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1},label:{type:String,required:!1},itemAttrs:{type:Object,required:!1}},{modelValue:{type:Array,default:()=>[]},modelModifiers:{}}),emits:["update:modelValue"],setup(e){const i=w(),u=e,r=E(()=>!u.disabled&&!u.readonly),t=V(e,"modelValue",{type:Array,default:()=>[]}),s=h([]),a=h(0);function b(l){r.value&&(L(t.value,l),t.value.length>0&&(a.value>=t.value.length&&(a.value=t.value.length-1),F(()=>{s.value[a.value]?.focus()})))}function k(l){if(u.disabled)return;const n=t.value.length;n!==0&&(l.key==="ArrowRight"?(a.value=(a.value+1)%n,s.value[a.value]?.focus(),l.preventDefault()):l.key==="ArrowLeft"?(a.value=(a.value-1+n)%n,s.value[a.value]?.focus(),l.preventDefault()):l.key==="Delete"||l.key==="Backspace"?r.value&&(b(t.value[a.value]),l.preventDefault()):l.key==="Home"?(a.value=0,s.value[a.value]?.focus(),l.preventDefault()):l.key==="End"&&(a.value=n-1,s.value[a.value]?.focus(),l.preventDefault()))}return(l,n)=>t.value&&t.value?.length>0?(c(),f("div",$({key:0,role:"list",class:o(x)(`
		multivalues
		group
		flex
		flex-initial
		items-center
		justify-center
		gap-1
		overflow-x-scroll
		scrollbar-hidden
	`,o(i)?.class),"data-disabled":e.disabled,"data-read-only":e.readonly,"aria-label":e.label?`Values for ${e.label}`:void 0},{...o(i),class:void 0},{onKeydown:k}),[(c(!0),f(B,null,A(t.value,(d,m)=>(c(),f("div",{role:"listitem","data-border":e.border,class:C(o(x)(`
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
			`,e.itemAttrs?.class)),tabindex:r.value?a.value===m?0:-1:void 0,key:d,ref_for:!0,ref_key:"itemRefs",ref:s,onKeydown:M(q(y=>o(K)(d.toString()),["ctrl","prevent"]),["c"]),onFocus:y=>a.value=m},[I("span",S,R(d),1),v(z,{class:"multivalues--remove-button !p-0 text-sm !leading-none","aria-label":`Remove ${d}`,border:!1,disabled:e.disabled||e.readonly,tabindex:"-1",onClick:y=>b(d)},{default:g(()=>[v(j,null,{default:g(()=>[v(o(W))]),_:1})]),_:1},8,["aria-label","disabled","onClick"])],42,O))),128))],16,N)):p("",!0)}});export{T as default};
