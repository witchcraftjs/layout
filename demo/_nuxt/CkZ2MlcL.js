import{C as q,w,aT as me,b5 as we,aX as ye,b6 as oe,ax as V,ao as ke,bh as G,G as ne,z as g,al as L,aj as k,aR as d,B as xe,aA as ie,aP as $e,af as se,x as B,av as Se,v as Ce,a6 as Ae,aQ as U,as as ce,K as S,t as Re,bl as I,W as Ve,I as qe,y as Ee,s as W,J as ue,aJ as de}from"./BIYrkOIG.js";function ve(t,f){try{const p=typeof t=="string"?new q(t):new q("srgb",[t.r/255,t.g/255,t.b/255],f?t.a:1),r=p.hsv;return!r||r[1]===void 0||r[2]===void 0?void 0:{h:w(r[0]??0,0,Number.MAX_SAFE_INTEGER),s:w(r[1],0,100),v:w(r[2],0,100),a:w(f?p.alpha:1,0,1)}}catch{return}}function Y(t,f){try{const p=typeof t=="string"?new q(t):new q("hsv",[t.h,t.s,t.v],f?t.a:1),r=p.srgb;return!r||r[0]===void 0||r[1]===void 0||r[2]===void 0?void 0:{r:w(r[0]/1*255,0,255),g:w(r[1]/1*255,0,255),b:w(r[2]/1*255,0,255),a:w(f?p.alpha:1,0,1)}}catch{return}}function M(t,f){const p=t.toFixed(f);return Number.parseFloat(p).toString()}function Te(t,f,p){const r=M(t.r,p),x=M(t.g,p),s=M(t.b,p),C=t.a!==void 0?M(t.a,p):void 0;return f?`rgba(${r}, ${x}, ${s}, ${C})`:`rgb(${r}, ${x}, ${s})`}const Ke=["id","aria-label"],ze=["aria-description","aria-valuetext"],Pe=["aria-valuenow","aria-label","aria-description"],De=["aria-label","aria-valuenow","aria-description"],Le={class:"color-picker--footer flex w-full flex-1 gap-2"},Be={class:"color-picker--preview-wrapper bg-transparency-squares relative aspect-square h-[calc(var(--slider-size)*3)] rounded-full shadow-xs"},Ie={class:"color-picker--input-group flex flex-1 items-center gap-2"},Me={class:"color-picker--save-cancel-group flex w-full items-center justify-center gap-2"},pe=`
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
`,je=Object.assign({name:"WColorPicker"},{__name:"WColorPicker",props:se({id:{type:String,required:!1},label:{type:String,required:!1},allowAlpha:{type:Boolean,required:!1,default:!0},stringPrecision:{type:Number,required:!1,default:3},customRepresentation:{type:Object,required:!1,default:void 0},border:{type:Boolean,required:!1,default:!0},copyTransform:{type:Function,required:!1,default:(t,f)=>f},valid:{type:Boolean,required:!1,default:!0}},{modelValue:{type:Object,required:!1,default:()=>({r:0,g:0,b:0})},modelModifiers:{},tempValue:{type:null,required:!1,default:()=>{}},tempValueModifiers:{}}),emits:se(["save","cancel"],["update:modelValue","update:tempValue"]),setup(t,{emit:f}){const p=me(),r=we(),x=f,s=t,C=ye(s),N=r("color-picker.aria.description"),E=oe(t,"modelValue",{type:Object,required:!1,default:()=>({r:0,g:0,b:0})}),y=oe(t,"tempValue",{type:null,required:!1,default:()=>{}}),T=V(null),K=V(null),A=V(null);let j=null,Q=null,Z=null;const F={hue:{el:K,xKey:"h",xSteps:360},alpha:{el:A,xSteps:1,xKey:"a"},all:{el:T,xSteps:100,ySteps:100,xKey:"s",yKey:"v"}},o=Se({percent:{h:0,s:0,v:0,a:0},val:{h:0,s:0,v:0,a:0}}),_=B(()=>{const e=Y(o.val,s.allowAlpha);return e||U(),e}),ee=B(()=>{const e=_.value;return e||U(),`rgba(${e.r}, ${e.g}, ${e.b}, ${e.a})`}),$=B(()=>s.customRepresentation?s.customRepresentation.fromHsvaToString({...o.val},s.allowAlpha):Te(_.value,s.allowAlpha,s.stringPrecision)),R=V($.value);function fe(){R.value!==$.value&&(R.value=$.value)}function he(e,a){if(!j)return;const l=j,{height:n,width:h}=e;l.clearRect(0,0,h,n);const u=l.createLinearGradient(0,0,0,n);u.addColorStop(0,"white"),u.addColorStop(1,"black");const v=l.createLinearGradient(0,0,h,0);v.addColorStop(0,`hsla(${a} 100% 50% / 0)`),v.addColorStop(1,`hsla(${a} 100% 50% /1)`),l.fillStyle=u,l.fillRect(0,0,h,n),l.fillStyle=v,l.globalCompositeOperation="multiply",l.fillRect(0,0,h,n),l.globalCompositeOperation="source-over"}function ae(e,a,l,n=360){if(!a)return;const{height:h,width:u}=e;a.clearRect(0,0,u,h);const v=Ae(l)?l.length-1:n,c=a.createLinearGradient(0,0,u,0);for(let i=0;i<v+1;i++){const m=l instanceof Function?l(i):l[i];m===void 0&&U(),c.addColorStop(i/v,m)}a.fillStyle=c,a.fillRect(0,0,u,h)}function le(e,a,l=100,n=100,h=!1){const u=e/a,v=u*l,c=Math.round(v*n)/n,i=l===n?c:Math.round(u*100*n)/n,m={val:c,percent:i};return h&&(m.val=l-c),m}const z=V("");let P=!1;function H(e,a){requestAnimationFrame(()=>{if(a==="")return;const l=F[a]?.el.value;if(!l||!F[a])return;const{x:n,y:h,width:u,height:v}=l.getBoundingClientRect(),c=F[a];if(c.xKey!==void 0){let i=e.clientX-n;i=i<0?0:i>u?u:i;const m=le(i,u,c.xSteps??100);o.percent[c.xKey]=m.percent,o.val[c.xKey]=m.val}if(c.yKey!==void 0){let i=e.clientY-h;i=i<0?0:i>v?v:i;const m=le(i,v,c.ySteps??100,100,!0);o.percent[c.yKey]=m.percent,o.val[c.yKey]=m.val}})}const b={keydown:(e,a)=>{if(Ce(e.target),e.target?.getBoundingClientRect){if(["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();const{x:l,y:n,width:h,height:u}=e.target.getBoundingClientRect();let v=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0,c=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;e.shiftKey&&(v*=10),e.shiftKey&&(c*=10),H({clientX:l+h/2+v,clientY:n+u/2+c},a)}e.key==="Enter"&&(e.preventDefault(),re())}},pointerdown:(e,a)=>{const l=`#${C} .color-picker--${a}-handle`,n=document.querySelector(l);n instanceof HTMLElement&&n.focus(),!P&&(e.preventDefault(),z.value=a,P=!0,document.addEventListener("pointermove",b.pointermove),document.addEventListener("pointerup",b.pointerup),H(e,z.value))},pointerleave:e=>{P&&e.preventDefault()},pointermove:e=>{e.preventDefault(),H(e,z.value)},pointerup:e=>{e.preventDefault(),P=!1,z.value="",document.removeEventListener("pointermove",b.pointermove),document.removeEventListener("pointerup",b.pointerup)}};function O(e){if(A.value){const a=new q("hsv",[e.h,e.s,e.v],e.a).to("hsl"),l=a.clone();l.alpha=0;const n=a.clone();n.alpha=1,ae(A.value,Z,[l.toString(),n.toString()])}ae(K.value,Q,a=>`hsl(${a} 100% 50%)`),he(T.value,e.h)}function te(e){o.percent.h=Math.round(e.h/360*1e4)/100,o.percent.s=e.s,o.percent.v=100-e.v,o.percent.a=s.allowAlpha&&e.a!==void 0?e.a*100:1,o.val={...e,a:s.allowAlpha?e.a:1}}function D(e){const a=ve(e,s.allowAlpha);a&&(O(a),te(a))}function re(){const e=Y(o.val,s.allowAlpha);e&&(E.value=e,y.value=void 0,x("save",e))}function ge(e){const a=e.target?.value,l=s.customRepresentation?.fromStringToHsva?s.customRepresentation.fromStringToHsva(a):ve(a,s.allowAlpha);l&&(O(l),te(l))}let X=!1;ke(()=>{D(E.value),y.value!==void 0&&D(y.value);const e=document.querySelector(`#${C} .color-picker--all-handle`);e instanceof HTMLElement&&e.focus(),j=T.value?.getContext("2d")??null,Q=K.value?.getContext("2d")??null,Z=A.value?.getContext("2d")??null}),G(E,()=>{D(E.value)}),G(y,()=>{y.value!==void 0&&(X=!0,D(y.value),setTimeout(()=>{X=!1},0))}),G(o,()=>{if(O(o.val),R.value=$.value,X)return;const e=Y(o.val,s.allowAlpha);e&&(y.value=e)});const be=B(()=>o.percent.v<50||o.val.a===void 0||o.val.a<.5);return(e,a)=>(ce(),ne("div",{id:d(C),"aria-label":d(r)("color-picker.aria"),class:k(d($e)(`color-picker
			[--slider-size:calc(var(--spacing)_*_4)]
			[--contrast-dark:var(--color-neutral-100)]
			[--contrast-light:var(--color-neutral-800)]
			[--fg:rgb(var(--contrast-dark))]
			[--bg:rgb(var(--contrast-light))]
			max-w-[300px]
			flex flex-col items-center justify-center
			bg-neutral-50
			dark:bg-neutral-800
			gap-3
			p-3
		`,be.value&&`
			[--fg:rgb(var(--contrast-light))]
			[--bg:rgb(var(--contrast-dark))]
		`,t.border&&`
			border
			rounded-sm
			border-neutral-300
			dark:border-neutral-900
			shadow-md
			shadow-black/30
		`,d(p)?.class))},[g("div",{class:k(`color-picker--all-picker
			no-touch-action
			w-full
			aspect-square
			relative
			flex
			rounded-sm
			focus:border-accent-500
		`),onPointerdown:a[1]||(a[1]=l=>b.pointerdown(l,"all")),onPointerleave:a[2]||(a[2]=l=>b.pointerleave(l))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm",ref_key:"pickerEl",ref:T},null,512),g("div",{role:"slider","aria-description":d(N),"aria-valuetext":`${d(r)("color-picker.aria.saturation")}: ${o.percent.s}, ${d(r)("color-picker.aria.value")}: ${o.percent.v}`,class:k(`
					color-picker--all-handle
					${J}
					border-[var(--fg)]
					hover:shadow-black
					active:shadow-black
				`),tabindex:"0",style:L(`
					left: calc(${o.percent.s}% - var(--slider-size)/2);
					top: calc(${o.percent.v}% - var(--slider-size)/2);
					background: ${ee.value};
				`),onKeydown:a[0]||(a[0]=l=>b.keydown(l,"all"))},null,46,ze)],32),g("div",{class:k(`color-picker--hue-slider ${pe}`),onPointerdown:a[4]||(a[4]=l=>b.pointerdown(l,"hue"))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm",ref_key:"hueSliderEl",ref:K},null,512),g("div",{role:"slider","aria-valuenow":`${o.percent.h}`,"aria-valuemin":0,"aria-valuemax":100,"aria-label":d(r)("color-picker.aria.hue"),"aria-description":d(N),tabindex:"0",class:k(`
				color-picker--hue-handle
				${J}
			`),style:L(`left: calc(${o.percent.h}% - var(--slider-size)/2)`),onKeydown:a[3]||(a[3]=l=>b.keydown(l,"hue"))},null,46,Pe)],34),t.allowAlpha?(ce(),ne("div",{key:0,class:k(`
			color-picker--alpha-slider
			${pe}
		`),onPointerdown:a[6]||(a[6]=l=>b.pointerdown(l,"alpha"))},[g("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm bg-transparency-squares",ref_key:"alphaSliderEl",ref:A},null,512),g("div",{role:"slider","aria-label":d(r)("color-picker.aria.alpha-slider"),"aria-valuenow":`${o.percent.a}`,"aria-valuemin":0,"aria-valuemax":100,"aria-description":d(N),tabindex:"0",class:k(`color-picker--alpha-handle ${J}`),style:L(`left: calc(${o.percent.a}% - var(--slider-size)/2)`),onKeydown:a[5]||(a[5]=l=>b.keydown(l,"alpha"))},null,46,De)],34)):xe("",!0),g("div",Le,[g("div",Be,[g("div",{class:"color-picker--footer--preview size-full rounded-full border-2 border-neutral-600 dark:border-neutral-300",style:L(`background: ${ee.value}`)},null,4)]),g("div",Ie,[ie(e.$slots,"input",{},()=>[S(Re,{valid:t.valid,class:"color-picker--input w-full","aria-label":t.label,modelValue:R.value,"onUpdate:modelValue":a[7]||(a[7]=l=>R.value=l),onInput:ge,onBlur:fe},null,8,["valid","aria-label","modelValue"]),S(W,{class:"color-picker--copy-button","aria-label":d(r)("copy"),onClick:a[8]||(a[8]=l=>d(Ee)(t.copyTransform?.(o.val,$.value)??$.value))},{default:I(()=>[S(Ve,null,{default:I(()=>[S(d(qe))]),_:1})]),_:1},8,["aria-label"])])])]),ie(e.$slots,"buttons",{},()=>[g("div",Me,[S(W,{class:"color-picker--save-button",onClick:a[9]||(a[9]=l=>re())},{default:I(()=>[ue(de(d(r)("save")),1)]),_:1}),S(W,{class:"color-picker--cancel-button",onClick:a[10]||(a[10]=l=>x("cancel"))},{default:I(()=>[ue(de(d(r)("cancel")),1)]),_:1})])])],10,Ke))}});export{je as default};
