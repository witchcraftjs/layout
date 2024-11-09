import{d as N,O as w,i as f,F as A,t as b,v as m,W as g,X as l,Z as d,x as u,a9 as P,aa as L,S as G,V as B,B as S,y as p}from"./Cr7bJNLf.js";const V=["href","aria-label"],y=["href","aria-label"],F={key:2,class:"page-fill"},D=["href","aria-label"],E=["aria-label"],I=["href","aria-label"],j={key:3,class:"page-fill","aria-hidden":"true"},z=["href","aria-label"],M=["href","aria-label"],O={name:"lib-pagination"},W=N({...O,name:"lib-pagination",inheritAttrs:!1,props:{total:{},current:{},route:{},customRoute:{type:Function,default:($,h)=>h===0||h===1?{href:$,i:1}:{href:$+h.toString(),i:h}},extraPages:{default:3}},setup($){const h=`
	block
	focus-outline
	border-b-2
	border-transparent
	transition-all
	outlined:rounded
`,s=`
	${h}
	focus-outline
	hover:text-accent-600
	hover:border-b-accent-500
	hover:scale-125
`,k=`
	${h}
	border-b-accent-500
	scale-125
`,e=$,C=w(),r=f(()=>e.customRoute(e.route,e.current)),x=f(()=>r.value.i<0||r.value.i>e.total);A(()=>x.value,()=>{if(x.value)throw new Error(`Current page is out of range: 0 - ${e.total}`)});const n=f(()=>e.customRoute(e.route,e.current-1)),v=f(()=>{const t=e.customRoute(e.route,e.current+1);return t.i===r.value.i?e.customRoute(e.route,e.current+2):t}),i=f(()=>e.customRoute(e.route,0)),c=f(()=>e.customRoute(e.route,e.total)),_=f(()=>[...Array(e.extraPages)].map((t,o)=>{const a=r.value.i-(e.extraPages-o);if(!(a<=i.value.i||a>=c.value.i||a>=r.value.i))return e.customRoute(e.route,a)}).filter(t=>t!==void 0)),R=f(()=>[...Array(e.extraPages+1)].map((t,o)=>{const a=r.value.i+o;if(!(a<=i.value.i||a>=c.value.i||a<=r.value.i))return e.customRoute(e.route,a)}).filter(t=>t!==void 0).slice(0,e.extraPages));return(t,o)=>(b(),m("nav",{class:l(G(B)(`
		flex flex-wrap items-center justify-center gap-2
	`,G(C).class)),role:"navigation","aria-label":"Pagination Navigation"},[n.value.i>0&&n.value.i!==r.value.i?g(t.$slots,"link",{key:0,i:n.value.i,href:n.value.href,text:"Prev",ariaLabel:`Go to previous page. Page ${n.value.i}`,class:l(s)},()=>[u("a",{class:l(s),href:n.value.href,"aria-label":`Go to previous page. Page ${n.value.i}`},null,8,V)]):d("",!0),o[1]||(o[1]=u("div",{class:"flex-1"},null,-1)),i.value.i!==r.value.i?g(t.$slots,"link",{key:1,i:0,href:i.value.href,text:i.value.i,ariaLabel:`Go to page ${i.value.i}`,class:l(s)},()=>[S(p(i.value.href)+" ",1),u("a",{class:l(s),href:i.value.href,"aria-label":`Go to page ${i.value.i}`},p(i.value.i),9,y)]):d("",!0),n.value.i-t.extraPages>i.value.i?(b(),m("div",F," ... ")):d("",!0),(b(!0),m(P,null,L(_.value,a=>g(t.$slots,"link",{key:a.i,class:l(s),i:a.i,href:a.href,ariaLabel:`Go to page ${a.i}`},()=>[u("a",{class:l(s),href:a.href,"aria-label":`Go to page ${a.i}`},p(a.i),9,D)])),128)),g(t.$slots,"current",{class:l(k),tabindex:"0",i:r.value.i,ariaLabel:`Current page ${r.value.i}`,aria_current:!0},()=>[u("div",{class:l(["a",k]),tabindex:"0","aria-label":`Current page ${r.value.i}`,"aria-current":"true",onClick:o[0]||(o[0]=a=>a.preventDefault())},p(r.value.i),9,E)]),(b(!0),m(P,null,L(R.value,a=>g(t.$slots,"link",{key:a.i,class:l(s),i:a.i,href:a.href,ariaLabel:`Go to page ${a.i}`},()=>[u("a",{class:l(s),href:a.href,"aria-label":`Go to page ${a.i}`},p(a.i),9,I)])),128)),v.value.i+t.extraPages<t.total?(b(),m("div",j," ... ")):d("",!0),c.value.i!==r.value.i?g(t.$slots,"link",{key:4,class:l(s),i:c.value.i,href:c.value.href,text:t.total,ariaLabel:`Go to page ${c.value.i}`},()=>[u("a",{class:l(s),href:c.value.href,"aria-label":`Go to page ${c.value.i}`},p(t.total),9,z)]):d("",!0),o[2]||(o[2]=u("div",{class:"flex-1"},null,-1)),v.value.i<=t.total&&v.value.i!==r.value.i?g(t.$slots,"link",{key:5,class:l(s),i:v.value.i,href:v.value.href,text:"Next",ariaLabel:`Go to next page. Page ${v.value.i}`},()=>[u("a",{class:l(s),href:v.value.href,"aria-label":`Go to next page. Page ${v.value.i}`},"Next",8,M)]):d("",!0)],2))}});export{W as default};
