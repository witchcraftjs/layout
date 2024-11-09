import { defineComponent, mergeModels, mergeDefaults, useSlots, ref, useModel, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrLooseContain, ssrGetDynamicModelProps, ssrInterpolate } from 'vue/server-renderer';
import { u as useDivideAttrs } from './useDivideAttrs-nfucohOx.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import { b as baseInteractivePropsDefaults, g as getFallbackId } from './props-Dju_GRu4.mjs';
import './keys-D_QFUzvn.mjs';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-checkbox",
    inheritAttrs: false
  },
  __name: "LibCheckbox",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels(/* @__PURE__ */ mergeDefaults({
    id: {},
    label: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean }
  }, {
    ...baseInteractivePropsDefaults
  }), {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["submit"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const $ = useDivideAttrs(["label", "wrapper"]);
    useSlots();
    const fallbackId = getFallbackId();
    const el = ref(null);
    const inputEl = ref(null);
    const $value = useModel(__props, "modelValue");
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      let _temp0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(twMerge)(
          `
		flex
		items-center
		gap-1
	`,
          (_a = unref($).wrapperAttrs) == null ? void 0 : _a.class
        )
      }, { ...unref($).wrapperAttrs, class: void 0 }, {
        ref_key: "el",
        ref: el
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "left", {}, null, _push, _parent);
      _push(`<label${ssrRenderAttrs(mergeProps({
        class: ["flex items-center gap-1", unref(twMerge)(
          `
			flex
			items-center
			gap-1
		`,
          (_b = unref($).labelAttrs) == null ? void 0 : _b.class
        )]
      }, { ...unref($).labelAttrs, class: void 0 }, {
        for: _ctx.id ?? unref(fallbackId)
      }))}><input${ssrRenderAttrs((_temp0 = mergeProps({
        id: _ctx.id ?? unref(fallbackId),
        class: !_ctx.unstyle && unref(twMerge)(
          `
				focus-outline-no-offset
				m-0
				p-[0.4em]
				bg-bg
				dark:bg-fg
				appearance-none
				border
				border-accent-600
				rounded
				aspect-square
				relative
				checked:after:content
				checked:after:absolute
				checked:after:w-full
				checked:after:h-full
				checked:after:border-2
				checked:after:border-bg
				dark:checked:after:border-fg
				checked:after:rounded
				checked:after:top-0
				checked:after:left-0
				checked:after:bg-accent-700
				disabled:border-neutral-500
				disabled:checked:after:bg-neutral-700
			`,
          !_ctx.disabled && `after:cursor-pointer`,
          unref($).attrs.class
        ),
        type: "checkbox",
        disabled: _ctx.disabled,
        ref_key: "inputEl",
        ref: inputEl,
        checked: Array.isArray($value.value) ? ssrLooseContain($value.value, null) : $value.value
      }, { ...unref($).attrs, class: void 0 }), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, $value.value))))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(` ${ssrInterpolate(_ctx.label)}</label></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibCheckbox/LibCheckbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibCheckbox-AyJsWF-1.mjs.map
