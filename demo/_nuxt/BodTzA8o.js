import{aT as v,b5 as w,A as h,bl as C,ag as c,aR as a,aP as V,s as x,x as p,as as y,z as r,aA as d,ak as m,X as S,al as b,aj as f,B as _,C as g}from"./BIYrkOIG.js";const k={class:"color-input--swatch-wrapper flex w-full"},l=`
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
`,B={__name:"WColorSwatchButton",props:{id:{type:String,required:!1},tempValue:{type:null,required:!0},value:{type:Object,required:!0}},setup(s){const o=v(),n=w(),e=s,t=p(()=>new g("srgb",[e.value.r/255,e.value.g/255,e.value.b/255],e.value.a??1).toString()),u=p(()=>e.tempValue?new g("srgb",[e.tempValue.r/255,e.tempValue.g/255,e.tempValue.b/255],e.tempValue.a??1).toString():"");return(i,$)=>(y(),h(x,c({id:s.id,class:a(V)(`
		color-input--button
		p-0
		flex
		flex-nowrap
		min-w-4
		overflow-hidden
		[&_.button--label]:items-stretch
		[&_.button--label]:gap-0
		after:hidden
	`,a(o).class),"aria-label":a(n)("color-input.aria-and-title-prefix")+t.value,title:a(n)("color-input.aria-and-title-prefix")+t.value},{...a(o),class:void 0}),{label:C(()=>[r("div",k,[d(i.$slots,"default",m(S({stringColor:t.value,classes:l})),()=>[r("div",{class:f(l),style:b(`background:${t.value}`)},null,4)]),s.tempValue?d(i.$slots,"temp",m(c({key:0},{tempStringColor:u.value,classes:l})),()=>[r("div",{class:f(l),style:b(`background:${u.value}`)},null,4)]):_("",!0)])]),_:3},16,["id","class","aria-label","title"]))}};export{B as default};
