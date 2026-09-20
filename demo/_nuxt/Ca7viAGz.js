import{r as e}from"./Cfpk3IOQ.js";import{$n as t,D as n,Nt as r,On as i,Zn as a,_ as o,b as s,bt as c,ct as l,et as u,fn as d,g as f,gn as p,mt as m,o as h,qt as g,tr as _,v,vn as y,wt as b,xt as x,y as S,z as C}from"./Car86Ubo.js";import{C as w,w as T}from"./BuJ-z5Um.js";import{G as E,H as D,U as O,W as k,Y as A,Z as j,c as M,l as N,s as P}from"#entry";import{t as F}from"./JCXPeO0D.js";import{n as I}from"./g2lPe_Oy.js";import{t as L}from"./CYXZYEL9.js";function R(){let e=p({});function t(t,n){return e[t]=n,e[t]}return{slotVars:e,setSlotVar:t}}var z=class{timeout=5e3;debug=!1;id=0;queue;history;maxHistory=100;listeners=[];stringifier;constructor({timeout:e,stringifier:t,maxHistory:n}={}){this.queue=p([]),this.history=p([]),e&&(this.timeout=e),n&&(this.maxHistory=n),t&&(this.stringifier=t)}_checkEntry(e){if(e.cancellable!==void 0&&A(e.cancellable))throw Error(E`Cancellable cannot be a blank string:
					${k(O(e),5)}
				`);if(!e.options.includes(e.default))throw Error(E`Entry options does not include default option "${e.default}":
					${k(O(e),5)}
				`);if(e.cancellable){if(typeof e.cancellable==`string`&&!e.options.includes(e.cancellable))throw Error(E`Entry options does not include cancellable option "${e.cancellable}":
						${k(O(e),6)}
					`)}else if(e.options.includes(`Cancel`))throw Error(E`You specified that the entry should not be cancellable, but the options include the "Cancel" option:
						${k(O(e),6)}
					`);if(e.timeout!==void 0&&e.requiresAction)throw Error(E`Cannot timeout notification that requires action:
					${k(O(e),5)}
					`);let t=e.dangerous.find(t=>!e.options.includes(t));if(e.dangerous!==void 0&&t)throw Error(E`Dangerous options list contains an unknown option "${t}":
					${k(O(e),5)}
				`)}_createEntry(e){let t={requiresAction:!1,options:[`Ok`,`Cancel`],default:`Ok`,...e,component:e.component&&typeof e.component!=`string`?d(e.component):void 0,dangerous:e.dangerous??[],timeout:e.timeout===!0?this.timeout:e.timeout!==void 0&&e.timeout!==!1?e.timeout:void 0};return(e.cancellable===!0||e.cancellable===void 0&&t.options?.includes(`Cancel`))&&(t.cancellable=`Cancel`),this._checkEntry(t),j(t),this.id++,t.id=this.id,t}async notify(e){let t=this._createEntry(e);t.promise=new Promise(e=>{t.resolve=e}),t.timeout!==void 0&&(t._timer={elapsedBeforePause:0},this.resume(t)),this.queue.push(t);for(let e of this.listeners)e(t,`added`);return t.promise.then(e=>{t.resolution=e;for(let e of this.listeners)e(t,`resolved`);if(this.history.push(t),this.history.length>this.maxHistory){this.history.splice(0,1);for(let e of this.listeners)e(t,`deleted`)}return this.queue.splice(this.queue.indexOf(t),1),e})}pause(e){if(e.timeout===void 0)throw Error(`Cannot pause notification with no timeout: ${e.id}`);if(e.isPaused)throw Error(`Cannot pause notification that is already paused: ${e.id}`);e.isPaused=!0,clearTimeout(e._timer.id),e._timer.elapsedBeforePause+=Date.now()-e.startTime}resume(e){if(e.timeout===void 0)throw Error(`Cannot resume notification with no timeout: ${e.id}`);e.isPaused=!1,e.startTime=Date.now();let t=e.timeout-e._timer.elapsedBeforePause;clearTimeout(e._timer.id),e._timer.id=setTimeout(()=>{e.cancellable?e.resolve(e.cancellable):e.resolve(e.default)},t)}static resolveToDefault(e){e.resolve(e.default)}static dismiss(e){e.cancellable&&e.resolve(e.cancellable)}stringify(e){if(this.stringifier)return this.stringifier(e);let t=``;return e.title&&(t+=`${e.title}
`),t+=`${e.message}
`,e.code&&(t+=`code:${e.code}
`),t}clear(){D(this,`history`,[])}},B=e({default:()=>J}),V=[`role`,`aria-labelledby`,`aria-describedby`,`data-id`],H={class:`notification--header flex-reverse flex justify-between items-center`},U={class:`notification--actions flex`},W=[`id`],G={class:`notification--footer flex items-end justify-between`},K={key:0,class:`code text-xs text-neutral-700 dark:text-neutral-300`},q={key:1,class:`notification--options flex flex-wrap justify-end gap-2`},J=Object.assign({name:`WNotification`,inheritAttrs:!1},{__name:`WNotification`,props:{notification:{type:null,required:!0},handler:{type:Object,required:!1,default:void 0}},setup(e,{expose:d}){let p=r(),{setSlotVar:E,slotVars:D}=R(),O=e,k=(e,t)=>e.dangerous.includes(t)?`danger`:e.default===t?`primary`:`secondary`,A=f(()=>O.notification.options.map(e=>k(O.notification,e))),j=y(null);return l(()=>{O.notification.requiresAction&&j.value?.focus()}),d({focus:()=>{j.value?.focus()}}),(r,l)=>e.notification?(m(),s(`div`,u({key:0,role:e.notification.requiresAction?`alertdialog`:`status`,"aria-labelledby":e.notification.title?`title-${e.notification.id}`:void 0,"aria-describedby":e.notification.message?`msg-${e.notification.id}`:void 0,class:i(F)(`
		notification
		bg-neutral-50
		dark:bg-neutral-900
		text-fg
		dark:text-bg
		border
		border-neutral-400
		dark:border-neutral-700
		rounded-sm
		focus-outline
		flex
		flex-col
		gap-2
		p-1
		text-sm
		focus:border-accent-500
		focus-within:border-accent-500
	`,i(p).class,e.notification.notificationAttrs?.class)},{...i(p),...e.notification?.notificationAttrs??{},class:void 0},{tabindex:`0`,"data-id":e.notification.id,ref_key:`notificationEl`,ref:j,onKeydown:l[2]||=w(T(t=>i(z).resolveToDefault(e.notification),[`self`]),[`enter`])}),[x(r.$slots,`top`,{notification:e.notification}),o(`div`,H,[e.notification.title?x(r.$slots,`title`,t(C(i(E)(`title`,{id:`title-${e.notification.id}`,title:e.notification.title,class:`
					notification--title
					focus-outline
					rounded-sm
					font-bold
				`}))),()=>[o(`div`,t(C(i(D).title)),_(e.notification.title),17)],void 0,0):S(``,!0),l[3]||=o(`div`,{class:`notification--spacer flex-1`},null,-1),o(`div`,U,[n(I,{border:!1,"aria-label":`Copy notification content`,class:`notification--title-button notification--copy-button text-neutral-700 dark:text-neutral-300`,onClick:l[0]||=t=>i(N)(e.handler?e.handler.stringify(e.notification):JSON.stringify(e.notification))},{default:g(()=>[n(L,null,{default:g(()=>[n(i(M))]),_:1})]),_:1}),e.notification.cancellable?(m(),v(I,{key:0,"aria-label":`Dismiss notification`,class:`notification--title-button notification--cancel-button`,border:!1,onClick:l[1]||=t=>i(z).dismiss(e.notification)},{default:g(()=>[n(L,null,{default:g(()=>[n(i(P))]),_:1})]),_:1})):S(``,!0)])]),e.notification.message&&!e.notification.component?x(r.$slots,`message`,t(C(i(E)(`message`,{class:`
				notification--message
				shrink-1
				overflow-auto
				whitespace-pre-wrap
				text-neutral-800
				dark:text-neutral-200
				mb-1
			`,message:e.notification.message}))),()=>[o(`div`,u(i(D).message,{id:`msg-${e.notification.id}`}),_(e.notification.message),17,W)],void 0,0):S(``,!0),e.notification.component?(m(),v(b(e.notification.component),t(u({key:1},{notification:e.notification,message:e.notification.message,messageClasses:`
					notification--message
					whitespace-pre-wrap
					text-neutral-800
					dark:text-neutral-200
					mb-1
				`,...e.notification.componentProps??{}})),null,16)):S(``,!0),o(`div`,G,[e.notification.code?(m(),s(`div`,K,` Code: `+_(e.notification.code),1)):S(``,!0),l[4]||=o(`div`,{class:`notification--footer-spacer flex-1 py-1`},null,-1),e.notification.options?(m(),s(`div`,q,[(m(!0),s(h,null,c(e.notification.options,(t,n)=>(m(),v(I,{label:t,class:a(i(F)(`
					notification--button
					notification--option-button
					px-2
				`,e.notification.default===t&&`notification--default`)),color:A.value[n],key:t,onClick:n=>e.notification.resolve(t)},null,8,[`label`,`class`,`color`,`onClick`]))),128))])):S(``,!0)])],16,V)):S(``,!0)}});export{J as n,z as r,B as t};