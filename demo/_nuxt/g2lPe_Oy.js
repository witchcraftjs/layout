import{r as e}from"./Cfpk3IOQ.js";import{$n as t,Nt as n,On as r,Zn as i,_ as a,b as o,et as s,mt as c,tr as l,xt as u,y as d,z as f}from"./Car86Ubo.js";import{Y as p}from"#entry";import{t as m}from"./JCXPeO0D.js";var h=e({default:()=>v}),g=[`type`,`disabled`,`data-border`,`data-color`],_={key:0},v=Object.assign({name:`WButton`,inheritAttrs:!1},{__name:`WButton`,props:{disabled:{type:Boolean,required:!1},readonly:{type:Boolean,required:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1},label:{type:String,required:!1,default:``},color:{type:[String,Boolean],required:!1,default:!1}},setup(e){let h=n();return(n,v)=>(c(),o(`button`,s({class:!e.unstyle&&r(m)(`
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
		dark:hover:text-accent-400
		dark:disabled:text-neutral-500
		dark:disabled:hover:text-neutral-500
	`,!e.color&&`active:text-neutral-800`,e.border&&`
			transition-all
			bg-neutral-100
			dark:tint-neutral-800/10
			dark:bg-(--mix)
			shadow-[0_1px_1px_0]
			shadow-neutral-950/20
			hover:shadow-[0_1px_3px_0]
			hover:shadow-neutral-950/30
			hover:border-neutral-200
			dark:hover:border-neutral-800
			relative
			after:absolute
			after:rounded-sm
			after:inset-0
			after:content
			after:shadow-[0_1px_0_0_inset]
			after:shadow-bg/20
			hover:after:shadow-bg/60
			disabled:after:hidden
			dark:after:shadow-bg/10
			dark:hover:after:shadow-bg/50
			after:pointer-events-none
			after:mix-blend-overlay
			active:inset-shadow
			active:shadow-fg/20
			active:border-transparent
			border
			border-black/10
			disabled:border-neutral-200
			disabled:bg-neutral-100
			dark:hover:shadow-neutral-950/70
			dark:active:shadow-fg/40
			dark:active:border-neutral-900
			dark:border-black/50
			dark:disabled:border-neutral-800
			dark:disabled:bg-(--mix)
			dark:disabled:shade-neutral-900/10
		`,e.border&&(!e.color||e.color===`secondary`)&&`
			after:shadow-bg/90
			hover:after:shadow-bg
			dark:after:shadow-bg/20
			dark:hover:after:shadow-bg/90
		`,!e.border&&e.color===`primary`&&`
			font-bold
			hover:text-accent-50
		`,!e.border&&e.color===`ok`&&`
			text-ok-600 hover:text-ok-500
			dark:text-ok-600 dark:hover:text-ok-500
		`,!e.border&&e.color===`warning`&&`
			text-warning-500 hover:text-warning-300
			dark:text-warning-600 dark:hover:text-warning-400
		`,!e.border&&e.color===`danger`&&`
			text-danger-500 hover:text-danger-300
			dark:text-danger-600 dark:hover:text-danger-400
		`,!e.border&&e.color===`secondary`&&`
			text-accent-700 hover:text-accent-500
			dark:text-accent-600 dark:hover:text-accent-400
		`,!e.border&&e.color===`primary`&&`
			text-accent-700 hover:text-accent-500
			dark:text-accent-600 dark:hover:text-accent-400
		`,e.border&&e.color===`ok`&&`
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
		`,e.border&&e.color===`warning`&&`
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
		`,e.border&&e.color===`danger`&&`
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
		`,e.border&&e.color===`secondary`&&`
			text-accent-800
			dark:text-accent-400
		`,e.border&&e.color===`primary`&&`
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
		`,r(h)?.class),type:r(h)?.type||`button`,tabindex:0,disabled:e.disabled,"data-border":e.border,"data-color":e.color},{...r(h),class:void 0}),[u(n.$slots,`label`,t(f({classes:`button--label pointer-events-none flex flex-1 items-center justify-center gap-1`})),()=>[a(`div`,{class:i(!e.unstyle&&`button--label pointer-events-none flex flex-1 items-center justify-center gap-1`)},[u(n.$slots,`icon`),u(n.$slots,`default`,t(f({label:e.label})),()=>[e.label&&!r(p)(e.label)?(c(),o(`span`,_,l(e.label),1)):d(``,!0)]),u(n.$slots,`icon-after`)],2)])],16,g))}});export{v as n,h as t};