import{C as q}from"./475SGCPX.js";import{u as E}from"./DW0TJ8U8.js";import{t as T}from"./CudCRF6p.js";import U from"./CYLspzcf.js";import F from"./CiuX0mzt.js";import L from"./DbI8HASn.js";import{g as D}from"./C0K3EOEW.js";import{H as S,I as H,J as $,j as k,r as x,K as v,x as p,B as f,L as h,v as J,M as P,N as l,O as B,y as b,P as I,Q as j,R as K,S as M,T as R}from"./9MspHWnN.js";import"./BhoX2VZY.js";import"./QnU64Ice.js";import"./CSdR9QoN.js";import"./B9Vz3BzZ.js";import"./BJHjHy8t.js";import"./CD0Jx8XC.js";import"./b9rTLZqA.js";import"./CNP6MF_n.js";import"./B-RKKXbN.js";import"./CQ5ND8ze.js";const N={directiveName:"extract-root-el",mounted(e,{value:r}){r(e)},unmounted(e,{value:r}){r(null)},getSSRProps(){return{}}},Q={class:"color-input--swatch-wrapper flex w-full"},W={class:"color-input--popup-wrapper p-5"},d=`
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
`,ce=Object.assign({name:"LibColorInput"},{__name:"WColorInput",props:S({label:{type:String,required:!1},id:{type:String,required:!1},allowAlpha:{type:Boolean,required:!1,default:!0},border:{type:Boolean,required:!1,default:!0},copyTransform:{type:Function,required:!1,default:(e,r)=>r},stringPrecision:{type:Number,required:!1,default:3},customRepresentation:{type:Object,required:!1,default:void 0}},{modelValue:{type:Object,required:!1,default:()=>({r:0,g:0,b:0})},modelModifiers:{},tempValue:{type:null,required:!1,default:()=>{}},tempValueModifiers:{}}),emits:S(["save","cancel"],["update:modelValue","update:tempValue"]),setup(e,{emit:r}){const g=D(),w=E(),m=r;function O(){s.value=n.value,t.value=!1,a.value=void 0,m("save")}function z(){t.value=!1,a.value=void 0,m("cancel")}const y=H(),s=$(e,"modelValue",{type:Object,required:!1,default:()=>({r:0,g:0,b:0})}),a=$(e,"tempValue",{type:null,required:!1,default:()=>{}}),i=k(()=>new q("srgb",[s.value.r/255,s.value.g/255,s.value.b/255],s.value.a??1).toString()),V=k(()=>a.value?new q("srgb",[a.value.r/255,a.value.g/255,a.value.b/255],a.value.a??1).toString():""),n=x({...s.value}),t=x(!1),A=()=>{t.value&&(s.value=n.value),t.value=!t.value};return(C,o)=>(p(),v(L,{class:"color-input--popup",modelValue:t.value,"onUpdate:modelValue":o[2]||(o[2]=u=>t.value=u),onClose:o[3]||(o[3]=u=>{a.value=void 0,m("cancel")})},{button:f(({extractEl:u})=>[h((p(),v(U,B({id:e.id??l(g),class:l(T)(`
				p-0
				color-input--button
				flex flex-nowrap
				min-w-4
				overflow-hidden
				[&_.button--label]:items-stretch
				[&_.button--label]:gap-0
				after:hidden
			`,l(y).class),"aria-label":l(w)("color-input.aria-and-title-prefix")+i.value,title:l(w)("color-input.aria-and-title-prefix")+i.value},{...l(y),class:void 0},{onClick:A}),{label:f(()=>[b("div",Q,[I(C.$slots,"default",j(K({stringColor:i.value,classes:d})),()=>[b("div",{class:R(d),style:M(`background:${i.value}`)},null,4)]),a.value?I(C.$slots,"temp",j(B({key:0},{tempStringColor:V.value,classes:d})),()=>[b("div",{class:R(d),style:M(`background:${V.value}`)},null,4)]):P("",!0)])]),_:3},16,["id","class","aria-label","title"])),[[l(N),u]])]),popup:f(({extractEl:u})=>[h((p(),J("div",W,[t.value?(p(),v(F,{key:0,id:e.id??l(g),"allow-alpha":e.allowAlpha,"custom-representation":e.customRepresentation,"string-precision":e.stringPrecision,modelValue:n.value,"onUpdate:modelValue":o[0]||(o[0]=c=>n.value=c),"temp-value":a.value,"onUpdate:tempValue":o[1]||(o[1]=c=>a.value=c),onSave:O,onCancel:z},null,8,["id","allow-alpha","custom-representation","string-precision","modelValue","temp-value"])):P("",!0)])),[[l(N),u]])]),_:3},8,["modelValue"]))}});export{ce as default};
