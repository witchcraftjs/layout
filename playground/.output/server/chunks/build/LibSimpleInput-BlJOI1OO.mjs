import { defineComponent, mergeModels, mergeDefaults, useModel, useAttrs, mergeProps, unref, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrGetDynamicModelProps } from 'vue/server-renderer';
import { u as useAriaLabel } from './useAriaLabel-DmRBLde2.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import { b as baseInteractivePropsDefaults, g as getFallbackId } from './props-Dju_GRu4.mjs';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-simple-input",
    inheritAttrs: false
  },
  __name: "LibSimpleInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels(/* @__PURE__ */ mergeDefaults({
    id: {},
    label: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    placeholder: {},
    type: {},
    valid: { type: Boolean }
  }, {
    id: "",
    placeholder: "",
    valid: true,
    label: "",
    type: void 0,
    ...baseInteractivePropsDefaults
  }), {
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["submit", "input"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const fallbackId = getFallbackId();
    const props = __props;
    const modelValue = useModel(__props, "modelValue");
    const $attrs = useAttrs();
    const ariaLabel = useAriaLabel(props, fallbackId);
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      let _temp0;
      _push(`<input${ssrRenderAttrs((_temp0 = mergeProps({
        id: _ctx.id ?? unref(fallbackId),
        class: unref(twMerge)(
          `
			input
			flex-1
			grow-[999999]
			rounded
			px-1
			focus-outline
			min-w-[2rem]
			bg-inherit
			placeholder:text-neutral-400
			placeholder:focus:text-accent-300
			read-only:bg-neutral-50
			read-only:text-neutral-800
			read-only:placeholder:select-none
			read-only:placeholder:text-opacity-0
			read-only:focus:placeholder:text-opacity-0
			disabled:placeholder:text-nuetral-400
			disabled:cursor-unset
			disabled:bg-neutral-50
			disabled:text-neutral-400
			dark:read-only:bg-neutral-950
			dark:read-only:text-neutral-200
			dark:disabled:placeholder:text-nuetral-600
			dark:disabled:bg-neutral-950
			dark:disabled:text-neutral-500
		`,
          _ctx.type === `text` && `
			min-w-[10ch]
			w-full
		`,
          _ctx.type === `number` && `
			w-12
			placeholder:text-transparent
			appearance-none
		`,
          _ctx.border && `
			border
			border-neutral-500
			focus:border-accent-500
			disabled:border-neutral-400
			dark:disabled:border-neutral-600
		`,
          !_ctx.valid && `
			placeholder:text-danger-700
			border-danger-700
			outlined:!ring-danger-700
			text-danger-800
			dark:text-danger-400
			dark:placeholder:text-danger-700
			dark:border-danger-600
		`,
          (_a = unref($attrs)) == null ? void 0 : _a.class
        ),
        "data-border": _ctx.border,
        "data-invalid": !_ctx.valid,
        type: _ctx.type,
        placeholder: _ctx.placeholder,
        disabled: _ctx.disabled,
        readonly: "readonly" in _ctx ? _ctx.readonly : unref(readonly)
      }, { ...unref($attrs), class: void 0, ...unref(ariaLabel) }, _attrs), mergeProps(_temp0, ssrGetDynamicModelProps(_temp0, modelValue.value))))}>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibSimpleInput/LibSimpleInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibSimpleInput-BlJOI1OO.mjs.map
