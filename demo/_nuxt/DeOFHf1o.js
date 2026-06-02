import{M as v,a_ as _,a4 as C,as as u,A as d,bl as l,aA as s,ag as p,aR as t,p as k,ak as D,X as P,T as q,b4 as $,ao as B,b6 as x,c as w,af as T,B as c,K as i,b as V,z as b,D as h,aP as y,aj as M,d as S,J as g,aJ as m,a as j,s as O}from"./BIYrkOIG.js";var R=v({__name:"DialogClose",props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1,default:"button"}},setup(a){const r=a;_();const e=C();return(o,n)=>(u(),d(t(k),p(r,{type:o.as==="button"?"button":void 0,onClick:n[0]||(n[0]=f=>t(e).onOpenChange(!1))}),{default:l(()=>[s(o.$slots,"default")]),_:3},16,["type"]))}}),z=R,N=v({__name:"DialogPortal",props:{to:{type:null,required:!1},disabled:{type:Boolean,required:!1},defer:{type:Boolean,required:!1},forceMount:{type:Boolean,required:!1}},setup(a){const r=a;return(e,o)=>(u(),d(t(q),D(P(r)),{default:l(()=>[s(e.$slots,"default")]),_:3},16))}}),A=N,E=v({__name:"DialogTrigger",props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1,default:"button"}},setup(a){const r=a,e=C(),{forwardRef:o,currentElement:n}=_();return e.contentId||=$(void 0,"reka-dialog-content"),B(()=>{e.triggerElement.value=n.value}),(f,J)=>(u(),d(t(k),p(r,{ref:t(o),type:f.as==="button"?"button":void 0,"aria-haspopup":"dialog","aria-expanded":t(e).open.value||!1,"aria-controls":t(e).open.value?t(e).contentId:void 0,"data-state":t(e).open.value?"open":"closed",onClick:t(e).onOpenToggle}),{default:l(()=>[s(f.$slots,"default")]),_:3},16,["type","aria-expanded","aria-controls","data-state","onClick"]))}}),I=E;const F=Object.assign({name:"WPopup",inheritAttrs:!1},{__name:"WPopup",props:T({title:{type:String,required:!1},description:{type:String,required:!1},backdropClass:{type:String,required:!1},contentProps:{type:Object,required:!1},rootProps:{type:Object,required:!1},to:{type:String,required:!1,default:"#root"}},{modelValue:{type:Boolean,default:!1},modelModifiers:{}}),emits:["update:modelValue"],setup(a){const r=x(a,"modelValue",{type:Boolean,default:!1});return(e,o)=>(u(),d(t(w),p(a.rootProps,{open:r.value,"onUpdate:open":o[1]||(o[1]=n=>r.value=n)}),{default:l(()=>[e.$slots.button?(u(),d(t(I),{key:0,"as-child":""},{default:l(()=>[s(e.$slots,"button")]),_:3})):c("",!0),i(t(A),{to:a.to},{default:l(()=>[i(t(V),{"as-child":""},{default:l(()=>[s(e.$slots,"backdrop",{class:"popup--backdrop absolute inset-0 bg-black/50"},()=>[o[2]||(o[2]=b("div",{class:"popup--backdrop absolute inset-0 bg-black/50"},null,-1))])]),_:3}),i(t(h),p({...a.contentProps,class:void 0},{class:t(y)(`
				popup--content
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
				p-5
			`,a.contentProps?.class)}),{default:l(()=>[b("div",{class:M(t(y)(`
					popup--content-inner
					flex
					flex-col
					bg-neutral-100
					dark:bg-neutral-800
					rounded-md
					flex
					flex-col
					gap-3
					p-2
				`))},[s(e.$slots,"popup",{},()=>[s(e.$slots,"title",{},()=>[a.title?(u(),d(t(S),{key:0,class:"text-lg font-bold"},{default:l(()=>[g(m(a.title),1)]),_:1})):c("",!0)]),s(e.$slots,"description",{},()=>[a.description?(u(),d(t(j),{key:0},{default:l(()=>[g(m(a.description),1)]),_:1})):c("",!0)]),s(e.$slots,"extra")]),i(t(z),{"as-child":""},{default:l(()=>[s(e.$slots,"close",{},()=>[i(O,{class:"justify-self-end",onClick:o[0]||(o[0]=n=>r.value=!1)},{default:l(()=>[...o[3]||(o[3]=[g(" Close ",-1)])]),_:1})])]),_:3})],2)]),_:3},16,["class"])]),_:3},8,["to"])]),_:3},16,["open"]))}});export{F as default};
