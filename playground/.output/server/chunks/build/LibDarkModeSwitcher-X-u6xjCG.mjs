import { markRaw, defineComponent, useAttrs, watch, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, useSSRContext, createElementBlock, createElementVNode, ref, computed, provide } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import _sfc_main$2 from './Icon-DwfOmCfH.mjs';
import _sfc_main$1 from './LibButton-Bo9yy1km.mjs';
import 'tailwind-merge';
import './isBlank-HbqDBAiD.mjs';
import './useAriaLabel-DmRBLde2.mjs';
import './props-Dju_GRu4.mjs';

const _hoisted_1$2 = {
  style: { "vertical-align": "-0.125em", "height": "1em", "display": "inline-block", "width": "auto" },
  viewBox: "0 0 512 512"
};
function render$2(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$2, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "currentColor",
      d: "M448 256c0-106-86-192-192-192v384c106 0 192-86 192-192M0 256a256 256 0 1 1 512 0a256 256 0 1 1-512 0"
    }, null, -1)
  ]));
}
const __unplugin_components_2 = markRaw({ name: "fa6-solid-circle-half-stroke", render: render$2 });
const _hoisted_1$1 = {
  style: { "vertical-align": "-0.125em", "height": "1em", "display": "inline-block", "width": "auto" },
  viewBox: "0 0 256 256"
};
function render$1(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1$1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "currentColor",
      d: "M116 36V20a12 12 0 0 1 24 0v16a12 12 0 0 1-24 0m80 92a68 68 0 1 1-68-68a68.07 68.07 0 0 1 68 68m-24 0a44 44 0 1 0-44 44a44.05 44.05 0 0 0 44-44M51.51 68.49a12 12 0 1 0 17-17l-12-12a12 12 0 0 0-17 17Zm0 119l-12 12a12 12 0 0 0 17 17l12-12a12 12 0 1 0-17-17M196 72a12 12 0 0 0 8.49-3.51l12-12a12 12 0 0 0-17-17l-12 12A12 12 0 0 0 196 72m8.49 115.51a12 12 0 0 0-17 17l12 12a12 12 0 0 0 17-17ZM48 128a12 12 0 0 0-12-12H20a12 12 0 0 0 0 24h16a12 12 0 0 0 12-12m80 80a12 12 0 0 0-12 12v16a12 12 0 0 0 24 0v-16a12 12 0 0 0-12-12m108-92h-16a12 12 0 0 0 0 24h16a12 12 0 0 0 0-24"
    }, null, -1)
  ]));
}
const __unplugin_components_1 = markRaw({ name: "ph-sun-bold", render: render$1 });
const _hoisted_1 = {
  style: { "vertical-align": "-0.125em", "height": "1em", "display": "inline-block", "width": "auto" },
  viewBox: "0 0 512 512"
};
function render(_ctx, _cache) {
  return openBlock(), createElementBlock("svg", _hoisted_1, _cache[0] || (_cache[0] = [
    createElementVNode("path", {
      fill: "currentColor",
      d: "M283.211 512c78.962 0 151.079-35.925 198.857-94.792c7.068-8.708-.639-21.43-11.562-19.35c-124.203 23.654-238.262-71.576-238.262-196.954c0-72.222 38.662-138.635 101.498-174.394c9.686-5.512 7.25-20.197-3.756-22.23A258 258 0 0 0 283.211 0c-141.309 0-256 114.511-256 256c0 141.309 114.511 256 256 256"
    }, null, -1)
  ]));
}
const __unplugin_components_0 = markRaw({ name: "fa-solid-moon", render });
const defaultLocalStorageKey = "prefersColorSchemeDark";
const defaultOrder = ["system", "dark", "light"];
const injectionKey = Symbol("isDarkMode");
const useDarkMode = ({
  useLocalStorage,
  darkModeOrder = defaultOrder
} = {}) => {
  const systemDarkMode = ref(false);
  const manualDarkMode = ref(void 0);
  watch(() => useLocalStorage && manualDarkMode, () => {
    if (useLocalStorage !== false) {
      localStorage.setItem(defaultLocalStorageKey, manualDarkMode.value ? "true" : "false");
    }
  });
  const darkMode = computed(() => manualDarkMode.value ?? systemDarkMode.value);
  const darkModeState = computed(
    () => manualDarkMode.value === void 0 ? "system" : manualDarkMode.value ? "dark" : "light"
  );
  function setDarkMode(value) {
    manualDarkMode.value = value === "dark" ? true : value === "light" ? false : void 0;
  }
  function cycleDarkMode() {
    const index = darkModeOrder.indexOf(darkModeState.value);
    if (index === 2) {
      setDarkMode(darkModeOrder[0]);
    } else {
      setDarkMode(darkModeOrder[index + 1]);
    }
  }
  provide(injectionKey, darkMode);
  return {
    darkMode,
    darkModeState,
    setDarkMode,
    cycleDarkMode,
    manualDarkMode,
    systemDarkMode
  };
};
const defaultDarkModeOrder = defaultOrder;
const __default__ = {
  name: "lib-dark-mode-switcher"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  __ssrInlineRender: true,
  props: {
    useLocalStorage: { type: [Boolean, String] },
    darkModeOrder: { default: () => defaultDarkModeOrder },
    autoLabel: { type: [Boolean, Object], default: () => ({
      light: "Light Mode",
      system: "System Mode",
      dark: "Dark Mode"
    }) }
  },
  emits: ["update:darkMode", "update:darkModeState"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const $attrs = useAttrs();
    const props = __props;
    const {
      darkMode,
      cycleDarkMode,
      darkModeState,
      manualDarkMode,
      systemDarkMode,
      setDarkMode
    } = useDarkMode(props);
    watch(darkMode, (value) => emit("update:darkMode", value));
    watch(darkModeState, (value) => emit("update:darkModeState", value));
    __expose({
      getUseDarkMode: () => ({
        darkMode,
        darkModeState,
        manualDarkMode,
        systemDarkMode,
        setDarkMode,
        cycleDarkMode
      })
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_i_fa_solid_moon = __unplugin_components_0;
      const _component_i_ph_sun_bold = __unplugin_components_1;
      const _component_i_fa6_solid_circle_half_stroke = __unplugin_components_2;
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ ...unref($attrs), class: void 0 }, {
        class: unref(twMerge)(
          `
			rounded-full
			after:rounded-full
		`,
          (_a = unref($attrs)) == null ? void 0 : _a.class
        ),
        title: `Switch dark mode type (current: ${unref(darkModeState)})`,
        label: _ctx.autoLabel ? _ctx.autoLabel[unref(darkModeState)] : "",
        onClick: unref(cycleDarkMode)
      }, _attrs), {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}>`);
            if (unref(darkModeState) === "dark") {
              _push2(ssrRenderComponent(_sfc_main$2, { class: "w-[1em]" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_i_fa_solid_moon, null, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_i_fa_solid_moon)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else if (unref(darkModeState) === "light") {
              _push2(ssrRenderComponent(_sfc_main$2, { class: "w-[1em]" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_i_ph_sun_bold, null, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_i_ph_sun_bold)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_sfc_main$2, { class: "w-[1em]" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_i_fa6_solid_circle_half_stroke, null, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_i_fa6_solid_circle_half_stroke)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", null, [
                unref(darkModeState) === "dark" ? (openBlock(), createBlock(_sfc_main$2, {
                  key: 0,
                  class: "w-[1em]"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_i_fa_solid_moon)
                  ]),
                  _: 1
                })) : unref(darkModeState) === "light" ? (openBlock(), createBlock(_sfc_main$2, {
                  key: 1,
                  class: "w-[1em]"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_i_ph_sun_bold)
                  ]),
                  _: 1
                })) : (openBlock(), createBlock(_sfc_main$2, {
                  key: 2,
                  class: "w-[1em]"
                }, {
                  default: withCtx(() => [
                    createVNode(_component_i_fa6_solid_circle_half_stroke)
                  ]),
                  _: 1
                }))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibDarkModeSwitcher/LibDarkModeSwitcher.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibDarkModeSwitcher-X-u6xjCG.mjs.map
