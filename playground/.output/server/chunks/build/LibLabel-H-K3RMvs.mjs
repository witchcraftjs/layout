import { defineComponent, mergeDefaults, useAttrs, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import { b as baseInteractivePropsDefaults, g as getFallbackId } from './props-Dju_GRu4.mjs';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-label"
  },
  __name: "LibLabel",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeDefaults({
    id: {},
    label: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    unstyled: { type: Boolean },
    valid: { type: Boolean }
  }, {
    id: "",
    unstyled: void 0,
    valid: true,
    ...baseInteractivePropsDefaults
  }),
  setup(__props) {
    const fallbackId = getFallbackId();
    const $attrs = useAttrs();
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<label${ssrRenderAttrs(mergeProps({
        id: `label-${_ctx.id ?? unref(fallbackId)}`,
        class: !_ctx.unstyled && unref(twMerge)(
          `
			pr-0
			text-sm
		`,
          !_ctx.valid && `text-danger-700`,
          (_a = unref($attrs)) == null ? void 0 : _a.class
        ),
        "data-disabled": _ctx.disabled,
        "data-invalid": !_ctx.valid,
        for: _ctx.id
      }, { ...unref($attrs), class: void 0 }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</label>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibLabel/LibLabel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibLabel-H-K3RMvs.mjs.map
