import{d as v,az as _,bl as C,z as u,$ as d,E as l,O as s,M as p,k as t,ah as k,P as D,aa as q,a_ as P,aA as $,o as B,L as w,bm as h,R as x,Q as c,D as i,bn as V,B as y,bo as M,N as b,Z as O,bp as S,F as g,C as m,bq as T,a1 as j}from"./CXTw713-.js";var z=v({__name:"DialogClose",props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1,default:"button"}},setup(a){const r=a;_();const e=C();return(o,n)=>(u(),d(t(k),p(r,{type:o.as==="button"?"button":void 0,onClick:n[0]||(n[0]=f=>t(e).onOpenChange(!1))}),{default:l(()=>[s(o.$slots,"default")]),_:3},16,["type"]))}}),N=z,R=v({__name:"DialogPortal",props:{to:{type:null,required:!1},disabled:{type:Boolean,required:!1},defer:{type:Boolean,required:!1},forceMount:{type:Boolean,required:!1}},setup(a){const r=a;return(e,o)=>(u(),d(t(P),D(q(r)),{default:l(()=>[s(e.$slots,"default")]),_:3},16))}}),E=R,I=v({__name:"DialogTrigger",props:{asChild:{type:Boolean,required:!1},as:{type:null,required:!1,default:"button"}},setup(a){const r=a,e=C(),{forwardRef:o,currentElement:n}=_();return e.contentId||=$(void 0,"reka-dialog-content"),B(()=>{e.triggerElement.value=n.value}),(f,F)=>(u(),d(t(k),p(r,{ref:t(o),type:f.as==="button"?"button":void 0,"aria-haspopup":"dialog","aria-expanded":t(e).open.value||!1,"aria-controls":t(e).open.value?t(e).contentId:void 0,"data-state":t(e).open.value?"open":"closed",onClick:t(e).onOpenToggle}),{default:l(()=>[s(f.$slots,"default")]),_:3},16,["type","aria-expanded","aria-controls","data-state","onClick"]))}}),A=I;const L=Object.assign({name:"WPopup",inheritAttrs:!1},{__name:"WPopup",props:x({title:{type:String,required:!1},description:{type:String,required:!1},backdropClass:{type:String,required:!1},contentProps:{type:Object,required:!1},rootProps:{type:Object,required:!1},to:{type:String,required:!1,default:"#root"},unstyle:{type:Boolean,required:!1}},{modelValue:{type:Boolean,default:!1},modelModifiers:{}}),emits:["update:modelValue"],setup(a){const r=w(a,"modelValue",{type:Boolean,default:!1});return(e,o)=>(u(),d(t(h),p(a.rootProps,{open:r.value,"onUpdate:open":o[1]||(o[1]=n=>r.value=n)}),{default:l(()=>[e.$slots.button?(u(),d(t(A),{key:0,"as-child":""},{default:l(()=>[s(e.$slots,"button")]),_:3})):c("",!0),i(t(E),{to:a.to},{default:l(()=>[i(t(V),{"as-child":""},{default:l(()=>[s(e.$slots,"backdrop",{class:"popup--backdrop absolute inset-0 bg-black/50"},()=>[o[2]||(o[2]=y("div",{class:"popup--backdrop absolute inset-0 bg-black/50"},null,-1))])]),_:3}),i(t(M),p({...a.contentProps,class:void 0},{class:t(b)(`
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
				`,!a.unstyle&&`
					p-5
					bg-neutral-100
					dark:bg-neutral-800
					rounded-md
				`,a.contentProps?.class)}),{default:l(()=>[y("div",{class:O(t(b)(`
					popup--content-inner
					flex
					flex-col
					gap-3
				`))},[s(e.$slots,"popup",{},()=>[s(e.$slots,"title",{},()=>[a.title?(u(),d(t(S),{key:0,class:"text-lg font-bold"},{default:l(()=>[g(m(a.title),1)]),_:1})):c("",!0)]),s(e.$slots,"description",{},()=>[a.description?(u(),d(t(T),{key:0},{default:l(()=>[g(m(a.description),1)]),_:1})):c("",!0)]),s(e.$slots,"extra")]),i(t(N),{"as-child":""},{default:l(()=>[s(e.$slots,"close",{},()=>[i(j,{class:"justify-self-end",onClick:o[0]||(o[0]=n=>r.value=!1)},{default:l(()=>[...o[3]||(o[3]=[g(" Close ",-1)])]),_:1})])]),_:3})],2)]),_:3},16,["class"])]),_:3},8,["to"])]),_:3},16,["open"]))}});export{L as default};
