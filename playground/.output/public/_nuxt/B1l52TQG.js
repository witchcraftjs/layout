var q=Object.defineProperty;var S=(s,e,t)=>e in s?q(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var a=(s,e,t)=>S(s,typeof e!="symbol"?e+"":e,t);import{al as A,am as B,an as r,ao as c,d as D,O as L,i as J,r as V,t as u,v as b,x as p,y as w,Z as v,z as g,A as _,J as x,S as h,ap as j,K as $,Q as y,a9 as H,aa as K,U as T,aq as z,ai as M,V as P,ab as F,X as Q}from"./Cr7bJNLf.js";import{_ as R}from"./C8y7k1hF.js";function d(s,{oneline:e=!1,stringify:t=!1}={}){let o=s;return t&&(t===!0&&(t=n=>typeof n=="function"||typeof n=="symbol"?n.toString():n),o=A(s,(n,m)=>m.length===0?n:t(n),{save:!0,after:!0})),e?JSON.stringify(o,null,"|").replace(/\n\|*/g," "):JSON.stringify(o,null,"	")}function U(s,e,t){s[e]=t}class N{constructor({timeout:e,stringifier:t,maxHistory:o}={}){a(this,"timeout",5e3);a(this,"debug",!1);a(this,"id",0);a(this,"queue",[]);a(this,"history",[]);a(this,"maxHistory",100);a(this,"listeners",[]);a(this,"stringifier");e&&(this.timeout=e),o&&(this.maxHistory=o),t&&(this.stringifier=t)}_checkEntry(e){if(e.cancellable!==void 0&&B(e.cancellable))throw new Error(r`Cancellable cannot be a blank string:
					${c(d(e),5)}
				`);if(!e.options.includes(e.default))throw new Error(r`Entry options does not include default option "${e.default}":
					${c(d(e),5)}
				`);if(e.cancellable){if(typeof e.cancellable=="string"&&!e.options.includes(e.cancellable))throw new Error(r`Entry options does not include cancellable option "${e.cancellable}":
						${c(d(e),6)}
					`)}else if(e.options.includes("Cancel"))throw new Error(r`You specified that the entry should not be cancellable, but the options include the "Cancel" option:
						${c(d(e),6)}
					`);if(e.timeout!==void 0&&!e.cancellable)throw new Error(r`Cannot timeout notification that is not cancellable:
					${c(d(e),5)}
					`);if(e.timeout!==void 0&&e.requiresAction)throw new Error(r`Cannot timeout notification that requires action:
					${c(d(e),5)}
					`);const t=e.dangerous.find(o=>!e.options.includes(o));if(e.dangerous!==void 0&&t)throw new Error(r`Dangerous options list contains an unknown option "${t}":
					${c(d(e),5)}
				`)}_createEntry(e){var o;const t={requiresAction:!1,options:["Ok","Cancel"],default:"Ok",cancellable:e.cancellable,...e,dangerous:e.dangerous??[],timeout:e.timeout===!0?this.timeout:e.timeout!==void 0&&e.timeout!==!1?e.timeout:void 0};return(e.cancellable===!0||e.cancellable===void 0&&((o=t.options)!=null&&o.includes("Cancel")))&&(t.cancellable="Cancel"),this._checkEntry(t),this.id++,t.id=this.id,t}async notify(e){const t=this._createEntry(e);t.promise=new Promise(o=>{t.resolve=o}),t.timeout!==void 0&&setTimeout(()=>{t.resolve(t.cancellable)},t.timeout),this.queue.push(t);for(const o of this.listeners)o(t,"added");return t.promise.then(o=>{t.resolution=o;for(const n of this.listeners)n(t,"resolved");if(this.history.push(t),this.history.length>this.maxHistory){this.history.splice(0,1);for(const n of this.listeners)n(t,"deleted")}return this.queue.splice(this.queue.indexOf(t),1),o})}static resolveToDefault(e){e.resolve(e.default)}static dismiss(e){e.cancellable&&e.resolve(e.cancellable)}stringify(e){if(this.stringifier)return this.stringifier(e);let t="";return e.title&&(t+=`${e.title}
`),t+=`${e.message}
`,e.code&&(t+=`code:${e.code}
`),t}clear(){U(this,"history",[])}addNotificationListener(e){this.listeners.push(e)}removeNotificationListener(e){const t=this.listeners.indexOf(e);if(t>-1)this.listeners.splice(t,1);else throw new Error(`Listener does not exist: ${e.toString()}`)}}const X={class:"header flex-reverse flex justify-between"},Y={key:0,tabindex:"0",class:"title focus-outline flex rounded font-bold"},Z={class:"actions flex"},G={class:"message whitespace-pre-wrap",tabindex:"0"},I={class:"bottom flex items-end justify-between"},W={key:0,class:"code text-xs text-neutral-700"},ee={key:1,class:"options flex flex-wrap justify-end gap-2"},ne=D({name:"lib-notification",inheritAttrs:!1,__name:"LibNotification",props:{notification:{},handler:{default:void 0}},setup(s,{expose:e}){const t=L(),o=s,n=(i,l)=>i.default===l?"primary":i.dangerous.includes(l)?"danger":"secondary",m=J(()=>o.notification.options.map(i=>n(o.notification,i))),C=V(null);return e({focus:()=>{var i;(i=C.value)==null||i.focus()}}),(i,l)=>{const O=R,E=F;return u(),b("div",T({class:h(P)(`notification
		max-w-700px
		bg-neutral-50
		dark:bg-neutral-950
		text-fg
		dark:text-bg
		border
		border-neutral-400
		rounded
		focus-outline
		flex-flex-col
		gap-2
		p-2 m-2
	`,h(t).class)},{...h(t),class:void 0},{tabindex:"0",ref_key:"notificationEl",ref:C,onKeydown:l[2]||(l[2]=z(M(f=>h(N).resolveToDefault(i.notification),["self"]),["enter"]))}),[p("div",X,[i.notification.title?(u(),b("div",Y,w(i.notification.title),1)):v("",!0),l[3]||(l[3]=p("div",{class:"flex-1"},null,-1)),p("div",Z,[g($,{border:!1,class:"copy text-neutral-700",onClick:l[0]||(l[0]=f=>h(j)(i.handler?i.handler.stringify(i.notification):JSON.stringify(i.notification)))},{default:_(()=>[g(x,null,{default:_(()=>[g(O)]),_:1})]),_:1}),i.notification.cancellable?(u(),y($,{key:0,border:!1,onClick:l[1]||(l[1]=f=>h(N).dismiss(i.notification))},{default:_(()=>[g(x,null,{default:_(()=>[g(E)]),_:1})]),_:1})):v("",!0)])]),p("div",G,w(i.notification.message),1),p("div",I,[i.notification.code?(u(),b("div",W," Code: "+w(i.notification.code),1)):v("",!0),l[4]||(l[4]=p("div",{class:"flex-1 py-1"},null,-1)),i.notification.options?(u(),b("div",ee,[(u(!0),b(H,null,K(i.notification.options,(f,k)=>(u(),y($,{label:f,class:Q(m.value[k]=="secondary"?"p-0":void 0),border:m.value[k]!=="secondary",color:m.value[k],key:f,onClick:te=>i.notification.resolve(f)},null,8,["label","class","border","color","onClick"]))),128))])):v("",!0)])],16)}}});export{N,ne as _};
