import{d as P,M as k,N as q,P as h,r as m,i as D,F as B,au as T,av as A,e as F,o as K,t as N,v as S,x as E,X as U,S as s,V,aw as t,y as $,U as z,aq as X,ai as j,as as L,ar as G,at as H}from"./Cr7bJNLf.js";const J=["id","aria-disabled","aria-readonly","tabindex","title"],O={class:"recorder-value before:content-vertical-holder truncate"},W=P({name:"lib-recorder",inheritAttrs:!1,__name:"LibRecorder",props:k(G({id:{},disabled:{type:Boolean},readonly:{type:Boolean},border:{type:Boolean},unstyle:{type:Boolean},label:{},recordingValue:{},recordingTitle:{},recorder:{},binders:{}},{recordingValue:"Recording",recordingTitle:"",id:void 0,binders:void 0,recorder:void 0,...H}),{recording:{type:Boolean,required:!1,default:!1},recordingModifiers:{},modelValue:{required:!0},modelModifiers:{}}),emits:k(["recorder:blur","recorder:click","focus:parent"],["update:recording","update:modelValue"]),setup(u,{emit:M}){const c=M,R=q(),r=u,d=h(u,"recording"),f=h(u,"modelValue"),a=m(null),g=m(null),b=D(()=>!r.disabled&&!r.readonly),v=m(f.value);B([()=>r.binders,()=>r.binders],()=>{if(d.value)throw new Error("Component was not designed to allow swapping out of binders/recorders while recording")}),B(f,()=>{v.value=f.value});const C=T(r),i={};let l=!1;const p=()=>{var e;if(l){if(l=!1,r.recorder)for(const o of L(i))(e=a.value)==null||e.removeEventListener(o,i[o]),delete i[o];r.binders&&a.value&&r.binders.unbind(a.value)}},y=()=>{var e;if(!r.recorder&&!r.binders)throw new Error("Record is true but no recorder or binders props was passed");if(r.recorder&&r.binders)throw new Error("Recording is true and was passed both a recorder and a binders prop. Both cannot be used at the same time.");if(l=!0,r.recorder)for(const o of L(r.recorder))(e=a.value)==null||e.addEventListener(o,r.recorder[o],{passive:!1}),i[o]=r.recorder[o];r.binders&&a.value&&r.binders.bind(a.value)};A(()=>{if(!b.value){p(),d.value=!1;return}d.value?y():(r.recorder||r.binders)&&l&&(p(),c("focus:parent"))}),F(()=>{p()}),K(()=>{d.value&&y()});const I=e=>{b.value&&(r.recorder||r.binders)&&c("recorder:blur",e)},w=(e,o=!1)=>{var n;if(b.value&&(d.value||(n=a.value)==null||n.focus(),r.recorder||r.binders)){if(o)return;c("recorder:click",{event:e,indicator:g.value,input:a.value})}};return(e,o)=>(N(),S("div",z({id:e.id??s(R),class:s(V)(`recorder
			flex items-center
			gap-2
			px-2
			grow-[999999]
			focus-outline-no-offset
			rounded
		`,e.border&&`
			border border-neutral-500
			focus:border-accent-500
		`,(e.disabled||("readonly"in e?e.readonly:s(t)))&&`
			text-neutral-400
		`,(e.disabled||("readonly"in e?e.readonly:s(t)))&&e.border&&`
			bg-neutral-50
			border-neutral-400
		`,e.$attrs.class),"aria-disabled":e.disabled,"aria-readonly":"readonly"in e?e.readonly:s(t),tabindex:e.disabled?-1:0,title:d.value?e.recordingTitle:v.value,contenteditable:"false",ref_key:"recorderEl",ref:a},{...s(C),...e.$attrs,class:void 0},{onBlur:o[0]||(o[0]=n=>I(n)),onClick:o[1]||(o[1]=n=>w(n)),onKeydown:o[2]||(o[2]=X(j(n=>w(n,!0),["prevent"]),["space"]))}),[E("div",{class:U(s(V)(`recorder-indicator
				inline-block
				bg-recorder-700
				rounded-full
				w-[1em]
				h-[1em]
				shrink-0
				hover:bg-recorder-500
			`,d.value&&`
				animate-[blink_1s_infinite]
				bg-recorder-500
			`,(e.disabled||("readonly"in e?e.readonly:s(t)))&&`
				bg-neutral-500
			`)),ref_key:"recorderIndicatorEl",ref:g},null,2),E("div",O,$(d.value?e.recordingValue:v.value),1)],16,J))}});export{W as default};
