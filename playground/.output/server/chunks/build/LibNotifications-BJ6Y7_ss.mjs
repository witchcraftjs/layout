import { defineComponent, ref, shallowReactive, mergeProps, unref, useSSRContext, nextTick } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import { r as removeIfIn } from './removeIfIn-CtfXxQlL.mjs';
import _sfc_main$1 from './LibNotification-oCIS-K6V.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import './xmark-gUIVnf6w.mjs';
import './copy-gf1aXmzd.mjs';
import './isBlank-HbqDBAiD.mjs';
import './keys-D_QFUzvn.mjs';
import './Icon-DwfOmCfH.mjs';
import './LibButton-Bo9yy1km.mjs';
import './useAriaLabel-DmRBLde2.mjs';
import './props-Dju_GRu4.mjs';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-notifications",
    inheritAttrs: false
  },
  __name: "LibNotifications",
  __ssrInlineRender: true,
  props: {
    id: {},
    handler: {}
  },
  setup(__props) {
    const props = __props;
    const dialogEl = ref(null);
    const isOpen = ref(false);
    const notifications = shallowReactive([]);
    const topNotifications = shallowReactive([]);
    const open = () => {
      if (!isOpen.value) {
        void nextTick(() => {
          dialogEl.value.showModal();
          isOpen.value = true;
        });
      }
    };
    const close = () => {
      if (isOpen.value && topNotifications.length === 0) {
        dialogEl.value.close();
        isOpen.value = false;
      }
    };
    const addNotification = (entry) => {
      if (entry.resolution === void 0) {
        if (entry.requiresAction) {
          topNotifications.push(entry);
          open();
          entry.promise.then(() => {
            removeIfIn(topNotifications, entry);
            close();
          });
        } else {
          notifications.splice(0, 0, entry);
          entry.promise.then(() => {
            removeIfIn(notifications, entry);
          });
        }
      }
    };
    const notificationListener = (entry, type) => {
      if (type === "added") {
        addNotification(entry);
      }
    };
    props.handler.addNotificationListener(notificationListener);
    for (const entry of props.handler.queue) {
      addNotification(entry);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div${ssrRenderAttrs(mergeProps({
        name: "list",
        class: unref(twMerge)(`notifications
			fixed
			z-50
			inset-y-0 right-0
			w-1/3
			min-w-[300px]
			pointer-events-none
			overflow-hidden
		`, _ctx.$attrs.class)
      }, { ..._ctx.$attrs, class: void 0 }))}>`);
      ssrRenderList(unref(notifications), (notification) => {
        _push(ssrRenderComponent(_sfc_main$1, {
          class: "pointer-events-auto",
          handler: _ctx.handler,
          tabindex: "0",
          notification,
          key: notification.id
        }, null, _parent));
      });
      _push(`</div><div style="${ssrRenderStyle(unref(topNotifications).length > 0 ? null : { display: "none" })}"></div><dialog style="${ssrRenderStyle(unref(topNotifications).length > 0 ? null : { display: "none" })}"${ssrRenderAttr("id", _ctx.id)} class="modal bg-transparent p-0 backdrop:bg-black/50 backdrop:p-5"><form>`);
      if (unref(topNotifications).length > 0) {
        _push(ssrRenderComponent(_sfc_main$1, {
          handler: _ctx.handler,
          class: "top-notification",
          notification: unref(topNotifications)[0],
          ref: "topNotificationComp"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</form></dialog><!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibNotifications/LibNotifications.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibNotifications-BJ6Y7_ss.mjs.map
