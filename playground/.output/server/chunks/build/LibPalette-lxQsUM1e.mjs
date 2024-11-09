import { defineComponent, mergeDefaults, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { k as keys } from './keys-D_QFUzvn.mjs';
import { b as baseInteractivePropsDefaults } from './props-Dju_GRu4.mjs';

const __default__ = { name: "lib-palette" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeDefaults({
    id: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    theme: {}
  }, {
    theme: () => ({}),
    ...baseInteractivePropsDefaults
  }),
  setup(__props) {
    const props = __props;
    const exclude = ["--color-bg", "--color-fg"];
    const colors = keys(props.theme.css).filter((key) => key.startsWith("--color") && !exclude.includes(key)).map((key) => key.replace("--color-", "bg-"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex h-full flex-col items-center justify-center" }, _attrs))}><div class="container mx-auto"><div class="grid grid-cols-11 gap-2 gap-y-10 px-10"><!--[-->`);
      ssrRenderList(unref(colors), (color, i) => {
        _push(`<div class="${ssrRenderClass(`h-10 ${color} rounded flex items-center justify-center text-fg dark:text-bg`)}">${ssrInterpolate([5, 16, 27, 38, 49].includes(i) ? "Text" : "")}</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibPalette/LibPalette.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibPalette-lxQsUM1e.mjs.map
