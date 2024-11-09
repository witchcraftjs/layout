import { defineComponent, mergeDefaults, useAttrs, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { i as isBlank } from './isBlank-HbqDBAiD.mjs';
import { u as useAriaLabel } from './useAriaLabel-DmRBLde2.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import { b as baseInteractivePropsDefaults, g as getFallbackId } from './props-Dju_GRu4.mjs';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-button"
  },
  __name: "LibButton",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeDefaults({
    id: {},
    label: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    color: { type: [String, Boolean] },
    autoTitleFromAria: { type: Boolean }
  }, {
    color: false,
    label: "",
    ...baseInteractivePropsDefaults
  }),
  setup(__props) {
    const $attrs = useAttrs();
    const fallbackId = getFallbackId();
    const props = __props;
    const ariaLabel = useAriaLabel(props, fallbackId);
    const autoTitle = computed(() => ({
      title: props.autoTitleFromAria ? $attrs["aria-label"] ?? props.label : void 0
    }));
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<button${ssrRenderAttrs(mergeProps({
        id: _ctx.id ?? unref(fallbackId),
        class: !_ctx.unstyle && unref(twMerge)(
          `
			button
			flex
			cursor-pointer
			items-center
			justify-center
			rounded
			px-1
			hover:cursor-pointer
			[&:hover_*]:cursor-pointer
			focus-outline
			disabled:shadow-none
			disabled:text-neutral-500
			disabled:cursor-default
			text-fg
			hover:text-accent-700
			dark:text-bg
			dark:hover:text-accent-500
			dark:disabled:text-neutral-500
			dark:disabled:hover:text-neutral-500
		`,
          !_ctx.color && `active:text-neutral-800`,
          _ctx.border && `
			transition-all
			bg-neutral-100
			shadow-[0_1px_1px_0]
			shadow-neutral-950/20
			hover:shadow-[0_1px_3px_0]
			hover:shadow-neutral-950/30
			hover:border-neutral-300

			relative
			after:absolute
			after:rounded
			after:inset-0
			after:content
			after:shadow-[0_1px_0_0_inset]
			after:shadow-bg/20
			hover:after:shadow-bg/60
			dark:after:shadow-bg/10
			dark:hover:after:shadow-bg/50
			after:pointer-events-none
			after:mix-blend-overlay

			active:shadow-inner
			active:shadow-fg/20
			active:border-transparent
			border
			border-neutral-400
			disabled:border-neutral-200
			disabled:bg-neutral-50

			dark:hover:shadow-accent-950/30
			dark:active:shadow-fg/40
			dark:active:border-neutral-900
			dark:bg-neutral-800
			dark:border-neutral-900
			dark:disabled:border-neutral-800
			dark:disabled:bg-neutral-900
		`,
          _ctx.border && (!_ctx.color || _ctx.color === `secondary`) && `
			after:shadow-bg/90
			hover:after:shadow-bg
			dark:after:shadow-bg/20
			dark:hover:after:shadow-bg/90
		`,
          !_ctx.border && _ctx.color === `primary` && `
			font-bold
			hover:text-accent-50
		`,
          !_ctx.border && _ctx.color === `ok` && `
			text-ok-600 hover:text-ok-500
			dark:text-ok-600 dark:hover:text-ok-500
		`,
          !_ctx.border && _ctx.color === `warning` && `
			text-warning-500 hover:text-warning-300
			dark:text-warning-600 dark:hover:text-warning-400
		`,
          !_ctx.border && _ctx.color === `danger` && `
			text-danger-500 hover:text-danger-300
			dark:text-danger-600 dark:hover:text-danger-400
		`,
          !_ctx.border && _ctx.color === `secondary` && `
			text-accent-700 hover:text-accent-500
			dark:text-accent-600 dark:hover:text-accent-400
		`,
          !_ctx.border && _ctx.color === `primary` && `
			text-accent-700 hover:text-accent-500
			dark:text-accent-600 dark:hover:text-accent-400
		`,
          _ctx.border && _ctx.color === `ok` && `
			text-ok-950
			hover:text-ok-800
			bg-ok-400
			border-ok-500
			hover:border-ok-600
			hover:shadow-ok-900/50

			dark:text-ok-100
			dark:hover:text-ok-200
			dark:bg-ok-700
			dark:border-ok-800
			dark:hover:border-ok-900
			dark:hover:shadow-ok-900/30
		`,
          _ctx.border && _ctx.color === `warning` && `
			text-warning-950
			hover:text-warning-900
			bg-warning-300
			border-warning-400
			hover:border-warning-400
			hover:shadow-warning-900/50

			dark:text-warning-100
			dark:hover:text-warning-200
			dark:bg-warning-700
			dark:border-warning-700
			dark:hover:shadow-warning-900/25
		`,
          _ctx.border && _ctx.color === `danger` && `
			text-danger-950
			hover:text-danger-900
			bg-danger-400
			border-danger-500
			hover:border-danger-500
			hover:shadow-danger-900/50

			dark:text-danger-100
			dark:hover:text-danger-200
			dark:bg-danger-900
			dark:border-danger-950
			dark:hover:shadow-ranger-500/10
		`,
          _ctx.border && _ctx.color === `secondary` && `
			text-accent-800
			dark:text-accent-400
		`,
          _ctx.border && _ctx.color === `primary` && `
			text-bg
			hover:text-bg
			bg-accent-600
			border-accent-700
			hover:border-accent-800
			hover:shadow-accent-950/30

			dark:text-bg
			dark:bg-accent-600
			dark:hover:text-accent-200
			dark:border-accent-800
			dark:hover:border-accent-700
			dark:hover:shadow-accent-900/50
		`,
          (_a = unref($attrs)) == null ? void 0 : _a.class
        ),
        type: unref($attrs).type ?? "submit",
        tabindex: 0,
        disabled: _ctx.disabled,
        "data-border": _ctx.border,
        "data-color": _ctx.color,
        "aria-disabled": _ctx.disabled
      }, {
        ...autoTitle.value,
        ...unref($attrs),
        class: void 0,
        ...unref(ariaLabel)
      }, _attrs))}><label${ssrRenderAttr("id", `label-${_ctx.id ?? unref(fallbackId)}`)} class="label pointer-events-none flex flex-1 items-center justify-center gap-1">`);
      ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "default", { label: _ctx.label }, () => {
        if (_ctx.label && !unref(isBlank)(_ctx.label)) {
          _push(`<span>${ssrInterpolate(_ctx.label)}</span>`);
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "icon-after", {}, null, _push, _parent);
      _push(`</label></button>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibButton/LibButton.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibButton-Bo9yy1km.mjs.map
