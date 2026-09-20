import{D as e,Ht as t,On as n,Zn as r,_ as i,b as a,bt as o,et as s,fn as c,g as l,it as u,mt as d,o as f,qt as p,tr as m,vn as h,xt as g,y as _,yn as v}from"./Car86Ubo.js";import{w as y}from"./BuJ-z5Um.js";import{s as b}from"#entry";import{t as x}from"./JCXPeO0D.js";import{t as S}from"./DQRMssAd.js";import{n as ee}from"./g2lPe_Oy.js";import{t as C}from"./CYXZYEL9.js";import{t as w}from"./BgGaekc7.js";var T={style:{"vertical-align":`-0.125em`,height:`1em`,display:`inline-block`,width:`auto`},viewBox:`0 0 24 24`};function E(e,t){return d(),a(`svg`,T,[...t[0]||=[i(`g`,{fill:`none`,stroke:`currentColor`,"stroke-linecap":`round`,"stroke-linejoin":`round`,"stroke-width":`2`},[i(`path`,{d:`M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`}),i(`path`,{d:`M14 2v5a1 1 0 0 0 1 1h5`})],-1)]])}var D=c({name:`lucide-file`,render:E}),O={style:{"vertical-align":`-0.125em`,height:`1em`,display:`inline-block`,width:`auto`},viewBox:`0 0 24 24`};function k(e,t){return d(),a(`svg`,O,[...t[0]||=[i(`path`,{fill:`none`,stroke:`currentColor`,"stroke-linecap":`round`,"stroke-linejoin":`round`,"stroke-width":`2`,d:`M12 3v12m5-7l-5-5l-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4`},null,-1)]])}var te=c({name:`lucide-upload`,render:k}),ne=[`for`],re={class:`text-ellipsis overflow-hidden shrink-1 hidden @min-[15ch]:block`},ie={key:1,class:`file-input--label-count`},ae={key:2,class:`file-input--label-name text-ellipsis overflow-hidden shrink-9999 hidden @3xs:block`},oe={key:3,class:`file-input--label-name text-ellipsis overflow-hidden shrink-9999 @3xs:hidden`},se={key:0,class:`file-input--formats-label flex-col items-center text-sm max-w-full hidden @min-[15ch]:flex`},ce={class:`text-ellipsis overflow-hidden max-w-full`},A={class:`file-input--formats-list overflow-hidden text-ellipsis max-w-full`},j=[`id`,`accept`,`multiple`,`aria-invalid`,`aria-errormessage`],M={class:`flex flex-initial basis-full justify-start items-center max-w-full gap-2 px-1`},N=[`title`],P={class:`file-input--preview flex flex-initial basis-full justify-center`},F={key:0,class:`file-input--preview-image bg-transparency-squares flex h-[80px] flex-wrap items-center justify-center`},I=[`src`],L={key:1,class:`file-input--preview-no-image flex h-[80px] flex-1 basis-full flex-wrap items-center justify-center`},R={key:1,class:`file-input--errors flex flex-col gap-2 text-sm text-red-600 dark:text-red-400 items-center px-2`},z=Object.assign({name:`WFileInput`,inheritAttrs:!1},{__name:`WFileInput`,props:{id:{type:String,required:!1},multiple:{type:Boolean,required:!1,default:!1},formats:{type:Array,required:!1,default:()=>[`image/*`,`.jpeg`,`.jpg`,`.png`]},compact:{type:Boolean,required:!1,default:!1},schema:{type:Object,required:!1},inputAttrs:{type:Object,required:!1},wrapperAttrs:{type:Object,required:!1},safeToPreviewMimeTypes:{type:Array,required:!1,default:()=>[`image/jpeg`,`image/jpg`,`image/png`,`image/gif`,`image/webp`,`image/bmp`,`image/x-icon`,`image/vnd.microsoft.icon`,`image/apng`,`image/avif`,`image/jxl`]}},emits:[`input`,`errors`],setup(c,{expose:T,emit:E}){let O=S(),k=h(null),z=c,B=w(z),V=E,H=v([]),U=h(!1),W=v([]),G=h(!1),K=h(!1),q=h([]);t(H,async()=>{if(K.value=!0,!z.schema||H.length===0){q.value=[],K.value=!1;return}let e=await z.schema[`~standard`].validate(H.map(e=>e.file));if(e&&`issues`in e&&e.issues){K.value=!1,q.value=e.issues.map((e,t)=>({message:e.message,file:H[t]}));return}q.value=[],K.value=!1});let J=l(()=>[...W,...q.value.map(e=>Error(e.message))]);function Y(){k.value&&(k.value.value=``);for(let e of H)e.previewUrl&&URL.revokeObjectURL(e.previewUrl);H.splice(0,H.length)}t([H,K],()=>{K.value||V(`input`,H.map(e=>e.file),Y)}),t([J,K],()=>{K.value||J.value.length>0&&(G.value=!0,V(`errors`,[...J.value],X,Y))});function X(){G.value=!1,W.splice(0,W.length)}let le=l(()=>z.formats?.filter(e=>!e.startsWith(`.`))??[]),Z=l(()=>z.formats?.filter(e=>e.startsWith(`.`))??[]);u(()=>{for(let e of H)e.previewUrl&&URL.revokeObjectURL(e.previewUrl)});function ue(e){e.previewUrl&&URL.revokeObjectURL(e.previewUrl);let t=H.indexOf(e);t>-1&&H.splice(t,1)}let Q=l(()=>Z.value.join(`, `));function de(e){if(`dataTransfer`in e&&e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files.length>0)return k.value.files=e.dataTransfer.files,e.preventDefault(),U.value=!1,$(k.value.files)}async function fe(e){if(e.preventDefault(),k.value.files)return $(k.value.files)}function $(e){let t=[];for(let n of e){let e=n.type.toLowerCase(),r=z.safeToPreviewMimeTypes.includes(e),i=e.startsWith(`image/`),a=z.formats.length===0,o=le.value.find(e=>e.endsWith(`/*`)?n.type.startsWith(e.slice(0,-2)):e===n.type)!==void 0,s=Z.value.find(e=>n.name.endsWith(e))!==void 0;if(!a&&(!o||!s)){let e=`File type ${n.name.match(/.*(\..*)/)?.[1]??`Unknown`}${n.type===``?``:` (${n.type})`} is not allowed. Allowed file types are: ${Q.value}.`,r=Error(e);r.file=n,r.isValidExtension=s,r.isValidMimeType=o,t.push(r);continue}let c=r?URL.createObjectURL(n):void 0;t.length>0||H.find(e=>e.file===n)||(z.multiple||H.length<1?H.push({file:n,isImg:i,isSafeToPreviewAsImg:r,previewUrl:c}):H.splice(0,H.length,{file:n,isImg:i,isSafeToPreviewAsImg:r,previewUrl:c}))}if(t.length>0)return W.splice(0,W.length,...t),!1;W.length>0&&X()}return T({clearFiles:Y,clearErrors:X}),(t,l)=>(d(),a(`div`,s({class:n(x)(`
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
	`,c.compact&&`rounded-sm`,!c.compact&&`
			flex
			w-full
			flex-col
			items-stretch
			gap-2
			rounded-xl
			p-2
		`,U.value&&`bg-accent-500/10`,J.value.length>0&&G.value&&`errored border-red-400 hover:border-red-500`,c.wrapperAttrs?.class)},{...c.wrapperAttrs,class:void 0},{onDrop:de,onDragover:l[1]||=y(e=>U.value=!0,[`prevent`]),onDragleave:l[2]||=e=>U.value=!1}),[i(`div`,{class:r(n(x)(`
			file-input--wrapper
			relative
			justify-center
		`,c.compact&&`flex gap-2`,!c.compact&&`
				file-input
				flex
				flex-col
				items-center
			`))},[i(`label`,{for:n(B),class:r(n(x)(`
				file-input--label
				pointer-events-none
				flex
				gap-1
				items-center
				justify-center
				whitespace-nowrap
				max-w-full
				px-1
			`))},[c.compact||c.multiple||n(H).length===0?g(t.$slots,`icon`,{},()=>[e(C,null,{default:p(()=>[e(n(te))]),_:1})],void 0,0):_(``,!0),g(t.$slots,`label`,{},()=>[i(`div`,re,m(c.compact?c.multiple?n(O)(`file-input.compact-choose-file-plural`):n(O)(`file-input.compact-choose-file`):c.multiple?n(O)(`file-input.non-compact-choose-file-plural`):n(O)(`file-input.non-compact-choose-file`)),1)]),c.compact&&c.multiple?(d(),a(`div`,ie,m(` (${n(H).length})`),1)):_(``,!0),c.compact&&!c.multiple&&n(H).length>0?(d(),a(`div`,ae,m(` (${n(H)[0]?.file.name})`),1)):_(``,!0),c.compact&&!c.multiple&&n(H).length>0?(d(),a(`div`,oe,m(` (...)`))):_(``,!0)],10,ne),!c.compact&&c.formats?.length>0?(d(),a(`label`,se,[g(t.$slots,`formats`,{},()=>[i(`div`,ce,m(n(O)(`file-input.accepted-formats`))+`:`,1)]),i(`div`,A,m(Z.value.join(`, `)),1)])):_(``,!0),i(`input`,s({id:n(B),class:n(x)(`
				file-input--input
				absolute
				inset-[calc(var(--spacing)*-2)]
				cursor-pointer
				z-0
				text-[0]
				opacity-0
			`,c.inputAttrs?.class),type:`file`,accept:c.formats.join(`, `),multiple:c.multiple},{...c.inputAttrs,class:void 0},{"aria-invalid":J.value.length>0,"aria-errormessage":J.value.map(e=>e.message).join(`, `),ref_key:`el`,ref:k,onInput:fe,onClick:l[0]||=e=>e.target.value=null}),null,16,j)],2),!c.compact&&n(H).length>0?(d(),a(`div`,{key:0,class:r(n(x)(`file-input--previews
			flex items-stretch justify-center gap-4 flex-wrap
			`,c.multiple&&`
				w-full
			`))},[(d(!0),a(f,null,o(n(H),t=>(d(),a(`div`,{class:`file-input--preview-wrapper z-1 relative flex min-w-0 max-w-[150px] flex-initial flex-col items-center gap-1 p-1 rounded-sm border border-neutral-300 dark:border-neutral-800 shadow-md shadow-neutral-800/30 bg-neutral-100 dark:bg-neutral-900 [&:hover_.file-input--remove-button]:opacity-100`,key:t.file.name},[i(`div`,M,[e(ee,{border:!1,class:`file-input--remove-button rounded-full p-0`,"aria-label":`Remove file ${t.file.name}`,onClick:e=>ue(t)},{default:p(()=>[e(C,null,{default:p(()=>[e(n(b))]),_:1})]),_:1},8,[`aria-label`,`onClick`]),i(`div`,{class:`file-input--preview-filename min-w-0 flex-1 basis-0 truncate break-all rounded-sm text-sm`,title:t.file.name},m(t.file.name),9,N)]),i(`div`,P,[t.isImg?(d(),a(`div`,F,[i(`img`,{class:`max-h-full w-auto`,src:t.previewUrl},null,8,I)])):_(``,!0),t.isImg?_(``,!0):(d(),a(`div`,L,[e(C,null,{default:p(()=>[e(n(D),{class:`text-4xl opacity-50`})]),_:1})]))])]))),128))],2)):_(``,!0),!c.compact&&J.value.length>0?(d(),a(`div`,R,[(d(!0),a(f,null,o(J.value,e=>(d(),a(`div`,{class:`file-input--error text-center`,key:e.message},m(e.message),1))),128))])):_(``,!0)],16))}});export{z as default};