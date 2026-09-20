import{$ as e,D as t,Ft as n,Nt as r,On as i,Zn as a,_ as o,b as s,bt as c,et as l,g as u,mt as d,o as f,qt as p,tr as m,tt as h,vn as g,y as _}from"./Car86Ubo.js";import{C as v,w as y}from"./BuJ-z5Um.js";import{l as b,s as x}from"#entry";import{t as S}from"./JCXPeO0D.js";import{n as C}from"./g2lPe_Oy.js";import{t as w}from"./CYXZYEL9.js";function T(e,...t){for(let n of t){let t=e.indexOf(n);t>-1&&e.splice(t,1)}return e}var E=[`data-disabled`,`data-read-only`,`aria-label`],D=[`data-border`,`tabindex`,`onKeydown`,`onFocus`],O={class:`multivalues--label truncate`},k=Object.assign({name:`WMultiValues`,inheritAttrs:!1},{__name:`WMultiValues`,props:e({disabled:{type:Boolean,required:!1},readonly:{type:Boolean,required:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1},label:{type:String,required:!1},itemAttrs:{type:Object,required:!1}},{modelValue:{type:Array,default:()=>[]},modelModifiers:{}}),emits:[`update:modelValue`],setup(e){let k=r(),A=e,j=u(()=>!A.disabled&&!A.readonly),M=n(e,`modelValue`,{type:Array,default:()=>[]}),N=g([]),P=g(0);function F(e){j.value&&(T(M.value,e),M.value.length>0&&(P.value>=M.value.length&&(P.value=M.value.length-1),h(()=>{N.value[P.value]?.focus()})))}function I(e){if(A.disabled)return;let t=M.value.length;t!==0&&(e.key===`ArrowRight`?(P.value=(P.value+1)%t,N.value[P.value]?.focus(),e.preventDefault()):e.key===`ArrowLeft`?(P.value=(P.value-1+t)%t,N.value[P.value]?.focus(),e.preventDefault()):e.key===`Delete`||e.key===`Backspace`?j.value&&(F(M.value[P.value]),e.preventDefault()):e.key===`Home`?(P.value=0,N.value[P.value]?.focus(),e.preventDefault()):e.key===`End`&&(P.value=t-1,N.value[P.value]?.focus(),e.preventDefault()))}return(n,r)=>M.value&&M.value?.length>0?(d(),s(`div`,l({key:0,role:`list`,class:i(S)(`
		multivalues
		group
		flex
		flex-initial
		items-center
		justify-center
		gap-1
		overflow-x-scroll
		scrollbar-hidden
	`,i(k)?.class),"data-disabled":e.disabled,"data-read-only":e.readonly,"aria-label":e.label?`Values for ${e.label}`:void 0},{...i(k),class:void 0},{onKeydown:I}),[(d(!0),s(f,null,c(M.value,(n,r)=>(d(),s(`div`,{role:`listitem`,"data-border":e.border,class:a(i(S)(`
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
			`,e.itemAttrs?.class)),tabindex:j.value?P.value===r?0:-1:void 0,key:n,ref_for:!0,ref_key:`itemRefs`,ref:N,onKeydown:v(y(e=>i(b)(n.toString()),[`ctrl`,`prevent`]),[`c`]),onFocus:e=>P.value=r},[o(`span`,O,m(n),1),t(C,{class:`multivalues--remove-button !p-0 text-sm !leading-none`,"aria-label":`Remove ${n}`,border:!1,disabled:e.disabled||e.readonly,tabindex:`-1`,onClick:e=>F(n)},{default:p(()=>[t(w,null,{default:p(()=>[t(i(x))]),_:1})]),_:1},8,[`aria-label`,`disabled`,`onClick`])],42,D))),128))],16,E)):_(``,!0)}});export{k as default};