import { _ as __unplugin_components_0 } from './copy-gf1aXmzd.mjs';
import { defineComponent, useSlots, mergeProps, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderSlot } from 'vue/server-renderer';
import _sfc_main$2 from './Icon-DwfOmCfH.mjs';
import _sfc_main$1 from './LibButton-Bo9yy1km.mjs';
import './isBlank-HbqDBAiD.mjs';
import './useAriaLabel-DmRBLde2.mjs';
import './twMerge-D_Q1Xw-o.mjs';
import 'tailwind-merge';
import './props-Dju_GRu4.mjs';

const __default__ = {
  name: "lib-debug"
  // https://v3.vuejs.org/guide/typescript-support.html#annotating-props
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __ssrInlineRender: true,
  props: {
    value: { default: void 0 },
    tab: { default: 3 },
    title: { default: "Debug" }
  },
  setup(__props) {
    const $slots = useSlots();
    const props = __props;
    const getStringValue = (value) => value === void 0 ? "undefined" : typeof value === "string" ? value : JSON.stringify(value, null, "	");
    const findText = (children) => {
      let res = "";
      for (const child of children) {
        if (child.children) {
          if (typeof child.children === "string") res += child.children;
          else res += findText(child.children);
        } else {
          res += "\n";
        }
      }
      return res;
    };
    const copy = () => {
      if ((void 0).clipboard) {
        const text = props.value ? getStringValue(props.value) : findText([...$slots.default()[0].children]);
        (void 0).clipboard.writeText(text).catch(() => {
        });
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_i_fa6_regular_copy = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "lib-debug text-fg dark:text-bg flex flex-col rounded border border-danger-500 p-2" }, _attrs))}><div class="flex justify-between"><span class="font-bold">${ssrInterpolate(_ctx.title)}</span>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        class: "w-min-content",
        onClick: ($event) => copy()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_i_fa6_regular_copy, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_i_fa6_regular_copy)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$2, null, {
                default: withCtx(() => [
                  createVNode(_component_i_fa6_regular_copy)
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (_ctx.value) {
        _push(`<pre class="${ssrRenderClass(
          `
		[tab-size:${_ctx.tab}]
		`
        )}">${ssrInterpolate(getStringValue(_ctx.value))}</pre>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.value === void 0) {
        _push(`<pre>`);
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</pre>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibDebug/LibDebug.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibDebug-3WrB_ItW.mjs.map
