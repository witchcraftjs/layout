import{bb as y,bc as D,i as V,a4 as O,$ as g,E as w,a9 as j,an as _,k as C,_ as x,l as f,z as k,D as M,a1 as z,ab as A,Z as N,ac as $}from"./DqUrqeTS.js";import W from"./761fADFe.js";import q from"./DCP0btbb.js";import"./jFYhBC76.js";import"./DW2FntB1.js";import"./C4UEL9rT.js";import"./kRIii9yh.js";function B(a){let b=()=>{};const l=y((d,m)=>(b=m,{get(){return d(),"_"in a.value?a.value._:a.value},set(u){a.set(u)}})),p=y(d=>({get(){return d(),a.css},set(){throw new Error("Cannot set CSS directly.")}})),i={notify:()=>{b()}};return a.addDep(i),D(()=>{a.removeDep(i)}),{instance:a,ref:l,css:p}}const H=Object.assign({name:"WMetamorphosisControl"},{__name:"WMetamorphosisControl",props:{controlVar:{type:Object,required:!0},rootProps:{type:Object,required:!1}},setup(a){const b=a,{ref:l,css:p}=B(b.controlVar),i=f(()=>{const r=p.value.toLowerCase(),o=["rgb","hsl","hwb","lch","oklch","lab","oklab"];for(const e of o)if(r.startsWith(e))return e;return null}),d=f(()=>typeof l.value=="number"),m=f(()=>p.value.includes("/")),u=V(!1),v=f(()=>{const r=i.value;return(()=>{if(r===null)return{r:0,g:0,b:0,a:void 0};const e=l.value;if(r==="rgb")return{r:Math.round(e.r??0),g:Math.round(e.g??0),b:Math.round(e.b??0),a:e.a};let c,n;r==="hsl"?(c=[e.h??0,e.s??0,e.l??0],n=e.a):r==="hwb"?(c=[e.h??0,e.w??0,e.b??0],n=e.a):r==="lch"||r==="oklch"?(c=[e.l??0,e.c??0,e.h??0],n=e.a):r==="lab"||r==="oklab"?(c=[e.l??0,e.a??0,e.b??0],n=e.A):(c=[0,0,0],n=void 0);const s=new $(r,c,n??1),t=s.srgb;return{r:Math.round((t[0]??0)*255),g:Math.round((t[1]??0)*255),b:Math.round((t[2]??0)*255),a:s.alpha}})()}),h=V({...v.value});function R(r){U(r),u.value=!1}function S(){u.value=!1}function P(){u.value=!1}function U(r){const o=i.value;if(o==="rgb")l.value={r:r.r,g:r.g,b:r.b,a:r.a};else{const n=new $("srgb",[r.r/255,r.g/255,r.b/255],r.a??1).to(o).coords,s=[n[0]??0,n[1]??0,n[2]??0],t={};o==="hsl"?(t.h=s[0],t.s=s[1],t.l=s[2]):o==="hwb"?(t.h=s[0],t.w=s[1],t.b=s[2]):o==="lch"||o==="oklch"?(t.l=s[0],t.c=s[1],t.h=s[2]):(o==="lab"||o==="oklab")&&(t.l=s[0],t.a=s[1],t.b=s[2]),r.a!==void 0&&(t[o==="lab"||o==="oklab"?"A":"a"]=r.a),l.value=t}}return O(v,()=>{h.value={...v.value}}),(r,o)=>i.value!==null?(k(),g(j,{key:0,"root-props":{class:`
				metamorphosis-control--popover-root
			`,...a.rootProps},"content-props":{onInteractOutside:P,class:`
					[&_.popover--content-inner]:p-0
					[&_.popover--content-inner]:border-0
					[&_.popover--content-inner]:overflow-none
				`},modelValue:u.value,"onUpdate:modelValue":o[2]||(o[2]=e=>u.value=e)},{button:w(()=>[M(z,{border:!1,class:N(`
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
				`),style:A(`background:${C(p)}`),onClick:o[0]||(o[0]=e=>u.value=!0)},null,8,["style"])]),popover:w(()=>[M(W,{"allow-alpha":m.value,border:!1,modelValue:h.value,"onUpdate:modelValue":o[1]||(o[1]=e=>h.value=e),onSave:R,onCancel:S},{buttons:w(()=>[...o[5]||(o[5]=[])]),_:1},8,["allow-alpha","modelValue"])]),_:1},8,["root-props","content-props","modelValue"])):d.value?(k(),g(q,{key:1,modelValue:C(l),"onUpdate:modelValue":o[3]||(o[3]=e=>_(l)?l.value=e:null)},null,8,["modelValue"])):(k(),g(x,{key:2,modelValue:C(l),"onUpdate:modelValue":o[4]||(o[4]=e=>_(l)?l.value=e:null)},null,8,["modelValue"]))}});export{H as default};
