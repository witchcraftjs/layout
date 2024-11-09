import { defineComponent, mergeModels, useAttrs, ref, useModel, watch, createVNode, resolveDynamicComponent, mergeProps, unref, withCtx, openBlock, createBlock, renderSlot, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderSlot, ssrRenderVNode, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { g as getFallbackId } from './props-Dju_GRu4.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import { i as isArray } from './isArray-DAX_U8q6.mjs';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ name: "lib-popup" },
  __name: "LibPopup",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    id: {},
    useBackdrop: { type: Boolean, default: true },
    preferredHorizontal: { type: [Array, Function], default: () => ["center", "right", "left", "either"] },
    preferredVertical: { type: [Array, Function], default: () => ["top", "bottom", "either"] },
    avoidRepositioning: { type: Boolean, default: false },
    modifyPosition: {}
  }, {
    "modelValue": { type: Boolean, ...{ default: false } },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props, { expose: __expose }) {
    const fallbackId = getFallbackId();
    const props = __props;
    const $attrs = useAttrs();
    const dialogEl = ref(null);
    const popupEl = ref(null);
    const buttonEl = ref(null);
    const backgroundEl = ref(null);
    const pos = ref({});
    const modelValue = useModel(__props, "modelValue");
    let isOpen = false;
    const getDialogBoundingRect = (el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: 0,
        y: 0,
        width: rect.left + rect.right,
        height: rect.top + rect.bottom,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      };
    };
    let lastButtonElPos;
    const recompute = (force = false) => {
      requestAnimationFrame(() => {
        var _a, _b;
        const horzHasCenterScreen = isArray(props.preferredHorizontal) && props.preferredHorizontal[0] === "center-screen";
        const vertHasCenterScreen = isArray(props.preferredVertical) && props.preferredVertical[0] === "center-screen";
        const canBePositionedWithoutButton = (horzHasCenterScreen || typeof props.preferredHorizontal === "function") && (vertHasCenterScreen || typeof props.preferredVertical === "function");
        if (!popupEl.value || !dialogEl.value || !buttonEl.value && !canBePositionedWithoutButton) {
          pos.value = {};
          return;
        }
        const el = (_a = buttonEl.value) == null ? void 0 : _a.getBoundingClientRect();
        const bg = ((_b = backgroundEl.value) == null ? void 0 : _b.getBoundingClientRect()) ?? (props.useBackdrop ? getDialogBoundingRect(dialogEl.value) : (void 0).body.getBoundingClientRect());
        const popup = popupEl.value.getBoundingClientRect();
        let finalPos = {};
        if (!force && modelValue.value && props.avoidRepositioning && buttonEl.value && lastButtonElPos) {
          const shiftX = buttonEl.value.getBoundingClientRect().x - lastButtonElPos.x;
          const shiftY = buttonEl.value.getBoundingClientRect().y - lastButtonElPos.y;
          pos.value.x += shiftX;
          pos.value.y += shiftY;
          lastButtonElPos = el;
          return;
        }
        const space = {
          left: 0,
          right: 0,
          leftLeft: 0,
          rightRight: 0,
          leftFromCenter: 0,
          rightFromCenter: 0,
          topFromCenter: 0,
          bottomFromCenter: 0,
          top: 0,
          bottom: 0
        };
        if (el) {
          space.left = el.x + el.width - bg.x;
          space.leftLeft = el.x - bg.x;
          space.right = bg.x + bg.width - (el.x + el.width);
          space.rightRight = bg.x + bg.width - el.x;
          space.leftFromCenter = el.x + el.width / 2 - bg.x;
          space.rightFromCenter = bg.x + bg.width - (el.x + el.width / 2);
          space.topFromCenter = el.y + el.height / 2 - bg.y;
          space.bottomFromCenter = bg.y + bg.height - (el.y + el.height / 2);
          space.top = el.y - bg.y;
          space.bottom = bg.y + bg.height - (el.y + el.height);
        }
        const { preferredHorizontal, preferredVertical } = props;
        let maxWidth;
        let maxHeight;
        if (typeof preferredHorizontal === "function") {
          finalPos.x = preferredHorizontal(el, popup, bg, space);
        } else {
          outerloop:
            for (const type of preferredHorizontal) {
              switch (type) {
                case "center-screen":
                  if (popup.width < bg.width) {
                    finalPos.x = bg.width / 2 - popup.width / 2;
                  } else {
                    finalPos.x = 0;
                    maxWidth = finalPos.x;
                  }
                  break;
                case "center-most":
                case "center":
                  if (space.leftFromCenter >= popup.width / 2 && space.rightFromCenter >= popup.width / 2) {
                    finalPos.x = el.x + el.width / 2 - popup.width / 2;
                    break outerloop;
                  }
                  if (space.rightFromCenter + space.leftFromCenter <= popup.width) {
                    finalPos.x = 0;
                    break outerloop;
                  }
                  if (type === "center-most") {
                    if (space.leftFromCenter < space.rightFromCenter) {
                      finalPos.x = el.x + el.width / 2 - space.leftFromCenter;
                      break outerloop;
                    } else {
                      finalPos.x = el.x + el.width / 2 + space.rightFromCenter - popup.width;
                      break outerloop;
                    }
                  }
                  break;
                case "left-most":
                  if (space.left >= popup.width) {
                    finalPos.x = el.x - popup.width;
                    break outerloop;
                  } else {
                    finalPos.x = 0;
                    break outerloop;
                  }
                case "right-most":
                  if (space.right >= popup.width) {
                    finalPos.x = el.x + el.width;
                    break outerloop;
                  } else {
                    finalPos.x = bg.x + bg.width - popup.width;
                    break outerloop;
                  }
                case "right":
                  if (space.right >= popup.width) {
                    finalPos.x = el.x;
                    break outerloop;
                  }
                  break;
                case "left":
                  if (space.left >= popup.width) {
                    finalPos.x = el.x + el.width - popup.width;
                    break outerloop;
                  }
                  break;
                case "either": {
                  if (space.right >= space.left) {
                    finalPos.x = el.x;
                    break outerloop;
                  } else {
                    finalPos.x = el.x + el.width - popup.width;
                    break outerloop;
                  }
                }
              }
            }
        }
        if (typeof preferredVertical === "function") {
          finalPos.y = preferredVertical(el, popup, bg, space);
        } else {
          outerloop:
            for (const type of preferredVertical) {
              switch (type) {
                case "center-screen":
                  if (popup.height < bg.height) {
                    finalPos.y = bg.height / 2 - popup.height / 2;
                  } else {
                    finalPos.y = 0;
                    maxHeight = finalPos.y;
                  }
                  break;
                case "top":
                  if (space.top >= popup.height) {
                    finalPos.y = el.y - popup.height;
                    break outerloop;
                  }
                  break;
                case "bottom":
                  if (space.bottom >= popup.height) {
                    finalPos.y = el.y + el.height;
                    break outerloop;
                  }
                  break;
                case "top-most":
                  if (space.top >= popup.height) {
                    finalPos.y = el.y - popup.height;
                    break outerloop;
                  } else {
                    finalPos.y = 0;
                    break outerloop;
                  }
                case "bottom-most":
                  if (space.bottom >= popup.height) {
                    finalPos.y = el.y + el.height;
                    break outerloop;
                  } else {
                    finalPos.y = bg.y + bg.height - popup.height;
                    break outerloop;
                  }
                case "center-most":
                case "center":
                  if (space.topFromCenter >= popup.height / 2 && space.bottomFromCenter >= popup.height / 2) {
                    finalPos.y = el.y + el.height / 2 - popup.height / 2;
                    break outerloop;
                  }
                  if (space.bottomFromCenter + space.topFromCenter <= popup.height) {
                    finalPos.y = 0;
                    break outerloop;
                  }
                  if (type === "center-most") {
                    if (space.topFromCenter < space.bottomFromCenter) {
                      finalPos.y = el.y + el.height / 2 - space.topFromCenter;
                      break outerloop;
                    } else {
                      finalPos.y = el.y + el.height / 2 + space.bottomFromCenter - popup.height;
                      break outerloop;
                    }
                  }
                  break;
                case "either": {
                  if (space.top >= space.bottom) {
                    finalPos.y = el.y - popup.height;
                    break outerloop;
                  } else {
                    finalPos.y = el.y + el.height;
                    break outerloop;
                  }
                }
              }
            }
        }
        finalPos.maxWidth = maxWidth ?? void 0;
        finalPos.maxHeight = maxHeight ?? void 0;
        if (props.modifyPosition) {
          finalPos = props.modifyPosition(finalPos, el, popup, bg, space);
        }
        pos.value = finalPos;
        lastButtonElPos = el;
      });
    };
    const show = () => {
      var _a;
      if (!isOpen) {
        isOpen = true;
        modelValue.value = isOpen;
        if (props.useBackdrop) (_a = dialogEl.value) == null ? void 0 : _a.showModal();
        recompute(true);
      }
    };
    const close = () => {
      var _a;
      if (isOpen) {
        isOpen = false;
        modelValue.value = isOpen;
        pos.value.maxWidth = void 0;
        if (props.useBackdrop) (_a = dialogEl.value) == null ? void 0 : _a.close();
      }
    };
    const toggle = () => {
      if (!isOpen) show();
      else close();
    };
    const recomputeListener = () => recompute();
    const bindListeners = () => {
      (void 0).addEventListener("resize", recomputeListener);
      (void 0).addEventListener("scroll", recomputeListener, true);
    };
    const unbindListeners = () => {
      (void 0).removeEventListener("resize", recomputeListener);
      (void 0).removeEventListener("scroll", recomputeListener, true);
    };
    watch([modelValue, popupEl], () => {
      if (modelValue.value) {
        show();
        bindListeners();
      } else {
        close();
        unbindListeners();
      }
    });
    const handleMouseup = ($event) => {
      $event.preventDefault();
      toggle();
    };
    __expose({
      recompute,
      setReference: (el) => {
        buttonEl.value = el;
      },
      setBackground: (el) => {
        backgroundEl.value = el;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderSlot(_ctx.$slots, "button", {
        extractEl: (_) => buttonEl.value = _
      }, null, _push, _parent);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(_ctx.useBackdrop ? "dialog" : "div"), mergeProps({
        id: _ctx.id ?? unref(fallbackId),
        class: unref(twMerge)(
          _ctx.useBackdrop && `bg-transparent
			p-0
			backdrop:bg-transparent
		`,
          unref($attrs).class
        )
      }, { ...unref($attrs), class: void 0 }, {
        ref_key: "dialogEl",
        ref: dialogEl,
        onMousedown: handleMouseup
      }), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (_ctx.useBackdrop || modelValue.value) {
              _push2(`<div class="${ssrRenderClass(`fixed ${props.avoidRepositioning ? "transition-[top,left]" : ""}`)}" style="${ssrRenderStyle(`
		top:${pos.value.y}px;
		left:${pos.value.x}px;
		${pos.value.maxWidth ? `max-width:${pos.value.maxWidth}px` : ""}
		${pos.value.maxHeight ? `max-height:${pos.value.maxHeight}px` : ""}
		`)}"${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "popup", {
                position: pos.value,
                extractEl: (_2) => popupEl.value = _2
              }, null, _push2, _parent2, _scopeId);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              _ctx.useBackdrop || modelValue.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: `fixed ${props.avoidRepositioning ? "transition-[top,left]" : ""}`,
                style: `
		top:${pos.value.y}px;
		left:${pos.value.x}px;
		${pos.value.maxWidth ? `max-width:${pos.value.maxWidth}px` : ""}
		${pos.value.maxHeight ? `max-height:${pos.value.maxHeight}px` : ""}
		`
              }, [
                renderSlot(_ctx.$slots, "popup", {
                  position: pos.value,
                  extractEl: (_2) => popupEl.value = _2
                })
              ], 6)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }), _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibPopup/LibPopup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibPopup-DLTOd7Jl.mjs.map
