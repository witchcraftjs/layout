import{K as V,V as w,H as te,I as me,J as re,r as R,W as ge,j as D,X as U,o as he,Y as X,v as le,x as oe,y as g,N as be,Q as ne,T as L,U as k,O as d,Z as we,_ as ye,A as S,B as P,C as ie,z as se}from"./DVXjeaI0.js";import{I as ke}from"./B_5QWUUs.js";import{u as $e}from"./CJMfQ0aH.js";import{c as xe}from"./CD0Jx8XC.js";import{t as Se}from"./DeCVlzJk.js";import Ce from"./CoDCRfl4.js";import Y from"./BOOMfXGw.js";import Ae from"./BFhMFwn2.js";import{g as Re}from"./BpX0FRyY.js";import"./Bk2TiR2_.js";import"./yRW9QxNd.js";import"./DiEt9e2A.js";import"./CQ5ND8ze.js";function ce(r,f){try{const v=typeof r=="string"?new V(r):new V("srgb",[r.r/255,r.g/255,r.b/255],f?r.a:1),l=v.hsv;return!l||l[1]===void 0||l[2]===void 0?void 0:{h:w(l[0]??0,0,Number.MAX_SAFE_INTEGER),s:w(l[1],0,100),v:w(l[2],0,100),a:w(f?v.alpha:1,0,1)}}catch{return}}function G(r,f){try{const v=typeof r=="string"?new V(r):new V("hsv",[r.h,r.s,r.v],f?r.a:1),l=v.srgb;return!l||l[0]===void 0||l[1]===void 0||l[2]===void 0?void 0:{r:w(l[0]/1*255,0,255),g:w(l[1]/1*255,0,255),b:w(l[2]/1*255,0,255),a:w(f?v.alpha:1,0,1)}}catch{return}}function B(r,f){const v=r.toFixed(f);return Number.parseFloat(v).toString()}function Ve(r,f,v){const l=B(r.r,v),$=B(r.g,v),i=B(r.b,v),C=r.a!==void 0?B(r.a,v):void 0;return f?`rgba(${l}, ${$}, ${i}, ${C})`:`rgb(${l}, ${$}, ${i})`}const qe=["id","aria-label"],Ee=["aria-description","aria-label"],Te=["aria-valuenow","aria-label","aria-description"],Ke=["aria-label","aria-valuenow","aria-description"],ze={class:"color-picker--footer flex w-full flex-1 gap-2"},De={class:"color-picker--preview-wrapper bg-transparency-squares relative aspect-square h-[calc(var(--slider-size)*3)] rounded-full shadow-xs"},Le={class:"color-picker--input-group flex flex-1 items-center gap-2"},Pe={class:"color-picker--save-cancel-group flex w-full items-center justify-center gap-2"},ue=`
	slider
	no-touch-action
	h-4
	w-full
	relative
	flex
`,W=`
	handle
	h-[var(--slider-size)]
	w-[var(--slider-size)]
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
`,Je=Object.assign({name:"LibColorPicker"},{__name:"WColorPicker",props:te({label:{type:String,required:!1},id:{type:String,required:!1},allowAlpha:{type:Boolean,required:!1,default:!0},stringPrecision:{type:Number,required:!1,default:3},customRepresentation:{type:Object,required:!1,default:void 0},border:{type:Boolean,required:!1,default:!0},copyTransform:{type:Function,required:!1,default:(r,f)=>f},valid:{type:Boolean,required:!1,default:!0}},{modelValue:{type:Object,required:!1,default:()=>({r:0,g:0,b:0})},modelModifiers:{},tempValue:{type:null,required:!1,default:()=>{}},tempValueModifiers:{}}),emits:te(["save","cancel"],["update:modelValue","update:tempValue"]),setup(r,{emit:f}){const v=me(),l=$e(),$=f,i=r,C=l("color-picker.aria.description"),I=Re(),q=re(r,"modelValue",{type:Object,required:!1,default:()=>({r:0,g:0,b:0})}),y=re(r,"tempValue",{type:null,required:!1,default:()=>{}}),M=R(null),N=R(null),E=R(null),F={hue:{el:N,xKey:"h",xSteps:360},alpha:{el:E,xSteps:1,xKey:"a"},all:{el:M,xSteps:100,ySteps:100,xKey:"s",yKey:"v"}},o=ge({percent:{h:0,s:0,v:0,a:0},val:{h:0,s:0,v:0,a:0}}),J=D(()=>{const e=G(o.val,i.allowAlpha);return e||U(),e}),Q=D(()=>{const e=J.value;return e||U(),`rgba(${e.r}, ${e.g}, ${e.b}, ${e.a})`}),x=D(()=>i.customRepresentation?i.customRepresentation.fromHsvaToString({...o.val},i.allowAlpha):Ve(J.value,i.allowAlpha,i.stringPrecision)),A=R(x.value);function de(){A.value!==x.value&&(A.value=x.value)}function pe(e,a){const t=e.getContext("2d"),{height:n,width:m}=e;t.clearRect(0,0,m,n);const u=t.createLinearGradient(0,0,0,n);u.addColorStop(0,"white"),u.addColorStop(1,"black");const p=t.createLinearGradient(0,0,m,0);p.addColorStop(0,`hsla(${a} 100% 50% / 0)`),p.addColorStop(1,`hsla(${a} 100% 50% /1)`),t.fillStyle=u,t.fillRect(0,0,m,n),t.fillStyle=p,t.globalCompositeOperation="multiply",t.fillRect(0,0,m,n),t.globalCompositeOperation="source-over"}function Z(e,a,t=360){const n=e.getContext("2d"),{height:m,width:u}=e;n.clearRect(0,0,u,m);const p=ye(a)?a.length-1:t,c=n.createLinearGradient(0,0,u,0);for(let s=0;s<p+1;s++){const b=a instanceof Function?a(s):a[s];b===void 0&&U(),c.addColorStop(s/p,b)}n.fillStyle=c,n.fillRect(0,0,u,m)}function _(e,a,t=100,n=100,m=!1){const u=e/a,p=u*t,c=Math.round(p*n)/n,s=t===n?c:Math.round(u*100*n)/n,b={val:c,percent:s};return m&&(b.val=t-c),b}const T=R("");let K=!1;function j(e,a){requestAnimationFrame(()=>{if(a==="")return;const t=F[a]?.el.value;if(!t||!F[a])return;const{x:n,y:m,width:u,height:p}=t.getBoundingClientRect(),c=F[a];if(c.xKey!==void 0){let s=e.clientX-n;s=s<0?0:s>u?u:s;const b=_(s,u,c.xSteps??100);o.percent[c.xKey]=b.percent,o.val[c.xKey]=b.val}if(c.yKey!==void 0){let s=e.clientY-m;s=s<0?0:s>p?p:s;const b=_(s,p,c.ySteps??100,100,!0);o.percent[c.yKey]=b.percent,o.val[c.yKey]=b.val}})}const h={keydown:(e,a)=>{if(we(e.target),e.target?.getBoundingClientRect){if(["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();const{x:t,y:n,width:m,height:u}=e.target.getBoundingClientRect();let p=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0,c=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;e.shiftKey&&(p*=10),e.shiftKey&&(c*=10),j({clientX:t+m/2+p,clientY:n+u/2+c},a)}e.key==="Enter"&&(e.preventDefault(),ae())}},pointerdown:(e,a)=>{const t=`#${i.id??I} .color-picker--${a}-handle`,n=document.querySelector(t);n instanceof HTMLElement&&n.focus(),!K&&(e.preventDefault(),T.value=a,K=!0,document.addEventListener("pointermove",h.pointermove),document.addEventListener("pointerup",h.pointerup),j(e,T.value))},pointerleave:e=>{K&&e.preventDefault()},pointermove:e=>{e.preventDefault(),j(e,T.value)},pointerup:e=>{e.preventDefault(),K=!1,T.value="",document.removeEventListener("pointermove",h.pointermove),document.removeEventListener("pointerup",h.pointerup)}};function H(e){if(E.value){const a=new V("hsv",[e.h,e.s,e.v],e.a).to("hsl"),t=a.clone();t.alpha=0;const n=a.clone();n.alpha=1,Z(E.value,[t.toString(),n.toString()])}Z(N.value,a=>`hsl(${a} 100% 50%)`),pe(M.value,e.h)}function ee(e){o.percent.h=Math.round(e.h/360*1e4)/100,o.percent.s=e.s,o.percent.v=100-e.v,o.percent.a=i.allowAlpha&&e.a!==void 0?e.a*100:1,o.val={...e,a:i.allowAlpha?e.a:1}}function z(e){const a=ce(e,i.allowAlpha);a&&(H(a),ee(a))}function ae(){const e=G(o.val,i.allowAlpha);e&&(q.value=e,y.value=void 0,$("save",e))}function ve(e){const a=e.target?.value,t=i.customRepresentation?.fromStringToHsva?i.customRepresentation.fromStringToHsva(a):ce(a,i.allowAlpha);t&&(H(t),ee(t))}let O=!1;he(()=>{z(q.value),y.value!==void 0&&z(y.value);const e=document.querySelector(`#${i.id??I} .color-picker--all-handle`);e instanceof HTMLElement&&e.focus()}),X(q,()=>{z(q.value)}),X(y,()=>{y.value!==void 0&&(O=!0,z(y.value),setTimeout(()=>{O=!1},0))}),X(o,()=>{if(H(o.val),A.value=x.value,O)return;const e=G(o.val,i.allowAlpha);e&&(y.value=e)});const fe=D(()=>o.percent.v<50||o.val.a===void 0||o.val.a<.5);return(e,a)=>(oe(),le("div",{id:r.id??d(I),"aria-label":d(l)("color-picker.aria"),class:k(d(Se)(`color-picker
			[--slider-size:calc(var(--spacing)_*_4)]
			[--contrast-dark:var(--color-neutral-100)]
			[--contrast-light:var(--color-neutral-800)]
			[--fg:rgb(var(--contrast-dark))]
			[--bg:rgb(var(--contrast-light))]
			max-w-[300px]
			flex flex-col items-center justify-center
			bg-neutral-50
			dark:bg-neutral-950
			gap-3
			p-3
		`,fe.value&&`
			[--fg:rgb(var(--contrast-light))]
			[--bg:rgb(var(--contrast-dark))]
		`,r.border&&`
			border rounded-sm border-neutral-600
		`,d(v)?.class))},[g("div",{class:k(`color-picker--all-picker
			no-touch-action
			w-full
			aspect-square
			relative
			flex
			rounded-sm
			focus:border-accent-500
		`),onPointerdown:a[1]||(a[1]=t=>h.pointerdown(t,"all")),onPointerleave:a[2]||(a[2]=t=>h.pointerleave(t))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm",ref_key:"pickerEl",ref:M},null,512),g("div",{"aria-live":"assertive","aria-description":d(C),"aria-label":`${d(l)("color-picker.aria.saturation")}: ${o.percent.s}, ${d(l)("color-picker.aria.value")}: ${o.percent.s}`,class:k(`
					color-picker--all-handle
					${W}
					border-[var(--fg)]
					hover:shadow-black
					active:shadow-black
				`),tabindex:"0",style:L(`
					left: calc(${o.percent.s}% - var(--slider-size)/2);
					top: calc(${o.percent.v}% - var(--slider-size)/2);
					background: ${Q.value};
				`),onKeydown:a[0]||(a[0]=t=>h.keydown(t,"all"))},null,46,Ee)],32),g("div",{class:k(`color-picker--hue-slider ${ue}`),onPointerdown:a[4]||(a[4]=t=>h.pointerdown(t,"hue"))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm",ref_key:"hueSliderEl",ref:N},null,512),g("div",{role:"slider","aria-valuenow":`${o.percent.h}`,"aria-valuemin":0,"aria-valuemax":100,"aria-label":d(l)("color-picker.aria.hue"),"aria-description":d(C),tabindex:"0",class:k(`
				color-picker--hue-handle
				${W}
			`),style:L(`left: calc(${o.percent.h}% - var(--slider-size)/2)`),onKeydown:a[3]||(a[3]=t=>h.keydown(t,"hue"))},null,46,Te)],34),r.allowAlpha?(oe(),le("div",{key:0,class:k(`
			color-picker--alpha-slider
			${ue}
		`),onPointerdown:a[6]||(a[6]=t=>h.pointerdown(t,"alpha"))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm bg-transparency-squares",ref_key:"alphaSliderEl",ref:E},null,512),g("div",{role:"slider","aria-label":d(l)("color-picker.aria.alpha-slider"),"aria-valuenow":`${o.percent.h}`,"aria-valuemin":0,"aria-valuemax":100,"aria-description":d(C),tabindex:"0",class:k(`color-picker--alpha-handle ${W}`),style:L(`left: calc(${o.percent.a}% - var(--slider-size)/2)`),onKeydown:a[5]||(a[5]=t=>h.keydown(t,"alpha"))},null,46,Ke)],34)):be("",!0),g("div",ze,[g("div",De,[g("div",{class:"color-picker--footer--preview size-full rounded-full border-2 border-neutral-600 dark:border-neutral-300",style:L(`background: ${Q.value}`)},null,4)]),g("div",Le,[ne(e.$slots,"input",{},()=>[S(Ae,{valid:r.valid,class:"color-picker--input w-full","aria-label":r.label,modelValue:A.value,"onUpdate:modelValue":a[7]||(a[7]=t=>A.value=t),onInput:ve,onBlur:de},null,8,["valid","aria-label","modelValue"]),S(Y,{class:"color-picker--copy-button","aria-label":d(l)("copy"),onClick:a[8]||(a[8]=t=>d(xe)(r.copyTransform?.(o.val,x.value)??x.value))},{default:P(()=>[S(Ce,null,{default:P(()=>[S(d(ke))]),_:1})]),_:1},8,["aria-label"])])])]),ne(e.$slots,"buttons",{},()=>[g("div",Pe,[S(Y,{class:"color-picker--save-button",onClick:a[9]||(a[9]=t=>ae())},{default:P(()=>[ie(se(d(l)("save")),1)]),_:1}),S(Y,{class:"color-picker--cancel-button",onClick:a[10]||(a[10]=t=>$("cancel"))},{default:P(()=>[ie(se(d(l)("cancel")),1)]),_:1})])])],10,qe))}});export{Je as default};
