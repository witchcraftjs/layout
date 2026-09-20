import{Nt as e,On as t,Zn as n,_ as r,b as i,bt as a,mt as o,o as s,qt as c,tr as l,v as u,wt as d,xt as f,y as p}from"./Car86Ubo.js";import{t as m}from"./JCXPeO0D.js";import{t as h}from"./DQRMssAd.js";import{n as g}from"./g2lPe_Oy.js";import{t as _}from"./CYXZYEL9.js";var v=Object.assign({name:`WAuth`,inheritAttrs:!1},{__name:`WAuth`,props:{providers:{type:Array,required:!0},providerStyles:{type:Object,required:!1,default:()=>({})}},emits:[`login`],setup(v,{emit:y}){let b=h(),x=e(),S=y;return(e,h)=>(o(),i(`div`,{class:n(t(m)(`
		auth
		flex
		flex-col
		items-stretch
		justify-center
		gap-2
	`,t(x)?.class))},[(o(!0),i(s,null,a(v.providers,e=>(o(),i(s,{key:e},[e?(o(),u(g,{type:`button`,class:n(t(m)(`
				auth--button
				auth--button-${e}
				text-l p-2 px-4 [&_.button--label]:gap-3
				`,v.providerStyles?.[e]?.class)),key:e,onClick:t=>S(`login`,e)},{default:c(()=>[v.providerStyles?.[e]?.logo?(o(),u(_,{key:0,class:`text-xl`},{default:c(()=>[(o(),u(d(v.providerStyles?.[e]?.logo)))]),_:2},1024)):p(``,!0),r(`div`,null,l(`${t(b)(`auth.sign-in-register`)} ${v.providerStyles?.[e]?.name??e}`),1)]),_:2},1032,[`class`,`onClick`])):p(``,!0)],64))),128)),f(e.$slots,`extra`,{iconClass:`text-xl`,class:`auth--button auth--button-extra text-l p-2 px-4 [&_.button--label]:gap-3`})],2))}});export{v as default};