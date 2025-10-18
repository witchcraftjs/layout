import{H as f,aL as m,r as n,K as g,v as y,x as v,T as i,y as u,O as x,C as B,aT as q,R as d,Q as e,S as o,N as w,z as V}from"#entry";import{u as A}from"./DgeF6Nu6.js";const M=["for"],S=["id","disabled"],D=Object.assign({name:"LibCheckbox",inheritAttrs:!1},{__name:"WCheckbox",props:f({id:{type:String,required:!1},label:{type:String,required:!1},disabled:{type:Boolean,required:!1,default:!1},readonly:{type:Boolean,required:!1,default:!1},border:{type:Boolean,required:!1,default:!0},unstyle:{type:Boolean,required:!1,default:!1}},{modelValue:{type:Boolean,default:!1},modelModifiers:{}}),emits:f(["submit"],["update:modelValue"]),setup(a){const t=m(["label","wrapper"]),l=w(),b=a,p=n(null),k=n(null),r=g(a,"modelValue",{type:Boolean,default:!1});return A(b.id??l,r),(s,c)=>(v(),y("div",d({class:e(o)(`
		checkbox--wrapper
		flex
		items-center
		gap-1
	`,e(t).wrapperAttrs?.class)},{...e(t).wrapperAttrs,class:void 0},{ref_key:"el",ref:p}),[i(s.$slots,"left"),u("label",d({class:e(o)(`
			checkbox--label
			flex
			items-center
			gap-1
		`,e(t).labelAttrs?.class)},{...e(t).labelAttrs,class:void 0},{for:a.id??e(l)}),[x(u("input",d({id:a.id??e(l),class:!s.$attrs.unstyle&&e(o)(`
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
			`,!a.disabled&&"cursor-pointer",e(t).attrs.class),type:"checkbox",disabled:a.disabled,ref_key:"inputEl",ref:k,"onUpdate:modelValue":c[0]||(c[0]=h=>r.value=h)},{...e(t).attrs,class:void 0}),null,16,S),[[q,r.value]]),i(s.$slots,"default"),B(" "+V(a.label),1)],16,M)],16))}});export{D as default};
