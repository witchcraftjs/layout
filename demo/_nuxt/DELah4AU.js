import{X as I,Y as S,L as k,i as g,a4 as q,bs as P,c as A,o as T,A as j,B as y,C as E,k as t,aM as M,Z as z,N as x,M as K,ah as N,R as V,bl as R,l as W,z as D}from"./DqUrqeTS.js";const O=["aria-readonly","tabindex","title","aria-pressed","aria-disabled"],U={class:"sr-only","aria-live":"polite"},X={class:"recorder--value before:content-vertical-holder truncate"},Z=Object.assign({name:"WRecorder",inheritAttrs:!1},{__name:"WRecorder",props:V({disabled:{type:Boolean,required:!1},readonly:{type:Boolean,required:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1},recordingValue:{type:String,required:!1},recordingTitle:{type:String,required:!1,default:""},recorder:{type:null,required:!1,default:void 0},binders:{type:null,required:!1,default:void 0}},{recording:{type:Boolean,required:!1,default:!1},recordingModifiers:{},modelValue:{type:String,required:!0},modelModifiers:{}}),emits:V(["recorder:blur","recorder:pointerdown","focus:parent"],["update:recording","update:modelValue"]),setup(r,{emit:L}){const m=I(),u=L,w=S(),e=r,d=k(r,"recording",{type:Boolean,required:!1,default:!1}),c=k(r,"modelValue",{type:String,required:!0}),n=g(null),h=g(null),f=W(()=>!e.disabled&&!e.readonly),b=g(c.value);q([()=>e.binders,()=>e.recorder],()=>{if(d.value)throw new Error("Component was not designed to allow swapping out of binders/recorders while recording")}),q(c,()=>{b.value=c.value});const i={};let s=!1;const v=()=>{if(s){if(s=!1,e.recorder)for(const a of R(i))n.value?.removeEventListener(a,i[a]),delete i[a];e.binders&&n.value&&e.binders.unbind(n.value)}},p=()=>{if(!e.recorder&&!e.binders)throw new Error("Recording is true but no recorder or binders props was passed");if(e.recorder&&e.binders)throw new Error("Recording is true and was passed both a recorder and a binders prop. Both cannot be used at the same time.");if(s=!0,e.recorder)for(const a of R(e.recorder))n.value?.addEventListener(a,e.recorder[a],{passive:!1}),i[a]=e.recorder[a];e.binders&&n.value&&e.binders.bind(n.value)};P(()=>{if(!f.value){v(),d.value=!1;return}d.value?p():(e.recorder||e.binders)&&s&&(v(),u("focus:parent"))}),A(()=>{v()}),T(()=>{d.value&&p()});const C=a=>{f.value&&(e.recorder||e.binders)&&u("recorder:blur",a)},B=(a,o=!1)=>{if(f.value&&(d.value||n.value?.focus(),e.recorder||e.binders)){if(o)return;u("recorder:pointerdown",{event:a,indicator:h.value,input:n.value})}};return(a,o)=>(D(),j("div",K({class:t(x)(`
			recorder
			flex items-center
			gap-2
			px-2
			grow-[999999]
			focus-outline-no-offset
			rounded-sm
		`,r.border&&`
			border
			border-neutral-500
			focus:border-accent-500
		`,(r.disabled||r.readonly)&&`
			text-neutral-400
			dark:text-neutral-600
		`,(r.disabled||r.readonly)&&r.border&&`
			bg-neutral-50
			dark:bg-neutral-950
			border-neutral-400
			dark:border-neutral-600
		`,t(w).class),"aria-readonly":r.readonly,tabindex:r.disabled?-1:0,title:d.value?r.recordingTitle:b.value,contenteditable:"false"},{...t(w),class:void 0},{role:"button","aria-pressed":d.value,"aria-disabled":r.disabled,ref_key:"recorderEl",ref:n,onBlur:o[1]||(o[1]=l=>C(l)),onKeydownCapture:o[2]||(o[2]=N(M(l=>B(l,!0),["prevent"]),["space"]))}),[y("span",U,E(d.value?r.recordingTitle||t(m)("recorder.recording"):""),1),y("div",{class:z(t(x)(`
			recorder--indicator
			inline-block
			bg-red-700
			rounded-full
			w-[1em]
			h-[1em]
			shrink-0
		`,d.value&&`
				animate-blinkInf
				bg-red-500
			`,(r.disabled||r.readonly)&&`
				bg-neutral-500
			`,!(r.disabled||r.readonly)&&`
				hover:bg-red-500
			`)),ref_key:"recorderIndicatorEl",ref:h,onPointerdownCapture:o[0]||(o[0]=M(l=>B(l),["prevent"]))},null,34),y("div",X,E(d.value?r.recordingValue??t(m)("recorder.recording"):b.value),1)],16,O))}});export{Z as default};
