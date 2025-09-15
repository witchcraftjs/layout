import{u as U,c as me}from"./CSdR9QoN.js";import{i as ge}from"./B9Vz3BzZ.js";import{C as V}from"./475SGCPX.js";import{I as he}from"./BJHjHy8t.js";import{u as be}from"./DW0TJ8U8.js";import{c as we}from"./CD0Jx8XC.js";import{t as ye}from"./CudCRF6p.js";import ke from"./b9rTLZqA.js";import X from"./CYLspzcf.js";import $e from"./CNP6MF_n.js";import{g as xe}from"./C0K3EOEW.js";import{H as re,I as Se,J as te,r as R,U as Ce,j as P,o as Ae,V as G,v as oe,x as le,y as g,M as Re,P as ne,S as D,T as k,N as f,A as S,B as M,C as ie,z as se}from"./9MspHWnN.js";import"./BhoX2VZY.js";import"./QnU64Ice.js";import"./B-RKKXbN.js";import"./CQ5ND8ze.js";function w(t,d,u){return t<=d?d:t>=u?u:t}function ce(t,d){try{const u=typeof t=="string"?new V(t):new V("srgb",[t.r/255,t.g/255,t.b/255],d?t.a:1),o=u.hsv;return!o||o[1]===void 0||o[2]===void 0?void 0:{h:w(o[0]??0,0,Number.MAX_SAFE_INTEGER),s:w(o[1],0,100),v:w(o[2],0,100),a:w(d?u.alpha:1,0,1)}}catch{return}}function Y(t,d){try{const u=typeof t=="string"?new V(t):new V("hsv",[t.h,t.s,t.v],d?t.a:1),o=u.srgb;return!o||o[0]===void 0||o[1]===void 0||o[2]===void 0?void 0:{r:w(o[0]/1*255,0,255),g:w(o[1]/1*255,0,255),b:w(o[2]/1*255,0,255),a:w(d?u.alpha:1,0,1)}}catch{return}}function B(t,d){const u=t.toFixed(d);return Number.parseFloat(u).toString()}function Ve(t,d,u){const o=B(t.r,u),$=B(t.g,u),i=B(t.b,u),C=t.a!==void 0?B(t.a,u):void 0;return d?`rgba(${o}, ${$}, ${i}, ${C})`:`rgb(${o}, ${$}, ${i})`}const qe=["id","aria-label"],Ee=["aria-description","aria-label"],Te=["aria-valuenow","aria-label","aria-description"],ze=["aria-label","aria-valuenow","aria-description"],Ke={class:"color-picker--footer flex w-full flex-1 gap-2"},Pe={class:"color-picker--preview-wrapper bg-transparency-squares relative aspect-square h-[calc(var(--slider-size)*3)] rounded-full shadow-xs"},De={class:"color-picker--input-group flex flex-1 items-center gap-2"},Me={class:"color-picker--save-cancel-group flex w-full items-center justify-center gap-2"},ue=`
	slider
	no-touch-action
	h-4
	w-full
	relative
	flex
`,J=`
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
`,_e=Object.assign({name:"LibColorPicker"},{__name:"WColorPicker",props:re({label:{type:String,required:!1},id:{type:String,required:!1},allowAlpha:{type:Boolean,required:!1,default:!0},stringPrecision:{type:Number,required:!1,default:3},customRepresentation:{type:Object,required:!1,default:void 0},border:{type:Boolean,required:!1,default:!0},copyTransform:{type:Function,required:!1,default:(t,d)=>d},valid:{type:Boolean,required:!1,default:!0}},{modelValue:{type:Object,required:!1,default:()=>({r:0,g:0,b:0})},modelModifiers:{},tempValue:{type:null,required:!1,default:()=>{}},tempValueModifiers:{}}),emits:re(["save","cancel"],["update:modelValue","update:tempValue"]),setup(t,{emit:d}){const u=Se(),o=be(),$=d,i=t,C=o("color-picker.aria.description"),I=xe(),q=te(t,"modelValue",{type:Object,required:!1,default:()=>({r:0,g:0,b:0})}),y=te(t,"tempValue",{type:null,required:!1,default:()=>{}}),L=R(null),N=R(null),E=R(null),F={hue:{el:N,xKey:"h",xSteps:360},alpha:{el:E,xSteps:1,xKey:"a"},all:{el:L,xSteps:100,ySteps:100,xKey:"s",yKey:"v"}},l=Ce({percent:{h:0,s:0,v:0,a:0},val:{h:0,s:0,v:0,a:0}}),W=P(()=>{const e=Y(l.val,i.allowAlpha);return e||U(),e}),Q=P(()=>{const e=W.value;return e||U(),`rgba(${e.r}, ${e.g}, ${e.b}, ${e.a})`}),x=P(()=>i.customRepresentation?i.customRepresentation.fromHsvaToString({...l.val},i.allowAlpha):Ve(W.value,i.allowAlpha,i.stringPrecision)),A=R(x.value);function de(){A.value!==x.value&&(A.value=x.value)}function pe(e,a){const r=e.getContext("2d"),{height:n,width:m}=e;r.clearRect(0,0,m,n);const p=r.createLinearGradient(0,0,0,n);p.addColorStop(0,"white"),p.addColorStop(1,"black");const v=r.createLinearGradient(0,0,m,0);v.addColorStop(0,`hsla(${a} 100% 50% / 0)`),v.addColorStop(1,`hsla(${a} 100% 50% /1)`),r.fillStyle=p,r.fillRect(0,0,m,n),r.fillStyle=v,r.globalCompositeOperation="multiply",r.fillRect(0,0,m,n),r.globalCompositeOperation="source-over"}function Z(e,a,r=360){const n=e.getContext("2d"),{height:m,width:p}=e;n.clearRect(0,0,p,m);const v=ge(a)?a.length-1:r,c=n.createLinearGradient(0,0,p,0);for(let s=0;s<v+1;s++){const b=a instanceof Function?a(s):a[s];b===void 0&&U(),c.addColorStop(s/v,b)}n.fillStyle=c,n.fillRect(0,0,p,m)}function _(e,a,r=100,n=100,m=!1){const p=e/a,v=p*r,c=Math.round(v*n)/n,s=r===n?c:Math.round(p*100*n)/n,b={val:c,percent:s};return m&&(b.val=r-c),b}const T=R("");let z=!1;function j(e,a){requestAnimationFrame(()=>{if(a==="")return;const r=F[a]?.el.value;if(!r||!F[a])return;const{x:n,y:m,width:p,height:v}=r.getBoundingClientRect(),c=F[a];if(c.xKey!==void 0){let s=e.clientX-n;s=s<0?0:s>p?p:s;const b=_(s,p,c.xSteps??100);l.percent[c.xKey]=b.percent,l.val[c.xKey]=b.val}if(c.yKey!==void 0){let s=e.clientY-m;s=s<0?0:s>v?v:s;const b=_(s,v,c.ySteps??100,100,!0);l.percent[c.yKey]=b.percent,l.val[c.yKey]=b.val}})}const h={keydown:(e,a)=>{if(me(e.target),e.target?.getBoundingClientRect){if(["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();const{x:r,y:n,width:m,height:p}=e.target.getBoundingClientRect();let v=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0,c=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;e.shiftKey&&(v*=10),e.shiftKey&&(c*=10),j({clientX:r+m/2+v,clientY:n+p/2+c},a)}e.key==="Enter"&&(e.preventDefault(),ae())}},pointerdown:(e,a)=>{const r=`#${i.id??I} .color-picker--${a}-handle`,n=document.querySelector(r);n instanceof HTMLElement&&n.focus(),!z&&(e.preventDefault(),T.value=a,z=!0,document.addEventListener("pointermove",h.pointermove),document.addEventListener("pointerup",h.pointerup),j(e,T.value))},pointerleave:e=>{z&&e.preventDefault()},pointermove:e=>{e.preventDefault(),j(e,T.value)},pointerup:e=>{e.preventDefault(),z=!1,T.value="",document.removeEventListener("pointermove",h.pointermove),document.removeEventListener("pointerup",h.pointerup)}};function H(e){if(E.value){const a=new V("hsv",[e.h,e.s,e.v],e.a).to("hsl"),r=a.clone();r.alpha=0;const n=a.clone();n.alpha=1,Z(E.value,[r.toString(),n.toString()])}Z(N.value,a=>`hsl(${a} 100% 50%)`),pe(L.value,e.h)}function ee(e){l.percent.h=Math.round(e.h/360*1e4)/100,l.percent.s=e.s,l.percent.v=100-e.v,l.percent.a=i.allowAlpha&&e.a!==void 0?e.a*100:1,l.val={...e,a:i.allowAlpha?e.a:1}}function K(e){const a=ce(e,i.allowAlpha);a&&(H(a),ee(a))}function ae(){const e=Y(l.val,i.allowAlpha);e&&(q.value=e,y.value=void 0,$("save",e))}function fe(e){const a=e.target?.value,r=i.customRepresentation?.fromStringToHsva?i.customRepresentation.fromStringToHsva(a):ce(a,i.allowAlpha);r&&(H(r),ee(r))}let O=!1;Ae(()=>{K(q.value),y.value!==void 0&&K(y.value);const e=document.querySelector(`#${i.id??I} .color-picker--all-handle`);e instanceof HTMLElement&&e.focus()}),G(q,()=>{K(q.value)}),G(y,()=>{y.value!==void 0&&(O=!0,K(y.value),setTimeout(()=>{O=!1},0))}),G(l,()=>{if(H(l.val),A.value=x.value,O)return;const e=Y(l.val,i.allowAlpha);e&&(y.value=e)});const ve=P(()=>l.percent.v<50||l.val.a===void 0||l.val.a<.5);return(e,a)=>(le(),oe("div",{id:t.id??f(I),"aria-label":f(o)("color-picker.aria"),class:k(f(ye)(`color-picker
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
		`,ve.value&&`
			[--fg:rgb(var(--contrast-light))]
			[--bg:rgb(var(--contrast-dark))]
		`,t.border&&`
			border rounded-sm border-neutral-600
		`,f(u)?.class))},[g("div",{class:k(`color-picker--all-picker
			no-touch-action
			w-full
			aspect-square
			relative
			flex
			rounded-sm
			focus:border-accent-500
		`),onPointerdown:a[1]||(a[1]=r=>h.pointerdown(r,"all")),onPointerleave:a[2]||(a[2]=r=>h.pointerleave(r))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm",ref_key:"pickerEl",ref:L},null,512),g("div",{"aria-live":"assertive","aria-description":f(C),"aria-label":`${f(o)("color-picker.aria.saturation")}: ${l.percent.s}, ${f(o)("color-picker.aria.value")}: ${l.percent.s}`,class:k(`
					color-picker--all-handle
					${J}
					border-[var(--fg)]
					hover:shadow-black
					active:shadow-black
				`),tabindex:"0",style:D(`
					left: calc(${l.percent.s}% - var(--slider-size)/2);
					top: calc(${l.percent.v}% - var(--slider-size)/2);
					background: ${Q.value};
				`),onKeydown:a[0]||(a[0]=r=>h.keydown(r,"all"))},null,46,Ee)],32),g("div",{class:k(`color-picker--hue-slider ${ue}`),onPointerdown:a[4]||(a[4]=r=>h.pointerdown(r,"hue"))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm",ref_key:"hueSliderEl",ref:N},null,512),g("div",{role:"slider","aria-valuenow":`${l.percent.h}`,"aria-valuemin":0,"aria-valuemax":100,"aria-label":f(o)("color-picker.aria.hue"),"aria-description":f(C),tabindex:"0",class:k(`
				color-picker--hue-handle
				${J}
			`),style:D(`left: calc(${l.percent.h}% - var(--slider-size)/2)`),onKeydown:a[3]||(a[3]=r=>h.keydown(r,"hue"))},null,46,Te)],34),t.allowAlpha?(le(),oe("div",{key:0,class:k(`
			color-picker--alpha-slider
			${ue}
		`),onPointerdown:a[6]||(a[6]=r=>h.pointerdown(r,"alpha"))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm bg-transparency-squares",ref_key:"alphaSliderEl",ref:E},null,512),g("div",{role:"slider","aria-label":f(o)("color-picker.aria.alpha-slider"),"aria-valuenow":`${l.percent.h}`,"aria-valuemin":0,"aria-valuemax":100,"aria-description":f(C),tabindex:"0",class:k(`color-picker--alpha-handle ${J}`),style:D(`left: calc(${l.percent.a}% - var(--slider-size)/2)`),onKeydown:a[5]||(a[5]=r=>h.keydown(r,"alpha"))},null,46,ze)],34)):Re("",!0),g("div",Ke,[g("div",Pe,[g("div",{class:"color-picker--footer--preview size-full rounded-full border-2 border-neutral-600 dark:border-neutral-300",style:D(`background: ${Q.value}`)},null,4)]),g("div",De,[ne(e.$slots,"input",{},()=>[S($e,{valid:t.valid,class:"color-picker--input w-full","aria-label":t.label,modelValue:A.value,"onUpdate:modelValue":a[7]||(a[7]=r=>A.value=r),onInput:fe,onBlur:de},null,8,["valid","aria-label","modelValue"]),S(X,{class:"color-picker--copy-button","aria-label":f(o)("copy"),onClick:a[8]||(a[8]=r=>f(we)(t.copyTransform?.(l.val,x.value)??x.value))},{default:M(()=>[S(ke,null,{default:M(()=>[S(f(he))]),_:1})]),_:1},8,["aria-label"])])])]),ne(e.$slots,"buttons",{},()=>[g("div",Me,[S(X,{class:"color-picker--save-button",onClick:a[9]||(a[9]=r=>ae())},{default:M(()=>[ie(se(f(o)("save")),1)]),_:1}),S(X,{class:"color-picker--cancel-button",onClick:a[10]||(a[10]=r=>$("cancel"))},{default:M(()=>[ie(se(f(o)("cancel")),1)]),_:1})])])],10,qe))}});export{_e as default};
