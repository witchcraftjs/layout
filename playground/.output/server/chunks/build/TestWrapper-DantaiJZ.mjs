import { defineComponent, ref, computed, createVNode, resolveDynamicComponent, useSSRContext, watch } from 'vue';
import { ssrRenderVNode, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { c as castType } from './castType-pqMMfJfM.mjs';
import _sfc_main$1 from './LibDarkModeSwitcher-X-u6xjCG.mjs';
import './twMerge-D_Q1Xw-o.mjs';
import 'tailwind-merge';
import './Icon-DwfOmCfH.mjs';
import './LibButton-Bo9yy1km.mjs';
import './isBlank-HbqDBAiD.mjs';
import './useAriaLabel-DmRBLde2.mjs';
import './props-Dju_GRu4.mjs';

function useAccesibilityOutline(target, enable = ref(true)) {
  const outline = ref(false);
  const awaitingFocus = ref(false);
  const keydown = (_e) => {
    awaitingFocus.value = true;
    setTimeout(() => {
      awaitingFocus.value = false;
    }, 0);
  };
  const mousedown = (_e) => {
    awaitingFocus.value = false;
    outline.value = false;
  };
  const focusin = (_e) => {
    if (awaitingFocus.value && enable.value) {
      outline.value = true;
    }
  };
  const detach = () => {
    if (target.value) {
      castType(target.value);
      target.value.removeEventListener("focusin", focusin);
      target.value.removeEventListener("keydown", keydown);
      target.value.removeEventListener("mousedown", mousedown);
    }
  };
  watch(enable, (newVal, oldVal) => {
    if (newVal === oldVal) return;
    if (newVal) ;
    else {
      outline.value = false;
      detach();
    }
  });
  return { outline, control: enable };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "test-wrapper" },
  __name: "TestWrapper",
  __ssrInlineRender: true,
  props: {
    outline: { type: Boolean, required: false, default: () => false },
    forceOutline: { type: Boolean, required: false, default: () => false }
  },
  setup(__props) {
    const props = __props;
    const el = ref(null);
    const styleEl = ref(null);
    const autoOutline = useAccesibilityOutline(el).outline;
    const showOutline = computed(() => props.outline && autoOutline.value || props.forceOutline);
    const darkMode = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent("style"), {
        ref_key: "styleEl",
        ref: styleEl
      }, null), _parent);
      _push(`<div id="app" tabindex="-1" class="${ssrRenderClass((showOutline.value ? "group outlined outlined-visible" : "[&_*]:outline-none") + (darkMode.value ? " dark" : ""))}"><div class="flex gap-2 absolute right-0 top-0 m-1 dark:text-white"><div>Wrapper Controls:</div><div class="outline-indicator">${ssrInterpolate(showOutline.value ? "Outline Enabled" : "Outline Disabled")}</div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        "onUpdate:darkMode": ($event) => darkMode.value = $event
      }, null, _parent));
      _push(`</div><div class="p-10 dark:bg-neutral-900 dark:text-white">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/TestWrapper/TestWrapper.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=TestWrapper-DantaiJZ.mjs.map
