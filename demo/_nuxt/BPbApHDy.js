import{H as f,r as i,J as h,v as g,x as y,Q as n,y as u,M as v,C as x,aW as B,P as d,O as e,z as q}from"./DVXjeaI0.js";import{u as w}from"./Cn0dpc25.js";import{u as V}from"./DiEt9e2A.js";import{t as o}from"./DeCVlzJk.js";import{g as A}from"./BpX0FRyY.js";const M=["for"],$=["id","disabled"],H=Object.assign({name:"LibCheckbox",inheritAttrs:!1},{__name:"WCheckbox",props:f({id:{type:String,required:!1},label:{type:String,required:!1},disabled:{type:Boolean,required:!1,default:!1},readonly:{type:Boolean,required:!1,default:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1,default:!1}},{modelValue:{type:Boolean,default:!1},modelModifiers:{}}),emits:f(["submit"],["update:modelValue"]),setup(a){const t=w(["label","wrapper"]),r=A(),b=a,p=i(null),m=i(null),l=h(a,"modelValue",{type:Boolean,default:!1});return V(b.id??r,l),(s,c)=>(y(),g("div",d({class:e(o)(`
		checkbox--wrapper
		flex
		items-center
		gap-1
	`,e(t).wrapperAttrs?.class)},{...e(t).wrapperAttrs,class:void 0},{ref_key:"el",ref:p}),[n(s.$slots,"left"),u("label",d({class:e(o)(`
			checkbox--label
			flex
			items-center
			gap-1
		`,e(t).labelAttrs?.class)},{...e(t).labelAttrs,class:void 0},{for:a.id??e(r)}),[v(u("input",d({id:a.id??e(r),class:!s.$attrs.unstyle&&e(o)(`
				checkbox
				focus-outline-no-offset
				m-0
				p-[0.4em]
				bg-bg
				dark:bg-fg
				appearance-none
				border
				border-neutral-500
				focus:border-accent-600
				rounded-sm
				aspect-square
				relative
				checked:after:content
				checked:after:absolute
				checked:after:w-full
				checked:after:h-full
				checked:after:border-2
				checked:after:border-bg
				dark:checked:after:border-fg
				checked:after:rounded-sm
				checked:after:top-0
				checked:after:left-0
				checked:after:bg-accent-700
				disabled:border-neutral-500
				disabled:checked:after:bg-neutral-700
			`,!a.disabled&&"cursor-pointer",e(t).attrs.class),type:"checkbox",disabled:a.disabled,ref_key:"inputEl",ref:m,"onUpdate:modelValue":c[0]||(c[0]=k=>l.value=k)},{...e(t).attrs,class:void 0}),null,16,$),[[B,l.value]]),n(s.$slots,"default"),x(" "+q(a.label),1)],16,M)],16))}});export{H as default};
