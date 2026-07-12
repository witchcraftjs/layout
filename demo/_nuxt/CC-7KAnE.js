import{X as h,Y as b,A as l,U as r,V as d,O as k,Z as u,k as a,N as o,z as e,$ as n,E as c,W as p,a0 as C,Q as i,B as $,C as S,a1 as A}from"./DqUrqeTS.js";const I=Object.assign({name:"WAuth",inheritAttrs:!1},{__name:"WAuth",props:{providers:{type:Array,required:!0},providerStyles:{type:Object,required:!1,default:()=>({})}},emits:["login"],setup(s,{emit:m}){const y=h(),x=b(),f=m;return(g,B)=>(e(),l("div",{class:u(a(o)(`
		auth
		flex
		flex-col
		items-stretch
		justify-center
		gap-2
	`,a(x)?.class))},[(e(!0),l(r,null,d(s.providers,t=>(e(),l(r,{key:t},[t?(e(),n(A,{type:"button",class:u(a(o)(`
				auth--button
				auth--button-${t}
				text-l p-2 px-4 [&_.button--label]:gap-3
				`,s.providerStyles?.[t]?.class)),key:t,onClick:j=>f("login",t)},{default:c(()=>[s.providerStyles?.[t]?.logo?(e(),n(p,{key:0,class:"text-xl"},{default:c(()=>[(e(),n(C(s.providerStyles?.[t]?.logo)))]),_:2},1024)):i("",!0),$("div",null,S(`${a(y)("auth.sign-in-register")} ${s.providerStyles?.[t]?.name??t}`),1)]),_:2},1032,["class","onClick"])):i("",!0)],64))),128)),k(g.$slots,"extra",{iconClass:"text-xl",class:"auth--button auth--button-extra text-l p-2 px-4 [&_.button--label]:gap-3"})],2))}});export{I as default};
