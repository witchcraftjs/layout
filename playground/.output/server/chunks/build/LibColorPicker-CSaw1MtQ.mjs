import { _ as __unplugin_components_0 } from './copy-gf1aXmzd.mjs';
import { useSSRContext, defineComponent, mergeModels, useModel, ref, reactive, computed, watch, mergeProps, unref, withCtx, createVNode, createTextVNode } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { i as isArray } from './isArray-DAX_U8q6.mjs';
import { colord } from 'colord';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import aria from './Aria-fsIgizVX.mjs';
import _sfc_main$3 from './Icon-DwfOmCfH.mjs';
import _sfc_main$2 from './LibButton-Bo9yy1km.mjs';
import _sfc_main$1 from './LibSimpleInput-BlJOI1OO.mjs';
import { g as getFallbackId } from './props-Dju_GRu4.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'tailwind-merge';
import './isBlank-HbqDBAiD.mjs';
import './useAriaLabel-DmRBLde2.mjs';

const sliderClasses = `
	slider
	no-touch-action
	h-4
	w-full
	relative
	flex
`;
const handleClasses = `
	h-[var(--slider-size)]
	w-[var(--slider-size)]
	shadow-sm
	shadow-black/50
	border-2 border-neutral-700
	rounded-full
	absolute
	cursor-pointer
	outline-none
	focus:border-accent-500
	active:border-accent-500
	hover:border-accent-500
`;
const ariaDescription = "Use the arrow keys to move the handle, or use shift to move in 10 pixel increments.";
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-color-picker"
  },
  __name: "LibColorPicker",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    label: {},
    id: {},
    allowAlpha: { type: Boolean, default: true },
    border: { type: Boolean, default: true },
    copyTransform: { type: Function, default: (_val, stringVal) => stringVal }
  }, {
    "modelValue": { required: false, default: () => ({ r: 0, g: 0, b: 0 }) },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["save", "cancel"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const $value = useModel(__props, "modelValue");
    const fallbackId = getFallbackId();
    const props = __props;
    const emits = __emit;
    const pickerEl = ref(null);
    const hueSliderEl = ref(null);
    const alphaSliderEl = ref(null);
    const localColor = reactive({
      percent: {
        h: 0,
        s: 0,
        v: 0,
        a: 0
      },
      val: {
        h: 0,
        s: 0,
        v: 0,
        a: 0
      }
    });
    const localColorString = computed(
      () => colord(localColor.val).toRgbString()
    );
    const localColorStringOpaque = computed(
      () => colord({ ...localColor.val, a: 1 }).toRgbString()
    );
    const copy = () => {
      var _a;
      if ((void 0).clipboard) {
        const text = (_a = props.copyTransform) == null ? void 0 : _a.call(props, localColor.val, localColorString.value);
        (void 0).clipboard.writeText(text).catch(() => {
        });
      }
    };
    const updatePicker = (el, hue) => {
      const ctx = el.getContext("2d");
      const { height, width } = el;
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "white");
      gradient.addColorStop(1, "black");
      const gradientColor = ctx.createLinearGradient(0, 0, width, 0);
      gradientColor.addColorStop(0, `hsla(${hue},100%,50%,0)`);
      gradientColor.addColorStop(1, `hsla(${hue},100%,50%,1)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = gradientColor;
      ctx.globalCompositeOperation = "multiply";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    };
    const updateSlider = (el, stops, length = 360) => {
      const ctx = el.getContext("2d");
      const { height, width } = el;
      ctx.clearRect(0, 0, width, height);
      const end = isArray(stops) ? stops.length - 1 : length;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      for (let i = 0; i < end + 1; i++) {
        const stop = stops instanceof Function ? stops(i) : stops[i];
        gradient.addColorStop(i / end, stop);
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };
    ref("");
    const update = (_, { updatePosition = true, updateValue = true } = {}) => {
      if (alphaSliderEl.value) {
        const hsl = colord(_);
        const hsl0 = hsl.alpha(0).toHslString();
        const hsl1 = hsl.alpha(1).toHslString();
        updateSlider(alphaSliderEl.value, [hsl0, hsl1]);
      }
      updateSlider(hueSliderEl.value, (i) => `hsl(${i},100%,50%)`);
      updatePicker(pickerEl.value, _.h);
      if (updatePosition) {
        localColor.percent.h = Math.round(_.h / 360 * 1e4) / 100;
        localColor.percent.s = _.s;
        localColor.percent.v = 100 - _.v;
        localColor.percent.a = props.allowAlpha ? _.a !== void 0 ? _.a * 100 : 1 : 1;
      }
      if (updateValue) {
        localColor.val = { ..._, a: props.allowAlpha ? _.a : 1 };
      }
    };
    const parseInput = (e) => {
      var _a;
      const val = (_a = e.target) == null ? void 0 : _a.value;
      if (val) {
        const color = colord(val);
        if (!color.isValid()) return;
        update(color.toHsv());
      }
    };
    watch(props, () => {
      const color = colord($value.value);
      update(color.toHsv());
    });
    watch(localColor, () => {
      update(localColor.val, { updatePosition: false, updateValue: false });
    });
    const save = () => {
      const color = colord(localColor.val).toRgb();
      update(localColor.val, { updatePosition: false, updateValue: false });
      $value.value = color;
      emits("save", color);
    };
    const invertColors = computed(() => !!(localColor.percent.v < 50 || (localColor.val.a === void 0 || localColor.val.a < 0.5)));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_i_fa6_regular_copy = __unplugin_components_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: _ctx.id ?? unref(fallbackId),
        "aria-label": "color picker",
        class: unref(twMerge)(
          `color-picker
			[--slider-size:var(--spacing-4)]
			[--contrast-dark:var(--color-neutral-100)]
			[--contrast-light:var(--color-neutral-800)]
			[--fg:rgb(var(--contrast-dark))]
			[--bg:rgb(var(--contrast-light))]
			max-w-[300px]
			flex flex-col items-center justify-center
			bg-bg
			dark:bg-fg
			gap-3
			p-3
		`,
          invertColors.value && `
			[--fg:rgb(var(--contrast-light))]
			[--bg:rgb(var(--contrast-dark))]
		`,
          _ctx.border && `
			border rounded border-neutral-600
		`
        )
      }, _attrs))} data-v-8ac20dca><div class="${ssrRenderClass(`picker
			no-touch-action
			w-full
			aspect-square
			relative
			flex
			rounded
			focus:border-accent-500
		`)}" data-v-8ac20dca><canvas data-v-8ac20dca></canvas><div aria-live="assertive"${ssrRenderAttr("aria-description", ariaDescription)} class="${ssrRenderClass(`
					handle ${handleClasses}
					border-[var(--fg)]
					hover:shadow-black
					active:shadow-black
				`)}" tabindex="0" style="${ssrRenderStyle(`
					left: calc(${localColor.percent.s}% - var(--slider-size)/2);
					top: calc(${localColor.percent.v}% - var(--slider-size)/2);
					background: ${localColorStringOpaque.value};
				`)}" data-v-8ac20dca>`);
      _push(ssrRenderComponent(aria, {
        value: `saturation: ${localColor.percent.s}, value: ${localColor.percent.s}`
      }, null, _parent));
      _push(`</div></div><div class="${ssrRenderClass(`hue-slider ${sliderClasses}`)}" data-v-8ac20dca><canvas data-v-8ac20dca></canvas><div role="slider"${ssrRenderAttr("aria-valuenow", `${localColor.percent.h}`)}${ssrRenderAttr("aria-valuemin", 0)}${ssrRenderAttr("aria-valuemax", 100)} aria-label="hue slider"${ssrRenderAttr("aria-description", ariaDescription)} tabindex="0" class="${ssrRenderClass(`handle ${handleClasses} bg-neutral-50`)}" style="${ssrRenderStyle(`left: calc(${localColor.percent.h}% - var(--slider-size)/2)`)}" data-v-8ac20dca></div></div>`);
      if (_ctx.allowAlpha) {
        _push(`<div class="${ssrRenderClass(`alpha-slider ${sliderClasses}`)}" data-v-8ac20dca><canvas class="bg-transparency-squares" data-v-8ac20dca></canvas><div role="slider" aria-label="alpha slider"${ssrRenderAttr("aria-valuenow", `${localColor.percent.h}`)}${ssrRenderAttr("aria-valuemin", 0)}${ssrRenderAttr("aria-valuemax", 100)}${ssrRenderAttr("aria-description", ariaDescription)} tabindex="0" class="${ssrRenderClass(`handle ${handleClasses} bg-neutral-50`)}" style="${ssrRenderStyle(`left: calc(${localColor.percent.a}% - var(--slider-size)/2)`)}" data-v-8ac20dca></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="color-group flex w-full flex-1 gap-2" data-v-8ac20dca><div class="color-wrapper bg-transparency-squares relative aspect-square h-[calc(var(--slider-size)*3)] rounded-full shadow-sm" data-v-8ac20dca><div class="color size-full rounded-full border-2 border-neutral-600 dark:border-neutral-300" style="${ssrRenderStyle(`background:${localColorString.value}`)}" data-v-8ac20dca></div></div><div class="color-controls flex flex-1 items-center gap-2" data-v-8ac20dca>`);
      ssrRenderSlot(_ctx.$slots, "input", {}, () => {
        _push(ssrRenderComponent(_sfc_main$1, {
          class: "w-full",
          "aria-label": _ctx.label,
          "model-value": localColorString.value,
          onInput: parseInput
        }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$2, {
          "aria-label": "'copy'",
          onClick: ($event) => copy()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_sfc_main$3, null, {
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
                createVNode(_sfc_main$3, null, {
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
      }, _push, _parent);
      _push(`</div></div>`);
      ssrRenderSlot(_ctx.$slots, "buttons", {}, () => {
        _push(`<div class="save-cancel-group flex w-full items-center justify-center gap-2" data-v-8ac20dca>`);
        _push(ssrRenderComponent(_sfc_main$2, {
          onClick: ($event) => save()
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Save`);
            } else {
              return [
                createTextVNode("Save")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_sfc_main$2, {
          onClick: ($event) => emits("cancel")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Cancel`);
            } else {
              return [
                createTextVNode("Cancel")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibColorPicker/LibColorPicker.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LibColorPicker = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8ac20dca"]]);

export { LibColorPicker as default };
//# sourceMappingURL=LibColorPicker-CSaw1MtQ.mjs.map
