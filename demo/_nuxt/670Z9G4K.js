import{r as e}from"./Cfpk3IOQ.js";import{$ as t,D as n,E as r,Ft as i,Ht as a,Nt as o,On as s,Zn as c,_ as l,b as u,ct as ee,er as d,g as f,gn as te,mt as ne,qt as p,tr as m,vn as h,xt as g,y as re}from"./Car86Ubo.js";import{Q as _,Z as ie,c as ae,l as oe,o as v,q as y,r as se}from"#entry";import{t as b}from"./JCXPeO0D.js";import{t as ce}from"./DQRMssAd.js";import{n as x}from"./g2lPe_Oy.js";import{t as le}from"./CYXZYEL9.js";import{t as ue}from"./BgGaekc7.js";import{n as de}from"./D9zOCwpr.js";function S(e,t){try{let n=typeof e==`string`?new y(e):new y(`srgb`,[e.r/255,e.g/255,e.b/255],t?e.a:1),r=n.hsv;return!r||r[1]===void 0||r[2]===void 0?void 0:{h:v(r[0]??0,0,2**53-1),s:v(r[1],0,100),v:v(r[2],0,100),a:v(t?n.alpha:1,0,1)}}catch{return}}function C(e,t){try{let n=typeof e==`string`?new y(e):new y(`hsv`,[e.h,e.s,e.v],t?e.a:1),r=n.srgb;return!r||r[0]===void 0||r[1]===void 0||r[2]===void 0?void 0:{r:v(r[0]/1*255,0,255),g:v(r[1]/1*255,0,255),b:v(r[2]/1*255,0,255),a:v(t?n.alpha:1,0,1)}}catch{return}}function w(e,t){let n=e.toFixed(t);return Number.parseFloat(n).toString()}function fe(e,t,n){let r=w(e.r,n),i=w(e.g,n),a=w(e.b,n),o=e.a===void 0?void 0:w(e.a,n);return t?`rgba(${r}, ${i}, ${a}, ${o})`:`rgb(${r}, ${i}, ${a})`}var T=e({default:()=>O}),pe=[`id`,`aria-label`],me=[`aria-description`,`aria-valuetext`],he=[`aria-valuenow`,`aria-label`,`aria-description`],ge=[`aria-label`,`aria-valuenow`,`aria-description`],_e={class:`color-picker--footer flex w-full flex-1 gap-2`},ve={class:`color-picker--preview-wrapper bg-transparency-squares relative aspect-square h-[calc(var(--slider-size,var(--_slider-size))*3)] rounded-full shadow-xs`},ye={class:`color-picker--input-group flex flex-1 items-center gap-2`},be={class:`color-picker--save-cancel-group flex w-full items-center justify-center gap-2`},E=`
	slider
	no-touch-action
	h-4
	w-full
	relative
	flex
`,D=`
	handle
	h-[var(--slider-size,var(--_slider-size))]
	w-[var(--slider-size,var(--_slider-size))]
	shadow-xs
	shadow-black/50
	border-2 border-neutral-700
	rounded-full
	absolute
	cursor-pointer
	outline-hidden
	focus:border-accent-500
	active:border-accent-500
	hover:border-accent-500
`,O=Object.assign({name:`WColorPicker`},{__name:`WColorPicker`,props:t({id:{type:String,required:!1},label:{type:String,required:!1},allowAlpha:{type:Boolean,required:!1,default:!0},stringPrecision:{type:Number,required:!1,default:3},customRepresentation:{type:Object,required:!1,default:void 0},border:{type:Boolean,required:!1,default:!0},copyTransform:{type:Function,required:!1,default:(e,t)=>t},valid:{type:Boolean,required:!1,default:!0}},{modelValue:{type:Object,required:!1,default:()=>({r:0,g:0,b:0})},modelModifiers:{},tempValue:{type:null,required:!1,default:()=>void 0},tempValueModifiers:{}}),emits:t([`save`,`cancel`],[`update:modelValue`,`update:tempValue`]),setup(e,{emit:t}){let v=o(),w=ce(),T=t,O=e,k=ue(O),A=w(`color-picker.aria.description`),j=i(e,`modelValue`,{type:Object,required:!1,default:()=>({r:0,g:0,b:0})}),M=i(e,`tempValue`,{type:null,required:!1,default:()=>void 0}),N=h(null),P=h(null),F=h(null),I=null,L=null,R=null,z={hue:{el:P,xKey:`h`,xSteps:360},alpha:{el:F,xSteps:1,xKey:`a`},all:{el:N,xSteps:100,ySteps:100,xKey:`s`,yKey:`v`}},B=te({percent:{h:0,s:0,v:0,a:0},val:{h:0,s:0,v:0,a:0}}),V=f(()=>{let e=C(B.val,O.allowAlpha);return e||_(),e}),H=f(()=>{let e=V.value;return e||_(),`rgba(${e.r}, ${e.g}, ${e.b}, ${e.a})`}),U=f(()=>O.customRepresentation?O.customRepresentation.fromHsvaToString({...B.val},O.allowAlpha):fe(V.value,O.allowAlpha,O.stringPrecision)),W=h(U.value);function xe(){W.value!==U.value&&(W.value=U.value)}function Se(e,t){if(!I)return;let n=I,{height:r,width:i}=e;n.clearRect(0,0,i,r);let a=n.createLinearGradient(0,0,0,r);a.addColorStop(0,`white`),a.addColorStop(1,`black`);let o=n.createLinearGradient(0,0,i,0);o.addColorStop(0,`hsla(${t} 100% 50% / 0)`),o.addColorStop(1,`hsla(${t} 100% 50% /1)`),n.fillStyle=a,n.fillRect(0,0,i,r),n.fillStyle=o,n.globalCompositeOperation=`multiply`,n.fillRect(0,0,i,r),n.globalCompositeOperation=`source-over`}function G(e,t,n,r=360){if(!t)return;let{height:i,width:a}=e;t.clearRect(0,0,a,i);let o=se(n)?n.length-1:r,s=t.createLinearGradient(0,0,a,0);for(let e=0;e<o+1;e++){let t=n instanceof Function?n(e):n[e];t===void 0&&_(),s.addColorStop(e/o,t)}t.fillStyle=s,t.fillRect(0,0,a,i)}function Ce(e,t,n=100,r=100,i=!1){let a=e/t,o=a*n,s=Math.round(o*r)/r,c={val:s,percent:n===r?s:Math.round(a*100*r)/r};return i&&(c.val=n-s),c}let K=h(``),q=!1;function J(e,t){requestAnimationFrame(()=>{if(t===``)return;let n=z[t]?.el.value;if(!n||!z[t])return;let{x:r,y:i,width:a,height:o}=n.getBoundingClientRect(),s=z[t];if(s.xKey!==void 0){let t=e.clientX-r;t=t<0?0:t>a?a:t;let n=Ce(t,a,s.xSteps??100);B.percent[s.xKey]=n.percent,B.val[s.xKey]=n.val}if(s.yKey!==void 0){let t=e.clientY-i;t=t<0?0:t>o?o:t;let n=Ce(t,o,s.ySteps??100,100,!0);B.percent[s.yKey]=n.percent,B.val[s.yKey]=n.val}})}let Y={keydown:(e,t)=>{if(ie(e.target),e.target?.getBoundingClientRect){if([`ArrowRight`,`ArrowLeft`,`ArrowUp`,`ArrowDown`].includes(e.key)){e.preventDefault();let{x:n,y:r,width:i,height:a}=e.target.getBoundingClientRect(),o=e.key===`ArrowRight`?1:e.key===`ArrowLeft`?-1:0,s=e.key===`ArrowUp`?-1:+(e.key===`ArrowDown`);e.shiftKey&&(o*=10),e.shiftKey&&(s*=10),J({clientX:n+i/2+o,clientY:r+a/2+s},t)}e.key===`Enter`&&(e.preventDefault(),Q())}},pointerdown:(e,t)=>{let n=`#${k} .color-picker--${t}-handle`,r=document.querySelector(n);r instanceof HTMLElement&&r.focus(),!q&&(e.preventDefault(),K.value=t,q=!0,document.addEventListener(`pointermove`,Y.pointermove),document.addEventListener(`pointerup`,Y.pointerup),J(e,K.value))},pointerleave:e=>{q&&e.preventDefault()},pointermove:e=>{e.preventDefault(),J(e,K.value)},pointerup:e=>{e.preventDefault(),q=!1,K.value=``,document.removeEventListener(`pointermove`,Y.pointermove),document.removeEventListener(`pointerup`,Y.pointerup)}};function X(e){if(F.value){let t=new y(`hsv`,[e.h,e.s,e.v],e.a).to(`hsl`),n=t.clone();n.alpha=0;let r=t.clone();r.alpha=1,G(F.value,R,[n.toString(),r.toString()])}G(P.value,L,e=>`hsl(${e} 100% 50%)`),Se(N.value,e.h)}function we(e){B.percent.h=Math.round(e.h/360*1e4)/100,B.percent.s=e.s,B.percent.v=100-e.v,B.percent.a=O.allowAlpha?e.a===void 0?1:e.a*100:1,B.val={...e,a:O.allowAlpha?e.a:1}}function Z(e){let t=S(e,O.allowAlpha);t&&(X(t),we(t))}function Q(){let e=C(B.val,O.allowAlpha);e&&(j.value=e,M.value=void 0,T(`save`,e))}function Te(e){let t=e.target?.value,n=O.customRepresentation?.fromStringToHsva?O.customRepresentation.fromStringToHsva(t):S(t,O.allowAlpha);n&&(X(n),we(n))}let $=!1;ee(()=>{Z(j.value),M.value!==void 0&&Z(M.value);let e=document.querySelector(`#${k} .color-picker--all-handle`);e instanceof HTMLElement&&e.focus(),I=N.value?.getContext(`2d`)??null,L=P.value?.getContext(`2d`)??null,R=F.value?.getContext(`2d`)??null}),a(j,()=>{Z(j.value)}),a(M,()=>{M.value!==void 0&&($=!0,Z(M.value),setTimeout(()=>{$=!1},0))}),a(B,()=>{if(X(B.val),W.value=U.value,$)return;let e=C(B.val,O.allowAlpha);e&&(M.value=e)});let Ee=f(()=>B.percent.v<50||B.val.a===void 0||B.val.a<.5);return(t,i)=>(ne(),u(`div`,{id:s(k),"aria-label":s(w)(`color-picker.aria`),class:c(s(b)(`color-picker
			[--_slider-size:calc(var(--spacing)_*_4)]
			[--_contrast-dark:var(--color-neutral-100)]
			[--_contrast-light:var(--color-neutral-800)]
			[--_fg:rgb(var(--_contrast-dark))]
			[--_bg:rgb(var(--_contrast-light))]
			[--slider-size:calc(var(--spacing)_*_4)]
			[--contrast-dark:var(--color-neutral-100)]
			[--contrast-light:var(--color-neutral-800)]
			[--fg:rgb(var(--contrast-dark,var(--_contrast-dark)))]
			[--bg:rgb(var(--contrast-light,var(--_contrast-light)))]
			max-w-[300px]
			flex flex-col items-center justify-center
			bg-neutral-50
			dark:bg-neutral-800
			gap-3
			p-3
		`,Ee.value&&`
			[--fg:rgb(var(--contrast-light,var(--_contrast-light)))]
			[--bg:rgb(var(--contrast-dark,var(--_contrast-dark)))]
			[--_fg:rgb(var(--_contrast-light))]
			[--_bg:rgb(var(--_contrast-dark))]
		`,e.border&&`
			border
			rounded-sm
			border-neutral-300
			dark:border-neutral-900
			shadow-md
			shadow-black/30
		`,s(v)?.class))},[l(`div`,{class:c(`color-picker--all-picker
			no-touch-action
			w-full
			aspect-square
			relative
			flex
			rounded-sm
			focus:border-accent-500
		`),onPointerdown:i[1]||=e=>Y.pointerdown(e,`all`),onPointerleave:i[2]||=e=>Y.pointerleave(e)},[l(`canvas`,{class:`size-full shadow-xs shadow-black/50 rounded-sm`,ref_key:`pickerEl`,ref:N},null,512),l(`div`,{role:`slider`,"aria-description":s(A),"aria-valuetext":`${s(w)(`color-picker.aria.saturation`)}: ${B.percent.s}, ${s(w)(`color-picker.aria.value`)}: ${B.percent.v}`,class:c(s(b)(`
					color-picker--all-handle
					${D}
					border-[var(--fg,var(--_fg))]
					hover:shadow-black
					active:shadow-black
				`)),tabindex:`0`,style:d(`
					left: calc(${B.percent.s}% - var(--slider-size,var(--_slider-size))/2);
					top: calc(${B.percent.v}% - var(--slider-size,var(--_slider-size))/2);
					background: ${H.value};
				`),onKeydown:i[0]||=e=>Y.keydown(e,`all`)},null,46,me)],32),l(`div`,{class:c(`color-picker--hue-slider ${E}`),onPointerdown:i[4]||=e=>Y.pointerdown(e,`hue`)},[l(`canvas`,{class:`size-full shadow-xs shadow-black/50 rounded-sm`,ref_key:`hueSliderEl`,ref:P},null,512),l(`div`,{role:`slider`,"aria-valuenow":`${B.percent.h}`,"aria-valuemin":0,"aria-valuemax":100,"aria-label":s(w)(`color-picker.aria.hue`),"aria-description":s(A),tabindex:`0`,class:c(`
				color-picker--hue-handle
				${D}
			`),style:d(`left: calc(${B.percent.h}% - var(--slider-size,var(--_slider-size))/2)`),onKeydown:i[3]||=e=>Y.keydown(e,`hue`)},null,46,he)],34),e.allowAlpha?(ne(),u(`div`,{key:0,class:c(`
			color-picker--alpha-slider
			${E}
		`),onPointerdown:i[6]||=e=>Y.pointerdown(e,`alpha`)},[l(`canvas`,{class:`size-full shadow-xs shadow-black/50 rounded-sm bg-transparency-squares`,ref_key:`alphaSliderEl`,ref:F},null,512),l(`div`,{role:`slider`,"aria-label":s(w)(`color-picker.aria.alpha-slider`),"aria-valuenow":`${B.percent.a}`,"aria-valuemin":0,"aria-valuemax":100,"aria-description":s(A),tabindex:`0`,class:c(`color-picker--alpha-handle ${D}`),style:d(`left: calc(${B.percent.a}% - var(--slider-size,var(--_slider-size))/2)`),onKeydown:i[5]||=e=>Y.keydown(e,`alpha`)},null,46,ge)],34)):re(``,!0),l(`div`,_e,[l(`div`,ve,[l(`div`,{class:`color-picker--footer--preview size-full rounded-full border-2 border-neutral-600 dark:border-neutral-300`,style:d(`background: ${H.value}`)},null,4)]),l(`div`,ye,[g(t.$slots,`input`,{},()=>[n(de,{valid:e.valid,class:`color-picker--input w-full`,"aria-label":e.label,modelValue:W.value,"onUpdate:modelValue":i[7]||=e=>W.value=e,onInput:Te,onBlur:xe},null,8,[`valid`,`aria-label`,`modelValue`]),n(x,{class:`color-picker--copy-button`,"aria-label":s(w)(`copy`),onClick:i[8]||=t=>s(oe)(e.copyTransform?.(B.val,U.value)??U.value)},{default:p(()=>[n(le,null,{default:p(()=>[n(s(ae))]),_:1})]),_:1},8,[`aria-label`])])])]),g(t.$slots,`buttons`,{},()=>[l(`div`,be,[n(x,{class:`color-picker--save-button`,onClick:i[9]||=e=>Q()},{default:p(()=>[r(m(s(w)(`save`)),1)]),_:1}),n(x,{class:`color-picker--cancel-button`,onClick:i[10]||=e=>T(`cancel`)},{default:p(()=>[r(m(s(w)(`cancel`)),1)]),_:1})])])],10,pe))}});export{O as n,T as t};