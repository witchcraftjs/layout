import { defineComponent, mergeModels, useAttrs, useModel, computed, ref, mergeProps, withCtx, unref, createVNode, renderSlot, createTextVNode, withDirectives, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrGetDirectiveProps, ssrRenderSlot, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { colord } from 'colord';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import _sfc_main$2 from './LibButton-Bo9yy1km.mjs';
import LibColorPicker from './LibColorPicker-CSaw1MtQ.mjs';
import _sfc_main$1 from './LibPopup-DLTOd7Jl.mjs';
import { g as getFallbackId } from './props-Dju_GRu4.mjs';
import 'tailwind-merge';
import './isBlank-HbqDBAiD.mjs';
import './useAriaLabel-DmRBLde2.mjs';
import './copy-gf1aXmzd.mjs';
import './isArray-DAX_U8q6.mjs';
import './Aria-fsIgizVX.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './Icon-DwfOmCfH.mjs';
import './LibSimpleInput-BlJOI1OO.mjs';

const vExtractRootEl = {
  // @ts-expect-error for registering properly without doing complicated case conversion
  directiveName: "extract-root-el",
  mounted(el, { value: callback }) {
    callback(el);
  },
  unmounted(_el, { value: callback }) {
    callback(null);
  },
  getSSRProps() {
    return {};
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-color-input"
  },
  __name: "LibColorInput",
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
  emits: ["update:modelValue"],
  setup(__props) {
    getFallbackId();
    const $attrs = useAttrs();
    const $value = useModel(__props, "modelValue");
    const stringColor = computed(() => colord($value.value).toRgbString());
    const tempValue = ref({ ...$value.value });
    const showPopup = ref(false);
    const togglePopup = () => {
      if (showPopup.value) {
        $value.value = tempValue.value;
      }
      showPopup.value = !showPopup.value;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        modelValue: showPopup.value,
        "onUpdate:modelValue": ($event) => showPopup.value = $event
      }, _attrs), {
        button: withCtx(({ extractEl }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, mergeProps({
              id: _ctx.id,
              class: unref(twMerge)(
                `
				flex flex-nowrap
			`,
                unref($attrs).class
              ),
              "aria-label": stringColor.value,
              title: stringColor.value
            }, { ...unref($attrs), class: void 0 }, { onClick: togglePopup }, ssrGetDirectiveProps(_ctx, unref(vExtractRootEl), extractEl)), {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="color-label whitespace-nowrap pr-2"${_scopeId2}>`);
                  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                    _push3(`Pick Color`);
                  }, _push3, _parent3, _scopeId2);
                  _push3(`</span><div class="${ssrRenderClass(`color-swatch
						rounded-sm
						px-1
						flex-1
						h-4
						w-8
						relative
						aspect-square
						before:content-['']
						before:absolute
						before:inset-0
						before:bg-transparency-squares
						before:z-[-1]
					`)}" style="${ssrRenderStyle(`background:${stringColor.value}`)}"${_scopeId2}></div>`);
                } else {
                  return [
                    createVNode("span", { class: "color-label whitespace-nowrap pr-2" }, [
                      renderSlot(_ctx.$slots, "default", {}, () => [
                        createTextVNode("Pick Color")
                      ])
                    ]),
                    createVNode("div", {
                      class: `color-swatch
						rounded-sm
						px-1
						flex-1
						h-4
						w-8
						relative
						aspect-square
						before:content-['']
						before:absolute
						before:inset-0
						before:bg-transparency-squares
						before:z-[-1]
					`,
                      style: `background:${stringColor.value}`
                    }, null, 4)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              withDirectives((openBlock(), createBlock(_sfc_main$2, mergeProps({
                id: _ctx.id,
                class: unref(twMerge)(
                  `
				flex flex-nowrap
			`,
                  unref($attrs).class
                ),
                "aria-label": stringColor.value,
                title: stringColor.value
              }, { ...unref($attrs), class: void 0 }, { onClick: togglePopup }), {
                default: withCtx(() => [
                  createVNode("span", { class: "color-label whitespace-nowrap pr-2" }, [
                    renderSlot(_ctx.$slots, "default", {}, () => [
                      createTextVNode("Pick Color")
                    ])
                  ]),
                  createVNode("div", {
                    class: `color-swatch
						rounded-sm
						px-1
						flex-1
						h-4
						w-8
						relative
						aspect-square
						before:content-['']
						before:absolute
						before:inset-0
						before:bg-transparency-squares
						before:z-[-1]
					`,
                    style: `background:${stringColor.value}`
                  }, null, 4)
                ]),
                _: 2
              }, 1040, ["id", "class", "aria-label", "title"])), [
                [unref(vExtractRootEl), extractEl]
              ])
            ];
          }
        }),
        popup: withCtx(({ extractEl }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (showPopup.value) {
              _push2(ssrRenderComponent(LibColorPicker, mergeProps({
                id: _ctx.id,
                "allow-alpha": _ctx.allowAlpha,
                modelValue: tempValue.value,
                "onUpdate:modelValue": ($event) => tempValue.value = $event,
                onSave: ($event) => {
                  $value.value = tempValue.value;
                  showPopup.value = false;
                },
                onCancel: ($event) => showPopup.value = false
              }, ssrGetDirectiveProps(_ctx, unref(vExtractRootEl), extractEl)), null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              showPopup.value ? withDirectives((openBlock(), createBlock(LibColorPicker, {
                key: 0,
                id: _ctx.id,
                "allow-alpha": _ctx.allowAlpha,
                modelValue: tempValue.value,
                "onUpdate:modelValue": ($event) => tempValue.value = $event,
                onSave: ($event) => {
                  $value.value = tempValue.value;
                  showPopup.value = false;
                },
                onCancel: ($event) => showPopup.value = false
              }, null, 8, ["id", "allow-alpha", "modelValue", "onUpdate:modelValue", "onSave", "onCancel"])), [
                [unref(vExtractRootEl), extractEl]
              ]) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibColorInput/LibColorInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibColorInput-r9i8RQkx.mjs.map
