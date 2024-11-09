import { useSSRContext, defineComponent, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "aria" },
  __name: "Aria",
  __ssrInlineRender: true,
  props: {
    value: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ tabindex: "0" }, _attrs))} data-v-96b978dc>${ssrInterpolate(_ctx.value)}</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/Aria/Aria.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const aria = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-96b978dc"]]);

export { aria as default };
//# sourceMappingURL=Aria-fsIgizVX.mjs.map
