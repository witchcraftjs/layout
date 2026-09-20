import{$n as e,Nt as t,On as n,Zn as r,_ as i,er as a,et as o,g as s,mt as c,qt as l,v as u,xt as d,y as f,z as p}from"./Car86Ubo.js";import{q as m}from"#entry";import{t as h}from"./JCXPeO0D.js";import{t as g}from"./DQRMssAd.js";import{n as _}from"./g2lPe_Oy.js";var v={class:`color-input--swatch-wrapper flex w-full`},y=`
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
`,b={__name:`WColorSwatchButton`,props:{id:{type:String,required:!1},tempValue:{type:null,required:!0},value:{type:Object,required:!0}},setup(b){let x=t(),S=g(),C=b,w=s(()=>new m(`srgb`,[C.value.r/255,C.value.g/255,C.value.b/255],C.value.a??1).toString()),T=s(()=>C.tempValue?new m(`srgb`,[C.tempValue.r/255,C.tempValue.g/255,C.tempValue.b/255],C.tempValue.a??1).toString():``);return(t,s)=>(c(),u(_,o({id:b.id,class:n(h)(`
		color-input--button
		p-0
		flex
		flex-nowrap
		min-w-4
		overflow-hidden
		[&_.button--label]:items-stretch
		[&_.button--label]:gap-0
		after:hidden
	`,n(x).class),"aria-label":n(S)(`color-input.aria-and-title-prefix`)+w.value,title:n(S)(`color-input.aria-and-title-prefix`)+w.value},{...n(x),class:void 0}),{label:l(()=>[i(`div`,v,[d(t.$slots,`default`,e(p({stringColor:w.value,classes:y})),()=>[i(`div`,{class:r(y),style:a(`background:${w.value}`)},null,4)]),b.tempValue?d(t.$slots,`temp`,e(p({tempStringColor:T.value,classes:y})),()=>[i(`div`,{class:r(y),style:a(`background:${T.value}`)},null,4)],void 0,0):f(``,!0)])]),_:3},16,[`id`,`class`,`aria-label`,`title`]))}};export{b as default};