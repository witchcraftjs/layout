import{H as q,I as A,J as E,K as S,j as $,L as k,r as x,M as m,x as d,B as f,N as T,O as h,v as F,P,Q as l,_ as L,R as B,S as W,y as b,T as I,U as j,V as D,W as M,X as R}from"#entry";import H from"./L2Zxy4VX.js";import J from"./CWxUrIsD.js";import"./DbBM7WX3.js";import"./DtnwhoB0.js";import"./DgeF6Nu6.js";import"./CQ5ND8ze.js";const N={directiveName:"extract-root-el",mounted(e,{value:s}){s(e)},unmounted(e,{value:s}){s(null)},getSSRProps(){return{}}},K={class:"color-input--swatch-wrapper flex w-full"},Q={class:"color-input--popup-wrapper p-5"},p=`
	color-input--swatch
	after:content-vertical-holder
	min-w-4
	flex-1
	relative
	before:content-['']
	before:absolute
	before:inset-0
	before:bg-transparency-squares
	before:z-[-1]
`,le=Object.assign({name:"LibColorInput"},{__name:"WColorInput",props:q({label:{type:String,required:!1},id:{type:String,required:!1},allowAlpha:{type:Boolean,required:!1,default:!0},border:{type:Boolean,required:!1,default:!0},copyTransform:{type:Function,required:!1,default:(e,s)=>s},stringPrecision:{type:Number,required:!1,default:3},customRepresentation:{type:Object,required:!1,default:void 0}},{modelValue:{type:Object,required:!1,default:()=>({r:0,g:0,b:0})},modelModifiers:{},tempValue:{type:null,required:!1,default:()=>{}},tempValueModifiers:{}}),emits:q(["save","cancel"],["update:modelValue","update:tempValue"]),setup(e,{emit:s}){const g=T(),w=A(),c=s;function O(){r.value=i.value,t.value=!1,a.value=void 0,c("save")}function z(){t.value=!1,a.value=void 0,c("cancel")}const y=E(),r=S(e,"modelValue",{type:Object,required:!1,default:()=>({r:0,g:0,b:0})}),a=S(e,"tempValue",{type:null,required:!1,default:()=>{}}),n=$(()=>new k("srgb",[r.value.r/255,r.value.g/255,r.value.b/255],r.value.a??1).toString()),V=$(()=>a.value?new k("srgb",[a.value.r/255,a.value.g/255,a.value.b/255],a.value.a??1).toString():""),i=x({...r.value}),t=x(!1),U=()=>{t.value&&(r.value=i.value),t.value=!t.value};return(C,o)=>(d(),m(J,{class:"color-input--popup",modelValue:t.value,"onUpdate:modelValue":o[2]||(o[2]=u=>t.value=u),onClose:o[3]||(o[3]=u=>{a.value=void 0,c("cancel")})},{button:f(({extractEl:u})=>[h((d(),m(L,B({id:e.id??l(g),class:l(W)(`
				p-0
				color-input--button
				flex flex-nowrap
				min-w-4
				overflow-hidden
				[&_.button--label]:items-stretch
				[&_.button--label]:gap-0
				after:hidden
			`,l(y).class),"aria-label":l(w)("color-input.aria-and-title-prefix")+n.value,title:l(w)("color-input.aria-and-title-prefix")+n.value},{...l(y),class:void 0},{onClick:U}),{label:f(()=>[b("div",K,[I(C.$slots,"default",j(D({stringColor:n.value,classes:p})),()=>[b("div",{class:R(p),style:M(`background:${n.value}`)},null,4)]),a.value?I(C.$slots,"temp",j(B({key:0},{tempStringColor:V.value,classes:p})),()=>[b("div",{class:R(p),style:M(`background:${V.value}`)},null,4)]):P("",!0)])]),_:3},16,["id","class","aria-label","title"])),[[l(N),u]])]),popup:f(({extractEl:u})=>[h((d(),F("div",Q,[t.value?(d(),m(H,{key:0,id:e.id??l(g),"allow-alpha":e.allowAlpha,"custom-representation":e.customRepresentation,"string-precision":e.stringPrecision,modelValue:i.value,"onUpdate:modelValue":o[0]||(o[0]=v=>i.value=v),"temp-value":a.value,"onUpdate:tempValue":o[1]||(o[1]=v=>a.value=v),onSave:O,onCancel:z},null,8,["id","allow-alpha","custom-representation","string-precision","modelValue","temp-value"])):P("",!0)])),[[l(N),u]])]),_:3},8,["modelValue"]))}});export{le as default};
