import{$ as e,Ft as t,Ht as n,Nt as r,On as i,Wt as a,Zn as o,_ as s,b as c,ct as l,et as u,g as d,it as f,mt as p,tr as m,vn as h}from"./Car86Ubo.js";import{C as g,w as _}from"./BuJ-z5Um.js";import{$ as v}from"#entry";import{t as y}from"./JCXPeO0D.js";import{t as b}from"./DQRMssAd.js";var x=[`aria-readonly`,`tabindex`,`title`,`aria-pressed`,`aria-disabled`],S={class:`sr-only`,"aria-live":`polite`},C={class:`recorder--value before:content-vertical-holder truncate`},w=Object.assign({name:`WRecorder`,inheritAttrs:!1},{__name:`WRecorder`,props:e({disabled:{type:Boolean,required:!1},readonly:{type:Boolean,required:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1},recordingValue:{type:String,required:!1},recordingTitle:{type:String,required:!1,default:``},recorder:{type:null,required:!1,default:void 0},binders:{type:null,required:!1,default:void 0}},{recording:{type:Boolean,required:!1,default:!1},recordingModifiers:{},modelValue:{type:String,required:!0},modelModifiers:{}}),emits:e([`recorder:blur`,`recorder:pointerdown`,`focus:parent`],[`update:recording`,`update:modelValue`]),setup(e,{emit:w}){let T=b(),E=w,D=r(),O=e,k=t(e,`recording`,{type:Boolean,required:!1,default:!1}),A=t(e,`modelValue`,{type:String,required:!0}),j=h(null),M=h(null),N=d(()=>!O.disabled&&!O.readonly),P=h(A.value);n([()=>O.binders,()=>O.recorder],()=>{if(k.value)throw Error(`Component was not designed to allow swapping out of binders/recorders while recording`)}),n(A,()=>{P.value=A.value});let F={},I=!1,L=()=>{if(I){if(I=!1,O.recorder)for(let e of v(F))j.value?.removeEventListener(e,F[e]),delete F[e];O.binders&&j.value&&O.binders.unbind(j.value)}},R=()=>{if(!O.recorder&&!O.binders)throw Error(`Recording is true but no recorder or binders props was passed`);if(O.recorder&&O.binders)throw Error(`Recording is true and was passed both a recorder and a binders prop. Both cannot be used at the same time.`);if(I=!0,O.recorder)for(let e of v(O.recorder))j.value?.addEventListener(e,O.recorder[e],{passive:!1}),F[e]=O.recorder[e];O.binders&&j.value&&O.binders.bind(j.value)};a(()=>{if(!N.value){L(),k.value=!1;return}k.value?R():(O.recorder||O.binders)&&I&&(L(),E(`focus:parent`))}),f(()=>{L()}),l(()=>{k.value&&R()});let z=e=>{N.value&&(O.recorder||O.binders)&&E(`recorder:blur`,e)},B=(e,t=!1)=>{if(N.value&&(k.value||j.value?.focus(),O.recorder||O.binders)){if(t)return;E(`recorder:pointerdown`,{event:e,indicator:M.value,input:j.value})}};return(t,n)=>(p(),c(`div`,u({class:i(y)(`
			recorder
			flex items-center
			gap-2
			px-2
			grow-[999999]
			focus-outline-no-offset
			rounded-sm
		`,e.border&&`
			border
			border-neutral-500
			focus:border-accent-500
		`,(e.disabled||e.readonly)&&`
			text-neutral-400
			dark:text-neutral-600
		`,(e.disabled||e.readonly)&&e.border&&`
			bg-neutral-50
			dark:bg-neutral-950
			border-neutral-400
			dark:border-neutral-600
		`,i(D).class),"aria-readonly":e.readonly,tabindex:e.disabled?-1:0,title:k.value?e.recordingTitle:P.value,contenteditable:`false`},{...i(D),class:void 0},{role:`button`,"aria-pressed":k.value,"aria-disabled":e.disabled,ref_key:`recorderEl`,ref:j,onBlur:n[1]||=e=>z(e),onKeydownCapture:n[2]||=g(_(e=>B(e,!0),[`prevent`]),[`space`])}),[s(`span`,S,m(k.value?e.recordingTitle||i(T)(`recorder.recording`):``),1),s(`div`,{class:o(i(y)(`
			recorder--indicator
			inline-block
			bg-red-700
			rounded-full
			w-[1em]
			h-[1em]
			shrink-0
		`,k.value&&`
				animate-blinkInf
				bg-red-500
			`,(e.disabled||e.readonly)&&`
				bg-neutral-500
			`,!(e.disabled||e.readonly)&&`
				hover:bg-red-500
			`)),ref_key:`recorderIndicatorEl`,ref:M,onPointerdownCapture:n[0]||=_(e=>B(e),[`prevent`])},null,34),s(`div`,C,m(k.value?e.recordingValue??i(T)(`recorder.recording`):P.value),1)],16,x))}});export{w as default};