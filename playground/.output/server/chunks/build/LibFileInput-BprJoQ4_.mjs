import { markRaw, defineComponent, ref, shallowReactive, watch, computed, mergeProps, unref, withCtx, createVNode, useSSRContext, openBlock, createElementBlock, createElementVNode } from 'vue';
import { _ as __unplugin_components_1 } from './xmark-gUIVnf6w.mjs';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderSlot, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useDivideAttrs } from './useDivideAttrs-nfucohOx.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import _sfc_main$1 from './Icon-DwfOmCfH.mjs';
import _sfc_main$2 from './LibButton-Bo9yy1km.mjs';
import { g as getFallbackId } from './props-Dju_GRu4.mjs';
import './keys-D_QFUzvn.mjs';
import 'tailwind-merge';
import './isBlank-HbqDBAiD.mjs';
import './useAriaLabel-DmRBLde2.mjs';

const _hoisted_1$1 = {
  style: { "vertical-align": "-0.125em", "height": "1em", "display": "inline-block", "width": "auto" },
  viewBox: "0 0 384 512"
};
function render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "currentColor",
      d: "M320 464c8.8 0 16-7.2 16-16V160h-80c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16v384c0 8.8 7.2 16 16 16zM0 64C0 28.7 28.7 0 64 0h165.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64z"
    }, null, -1)
  ]));
}
const __unplugin_components_2 = markRaw({ name: "fa6-regular-file", render: render$1 });
const _hoisted_1 = {
  style: { "vertical-align": "-0.125em", "height": "1em", "display": "inline-block", "width": "auto" },
  viewBox: "0 0 448 512"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "currentColor",
      d: "M246.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l73.4-73.4V320c0 17.7 14.3 32 32 32s32-14.3 32-32V109.3l73.4 73.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-128-128zM64 352c0-17.7-14.3-32-32-32S0 334.3 0 352v64c0 53 43 96 96 96h256c53 0 96-43 96-96v-64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32z"
    }, null, -1)
  ]));
}
const __unplugin_components_0 = markRaw({ name: "fa6-solid-arrow-up-from-bracket", render });
const __default__ = { name: "lib-file-input" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  ...{
    name: "lib-file-input",
    inheritAttrs: false
  },
  __ssrInlineRender: true,
  props: {
    id: {},
    multiple: { type: Boolean, default: false },
    formats: { default: () => ["image/*", ".jpeg", ".jpg", ".png"] },
    compact: { type: Boolean, default: false }
  },
  emits: ["input", "errors"],
  setup(__props, { emit: __emit }) {
    const el = ref(null);
    const files = shallowReactive([]);
    const errors = shallowReactive([]);
    const errorFlashing = ref(false);
    watch(files, () => {
      emits("input", files.map((entry) => entry.file));
    });
    watch(errors, () => {
      if (errors.length > 0) {
        errorFlashing.value = true;
        setTimeout(() => {
          errorFlashing.value = false;
        }, 500);
        emits("errors", errors);
      }
    });
    const $ = useDivideAttrs(["wrapper", "input", "previews"]);
    const emits = __emit;
    const fallbackId = getFallbackId();
    const props = __props;
    computed(() => {
      var _a;
      return ((_a = props.formats) == null ? void 0 : _a.filter((_) => !_.startsWith("."))) ?? [];
    });
    const extensions = computed(() => {
      var _a;
      return ((_a = props.formats) == null ? void 0 : _a.filter((_) => _.startsWith("."))) ?? [];
    });
    const getSrc = (file) => {
      const src = URL.createObjectURL(file);
      return src;
    };
    const removeFile = (entry) => {
      const index = files.indexOf(entry);
      files.splice(index, 1);
    };
    computed(() => extensions.value.join(", "));
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_i_fa6_solid_arrow_up_from_bracket = __unplugin_components_0;
      const _component_i_fa6_solid_xmark = __unplugin_components_1;
      const _component_i_fa6_regular_file = __unplugin_components_2;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(twMerge)(
          `file-input
		justify-center
		border-2
		border-dashed
		border-accent-500/80
		focus-outline-within
		transition-[border-color,box-shadow]
		ease-out`,
          _ctx.compact && `rounded`,
          !_ctx.compact && `flex w-full flex-col items-center gap-2 rounded-xl  p-2 `,
          unref(errors).length > 0 && errorFlashing.value && `border-danger-400`,
          unref($).wrapperAttrs.class
        )
      }, { ...unref($).wrapperAttrs, class: void 0 }, _attrs))}><div class="${ssrRenderClass(unref(twMerge)(
        `relative justify-center`,
        _ctx.compact && `flex gap-2`,
        !_ctx.compact && `input-wrapper
		flex flex-col items-center
		`
      ))}"><label${ssrRenderAttr("for", _ctx.id ?? unref(fallbackId))} class="${ssrRenderClass(unref(twMerge)(
        `pointer-events-none flex gap-1 items-center whitespace-nowrap`
      ))}">`);
      if (_ctx.compact || _ctx.multiple || unref(files).length === 0) {
        ssrRenderSlot(_ctx.$slots, "icon", {}, () => {
          _push(ssrRenderComponent(_sfc_main$1, null, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_i_fa6_solid_arrow_up_from_bracket, null, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_i_fa6_solid_arrow_up_from_bracket)
                ];
              }
            }),
            _: 1
          }, _parent));
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "label", {}, () => {
        _push(`${ssrInterpolate((_ctx.compact ? "Choose File" : "Drag & Drop File") + (_ctx.multiple ? "s" : ""))}`);
      }, _push, _parent);
      if (_ctx.compact && _ctx.multiple) {
        _push(`<span>${ssrInterpolate(` (${unref(files).length})`)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label>`);
      if (!_ctx.compact && ((_a = _ctx.formats) == null ? void 0 : _a.length) > 0) {
        _push(`<label class="flex flex-col items-center text-sm">`);
        ssrRenderSlot(_ctx.$slots, "formats", {}, () => {
          _push(`Accepted Formats: `);
        }, _push, _parent);
        _push(`<div class="">${ssrInterpolate(extensions.value.join(", "))}</div></label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttrs(mergeProps({
        id: _ctx.id ?? unref(fallbackId),
        class: unref(twMerge)(
          `absolute inset-0
				z-0
				cursor-pointer
				text-[0]
				opacity-0
				`,
          (_b = unref($).inputAttrs) == null ? void 0 : _b.class
        ),
        type: "file",
        accept: _ctx.formats.join(", "),
        multiple: _ctx.multiple,
        ref_key: "el",
        ref: el
      }, { ...unref($).inputAttrs, class: void 0 }))}></div>`);
      if (!_ctx.compact && unref(files).length > 0) {
        _push(`<div class="${ssrRenderClass(unref(twMerge)(
          `previews
			flex items-stretch justify-center gap-2 flex-wrap
			`,
          _ctx.multiple && `
				w-full
			`,
          (_c = unref($).previewsAttrs) == null ? void 0 : _c.class
        ))}"><div class="flex-1"></div><!--[-->`);
        ssrRenderList(unref(files), (entry) => {
          _push(`<div class="preview z-1 relative flex min-w-0 max-w-[150px] flex-initial flex-wrap items-center gap-2 rounded border border-neutral-400 shadow-sm shadow-neutral-800/20"><div class="flex flex-initial basis-full justify-start">`);
          _push(ssrRenderComponent(_sfc_main$2, {
            border: false,
            "aria-label": `Remove file ${entry.file.name}`,
            onClick: ($event) => removeFile(entry)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_sfc_main$1, null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_i_fa6_solid_xmark, null, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(_component_i_fa6_solid_xmark)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_sfc_main$1, null, {
                    default: withCtx(() => [
                      createVNode(_component_i_fa6_solid_xmark)
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><div class="flex flex-initial basis-full justify-center">`);
          if (entry.isImg) {
            _push(`<div class="image bg-transparency-squares flex h-[80px] flex-wrap items-center justify-center"><img class="max-h-full w-auto"${ssrRenderAttr("src", getSrc(entry.file))}></div>`);
          } else {
            _push(`<!---->`);
          }
          if (!entry.isImg) {
            _push(`<div class="no-image flex h-[80px] flex-1 basis-full flex-wrap items-center justify-center">`);
            _push(ssrRenderComponent(_sfc_main$1, null, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_i_fa6_regular_file, { class: "text-4xl opacity-50" }, null, _parent2, _scopeId));
                } else {
                  return [
                    createVNode(_component_i_fa6_regular_file, { class: "text-4xl opacity-50" })
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="filename min-w-0 flex-1 basis-0 truncate break-all rounded p-1 text-sm"${ssrRenderAttr("title", entry.file.name)}>${ssrInterpolate(entry.file.name)}</div></div>`);
        });
        _push(`<!--]--><div class="flex-1"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibFileInput/LibFileInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibFileInput-BprJoQ4_.mjs.map
