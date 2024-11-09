import { defineComponent, mergeDefaults, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlotInner, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import { b as baseInteractivePropsDefaults, g as getFallbackId } from './props-Dju_GRu4.mjs';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-progress-bar",
    inheritAttrs: false
  },
  __name: "LibProgressBar",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeDefaults({
    id: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    label: {},
    progress: {},
    autohideOnComplete: {},
    keepSpaceWhenHidden: { type: Boolean },
    clamp: {}
  }, {
    autohideOnComplete: -1,
    keepSpaceWhenHidden: false,
    clamp: () => [0, 100],
    ...baseInteractivePropsDefaults
  }),
  setup(__props) {
    const clampVal = (n, min, max) => Math.min(Math.max(n, min), max);
    const fallbackId = getFallbackId();
    const props = __props;
    const hide = ref(false);
    const psuedoHide = ref(false);
    let timeout;
    let type;
    if (props.autohideOnComplete > -1 && (props.progress >= 100 || props.progress < 0)) {
      if (props.keepSpaceWhenHidden) {
        hide.value = false;
        psuedoHide.value = true;
      } else {
        hide.value = true;
        psuedoHide.value = false;
      }
    }
    watch([
      () => props.progress,
      () => props.keepSpaceWhenHidden,
      () => props.autohideOnComplete
    ], () => {
      if (props.autohideOnComplete > -1 && (props.progress >= 100 || props.progress < 0)) {
        if (props.keepSpaceWhenHidden) {
          if (type === 1) return;
          clearTimeout(timeout);
          type = 1;
          timeout = setTimeout(() => {
            type = 0;
            hide.value = false;
            psuedoHide.value = true;
          }, props.autohideOnComplete);
        } else {
          if (type === 2) return;
          clearTimeout(timeout);
          type = 2;
          timeout = setTimeout(() => {
            type = 0;
            hide.value = true;
            psuedoHide.value = false;
          }, props.autohideOnComplete);
        }
      } else {
        clearTimeout(timeout);
        hide.value = false;
        psuedoHide.value = false;
      }
    }, { immediate: false });
    return (_ctx, _push, _parent, _attrs) => {
      if (!hide.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          id: _ctx.id ?? unref(fallbackId),
          class: unref(twMerge)(`
			w-[200px]
			whitespace-nowrap
			overflow-x-scroll
			scrollbar-hidden
			rounded
			flex
			text-fg
			relative
			before:content-['']
			text-sm
			min-w-[50px]
			after:shadow-inner
			after:shadow-black/50
			after:content-['']
			after:absolute
			after:inset-0
			after:pointer-events-none
			after:z-2
			after:transition-all
			before:shadow-inner
			before:shadow-black/50
			before:rounded
			before:bg-bars-gradient
			before:bars-bg-accent-700
			before:bars-fg-accent-800
			before:bars-angle-[-45deg]
			before:animate-[slide_10s_linear_infinite]
			before:[background-size:15px_15px]
			before:absolute
			before:w-[var(--progress)]
			before:top-0 before:bottom-0 before:left-0
			before:transition-all
			before:z-1
			before:duration-500
		`, psuedoHide.value && `
			after:opacity-0
			before:opacity-0
		`, _ctx.$attrs.class),
          "data-value": _ctx.progress,
          title: _ctx.label
        }, { ..._ctx.$attrs, class: void 0 }, {
          style: `--progress: ${clampVal(_ctx.progress, _ctx.clamp[0] ?? 0, _ctx.clamp[1] ?? 100)}%;`
        }, _attrs))}><div class="label-wrapper relative flex-1"><span class="before:content-vertical-holder"></span>`);
        ssrRenderSlotInner(_ctx.$slots, "default", {}, () => {
          if (!psuedoHide.value) {
            _push(`<label${ssrRenderAttr("for", _ctx.id)} class="text-bg absolute inset-0 flex justify-center"><div class="truncate">${ssrInterpolate(_ctx.label ?? "")}</div></label>`);
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent, null, true);
        ssrRenderSlotInner(_ctx.$slots, "default", {}, () => {
          if (!psuedoHide.value) {
            _push(`<label class="contrast-label pointer-events-none absolute inset-0 flex justify-center transition-all duration-500 [clip-path:inset(0_0_0_var(--progress))] dark:hidden"><div class="truncate">${ssrInterpolate(_ctx.label ?? "")}</div></label>`);
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent, null, true);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibProgressBar/LibProgressBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibProgressBar-DdRQ_JEJ.mjs.map
