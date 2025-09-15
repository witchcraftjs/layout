import{i as g}from"./BhoX2VZY.js";import{u as k}from"./QnU64Ice.js";import{t as u}from"./CudCRF6p.js";import{g as v}from"./C0K3EOEW.js";import{I as x,j as f,v as l,x as i,P as d,Q as c,R as b,N as r,O as w,y as m,M as y,z as B}from"./9MspHWnN.js";const q=["id","type","disabled","data-border","data-color","aria-disabled"],$=["id"],j={key:0},N=Object.assign({name:"LibButton"},{__name:"WButton",props:{id:{type:String,required:!1},label:{type:String,required:!1,default:""},disabled:{type:Boolean,required:!1,default:!1},readonly:{type:Boolean,required:!1,default:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1,default:!1},color:{type:[String,Boolean],required:!1,default:!1},autoTitleFromAria:{type:Boolean,required:!1}},setup(e){const a=x(),t=v(),n=e,s=k(n,t),h=f(()=>({title:n.autoTitleFromAria?a["aria-label"]??n.label:void 0}));return(o,S)=>(i(),l("button",w({id:e.id??r(t),class:!r(a).unstyle&&r(u)(`
		button
		flex
		cursor-pointer
		items-center
		justify-center
		rounded-sm
		px-1
		hover:cursor-pointer
		[&:hover_*]:cursor-pointer
		focus-outline
		disabled:shadow-none
		disabled:text-neutral-500
		disabled:cursor-default
		text-fg
		hover:text-accent-700
		dark:text-bg
		dark:hover:text-accent-500
		dark:disabled:text-neutral-500
		dark:disabled:hover:text-neutral-500
	`,!e.color&&"active:text-neutral-800",e.border&&`
			transition-all
			bg-neutral-100
			dark:bg-neutral-900
			shadow-[0_1px_1px_0]
			shadow-neutral-950/20
			hover:shadow-[0_1px_3px_0]
			hover:shadow-neutral-950/30
			hover:border-neutral-200
			dark:hover:border-neutral-800
			relative
			after:absolute
			after:rounded-xs
			after:inset-0
			after:content
			after:shadow-[0_1px_0_0_inset]
			after:shadow-bg/20
			hover:after:shadow-bg/60
			dark:after:shadow-bg/10
			dark:hover:after:shadow-bg/50
			after:pointer-events-none
			after:mix-blend-overlay
			active:inset-shadow
			active:shadow-fg/20
			active:border-transparent
			border
			border-neutral-300
			disabled:border-neutral-200
			disabled:bg-neutral-50
			dark:hover:shadow-accent-950/30
			dark:active:shadow-fg/40
			dark:active:border-neutral-900
			dark:border-neutral-900
			dark:disabled:border-neutral-800
			dark:disabled:bg-neutral-900
		`,e.border&&(!e.color||e.color==="secondary")&&`
			after:shadow-bg/90
			hover:after:shadow-bg
			dark:after:shadow-bg/20
			dark:hover:after:shadow-bg/90
		`,!e.border&&e.color==="primary"&&`
			font-bold
			hover:text-accent-50
		`,!e.border&&e.color==="ok"&&`
			text-ok-600 hover:text-ok-500
			dark:text-ok-600 dark:hover:text-ok-500
		`,!e.border&&e.color==="warning"&&`
			text-warning-500 hover:text-warning-300
			dark:text-warning-600 dark:hover:text-warning-400
		`,!e.border&&e.color==="danger"&&`
			text-danger-500 hover:text-danger-300
			dark:text-danger-600 dark:hover:text-danger-400
		`,!e.border&&e.color==="secondary"&&`
			text-accent-700 hover:text-accent-500
			dark:text-accent-600 dark:hover:text-accent-400
		`,!e.border&&e.color==="primary"&&`
			text-accent-700 hover:text-accent-500
			dark:text-accent-600 dark:hover:text-accent-400
		`,e.border&&e.color==="ok"&&`
			text-ok-950
			hover:text-ok-800
			bg-ok-400
			border-ok-500
			hover:border-ok-600
			hover:shadow-ok-900/50

			dark:text-ok-100
			dark:hover:text-ok-200
			dark:bg-ok-700
			dark:border-ok-800
			dark:hover:border-ok-900
			dark:hover:shadow-ok-900/30
		`,e.border&&e.color==="warning"&&`
			text-warning-950
			hover:text-warning-900
			bg-warning-300
			border-warning-400
			hover:border-warning-400
			hover:shadow-warning-900/50

			dark:text-warning-100
			dark:hover:text-warning-200
			dark:bg-warning-700
			dark:border-warning-700
			dark:hover:shadow-warning-900/25
		`,e.border&&e.color==="danger"&&`
			text-danger-950
			hover:text-danger-900
			bg-danger-400
			border-danger-500
			hover:border-danger-500
			hover:shadow-danger-900/50

			dark:text-danger-100
			dark:hover:text-danger-200
			dark:bg-danger-900
			dark:border-danger-950
			dark:hover:shadow-ranger-500/10
		`,e.border&&e.color==="secondary"&&`
			text-accent-800
			dark:text-accent-400
		`,e.border&&e.color==="primary"&&`
			text-bg
			hover:text-bg
			bg-accent-600
			border-accent-700
			hover:border-accent-800
			hover:shadow-accent-950/30

			dark:text-bg
			dark:bg-accent-600
			dark:hover:text-accent-200
			dark:border-accent-800
			dark:hover:border-accent-700
			dark:hover:shadow-accent-900/50
		`,r(a)?.class),type:r(a).type,tabindex:0,disabled:e.disabled,"data-border":e.border,"data-color":e.color,"aria-disabled":e.disabled},{...h.value,...r(a),class:void 0,...r(s)}),[d(o.$slots,"label",c(b({id:`label-${e.id??r(t)}`,classes:"button--label pointer-events-none flex flex-1 items-center justify-center gap-1"})),()=>[m("label",{id:`label-${e.id??r(t)}`,class:"button--label pointer-events-none flex flex-1 items-center justify-center gap-1"},[d(o.$slots,"icon"),d(o.$slots,"default",c(b({label:e.label})),()=>[e.label&&!r(g)(e.label)?(i(),l("span",j,B(e.label),1)):y("",!0)]),d(o.$slots,"icon-after")],8,$)])],16,q))}});export{N as default};
