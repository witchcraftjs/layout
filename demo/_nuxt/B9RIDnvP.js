import{at as X,z as n,A as r,B as o,X as le,K as ie,a4 as F,c as se,Z as O,k as s,N as b,O as W,Q as c,C as m,M as N,U as S,V as H,aM as ae,b9 as P,l as I,i as y,D as g,E as L,W as B,T as ne,a1 as re}from"./DqUrqeTS.js";const oe={style:{"vertical-align":"-0.125em",height:"1em",display:"inline-block",width:"auto"},viewBox:"0 0 24 24"};function ue(l,p){return n(),r("svg",oe,[...p[0]||(p[0]=[o("g",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2"},[o("path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}),o("path",{d:"M14 2v5a1 1 0 0 0 1 1h5"})],-1)])])}const ce=X({name:"lucide-file",render:ue}),fe={style:{"vertical-align":"-0.125em",height:"1em",display:"inline-block",width:"auto"},viewBox:"0 0 24 24"};function de(l,p){return n(),r("svg",fe,[...p[0]||(p[0]=[o("path",{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M12 3v12m5-7l-5-5l-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"},null,-1)])])}const me=X({name:"lucide-upload",render:de}),pe=["for"],ve={class:"text-ellipsis overflow-hidden shrink-1 hidden @min-[15ch]:block"},he={key:1,class:"file-input--label-count"},ge={key:2,class:"file-input--label-name text-ellipsis overflow-hidden shrink-9999 hidden @3xs:block"},xe={key:3,class:"file-input--label-name text-ellipsis overflow-hidden shrink-9999 @3xs:hidden"},we={key:0,class:"file-input--formats-label flex-col items-center text-sm max-w-full hidden @min-[15ch]:flex"},be={class:"text-ellipsis overflow-hidden max-w-full"},ye={class:"file-input--formats-list overflow-hidden text-ellipsis max-w-full"},ke=["id","accept","multiple","aria-invalid","aria-errormessage"],je={class:"flex flex-initial basis-full justify-start items-center max-w-full gap-2 px-1"},Ue=["title"],$e={class:"file-input--preview flex flex-initial basis-full justify-center"},Ie={key:0,class:"file-input--preview-image bg-transparency-squares flex h-[80px] flex-wrap items-center justify-center"},Le=["src"],Ae={key:1,class:"file-input--preview-no-image flex h-[80px] flex-1 basis-full flex-wrap items-center justify-center"},Ee={key:1,class:"file-input--errors flex flex-col gap-2 text-sm text-red-600 dark:text-red-400 items-center px-2"},Ve=Object.assign({name:"WFileInput",inheritAttrs:!1},{__name:"WFileInput",props:{id:{type:String,required:!1},multiple:{type:Boolean,required:!1,default:!1},formats:{type:Array,required:!1,default:()=>["image/*",".jpeg",".jpg",".png"]},compact:{type:Boolean,required:!1,default:!1},schema:{type:Object,required:!1},inputAttrs:{type:Object,required:!1},wrapperAttrs:{type:Object,required:!1}},emits:["input","errors"],setup(l,{expose:p,emit:K}){const w=le(),v=y(null),h=l,C=ie(h),M=K,i=P([]),k=y(!1),x=P([]),A=y(!1),f=y(!1),j=y([]);F(i,async()=>{if(f.value=!0,!h.schema||i.length===0){j.value=[],f.value=!1;return}const e=await h.schema["~standard"].validate(i.map(a=>a.file));if(e&&"issues"in e&&e.issues){f.value=!1,j.value=e.issues.map((a,t)=>({message:a.message,file:i[t]}));return}j.value=[],f.value=!1});const d=I(()=>[...x,...j.value.map(e=>new Error(e.message))]);function E(){v.value&&(v.value.value="");for(const e of i)e.previewUrl&&URL.revokeObjectURL(e.previewUrl);i.splice(0,i.length)}F([i,f],()=>{f.value||M("input",i.map(e=>e.file),E)}),F([d,f],()=>{f.value||d.value.length>0&&(A.value=!0,M("errors",[...d.value],R,E))});function R(){A.value=!1,x.splice(0,x.length)}const Q=I(()=>h.formats?.filter(e=>!e.startsWith("."))??[]),V=I(()=>h.formats?.filter(e=>e.startsWith("."))??[]);se(()=>{for(const e of i)e.previewUrl&&URL.revokeObjectURL(e.previewUrl)});function Z(e){e.previewUrl&&URL.revokeObjectURL(e.previewUrl);const a=i.indexOf(e);a>-1&&i.splice(a,1)}const G=I(()=>V.value.join(", "));function J(e){if("dataTransfer"in e&&e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files.length>0)return v.value.files=e.dataTransfer.files,e.preventDefault(),k.value=!1,T(v.value.files)}async function Y(e){if(e.preventDefault(),v.value.files)return T(v.value.files)}function T(e){const a=[];for(const t of e){const U=t.type.startsWith("image"),_=h.formats.length===0,q=Q.value.find(u=>u.endsWith("/*")?t.type.startsWith(u.slice(0,-2)):u===t.type)!==void 0,D=V.value.find(u=>t.name.endsWith(u))!==void 0;if(!_&&(!q||!D)){const u=t.name.match(/.*(\..*)/)?.[1]??"Unknown",ee=t.type===""?"":` (${t.type})`,te=`File type ${u}${ee} is not allowed. Allowed file types are: ${G.value}.`,$=new Error(te);$.file=t,$.isValidExtension=D,$.isValidMimeType=q,a.push($);continue}const z=U?URL.createObjectURL(t):void 0;a.length>0||i.find(u=>u.file===t)||(h.multiple||i.length<1?i.push({file:t,isImg:U,previewUrl:z}):i.splice(0,i.length,{file:t,isImg:U,previewUrl:z}))}if(a.length>0)return x.splice(0,x.length,...a),!1;x.length>0&&R()}return p({clearFiles:E,clearErrors:R}),(e,a)=>(n(),r("div",N({class:s(b)(`
		file-input
		justify-center
		border-2
		border-dashed
		border-accent-500/80
		focus-outline-within
		transition-[border-color,box-shadow]
		ease-out
		hover:bg-accent-500/10
		outlined-focus-within
	`,l.compact&&"rounded-sm",!l.compact&&`
			flex
			w-full
			flex-col
			items-stretch
			gap-2
			rounded-xl
			p-2
		`,k.value&&"bg-accent-500/10",d.value.length>0&&A.value&&"errored border-red-400 hover:border-red-500",l.wrapperAttrs?.class)},{...l.wrapperAttrs,class:void 0},{onDrop:J,onDragover:a[1]||(a[1]=ae(t=>k.value=!0,["prevent"])),onDragleave:a[2]||(a[2]=t=>k.value=!1)}),[o("div",{class:O(s(b)(`
			file-input--wrapper
			relative
			justify-center
		`,l.compact&&"flex gap-2",!l.compact&&`
				file-input
				flex
				flex-col
				items-center
			`))},[o("label",{for:s(C),class:O(s(b)(`
				file-input--label
				pointer-events-none
				flex
				gap-1
				items-center
				justify-center
				whitespace-nowrap
				max-w-full
				px-1
			`))},[l.compact||l.multiple||s(i).length===0?W(e.$slots,"icon",{key:0},()=>[g(B,null,{default:L(()=>[g(s(me))]),_:1})]):c("",!0),W(e.$slots,"label",{},()=>[o("div",ve,m(l.compact?l.multiple?s(w)("file-input.compact-choose-file-plural"):s(w)("file-input.compact-choose-file"):l.multiple?s(w)("file-input.non-compact-choose-file-plural"):s(w)("file-input.non-compact-choose-file")),1)]),l.compact&&l.multiple?(n(),r("div",he,m(` (${s(i).length})`),1)):c("",!0),l.compact&&!l.multiple&&s(i).length>0?(n(),r("div",ge,m(` (${s(i)[0]?.file.name})`),1)):c("",!0),l.compact&&!l.multiple&&s(i).length>0?(n(),r("div",xe,m(" (...)"))):c("",!0)],10,pe),!l.compact&&l.formats?.length>0?(n(),r("label",we,[W(e.$slots,"formats",{},()=>[o("div",be,m(s(w)("file-input.accepted-formats"))+":",1)]),o("div",ye,m(V.value.join(", ")),1)])):c("",!0),o("input",N({id:s(C),class:s(b)(`
				file-input--input
				absolute
				inset-[calc(var(--spacing)*-2)]
				cursor-pointer
				z-0
				text-[0]
				opacity-0
			`,l.inputAttrs?.class),type:"file",accept:l.formats.join(", "),multiple:l.multiple},{...l.inputAttrs,class:void 0},{"aria-invalid":d.value.length>0,"aria-errormessage":d.value.map(t=>t.message).join(", "),ref_key:"el",ref:v,onInput:Y,onClick:a[0]||(a[0]=t=>t.target.value=null)}),null,16,ke)],2),!l.compact&&s(i).length>0?(n(),r("div",{key:0,class:O(s(b)(`file-input--previews
			flex items-stretch justify-center gap-4 flex-wrap
			`,l.multiple&&`
				w-full
			`))},[(n(!0),r(S,null,H(s(i),t=>(n(),r("div",{class:"file-input--preview-wrapper z-1 relative flex min-w-0 max-w-[150px] flex-initial flex-col items-center gap-1 p-1 rounded-sm border border-neutral-300 dark:border-neutral-800 shadow-md shadow-neutral-800/30 bg-neutral-100 dark:bg-neutral-900 [&:hover_.file-input--remove-button]:opacity-100",key:t.file.name},[o("div",je,[g(re,{border:!1,class:"file-input--remove-button rounded-full p-0","aria-label":`Remove file ${t.file.name}`,onClick:U=>Z(t)},{default:L(()=>[g(B,null,{default:L(()=>[g(s(ne))]),_:1})]),_:1},8,["aria-label","onClick"]),o("div",{class:"file-input--preview-filename min-w-0 flex-1 basis-0 truncate break-all rounded-sm text-sm",title:t.file.name},m(t.file.name),9,Ue)]),o("div",$e,[t.isImg?(n(),r("div",Ie,[o("img",{class:"max-h-full w-auto",src:t.previewUrl},null,8,Le)])):c("",!0),t.isImg?c("",!0):(n(),r("div",Ae,[g(B,null,{default:L(()=>[g(s(ce),{class:"text-4xl opacity-50"})]),_:1})]))])]))),128))],2)):c("",!0),!l.compact&&d.value.length>0?(n(),r("div",Ee,[(n(!0),r(S,null,H(d.value,t=>(n(),r("div",{class:"file-input--error text-center",key:t.message},m(t.message),1))),128))])):c("",!0)],16))}});export{Ve as default};
