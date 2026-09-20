import{n as e}from"./Cfpk3IOQ.js";import{$ as t,$n as n,D as r,E as i,Ft as a,On as o,Zn as s,_ as c,ct as l,et as u,k as d,mt as f,qt as p,tr as m,v as h,xt as g,y as _,z as v}from"./Car86Ubo.js";import{t as y}from"./bvfhAA2m.js";import{t as b}from"./DHwUhbJe.js";import{t as x}from"./BSpQifn5.js";import{A as S,M as C,N as w,O as T,j as E,k as D}from"#entry";import{t as O}from"./JCXPeO0D.js";import{n as k}from"./g2lPe_Oy.js";var A=d({__name:`DialogClose`,props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1,default:`button`}},setup(e){let t=e;x();let n=w();return(e,r)=>(f(),h(o(y),u(t,{type:e.as===`button`?`button`:void 0,onClick:r[0]||=e=>o(n).onOpenChange(!1)}),{default:p(()=>[g(e.$slots,`default`)]),_:3},16,[`type`]))}}),j=d({__name:`DialogPortal`,props:{to:{type:null,required:!1},disabled:{type:Boolean,required:!1},defer:{type:Boolean,required:!1},forceMount:{type:Boolean,required:!1}},setup(e){let t=e;return(e,r)=>(f(),h(o(b),n(v(t)),{default:p(()=>[g(e.$slots,`default`)]),_:3},16))}}),M=d({__name:`DialogTrigger`,props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1,default:`button`}},setup(t){let n=t,r=w(),{forwardRef:i,currentElement:a}=x();return r.contentId||=e(void 0,`reka-dialog-content`),l(()=>{r.triggerElement.value=a.value}),(e,t)=>(f(),h(o(y),u(n,{ref:o(i),type:e.as===`button`?`button`:void 0,"aria-haspopup":`dialog`,"aria-expanded":o(r).open.value||!1,"aria-controls":o(r).open.value?o(r).contentId:void 0,"data-state":o(r).open.value?`open`:`closed`,onClick:o(r).onOpenToggle}),{default:p(()=>[g(e.$slots,`default`)]),_:3},16,[`type`,`aria-expanded`,`aria-controls`,`data-state`,`onClick`]))}}),N=Object.assign({name:`WPopup`,inheritAttrs:!1},{__name:`WPopup`,props:t({title:{type:String,required:!1},description:{type:String,required:!1},backdropClass:{type:String,required:!1},contentProps:{type:Object,required:!1},rootProps:{type:Object,required:!1},to:{type:String,required:!1,default:`#root`},unstyle:{type:Boolean,required:!1}},{modelValue:{type:Boolean,default:!1},modelModifiers:{}}),emits:[`update:modelValue`],setup(e){let t=a(e,`modelValue`,{type:Boolean,default:!1});return(n,a)=>(f(),h(o(C),u(e.rootProps,{open:t.value,"onUpdate:open":a[1]||=e=>t.value=e}),{default:p(()=>[n.$slots.button?(f(),h(o(M),{key:0,"as-child":``},{default:p(()=>[g(n.$slots,`button`)]),_:3})):_(``,!0),r(o(j),{to:e.to},{default:p(()=>[r(o(D),{"as-child":``},{default:p(()=>[g(n.$slots,`backdrop`,{class:`popup--backdrop absolute inset-0 bg-black/50`},()=>[a[2]||=c(`div`,{class:`popup--backdrop absolute inset-0 bg-black/50`},null,-1)])]),_:3}),r(o(E),u({...e.contentProps,class:void 0},{class:o(O)(`
					popup--content-wrapper
					z-100
					focus:outline-none
					fixed
					top-1/2
					left-1/2
					-translate-x-1/2
					-translate-y-1/2
					animate-contentShow
					max-w-[100dvw]
					max-h-[100dvh]
					overflow-auto
					scrollbar-hidden
				`,!e.unstyle&&`
					p-5
					bg-neutral-100
					dark:bg-neutral-800
					rounded-md
				`,e.contentProps?.class)}),{default:p(()=>[c(`div`,{class:s(o(O)(`
					popup--content-inner
					flex
					flex-col
					gap-3
				`))},[g(n.$slots,`popup`,{},()=>[g(n.$slots,`title`,{},()=>[e.title?(f(),h(o(T),{key:0,class:`text-lg font-bold`},{default:p(()=>[i(m(e.title),1)]),_:1})):_(``,!0)]),g(n.$slots,`description`,{},()=>[e.description?(f(),h(o(S),{key:0},{default:p(()=>[i(m(e.description),1)]),_:1})):_(``,!0)]),g(n.$slots,`extra`)]),r(o(A),{"as-child":``},{default:p(()=>[g(n.$slots,`close`,{},()=>[r(k,{class:`justify-self-end`,onClick:a[0]||=e=>t.value=!1},{default:p(()=>[...a[3]||=[i(` Close `,-1)]]),_:1})])]),_:3})],2)]),_:3},16,[`class`])]),_:3},8,[`to`])]),_:3},16,[`open`]))}});export{N as default};