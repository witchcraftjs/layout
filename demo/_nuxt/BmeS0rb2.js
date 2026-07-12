import{Y as g,X as w,$ as h,E as C,M as c,k as a,N as V,a1 as y,l as p,z as S,B as r,O as d,P as m,aa as x,ab as b,Z as f,Q as _,ac as v}from"./DqUrqeTS.js";const $={class:"color-input--swatch-wrapper flex w-full"},l=`
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
`,B={__name:"WColorSwatchButton",props:{id:{type:String,required:!1},tempValue:{type:null,required:!0},value:{type:Object,required:!0}},setup(s){const o=g(),n=w(),e=s,t=p(()=>new v("srgb",[e.value.r/255,e.value.g/255,e.value.b/255],e.value.a??1).toString()),u=p(()=>e.tempValue?new v("srgb",[e.tempValue.r/255,e.tempValue.g/255,e.tempValue.b/255],e.tempValue.a??1).toString():"");return(i,k)=>(S(),h(y,c({id:s.id,class:a(V)(`
		color-input--button
		p-0
		flex
		flex-nowrap
		min-w-4
		overflow-hidden
		[&_.button--label]:items-stretch
		[&_.button--label]:gap-0
		after:hidden
	`,a(o).class),"aria-label":a(n)("color-input.aria-and-title-prefix")+t.value,title:a(n)("color-input.aria-and-title-prefix")+t.value},{...a(o),class:void 0}),{label:C(()=>[r("div",$,[d(i.$slots,"default",m(x({stringColor:t.value,classes:l})),()=>[r("div",{class:f(l),style:b(`background:${t.value}`)},null,4)]),s.tempValue?d(i.$slots,"temp",m(c({key:0},{tempStringColor:u.value,classes:l})),()=>[r("div",{class:f(l),style:b(`background:${u.value}`)},null,4)]):_("",!0)])]),_:3},16,["id","class","aria-label","title"]))}};export{B as default};
