import { _ as __unplugin_components_1 } from './xmark-gUIVnf6w.mjs';
import { _ as __unplugin_components_0 } from './copy-gf1aXmzd.mjs';
import { defineComponent, useAttrs, computed, ref, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import { i as isBlank } from './isBlank-HbqDBAiD.mjs';
import { k as keys } from './keys-D_QFUzvn.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import _sfc_main$2 from './Icon-DwfOmCfH.mjs';
import _sfc_main$1 from './LibButton-Bo9yy1km.mjs';
import 'tailwind-merge';
import './useAriaLabel-DmRBLde2.mjs';
import './props-Dju_GRu4.mjs';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const copy = (text) => {
  if ((void 0).clipboard) {
    (void 0).clipboard.writeText(text).catch((err) => {
      console.warn(`There was an error copying to the clipboard, please file a bug report.
${err}`);
    });
  } else {
    console.warn("Could not copy to clipboard, your browser is not supported.");
  }
};
function evalTemplateString(template, substitutions) {
  let res = "";
  for (let i = 0; i < template.length; i++) {
    const str = template[i];
    res += str + (i < substitutions.length ? substitutions[i] : "");
  }
  return res;
}
function isDefined(value) {
  return value !== void 0;
}
function stripIndent(str, {
  tabs = true,
  count = void 0
} = {}) {
  let min = count;
  if (!isDefined(min)) {
    const unknownAmountOfTabs = tabs ? /^[\t]*(?=[^\t])/gm : /^[ ]*(?=[^ ])/gm;
    const indent2 = str.match(unknownAmountOfTabs);
    if (indent2 === null) return str;
    min = indent2.reduce((prev, curr) => Math.min(prev, curr.length), Infinity);
  }
  const limit = min === Infinity ? "" : min;
  const knownAmountOfTabs = new RegExp(`^${tabs ? "\\t" : " "}{0,${limit}}`, "gm");
  return str.replace(knownAmountOfTabs, "");
}
function trimLines(str) {
  return str.replace(/(^\n*?(?=[^\n]|$))([\s\S]*?)(\n*?\s*?$)/, "$2");
}
function crop(template, ...substitutions) {
  return stripIndent(trimLines(evalTemplateString(template, substitutions)));
}
function indent(str, count = 0, { first = false } = {}) {
  const regex = first ? /(^|\n)/g : /\n/g;
  const tabs = "	".repeat(count);
  const replacement = first ? `$1${tabs}` : `
${tabs}`;
  return str.replace(regex, replacement);
}
function walk(obj, walker, opts = {}) {
  const keyPath = [...arguments[3] ?? []];
  if (opts.before) {
    const walkerRes = walker ? walker(obj, keyPath, "before") : obj;
    if (opts.save) obj = walkerRes;
  }
  let res;
  if (Array.isArray(obj)) {
    const items = [];
    let i = 0;
    for (const item of obj) {
      const thisKeyPath = [...keyPath, i.toString()];
      const walkRes = typeof item === "object" && item !== null ? walk(item, walker, opts, thisKeyPath) : walker ? walker(item, thisKeyPath) : item;
      if (opts.save && walkRes !== void 0) items.push(walkRes);
      i++;
    }
    res = opts.save ? items : void 0;
  } else if (obj !== null) {
    const items = {};
    for (const key of keys(obj)) {
      const thisKeyPath = [...keyPath, key.toString()];
      const item = obj[key];
      const walkRes = typeof item === "object" && item !== null ? walk(item, walker, opts, thisKeyPath) : walker ? walker(item, thisKeyPath) : item;
      if (opts.save && walkRes !== void 0) items[key] = walkRes;
    }
    res = opts.save ? items : void 0;
  } else if (obj === null) {
    const walkRes = walker ? walker(obj, keyPath) : obj;
    res = opts.save ? walkRes : void 0;
  }
  if (opts.after) {
    const walkerRes = walker ? walker(res, keyPath, "after") : res;
    if (opts.save) res = walkerRes;
  }
  return res;
}
function pretty(obj, { oneline = false, stringify = false } = {}) {
  let objClone = obj;
  if (stringify) {
    if (stringify === true) {
      stringify = (val) => typeof val === "function" || typeof val === "symbol" ? val.toString() : val;
    }
    objClone = walk(obj, (val, keypath) => {
      if (keypath.length === 0) return val;
      return stringify(val);
    }, { save: true, after: true });
  }
  return oneline ? JSON.stringify(objClone, null, "|").replace(/\n\|*/g, " ") : JSON.stringify(objClone, null, "	");
}
function setReadOnly(self, key, value) {
  self[key] = value;
}
class NotificationHandler {
  constructor({
    timeout,
    stringifier,
    maxHistory
  } = {}) {
    __publicField(this, "timeout", 5e3);
    __publicField(this, "debug", false);
    __publicField(this, "id", 0);
    __publicField(this, "queue", []);
    __publicField(this, "history", []);
    __publicField(this, "maxHistory", 100);
    __publicField(this, "listeners", []);
    __publicField(this, "stringifier");
    if (timeout) this.timeout = timeout;
    if (maxHistory) this.maxHistory = maxHistory;
    if (stringifier) this.stringifier = stringifier;
  }
  _checkEntry(entry) {
    if (entry.cancellable !== void 0 && isBlank(entry.cancellable)) {
      throw new Error(
        crop`Cancellable cannot be a blank string:
					${indent(pretty(entry), 5)}
				`
      );
    }
    if (!entry.options.includes(entry.default)) {
      throw new Error(
        crop`Entry options does not include default option "${entry.default}":
					${indent(pretty(entry), 5)}
				`
      );
    }
    if (entry.cancellable) {
      if (typeof entry.cancellable === "string" && !entry.options.includes(entry.cancellable)) {
        throw new Error(
          crop`Entry options does not include cancellable option "${entry.cancellable}":
						${indent(pretty(entry), 6)}
					`
        );
      }
    } else {
      if (entry.options.includes("Cancel")) {
        throw new Error(
          crop`You specified that the entry should not be cancellable, but the options include the "Cancel" option:
						${indent(pretty(entry), 6)}
					`
        );
      }
    }
    if (entry.timeout !== void 0 && !entry.cancellable) {
      throw new Error(
        crop`Cannot timeout notification that is not cancellable:
					${indent(pretty(entry), 5)}
					`
      );
    }
    if (entry.timeout !== void 0 && entry.requiresAction) {
      throw new Error(
        crop`Cannot timeout notification that requires action:
					${indent(pretty(entry), 5)}
					`
      );
    }
    const missingDangerousOption = entry.dangerous.find((option) => !entry.options.includes(option));
    if (entry.dangerous !== void 0 && missingDangerousOption) {
      throw new Error(
        crop`Dangerous options list contains an unknown option "${missingDangerousOption}":
					${indent(pretty(entry), 5)}
				`
      );
    }
  }
  _createEntry(rawEntry) {
    var _a;
    const entry = {
      requiresAction: false,
      options: ["Ok", "Cancel"],
      default: "Ok",
      cancellable: rawEntry.cancellable,
      ...rawEntry,
      dangerous: rawEntry.dangerous ?? [],
      timeout: rawEntry.timeout === true ? this.timeout : rawEntry.timeout !== void 0 && rawEntry.timeout !== false ? rawEntry.timeout : void 0
    };
    if (rawEntry.cancellable === true || rawEntry.cancellable === void 0 && ((_a = entry.options) == null ? void 0 : _a.includes("Cancel"))) {
      entry.cancellable = "Cancel";
    }
    this._checkEntry(entry);
    this.id++;
    entry.id = this.id;
    return entry;
  }
  async notify(rawEntry) {
    const entry = this._createEntry(rawEntry);
    entry.promise = new Promise((_resolve) => {
      entry.resolve = _resolve;
    });
    if (entry.timeout !== void 0) {
      setTimeout(() => {
        entry.resolve(entry.cancellable);
      }, entry.timeout);
    }
    this.queue.push(entry);
    for (const listener of this.listeners) {
      listener(entry, "added");
    }
    return entry.promise.then((res) => {
      entry.resolution = res;
      for (const listener of this.listeners) {
        listener(entry, "resolved");
      }
      this.history.push(entry);
      if (this.history.length > this.maxHistory) {
        this.history.splice(0, 1);
        for (const listener of this.listeners) {
          listener(entry, "deleted");
        }
      }
      this.queue.splice(this.queue.indexOf(entry), 1);
      return res;
    });
  }
  static resolveToDefault(notification) {
    notification.resolve(notification.default);
  }
  static dismiss(notification) {
    if (notification.cancellable) {
      notification.resolve(notification.cancellable);
    }
  }
  stringify(notification) {
    if (this.stringifier) return this.stringifier(notification);
    let str = "";
    if (notification.title) str += `${notification.title}
`;
    str += `${notification.message}
`;
    if (notification.code) str += `code:${notification.code}
`;
    return str;
  }
  clear() {
    setReadOnly(this, "history", []);
  }
  addNotificationListener(cb) {
    this.listeners.push(cb);
  }
  removeNotificationListener(cb) {
    const exists = this.listeners.indexOf(cb);
    if (exists > -1) {
      this.listeners.splice(exists, 1);
    } else {
      throw new Error(`Listener does not exist: ${cb.toString()}`);
    }
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-notification",
    inheritAttrs: false
  },
  __name: "LibNotification",
  __ssrInlineRender: true,
  props: {
    notification: {},
    handler: { default: void 0 }
  },
  setup(__props, { expose: __expose }) {
    const $attrs = useAttrs();
    const props = __props;
    const getColor = (notification, option) => notification.default === option ? "primary" : notification.dangerous.includes(option) ? "danger" : "secondary";
    const buttonColors = computed(() => props.notification.options.map((option) => getColor(props.notification, option)));
    const notificationEl = ref(null);
    __expose({
      focus: () => {
        var _a;
        (_a = notificationEl.value) == null ? void 0 : _a.focus();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_i_fa6_regular_copy = __unplugin_components_0;
      const _component_i_fa6_solid_xmark = __unplugin_components_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(twMerge)(
          `notification
		max-w-700px
		bg-neutral-50
		dark:bg-neutral-950
		text-fg
		dark:text-bg
		border
		border-neutral-400
		rounded
		focus-outline
		flex-flex-col
		gap-2
		p-2 m-2
	`,
          unref($attrs).class
        )
      }, { ...unref($attrs), class: void 0 }, {
        tabindex: "0",
        ref_key: "notificationEl",
        ref: notificationEl
      }, _attrs))}><div class="header flex-reverse flex justify-between">`);
      if (_ctx.notification.title) {
        _push(`<div tabindex="0" class="title focus-outline flex rounded font-bold">${ssrInterpolate(_ctx.notification.title)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1"></div><div class="actions flex">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        border: false,
        class: "copy text-neutral-700",
        onClick: ($event) => unref(copy)(_ctx.handler ? _ctx.handler.stringify(_ctx.notification) : JSON.stringify(_ctx.notification))
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$2, null, {
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
              createVNode(_sfc_main$2, null, {
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
      if (_ctx.notification.cancellable) {
        _push(ssrRenderComponent(_sfc_main$1, {
          border: false,
          onClick: ($event) => unref(NotificationHandler).dismiss(_ctx.notification)
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
                _: 1
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
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="message whitespace-pre-wrap" tabindex="0">${ssrInterpolate(_ctx.notification.message)}</div><div class="bottom flex items-end justify-between">`);
      if (_ctx.notification.code) {
        _push(`<div class="code text-xs text-neutral-700"> Code: ${ssrInterpolate(_ctx.notification.code)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1 py-1"></div>`);
      if (_ctx.notification.options) {
        _push(`<div class="options flex flex-wrap justify-end gap-2"><!--[-->`);
        ssrRenderList(_ctx.notification.options, (option, i) => {
          _push(ssrRenderComponent(_sfc_main$1, {
            label: option,
            class: buttonColors.value[i] == "secondary" ? "p-0" : void 0,
            border: buttonColors.value[i] !== "secondary",
            color: buttonColors.value[i],
            key: option,
            onClick: ($event) => _ctx.notification.resolve(option)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibNotifications/LibNotification.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibNotification-oCIS-K6V.mjs.map
