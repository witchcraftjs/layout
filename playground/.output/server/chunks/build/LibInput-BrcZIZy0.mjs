import { markRaw, defineComponent, mergeModels, mergeDefaults, useSlots, useModel, computed, ref, watch, toRef, mergeProps, unref, readonly, withCtx, renderSlot, createTextVNode, toDisplayString, createVNode, useSSRContext, openBlock, createElementBlock, createElementVNode, nextTick } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { i as isBlank } from './isBlank-HbqDBAiD.mjs';
import { p as pushIfNotIn } from './pushIfNotIn-COOXuhv8.mjs';
import { u as useDivideAttrs } from './useDivideAttrs-nfucohOx.mjs';
import { u as useSuggestionsInputAria, _ as _sfc_main$5 } from './LibSuggestions-CUh2Ev_y.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import _sfc_main$3 from './Icon-DwfOmCfH.mjs';
import _sfc_main$1 from './LibLabel-H-K3RMvs.mjs';
import _sfc_main$4 from './LibMultiValues-eeHwPOq0.mjs';
import _sfc_main$2 from './LibSimpleInput-BlJOI1OO.mjs';
import { b as baseInteractivePropsDefaults, g as getFallbackId } from './props-Dju_GRu4.mjs';
import './isArray-DAX_U8q6.mjs';
import './keys-D_QFUzvn.mjs';
import 'tailwind-merge';
import './xmark-gUIVnf6w.mjs';
import './removeIfIn-CtfXxQlL.mjs';
import './LibButton-Bo9yy1km.mjs';
import './useAriaLabel-DmRBLde2.mjs';

const _hoisted_1 = {
  style: { "vertical-align": "-0.125em", "height": "1em", "display": "inline-block", "width": "auto" },
  viewBox: "0 0 512 512"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "currentColor",
      d: "M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3L86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"
    }, null, -1)
  ]));
}
const __unplugin_components_0 = markRaw({ name: "fa6-solid-chevron-up", render });
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-input",
    inheritAttrs: false
  },
  __name: "LibInput",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels(/* @__PURE__ */ mergeDefaults({
    suggestions: {},
    suggestionLabel: { type: Function },
    restrictToSuggestions: { type: Boolean },
    updateOnlyOnSubmit: { type: Boolean },
    suggestionsFilter: { type: Function },
    allowOpenEmpty: { type: Boolean },
    canOpen: { type: Boolean },
    isValid: { type: Boolean },
    suggestionSelector: { type: Function },
    id: {},
    label: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    preventDuplicateValues: { type: Boolean },
    values: {},
    valid: { type: Boolean }
  }, {
    valid: true,
    suggestions: void 0,
    updateOnlyOnSubmit: false,
    ...baseInteractivePropsDefaults
  }), {
    "values": { default: void 0 },
    "valuesModifiers": {},
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["submit", "input", "keydown", "blur", "focus", "indicatorClick"], ["update:values", "update:modelValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    const $slots = useSlots();
    const emit = __emit;
    const fallbackId = getFallbackId();
    const props = __props;
    const $ = useDivideAttrs(["wrapper", "inner-wrapper", "suggestions", "multivalues"]);
    const $values = useModel(__props, "values");
    const $modelValue = useModel(__props, "modelValue");
    const fullId = computed(() => props.id ?? fallbackId);
    const inputValue = ref($modelValue.value);
    const canEdit = computed(() => !props.disabled && !props.readonly);
    const suggestionsComponent = ref(null);
    const activeSuggestion = ref(0);
    watch($modelValue, () => {
      inputValue.value = $modelValue.value;
    });
    const inputWrapperEl = ref(null);
    const isOpen = ref(false);
    const suggestionsIndicatorClickHandler = (e) => {
      nextTick(() => {
        var _a;
        if (props.suggestions) {
          (_a = suggestionsComponent.value) == null ? void 0 : _a.suggestions.toggle();
        }
      });
      emit("indicatorClick", e);
    };
    const handleKeydown = (e) => {
      var _a, _b;
      if (props.suggestions) {
        (_b = (_a = suggestionsComponent.value) == null ? void 0 : _a.inputKeydownHandler) == null ? void 0 : _b.call(_a, e);
      }
      emit("keydown", e);
    };
    const handleBlur = (e) => {
      var _a, _b;
      if (props.suggestions) {
        (_b = (_a = suggestionsComponent.value) == null ? void 0 : _a.inputBlurHandler) == null ? void 0 : _b.call(_a, e);
      }
      emit("blur", e);
    };
    const handleFocus = (e) => {
      var _a, _b;
      if (props.suggestions) {
        (_b = (_a = suggestionsComponent.value) == null ? void 0 : _a.inputFocusHandler) == null ? void 0 : _b.call(_a, e);
      }
      emit("focus", e);
    };
    function addValue(val) {
      if ($values.value === void 0) return;
      if (isBlank(val)) return;
      props.preventDuplicateValues ? pushIfNotIn($values.value, [val]) : $values.value.push(val);
      inputValue.value = "";
      $modelValue.value = "";
    }
    const suggestions = toRef(props, "suggestions");
    const inputAriaProps = useSuggestionsInputAria(
      fullId,
      isOpen,
      activeSuggestion,
      suggestions
    );
    const inputProps = computed(() => ({
      id: fullId.value,
      border: false,
      disabled: props.disabled,
      readonly: props.readonly,
      isValid: props.valid,
      onKeydown: handleKeydown,
      onBlur: handleBlur,
      onFocus: handleFocus,
      modelValue: inputValue.value,
      "onUpdate:modelValue": (e) => {
        inputValue.value = e;
        if (!props.suggestions && !props.updateOnlyOnSubmit) {
          $modelValue.value = e;
        }
      },
      onSubmit: (e) => {
        if (!props.suggestions) {
          $modelValue.value = e;
          emit("submit", e);
          if ($values.value) {
            addValue(e);
          }
        }
      },
      ...inputAriaProps.value,
      canEdit: canEdit.value,
      ...$.value.attrs,
      class: void 0
    }));
    const slotProps = computed(() => ({
      id: fullId.value,
      isOpen: isOpen.value,
      valid: props.valid,
      disabled: props.disabled,
      readonly: props.readonly
    }));
    const suggestionProps = computed(() => ({
      id: fullId.value,
      suggestions: props.suggestions,
      allowOpenEmpty: props.allowOpenEmpty,
      restrictToSuggestions: props.restrictToSuggestions,
      suggestionLabel: props.suggestionLabel,
      suggestionsFilter: props.suggestionsFilter,
      modelValue: $modelValue.value.toString(),
      inputValue: inputValue.value,
      isValid: props.isValid,
      "onUpdate:inputValue": (e) => inputValue.value = e,
      onSubmit: (e, suggestion) => {
        $modelValue.value = e;
        emit("submit", e, suggestion);
        if ($values.value) {
          addValue(e);
        }
      },
      "onUpdate:isOpen": (e) => {
        isOpen.value = e;
      },
      "onUpdate:activeSuggestion": (e) => activeSuggestion.value = e,
      ...$.value.suggestionsAttrs,
      class: void 0
    }));
    const multivaluesProps = computed(() => ({
      hasSlotRight: !$slots.right,
      label: props.label,
      border: props.border,
      disabled: props.disabled,
      readonly: props.readonly,
      values: $values.value,
      "onUpdate:values": (e) => $values.value = e,
      ...$.value.multivaluesAttrs,
      class: void 0
    }));
    __expose({
      suggestionsComponent,
      el: inputWrapperEl,
      inputValue
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_i_fa6_solid_chevron_up = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(twMerge)(
          `input wrapper
			grow
			flex
			flex-wrap
			`,
          _ctx.disabled && `
			text-neutral-400
		`,
          (_a = unref($).wrapperAttrs) == null ? void 0 : _a.class
        ),
        tabindex: "-1"
      }, { ...unref($).wrapperAttrs, class: void 0 }, {
        ref_key: "inputWrapperEl",
        ref: inputWrapperEl
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "label", { ...slotProps.value, label: _ctx.label }, () => {
        if (_ctx.label || unref($slots).default) {
          _push(ssrRenderComponent(_sfc_main$1, {
            id: _ctx.id ?? unref(fallbackId),
            disabled: _ctx.disabled,
            readonly: "readonly" in _ctx ? _ctx.readonly : unref(readonly),
            valid: _ctx.valid
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, "default", slotProps.value, () => {
                  _push2(`${ssrInterpolate(_ctx.label)}`);
                }, _push2, _parent2, _scopeId);
              } else {
                return [
                  renderSlot(_ctx.$slots, "default", slotProps.value, () => [
                    createTextVNode(toDisplayString(_ctx.label), 1)
                  ])
                ];
              }
            }),
            _: 3
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex-1"></div>`);
      }, _push, _parent);
      _push(`<div${ssrRenderAttrs(mergeProps({
        "data-border": _ctx.border,
        "data-invalid": !_ctx.valid,
        "data-disabled": _ctx.disabled,
        "data-read-only": "readonly" in _ctx ? _ctx.readonly : unref(readonly),
        "data-is-open": isOpen.value
      }, { ...unref($)["inner-wrapperAttrs"], class: void 0 }, {
        class: unref(twMerge)(
          `inner-wrapper
				relative
				flex
				flex-1
				basis-[100%]
				flex-wrap
				rounded
				gap-2
				px-2
			`,
          _ctx.border && `
				bg-inherit
				border
				border-neutral-500
				outlined-within:border-accent-500
			`,
          isOpen.value && `rounded-b-none`,
          !_ctx.valid && `
				border-danger-700
				outlined:!ring-danger-700
				text-danger-800
				dark:text-danger-400
				dark:border-danger-600
				`,
          ("readonly" in _ctx ? _ctx.readonly : unref(readonly)) && `
				bg-neutral-50
				text-neutral-800
				dark:bg-neutral-950
				dark:text-neutral-200
				`,
          _ctx.disabled && `
				bg-neutral-50
				text-neutral-400
				dark:border-neutral-600
				border-neutral-400
			`,
          (_b = unref($)["inner-wrapperAttrs"]) == null ? void 0 : _b.class
        )
      }))}>`);
      ssrRenderSlot(_ctx.$slots, "left", slotProps.value, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "input", { ...inputProps.value, ...slotProps.value, suggestionsIndicatorClickHandler }, () => {
        var _a2;
        _push(ssrRenderComponent(_sfc_main$2, mergeProps({
          class: unref(twMerge)(
            `p-0`,
            !unref($slots).left && `-ml-2 pl-2`,
            !unref($slots).right && (!$values.value || $values.value.length === 0) && !suggestions.value && `-mr-2 -pr-2`,
            (_a2 = unref($).attrs) == null ? void 0 : _a2.class
          )
        }, inputProps.value), null, _parent));
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "indicator", { isOpen: isOpen.value, suggestionsIndicatorClickHandler }, () => {
        if (suggestions.value) {
          _push(`<div${ssrRenderAttr("data-is-open", isOpen.value)} class="${ssrRenderClass(unref(twMerge)(
            `indicator flex flex-col justify-center`
          ))}">`);
          _push(ssrRenderComponent(_sfc_main$3, {
            class: isOpen.value && `rotate-180`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_i_fa6_solid_chevron_up, null, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(_component_i_fa6_solid_chevron_up)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "values", { ...multivaluesProps.value, ...slotProps.value }, () => {
        var _a2;
        if ($values.value && $values.value.length > 0) {
          _push(ssrRenderComponent(_sfc_main$4, mergeProps({
            class: unref(twMerge)(
              `
							grow-[9000]
							justify-space-between
							py-1
						`,
              !unref($slots).right && `
							-mr-1
						`,
              (_a2 = unref($).multivaluesAttrs) == null ? void 0 : _a2.class
            )
          }, multivaluesProps.value), null, _parent));
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "right", slotProps.value, null, _push, _parent);
      if (suggestions.value) {
        ssrRenderSlot(_ctx.$slots, "suggestions", { ...suggestionProps.value, ...slotProps.value }, () => {
          var _a2;
          _push(ssrRenderComponent(_sfc_main$5, mergeProps({
            class: unref(twMerge)(
              `
						absolute
						-inset-x-px
						z-10
						rounded-b
						border-accent-500
						border
						top-full
					`,
              !_ctx.border && `
						rounded
					`,
              (_a2 = unref($).suggestionsAttrs) == null ? void 0 : _a2.class
            ),
            ref_key: "suggestionsComponent",
            ref: suggestionsComponent
          }, suggestionProps.value), {
            item: withCtx((itemSlotProps, _push2, _parent2, _scopeId) => {
              if (_push2) {
                ssrRenderSlot(_ctx.$slots, "suggestion-item", itemSlotProps, null, _push2, _parent2, _scopeId);
              } else {
                return [
                  renderSlot(_ctx.$slots, "suggestion-item", itemSlotProps)
                ];
              }
            }),
            _: 3
          }, _parent));
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibInput/LibInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibInput-BrcZIZy0.mjs.map
