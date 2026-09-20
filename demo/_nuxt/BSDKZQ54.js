import{D as e,Ht as t,On as n,Zn as r,er as i,g as a,mt as o,nn as s,pn as c,qt as l,un as u,v as d,vn as f}from"./Car86Ubo.js";import{n as p}from"./C2_WwFDv.js";import{q as m}from"#entry";import{n as h}from"./g2lPe_Oy.js";import{n as g}from"./D9zOCwpr.js";import{n as _}from"./670Z9G4K.js";import{n as v}from"./BMYLPhcs.js";function y(e){let t=()=>{},n=s((n,r)=>(t=r,{get(){return n(),`_`in e.value?e.value._:e.value},set(t){e.set(t)}})),r=s(t=>({get(){return t(),e.css},set(){throw Error(`Cannot set CSS directly.`)}})),i={notify:()=>{t()}};return e.addDep(i),c(()=>{e.removeDep(i)}),{instance:e,ref:n,css:r}}var b=Object.assign({name:`WMetamorphosisControl`},{__name:`WMetamorphosisControl`,props:{controlVar:{type:Object,required:!0},rootProps:{type:Object,required:!1}},setup(s){let{ref:c,css:b}=y(s.controlVar),x=a(()=>{let e=b.value.toLowerCase();for(let t of[`rgb`,`hsl`,`hwb`,`lch`,`oklch`,`lab`,`oklab`])if(e.startsWith(t))return t;return null}),S=a(()=>typeof c.value==`number`),C=a(()=>b.value.includes(`/`)),w=f(!1),T=a(()=>{let e=x.value;return(()=>{if(e===null)return{r:0,g:0,b:0,a:void 0};let t=c.value;if(e===`rgb`)return{r:Math.round(t.r??0),g:Math.round(t.g??0),b:Math.round(t.b??0),a:t.a};let n,r;e===`hsl`?(n=[t.h??0,t.s??0,t.l??0],r=t.a):e===`hwb`?(n=[t.h??0,t.w??0,t.b??0],r=t.a):e===`lch`||e===`oklch`?(n=[t.l??0,t.c??0,t.h??0],r=t.a):e===`lab`||e===`oklab`?(n=[t.l??0,t.a??0,t.b??0],r=t.A):(n=[0,0,0],r=void 0);let i=new m(e,n,r??1),a=i.srgb;return{r:Math.round((a[0]??0)*255),g:Math.round((a[1]??0)*255),b:Math.round((a[2]??0)*255),a:i.alpha}})()}),E=f({...T.value});function D(e){A(e),w.value=!1}function O(){w.value=!1}function k(){w.value=!1}function A(e){let t=x.value;if(t===`rgb`)c.value={r:e.r,g:e.g,b:e.b,a:e.a};else{let n=new m(`srgb`,[e.r/255,e.g/255,e.b/255],e.a??1).to(t).coords,r=[n[0]??0,n[1]??0,n[2]??0],i={};t===`hsl`?(i.h=r[0],i.s=r[1],i.l=r[2]):t===`hwb`?(i.h=r[0],i.w=r[1],i.b=r[2]):t===`lch`||t===`oklch`?(i.l=r[0],i.c=r[1],i.h=r[2]):(t===`lab`||t===`oklab`)&&(i.l=r[0],i.a=r[1],i.b=r[2]),e.a!==void 0&&(i[t===`lab`||t===`oklab`?`A`:`a`]=e.a),c.value=i}}return t(T,()=>{E.value={...T.value}}),(t,a)=>x.value===null?S.value?(o(),d(p,{key:1,modelValue:n(c),"onUpdate:modelValue":a[3]||=e=>u(c)?c.value=e:null},null,8,[`modelValue`])):(o(),d(g,{key:2,modelValue:n(c),"onUpdate:modelValue":a[4]||=e=>u(c)?c.value=e:null},null,8,[`modelValue`])):(o(),d(v,{key:0,"root-props":{class:`
				metamorphosis-control--popover-root
			`,...s.rootProps},"content-props":{onInteractOutside:k,class:`
					[&_.popover--content-inner]:p-0
					[&_.popover--content-inner]:border-0
					[&_.popover--content-inner]:overflow-none
				`},modelValue:w.value,"onUpdate:modelValue":a[2]||=e=>w.value=e},{button:l(()=>[e(h,{border:!1,class:r(`
					metamorphosis-control--button
					border-transparent
					border-2
					outline-hidden
					focus:border-accent-500
					active:border-accent-500
					hover:border-accent-500
					w-4
					h-4
					rounded-sm
					cursor-pointer
				`),style:i(`background:${n(b)}`),onClick:a[0]||=e=>w.value=!0},null,8,[`style`])]),popover:l(()=>[e(_,{"allow-alpha":C.value,border:!1,modelValue:E.value,"onUpdate:modelValue":a[1]||=e=>E.value=e,onSave:D,onCancel:O},{buttons:l(()=>[...a[5]||=[]]),_:1},8,[`allow-alpha`,`modelValue`])]),_:1},8,[`root-props`,`content-props`,`modelValue`]))}});export{b as default};