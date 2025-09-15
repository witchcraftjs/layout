import{r as b,aq as w,e as T,v as _,x as c,A as p,B as m,O as j,N as t,at as y,as as k,a0 as L,Z as E,a1 as z,K as C,L as H,y as h,T as S,au as B,a3 as A,M as V}from"./9MspHWnN.js";import{r as M}from"./DOfhXivz.js";import{_ as O,N as I}from"./D9-Zw3oA.js";import{t as v}from"./CudCRF6p.js";let $=!0;const f={notificationHandler:void 0,isClientSide:void 0},P=(o,s)=>{const n=s??f.isClientSide;if(n){if($)if($=!1,f.isClientSide=n??!0,o)f.notificationHandler=o;else throw new Error("You must set the notification handler to use at least once before using it.");else(o||s)&&console.warn("You can only configure useNotificationHandler once. (Note that there might be false positive during HMR).");return f.notificationHandler}},R=["id"],Y=Object.assign({name:"LibNotifications",inheritAttrs:!1},{__name:"WNotifications",props:{id:{type:String,required:!1},handler:{type:Object,required:!1}},setup(o){const s=o,n=b(null),l=b(!1),d=w([]),i=w([]),q=()=>{l.value||E(()=>{n.value.showModal(),l.value=!0})},x=()=>{l.value&&i.length===0&&(n.value.close(),l.value=!1)},g=e=>{e.resolution===void 0&&(e.requiresAction?(i.push(e),q(),e.promise.then(()=>{M(i,e),x()})):(d.splice(0,0,e),e.promise.then(()=>{M(d,e)})))},N=(e,r)=>{r==="added"&&g(e)},a=s.handler??P();a.addNotificationListener(N);for(const e of a.queue)g(e);return T(()=>{a.removeNotificationListener(N)}),(e,r)=>(c(),_(L,null,[p(y,j({name:"list",tag:"div",class:t(v)(`notifications
			absolute
			z-50
			inset-y-0 right-0
			w-1/3
			min-w-[300px]
			pointer-events-none
			overflow-hidden
			flex flex-col
		`,e.$attrs.class)},{...e.$attrs,class:void 0}),{default:m(()=>[(c(!0),_(L,null,z(t(d),u=>(c(),C(O,{class:"pointer-events-auto",handler:t(a),tabindex:"0",notification:u,key:u.id},null,8,["handler","notification"]))),128))]),_:1},16,["class"]),p(k,null,{default:m(()=>[H(h("div",{class:S(t(v)("notifications--none",e.$attrs.class))},null,2),[[B,t(i).length>0]])]),_:1}),p(k,null,{default:m(()=>[H(h("dialog",{id:o.id,class:S(t(v)(`notifications-modal
			bg-transparent
			p-0
			backdrop:bg-black/50
			backdrop:p-5
		`,e.$attrs.class)),ref_key:"dialogEl",ref:n,onClick:r[0]||(r[0]=A(u=>t(i)[0]&&t(I).dismiss(t(i)[0]),["self","prevent"]))},[h("form",null,[t(i).length>0&&t(i)[0]?(c(),C(O,{key:0,handler:t(a),class:"top-notification",notification:t(i)[0],ref:"topNotificationComp"},null,8,["handler","notification"])):V("",!0)])],10,R),[[B,t(i).length>0]])]),_:1})],64))}}),U=Object.freeze(Object.defineProperty({__proto__:null,default:Y},Symbol.toStringTag,{value:"Module"}));export{U as L,Y as _,P as u};
