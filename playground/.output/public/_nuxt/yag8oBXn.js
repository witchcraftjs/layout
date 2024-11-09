import{w as g,L as C}from"./Bnf_lRQy.js";import{d as $,M as k,N as y,O as x,P as B,i as P,r as v,t as d,Q as p,A as m,R as c,S as o,T as b,K as M,U as S,V as A,x as w,W as N,X as q,Y as z,Z as L,$ as R,B as T}from"./Cr7bJNLf.js";import"./C8y7k1hF.js";import"./DWuLgtwn.js";const U={class:"color-label whitespace-nowrap pr-2"},D=$({name:"lib-color-input",__name:"LibColorInput",props:k({label:{},id:{},allowAlpha:{type:Boolean,default:!0},border:{type:Boolean,default:!0},copyTransform:{type:Function,default:(f,s)=>s}},{modelValue:{required:!1,default:()=>({r:0,g:0,b:0})},modelModifiers:{}}),emits:["update:modelValue"],setup(f){y();const s=x(),t=B(f,"modelValue"),n=P(()=>g(t.value).toRgbString()),r=v({...t.value}),a=v(!1),V=()=>{a.value&&(t.value=r.value),a.value=!a.value};return(u,e)=>(d(),p(R,{modelValue:a.value,"onUpdate:modelValue":e[3]||(e[3]=l=>a.value=l)},{button:m(({extractEl:l})=>[c((d(),p(M,S({id:u.id,class:o(A)(`
				flex flex-nowrap
			`,o(s).class),"aria-label":n.value,title:n.value},{...o(s),class:void 0},{onClick:V}),{default:m(()=>[w("span",U,[N(u.$slots,"default",{},()=>[e[4]||(e[4]=T("Pick Color"))])]),w("div",{class:q(`color-swatch
						rounded-sm
						px-1
						flex-1
						h-4
						w-8
						relative
						aspect-square
						before:content-['']
						before:absolute
						before:inset-0
						before:bg-transparency-squares
						before:z-[-1]
					`),style:z(`background:${n.value}`)},null,4)]),_:2},1040,["id","class","aria-label","title"])),[[o(b),l]])]),popup:m(({extractEl:l})=>[a.value?c((d(),p(C,{key:0,id:u.id,"allow-alpha":u.allowAlpha,modelValue:r.value,"onUpdate:modelValue":e[0]||(e[0]=i=>r.value=i),onSave:e[1]||(e[1]=i=>{t.value=r.value,a.value=!1}),onCancel:e[2]||(e[2]=i=>a.value=!1)},null,8,["id","allow-alpha","modelValue"])),[[o(b),l]]):L("",!0)]),_:3},8,["modelValue"]))}});export{D as default};
