import{ac as V,be as w,Y as we,X as ke,K as ye,L as oe,i as R,o as $e,a4 as X,A as ne,B as h,ab as L,Z as y,k as u,N as ie,Q as xe,O as se,R as ce,l as P,bf as Se,bg as Ce,bh as Ae,a7 as U,z as ue,D as S,_ as ze,E as B,W as Re,b6 as Ve,b5 as qe,a1 as Y,F as de,C as ve}from"./CXTw713-.js";function pe(t,f){try{const p=typeof t=="string"?new V(t):new V("srgb",[t.r/255,t.g/255,t.b/255],f?t.a:1),l=p.hsv;return!l||l[1]===void 0||l[2]===void 0?void 0:{h:w(l[0]??0,0,Number.MAX_SAFE_INTEGER),s:w(l[1],0,100),v:w(l[2],0,100),a:w(f?p.alpha:1,0,1)}}catch{return}}function G(t,f){try{const p=typeof t=="string"?new V(t):new V("hsv",[t.h,t.s,t.v],f?t.a:1),l=p.srgb;return!l||l[0]===void 0||l[1]===void 0||l[2]===void 0?void 0:{r:w(l[0]/1*255,0,255),g:w(l[1]/1*255,0,255),b:w(l[2]/1*255,0,255),a:w(f?p.alpha:1,0,1)}}catch{return}}function M(t,f){const p=t.toFixed(f);return Number.parseFloat(p).toString()}function Ee(t,f,p){const l=M(t.r,p),$=M(t.g,p),s=M(t.b,p),C=t.a!==void 0?M(t.a,p):void 0;return f?`rgba(${l}, ${$}, ${s}, ${C})`:`rgb(${l}, ${$}, ${s})`}const Te=["id","aria-label"],Ke=["aria-description","aria-valuetext"],_e=["aria-valuenow","aria-label","aria-description"],De=["aria-label","aria-valuenow","aria-description"],Le={class:"color-picker--footer flex w-full flex-1 gap-2"},Pe={class:"color-picker--preview-wrapper bg-transparency-squares relative aspect-square h-[calc(var(--slider-size,var(--_slider-size))*3)] rounded-full shadow-xs"},Be={class:"color-picker--input-group flex flex-1 items-center gap-2"},Me={class:"color-picker--save-cancel-group flex w-full items-center justify-center gap-2"},fe=`
	slider
	no-touch-action
	h-4
	w-full
	relative
	flex
`,W=`
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
`,Ne=Object.assign({name:"WColorPicker"},{__name:"WColorPicker",props:ce({id:{type:String,required:!1},label:{type:String,required:!1},allowAlpha:{type:Boolean,required:!1,default:!0},stringPrecision:{type:Number,required:!1,default:3},customRepresentation:{type:Object,required:!1,default:void 0},border:{type:Boolean,required:!1,default:!0},copyTransform:{type:Function,required:!1,default:(t,f)=>f},valid:{type:Boolean,required:!1,default:!0}},{modelValue:{type:Object,required:!1,default:()=>({r:0,g:0,b:0})},modelModifiers:{},tempValue:{type:null,required:!1,default:()=>{}},tempValueModifiers:{}}),emits:ce(["save","cancel"],["update:modelValue","update:tempValue"]),setup(t,{emit:f}){const p=we(),l=ke(),$=f,s=t,C=ye(s),I=l("color-picker.aria.description"),q=oe(t,"modelValue",{type:Object,required:!1,default:()=>({r:0,g:0,b:0})}),k=oe(t,"tempValue",{type:null,required:!1,default:()=>{}}),E=R(null),T=R(null),A=R(null);let N=null,Q=null,Z=null;const F={hue:{el:T,xKey:"h",xSteps:360},alpha:{el:A,xSteps:1,xKey:"a"},all:{el:E,xSteps:100,ySteps:100,xKey:"s",yKey:"v"}},o=Se({percent:{h:0,s:0,v:0,a:0},val:{h:0,s:0,v:0,a:0}}),J=P(()=>{const e=G(o.val,s.allowAlpha);return e||U(),e}),ee=P(()=>{const e=J.value;return e||U(),`rgba(${e.r}, ${e.g}, ${e.b}, ${e.a})`}),x=P(()=>s.customRepresentation?s.customRepresentation.fromHsvaToString({...o.val},s.allowAlpha):Ee(J.value,s.allowAlpha,s.stringPrecision)),z=R(x.value);function ge(){z.value!==x.value&&(z.value=x.value)}function he(e,a){if(!N)return;const r=N,{height:n,width:g}=e;r.clearRect(0,0,g,n);const d=r.createLinearGradient(0,0,0,n);d.addColorStop(0,"white"),d.addColorStop(1,"black");const v=r.createLinearGradient(0,0,g,0);v.addColorStop(0,`hsla(${a} 100% 50% / 0)`),v.addColorStop(1,`hsla(${a} 100% 50% /1)`),r.fillStyle=d,r.fillRect(0,0,g,n),r.fillStyle=v,r.globalCompositeOperation="multiply",r.fillRect(0,0,g,n),r.globalCompositeOperation="source-over"}function ae(e,a,r,n=360){if(!a)return;const{height:g,width:d}=e;a.clearRect(0,0,d,g);const v=Ae(r)?r.length-1:n,c=a.createLinearGradient(0,0,d,0);for(let i=0;i<v+1;i++){const m=r instanceof Function?r(i):r[i];m===void 0&&U(),c.addColorStop(i/v,m)}a.fillStyle=c,a.fillRect(0,0,d,g)}function re(e,a,r=100,n=100,g=!1){const d=e/a,v=d*r,c=Math.round(v*n)/n,i=r===n?c:Math.round(d*100*n)/n,m={val:c,percent:i};return g&&(m.val=r-c),m}const K=R("");let _=!1;function j(e,a){requestAnimationFrame(()=>{if(a==="")return;const r=F[a]?.el.value;if(!r||!F[a])return;const{x:n,y:g,width:d,height:v}=r.getBoundingClientRect(),c=F[a];if(c.xKey!==void 0){let i=e.clientX-n;i=i<0?0:i>d?d:i;const m=re(i,d,c.xSteps??100);o.percent[c.xKey]=m.percent,o.val[c.xKey]=m.val}if(c.yKey!==void 0){let i=e.clientY-g;i=i<0?0:i>v?v:i;const m=re(i,v,c.ySteps??100,100,!0);o.percent[c.yKey]=m.percent,o.val[c.yKey]=m.val}})}const b={keydown:(e,a)=>{if(Ce(e.target),e.target?.getBoundingClientRect){if(["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(e.key)){e.preventDefault();const{x:r,y:n,width:g,height:d}=e.target.getBoundingClientRect();let v=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0,c=e.key==="ArrowUp"?-1:e.key==="ArrowDown"?1:0;e.shiftKey&&(v*=10),e.shiftKey&&(c*=10),j({clientX:r+g/2+v,clientY:n+d/2+c},a)}e.key==="Enter"&&(e.preventDefault(),le())}},pointerdown:(e,a)=>{const r=`#${C} .color-picker--${a}-handle`,n=document.querySelector(r);n instanceof HTMLElement&&n.focus(),!_&&(e.preventDefault(),K.value=a,_=!0,document.addEventListener("pointermove",b.pointermove),document.addEventListener("pointerup",b.pointerup),j(e,K.value))},pointerleave:e=>{_&&e.preventDefault()},pointermove:e=>{e.preventDefault(),j(e,K.value)},pointerup:e=>{e.preventDefault(),_=!1,K.value="",document.removeEventListener("pointermove",b.pointermove),document.removeEventListener("pointerup",b.pointerup)}};function H(e){if(A.value){const a=new V("hsv",[e.h,e.s,e.v],e.a).to("hsl"),r=a.clone();r.alpha=0;const n=a.clone();n.alpha=1,ae(A.value,Z,[r.toString(),n.toString()])}ae(T.value,Q,a=>`hsl(${a} 100% 50%)`),he(E.value,e.h)}function te(e){o.percent.h=Math.round(e.h/360*1e4)/100,o.percent.s=e.s,o.percent.v=100-e.v,o.percent.a=s.allowAlpha&&e.a!==void 0?e.a*100:1,o.val={...e,a:s.allowAlpha?e.a:1}}function D(e){const a=pe(e,s.allowAlpha);a&&(H(a),te(a))}function le(){const e=G(o.val,s.allowAlpha);e&&(q.value=e,k.value=void 0,$("save",e))}function be(e){const a=e.target?.value,r=s.customRepresentation?.fromStringToHsva?s.customRepresentation.fromStringToHsva(a):pe(a,s.allowAlpha);r&&(H(r),te(r))}let O=!1;$e(()=>{D(q.value),k.value!==void 0&&D(k.value);const e=document.querySelector(`#${C} .color-picker--all-handle`);e instanceof HTMLElement&&e.focus(),N=E.value?.getContext("2d")??null,Q=T.value?.getContext("2d")??null,Z=A.value?.getContext("2d")??null}),X(q,()=>{D(q.value)}),X(k,()=>{k.value!==void 0&&(O=!0,D(k.value),setTimeout(()=>{O=!1},0))}),X(o,()=>{if(H(o.val),z.value=x.value,O)return;const e=G(o.val,s.allowAlpha);e&&(k.value=e)});const me=P(()=>o.percent.v<50||o.val.a===void 0||o.val.a<.5);return(e,a)=>(ue(),ne("div",{id:u(C),"aria-label":u(l)("color-picker.aria"),class:y(u(ie)(`color-picker
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
		`,me.value&&`
			[--fg:rgb(var(--contrast-light,var(--_contrast-light)))]
			[--bg:rgb(var(--contrast-dark,var(--_contrast-dark)))]
			[--_fg:rgb(var(--_contrast-light))]
			[--_bg:rgb(var(--_contrast-dark))]
		`,t.border&&`
			border
			rounded-sm
			border-neutral-300
			dark:border-neutral-900
			shadow-md
			shadow-black/30
		`,u(p)?.class))},[h("div",{class:y(`color-picker--all-picker
			no-touch-action
			w-full
			aspect-square
			relative
			flex
			rounded-sm
			focus:border-accent-500
		`),onPointerdown:a[1]||(a[1]=r=>b.pointerdown(r,"all")),onPointerleave:a[2]||(a[2]=r=>b.pointerleave(r))},[h("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm",ref_key:"pickerEl",ref:E},null,512),h("div",{role:"slider","aria-description":u(I),"aria-valuetext":`${u(l)("color-picker.aria.saturation")}: ${o.percent.s}, ${u(l)("color-picker.aria.value")}: ${o.percent.v}`,class:y(u(ie)(`
					color-picker--all-handle
					${W}
					border-[var(--fg,var(--_fg))]
					hover:shadow-black
					active:shadow-black
				`)),tabindex:"0",style:L(`
					left: calc(${o.percent.s}% - var(--slider-size,var(--_slider-size))/2);
					top: calc(${o.percent.v}% - var(--slider-size,var(--_slider-size))/2);
					background: ${ee.value};
				`),onKeydown:a[0]||(a[0]=r=>b.keydown(r,"all"))},null,46,Ke)],32),h("div",{class:y(`color-picker--hue-slider ${fe}`),onPointerdown:a[4]||(a[4]=r=>b.pointerdown(r,"hue"))},[h("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm",ref_key:"hueSliderEl",ref:T},null,512),h("div",{role:"slider","aria-valuenow":`${o.percent.h}`,"aria-valuemin":0,"aria-valuemax":100,"aria-label":u(l)("color-picker.aria.hue"),"aria-description":u(I),tabindex:"0",class:y(`
				color-picker--hue-handle
				${W}
			`),style:L(`left: calc(${o.percent.h}% - var(--slider-size,var(--_slider-size))/2)`),onKeydown:a[3]||(a[3]=r=>b.keydown(r,"hue"))},null,46,_e)],34),t.allowAlpha?(ue(),ne("div",{key:0,class:y(`
			color-picker--alpha-slider
			${fe}
		`),onPointerdown:a[6]||(a[6]=r=>b.pointerdown(r,"alpha"))},[h("canvas",{class:"size-full shadow-xs shadow-black/50 rounded-sm bg-transparency-squares",ref_key:"alphaSliderEl",ref:A},null,512),h("div",{role:"slider","aria-label":u(l)("color-picker.aria.alpha-slider"),"aria-valuenow":`${o.percent.a}`,"aria-valuemin":0,"aria-valuemax":100,"aria-description":u(I),tabindex:"0",class:y(`color-picker--alpha-handle ${W}`),style:L(`left: calc(${o.percent.a}% - var(--slider-size,var(--_slider-size))/2)`),onKeydown:a[5]||(a[5]=r=>b.keydown(r,"alpha"))},null,46,De)],34)):xe("",!0),h("div",Le,[h("div",Pe,[h("div",{class:"color-picker--footer--preview size-full rounded-full border-2 border-neutral-600 dark:border-neutral-300",style:L(`background: ${ee.value}`)},null,4)]),h("div",Be,[se(e.$slots,"input",{},()=>[S(ze,{valid:t.valid,class:"color-picker--input w-full","aria-label":t.label,modelValue:z.value,"onUpdate:modelValue":a[7]||(a[7]=r=>z.value=r),onInput:be,onBlur:ge},null,8,["valid","aria-label","modelValue"]),S(Y,{class:"color-picker--copy-button","aria-label":u(l)("copy"),onClick:a[8]||(a[8]=r=>u(qe)(t.copyTransform?.(o.val,x.value)??x.value))},{default:B(()=>[S(Re,null,{default:B(()=>[S(u(Ve))]),_:1})]),_:1},8,["aria-label"])])])]),se(e.$slots,"buttons",{},()=>[h("div",Me,[S(Y,{class:"color-picker--save-button",onClick:a[9]||(a[9]=r=>le())},{default:B(()=>[de(ve(u(l)("save")),1)]),_:1}),S(Y,{class:"color-picker--cancel-button",onClick:a[10]||(a[10]=r=>$("cancel"))},{default:B(()=>[de(ve(u(l)("cancel")),1)]),_:1})])])],10,Te))}});export{Ne as default};
