import { defineComponent, mergeModels, mergeDefaults, useModel, ref, computed, watch, watchPostEffect, mergeProps, unref, readonly, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { k as keys } from './keys-D_QFUzvn.mjs';
import { u as useAriaLabel } from './useAriaLabel-DmRBLde2.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import { b as baseInteractivePropsDefaults, g as getFallbackId } from './props-Dju_GRu4.mjs';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-recorder",
    inheritAttrs: false
  },
  __name: "LibRecorder",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels(/* @__PURE__ */ mergeDefaults({
    id: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    label: {},
    recordingValue: {},
    recordingTitle: {},
    recorder: {},
    binders: {}
  }, {
    recordingValue: "Recording",
    recordingTitle: "",
    id: void 0,
    binders: void 0,
    recorder: void 0,
    ...baseInteractivePropsDefaults
  }), {
    "recording": { type: Boolean, ...{ required: false, default: false } },
    "recordingModifiers": {},
    "modelValue": { required: true },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["recorder:blur", "recorder:click", "focus:parent"], ["update:recording", "update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const emits = __emit;
    const fallbackId = getFallbackId();
    const props = __props;
    const recording = useModel(__props, "recording");
    const modelValue = useModel(__props, "modelValue");
    const recorderEl = ref(null);
    ref(null);
    const canEdit = computed(() => !props.disabled && !props.readonly);
    const tempValue = ref(modelValue.value);
    watch([() => props.binders, () => props.binders], () => {
      if (recording.value) {
        throw new Error("Component was not designed to allow swapping out of binders/recorders while recording");
      }
    });
    watch(modelValue, () => {
      tempValue.value = modelValue.value;
    });
    const ariaLabel = useAriaLabel(props);
    const boundListeners = {};
    let isBound = false;
    const unbindListeners = () => {
      var _a;
      if (!isBound) return;
      isBound = false;
      if (props.recorder) {
        for (const key of keys(boundListeners)) {
          (_a = recorderEl.value) == null ? void 0 : _a.removeEventListener(key, boundListeners[key]);
          delete boundListeners[key];
        }
      }
      if (props.binders && recorderEl.value) {
        props.binders.unbind(recorderEl.value);
      }
    };
    const bindListeners = () => {
      var _a;
      if (!props.recorder && !props.binders) {
        throw new Error("Record is true but no recorder or binders props was passed");
      }
      if (props.recorder && props.binders) {
        throw new Error("Recording is true and was passed both a recorder and a binders prop. Both cannot be used at the same time.");
      }
      isBound = true;
      if (props.recorder) {
        for (const key of keys(props.recorder)) {
          (_a = recorderEl.value) == null ? void 0 : _a.addEventListener(key, props.recorder[key], { passive: false });
          boundListeners[key] = props.recorder[key];
        }
      }
      if (props.binders && recorderEl.value) {
        props.binders.bind(recorderEl.value);
      }
    };
    watchPostEffect(() => {
      if (!canEdit.value) {
        unbindListeners();
        recording.value = false;
        return;
      }
      if (recording.value) {
        bindListeners();
      } else {
        if ((props.recorder || props.binders) && isBound) {
          unbindListeners();
          emits("focus:parent");
        }
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: _ctx.id ?? unref(fallbackId),
        class: unref(twMerge)(
          `recorder
			flex items-center
			gap-2
			px-2
			grow-[999999]
			focus-outline-no-offset
			rounded
		`,
          _ctx.border && `
			border border-neutral-500
			focus:border-accent-500
		`,
          (_ctx.disabled || ("readonly" in _ctx ? _ctx.readonly : unref(readonly))) && `
			text-neutral-400
		`,
          (_ctx.disabled || ("readonly" in _ctx ? _ctx.readonly : unref(readonly))) && _ctx.border && `
			bg-neutral-50
			border-neutral-400
		`,
          _ctx.$attrs.class
        ),
        "aria-disabled": _ctx.disabled,
        "aria-readonly": "readonly" in _ctx ? _ctx.readonly : unref(readonly),
        tabindex: _ctx.disabled ? -1 : 0,
        title: recording.value ? _ctx.recordingTitle : tempValue.value,
        contenteditable: "false",
        ref_key: "recorderEl",
        ref: recorderEl
      }, { ...unref(ariaLabel), ..._ctx.$attrs, class: void 0 }, _attrs))}><div class="${ssrRenderClass(unref(twMerge)(
        `recorder-indicator
				inline-block
				bg-recorder-700
				rounded-full
				w-[1em]
				h-[1em]
				shrink-0
				hover:bg-recorder-500
			`,
        recording.value && `
				animate-[blink_1s_infinite]
				bg-recorder-500
			`,
        (_ctx.disabled || ("readonly" in _ctx ? _ctx.readonly : unref(readonly))) && `
				bg-neutral-500
			`
      ))}"></div><div class="recorder-value before:content-vertical-holder truncate">${ssrInterpolate(recording.value ? _ctx.recordingValue : tempValue.value)}</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibRecorder/LibRecorder.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibRecorder-y02UmzEq.mjs.map
