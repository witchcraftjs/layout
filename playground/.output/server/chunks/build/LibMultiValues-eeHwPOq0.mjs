import { defineComponent, mergeModels, mergeDefaults, computed, useModel, mergeProps, unref, readonly, withCtx, createVNode, useSSRContext } from 'vue';
import { _ as __unplugin_components_1 } from './xmark-gUIVnf6w.mjs';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { r as removeIfIn } from './removeIfIn-CtfXxQlL.mjs';
import { u as useDivideAttrs } from './useDivideAttrs-nfucohOx.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import _sfc_main$2 from './Icon-DwfOmCfH.mjs';
import _sfc_main$1 from './LibButton-Bo9yy1km.mjs';
import { b as baseInteractivePropsDefaults } from './props-Dju_GRu4.mjs';
import './keys-D_QFUzvn.mjs';
import 'tailwind-merge';
import './isBlank-HbqDBAiD.mjs';
import './useAriaLabel-DmRBLde2.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-multi-values",
    inheritAttrs: false
  },
  __name: "LibMultiValues",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels(/* @__PURE__ */ mergeDefaults({
    label: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    preventDuplicateValues: { type: Boolean },
    values: {}
  }, {
    ...baseInteractivePropsDefaults
  }), {
    "values": { default: () => [] },
    "valuesModifiers": {}
  }),
  emits: ["update:values"],
  setup(__props) {
    const $ = useDivideAttrs(["item"]);
    const props = __props;
    const canEdit = computed(() => !props.disabled && !props.readonly);
    const $values = useModel(__props, "values");
    const removeVal = (value) => {
      if (!canEdit.value) return;
      removeIfIn($values.value, value);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_i_fa6_solid_xmark = __unplugin_components_1;
      if ($values.value && ((_a = $values.value) == null ? void 0 : _a.length) > 0) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: unref(twMerge)(
            `
		values
		group
		flex
		flex-initial
		items-center
		justify-center
		gap-1
		overflow-x-scroll
		scrollbar-hidden
	`,
            (_b = unref($)) == null ? void 0 : _b.class
          ),
          "data-disabled": _ctx.disabled,
          "data-read-only": "readonly" in _ctx ? _ctx.readonly : unref(readonly),
          "aria-label": `Values for ${_ctx.label}`,
          tabindex: _ctx.disabled ? -1 : 0
        }, { ...unref($), class: void 0 }, _attrs))}><!--[-->`);
        ssrRenderList($values.value, (value) => {
          var _a2;
          _push(`<div${ssrRenderAttr("data-border", _ctx.border)} class="${ssrRenderClass(unref(twMerge)(
            `
				value_wrapper
				flex-basis-0
				min-w-2
				flex
				max-w-fit
				flex-1
				items-center
				gap-0.5
				overflow-hidden
				px-1
				text-xs
				leading-none`,
            !(_ctx.disabled || ("readonly" in _ctx ? _ctx.readonly : unref(readonly))) && `
				group-focus:text-accent-500
				focus:text-accent-500`,
            _ctx.border && `
				rounded
				border-neutral-400
				border
				focus:border-accent-400
			`,
            _ctx.border && (_ctx.disabled || ("readonly" in _ctx ? _ctx.readonly : unref(readonly))) && `
				border-neutral-200
				focus:border-neutral-200
				dark:border-neutral-800
				dark:focus:border-neutral-800
			`,
            (_a2 = unref($).itemAttrs) == null ? void 0 : _a2.class
          ))}"${ssrRenderAttr("tabindex", canEdit.value ? 0 : void 0)}><span class="value_label truncate">${ssrInterpolate(value)}</span>`);
          _push(ssrRenderComponent(_sfc_main$1, {
            class: "!p-0 text-sm !leading-none",
            "aria-label": `Remove ${value}`,
            border: false,
            disabled: _ctx.disabled || ("readonly" in _ctx ? _ctx.readonly : unref(readonly)),
            onClick: ($event) => removeVal(value)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_sfc_main$2, null, {
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
                  createVNode(_sfc_main$2, null, {
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
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibMultiValues/LibMultiValues.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibMultiValues-eeHwPOq0.mjs.map
