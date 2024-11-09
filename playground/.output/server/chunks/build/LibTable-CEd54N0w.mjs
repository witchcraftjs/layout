import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrGetDirectiveProps, ssrRenderList, ssrRenderSlot, ssrRenderClass, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { k as keys } from './keys-D_QFUzvn.mjs';
import { c as castType } from './castType-pqMMfJfM.mjs';
import { p as pushIfNotIn } from './pushIfNotIn-COOXuhv8.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import './isArray-DAX_U8q6.mjs';
import 'tailwind-merge';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value) && value.constructor === Object && Object.getPrototypeOf(value) === Object.prototype;
}
function override(base, ...overrides) {
  for (const other of overrides) {
    const obj = base;
    const keys$1 = pushIfNotIn(keys(obj), keys(other));
    for (const prop of keys$1) {
      const baseVal = obj[prop];
      const otherVal = other[prop];
      if (baseVal === void 0) {
        obj[prop] = otherVal;
      } else if (isPlainObject(otherVal) && isPlainObject(baseVal)) {
        obj[prop] = override(baseVal, otherVal);
      } else if (otherVal !== void 0) {
        obj[prop] = otherVal;
      }
    }
  }
  return base;
}
function unreachable(message = `This error should never happen, please file a bug report.`) {
  throw new Error(message);
}
function getQueueKey(type, index, args) {
  switch (type) {
    case "function":
      return index(args);
    case "number":
      return args[index];
    case "undefined":
      return "";
    default:
      unreachable();
  }
}
function debounce(callback2, wait = 0, {
  queue = false,
  index = queue ? 0 : void 0,
  leading = false,
  trailing = true,
  promisify = false
} = {}) {
  const isThrottle = arguments[3] ?? false;
  let queues = {};
  if (typeof queue === "object") queues = queue;
  const type = queue ? typeof index : "undefined";
  let debounced;
  if (promisify) {
    debounced = function async(...args) {
      var _a, _b, _c, _d, _e, _f, _g;
      const key = getQueueKey(type, index, args);
      const timerFunc = () => {
        var _a2, _b2, _c2;
        if (trailing && ((_a2 = queues[key]) == null ? void 0 : _a2._args) && ((_b2 = queues[key]) == null ? void 0 : _b2.resolve)) {
          (_c2 = queues[key]) == null ? void 0 : _c2.resolve();
          return;
        }
        delete queues[key];
      };
      queues[key] ?? (queues[key] = {});
      if (((_a = queues[key]) == null ? void 0 : _a.timeout) !== void 0 || !leading) {
        queues[key]._args = args;
        if (isThrottle) {
          (_b = queues[key]).timeout ?? (_b.timeout = setTimeout(timerFunc, wait));
        } else if ((_c = queues[key]) == null ? void 0 : _c.timeout) {
          if ((_d = queues[key]) == null ? void 0 : _d.reject) {
            (_e = queues[key]) == null ? void 0 : _e.reject();
            (_f = queues[key]) == null ? true : delete _f.resolve;
            (_g = queues[key]) == null ? true : delete _g.reject;
          }
          clearTimeout(queues[key].timeout);
        }
      }
      if (!isThrottle) {
        queues[key].timeout = setTimeout(timerFunc, wait);
      }
      return new Promise((resolve, reject) => {
        var _a2, _b2, _c2;
        if (((_a2 = queues[key]) == null ? void 0 : _a2.timeout) === void 0 && leading) {
          queues[key].resolve();
          (_b2 = queues[key]) == null ? true : delete _b2.resolve;
          (_c2 = queues[key]) == null ? true : delete _c2.reject;
          if (isThrottle) {
            queues[key].timeout = setTimeout(timerFunc, wait);
          }
        }
        queues[key].resolve = resolve;
        queues[key].reject = reject;
      }).then(async () => {
        const args2 = queues[key]._args;
        delete queues[key];
        return callback2(...args2);
      }).catch(async () => callback2(debounceError));
    };
  } else {
    debounced = function(...args) {
      var _a, _b, _c;
      const context = this;
      const key = getQueueKey(type, index, args);
      const timerFunc = () => {
        var _a2;
        if (trailing && ((_a2 = queues[key]) == null ? void 0 : _a2._args)) {
          callback2.apply(queues[key]._context, queues[key]._args);
        }
        delete queues[key];
      };
      queues[key] || (queues[key] = {});
      if (((_a = queues[key]) == null ? void 0 : _a.timeout) === void 0 && leading) {
        callback2.apply(context, args);
        if (isThrottle) {
          queues[key].timeout = setTimeout(timerFunc, wait);
        }
      } else {
        queues[key]._context = context;
        queues[key]._args = args;
        if (isThrottle) {
          (_b = queues[key]).timeout ?? (_b.timeout = setTimeout(timerFunc, wait));
        } else if ((_c = queues[key]) == null ? void 0 : _c.timeout) {
          clearTimeout(queues[key].timeout);
        }
      }
      if (!isThrottle) queues[key].timeout = setTimeout(timerFunc, wait);
    };
  }
  const cancel = (key = "") => {
    if (queues[key].timeout) clearTimeout(queues[key].timeout);
    delete queues[key];
  };
  const flush = (key = "") => {
    var _a, _b;
    if (trailing && ((_a = queues[key]) == null ? void 0 : _a._args)) {
      callback2.apply((_b = queues[key]) == null ? void 0 : _b._context, queues[key]._args);
    }
    cancel(key);
  };
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
const debounceError = Object.freeze(new Error("Debounced"));
function throttle(callback2, wait = 0, {
  queue = false,
  index = queue ? 0 : void 0,
  leading = true,
  trailing = true
} = {}) {
  return debounce(callback2, wait, { queue, index, leading, trailing }, true);
}
class ResizeObserverWrapper {
  constructor() {
    __publicField(this, "observers", /* @__PURE__ */ new WeakMap());
    __publicField(this, "observer");
    this.observers = /* @__PURE__ */ new WeakMap();
    this.observer = new ResizeObserver((elements) => {
      for (const element of elements) {
        const { target, contentRect } = element;
        const callbacks = this.observers.get(target);
        if (callbacks) {
          for (const cb of callbacks) {
            cb(contentRect, target);
          }
        }
      }
    });
  }
  observe(element, callback2) {
    const entry = this.observers.get(element);
    if (!entry) {
      this.observers.set(element, /* @__PURE__ */ new Set());
    }
    this.observer.observe(element);
    const callbacks = this.observers.get(element);
    callbacks.add(callback2);
  }
  unobserve(element, callback2) {
    const entry = this.observers.get(element);
    if (!entry) return;
    const callbacks = this.observers.get(element);
    callbacks.delete(callback2);
    if (callbacks.size === 0) {
      this.observer.unobserve(element);
      this.observers.delete(element);
    }
  }
}
if (typeof ResizeObserver === "undefined") {
  console.warn("You are using a directive that uses a ResizeObserver or are importing something that uses this resize observer in a context (e.g. the server) where ResizeObserver does not exist.");
}
const globalResizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserverWrapper() : {};
const observer = globalResizeObserver;
const elMap = /* @__PURE__ */ new WeakMap();
const defaultOpts = {
  fitWidth: true,
  margin: "dynamic",
  enabled: true
};
const callback = (_rect, el) => {
  setColWidths(el);
  positionGrips(el);
};
const throttledCallback = throttle(callback);
const vResizableCols = {
  mounted(el, { value: opts = {} }) {
    const options = override({ ...defaultOpts }, opts);
    if (options.enabled) {
      setupColumns(el, options);
      observer.observe(el, throttledCallback);
    }
  },
  updated(el, { value: opts = {} }) {
    const options = override({ ...defaultOpts }, opts);
    const hasGrips = elMap.has(el) && elMap.get(el).grips;
    if (hasGrips && !options.enabled) {
      teardownColumns(el);
      observer.unobserve(el, throttledCallback);
    }
    if (!hasGrips && options.enabled) {
      setupColumns(el, options);
      observer.observe(el, throttledCallback);
    }
  },
  unmounted(el) {
    const hasGrips = elMap.has(el) && elMap.get(el).grips;
    if (hasGrips) {
      teardownColumns(el);
      globalResizeObserver.unobserve(el, throttledCallback);
    }
  },
  getSSRProps() {
    return {};
  }
};
const setWidth = (col, amountInPx, el) => {
  const $el = getElInfo(el);
  const width = Math.max($el.margin, amountInPx);
  const index = getColEls(el).findIndex((_) => col === _);
  if ($el.fitWidth) {
    $el.widths.value[index] = `${width / getBox(el).width * 100}%`;
  } else {
    $el.widths.value[index] = `${width}px`;
  }
};
const getBox = (el) => {
  const rect = el.getBoundingClientRect();
  return { x: Math.round(rect.x), width: Math.round(rect.width) };
};
const getCols = (el) => {
  const $el = getElInfo(el);
  if (!$el.target) unreachable();
  let col = getColEls(el)[$el.grips.get($el.target)];
  if (!col) unreachable();
  while (col == null ? void 0 : col.classList.contains("no-resize")) {
    col = (col == null ? void 0 : col.previousElementSibling) ?? null;
  }
  let colNext = (col == null ? void 0 : col.nextElementSibling) ?? null;
  if ($el.fitWidth) {
    while (colNext == null ? void 0 : colNext.classList.contains("no-resize")) {
      colNext = (colNext == null ? void 0 : colNext.nextElementSibling) ?? null;
    }
  }
  return { col, colNext };
};
const createMouseDownHandler = (el) => (e) => {
  const $el = getElInfo(el);
  if (!$el.isDragging) {
    castType(e.target);
    $el.target = e.target;
    $el.isDragging = true;
    e.preventDefault();
    const { col, colNext } = getCols(el);
    if (col === null || colNext === null) {
      el.classList.add("resizable-cols-error");
    } else {
      (void 0).addEventListener("mousemove", $el.mouseMoveHandler);
    }
    const box = getBox(col);
    if (box) {
      $el.offset = e.pageX - (box.x + box.width);
    }
    (void 0).addEventListener("mouseup", $el.mouseUpHandler);
  }
};
const createMouseMoveHandler = (el) => (e) => {
  const $el = getElInfo(el);
  if ($el.isDragging) {
    e.preventDefault();
    const { col, colNext } = getCols(el);
    if (col !== null) {
      const leftBox = getBox(col);
      const oldWidth = leftBox.width;
      const leftBound = leftBox.x;
      const rightBox = colNext ? getBox(colNext) : getBox(el);
      const rightBound = rightBox.x + rightBox.width;
      const margin = $el.margin;
      const pos = e.pageX - $el.offset;
      if ($el.fitWidth) {
        if (pos > leftBound + margin && pos < rightBound - margin) {
          const newWidth = pos - leftBound;
          const diff = oldWidth - newWidth;
          if (rightBox.width + diff < margin) {
            el.classList.add("resizable-cols-error");
            return;
          }
          setWidth(col, newWidth, el);
          setWidth(colNext, rightBox.width + diff, el);
        }
      } else {
        if (pos > leftBound + margin) {
          const newWidth = pos - leftBound;
          setWidth(col, newWidth, el);
        }
      }
      positionGrips(el);
    }
  }
};
const createMouseUpHandler = (el) => (e) => {
  const $el = getElInfo(el);
  if ($el.isDragging) {
    e.preventDefault();
    $el.isDragging = false;
    el.classList.remove("resizable-cols-error");
    $el.offset = 0;
    delete $el.target;
    (void 0).removeEventListener("mousemove", $el.mouseMoveHandler);
    (void 0).removeEventListener("mouseup", $el.mouseUpHandler);
    (void 0).removeEventListener("mouseleave", $el.mouseLeaveHandler);
  }
};
const createGrip = () => {
  const grip = (void 0).createElement("div");
  grip.style.position = "absolute";
  grip.style.cursor = "col-resize";
  grip.style.top = "0";
  grip.style.bottom = "0";
  grip.classList.add("grip");
  return grip;
};
const removeGrips = (el) => {
  const grips = Array.from(el.querySelectorAll(".grip") ?? []);
  for (const grip of grips) {
    el.removeChild(grip);
  }
};
const getTestGripSize = (el) => {
  const testGrip = createGrip();
  el.appendChild(testGrip);
  const dynamicMinWidth = getBox(testGrip).width * 3;
  el.removeChild(testGrip);
  return dynamicMinWidth;
};
const getElInfo = (el) => {
  const $el = elMap.get(el);
  if (!$el) unreachable("El went missing.");
  return $el;
};
const getColEls = (el) => {
  const $el = elMap.get(el);
  if (!$el) unreachable("El went missing.");
  return [...el.querySelectorAll(`:scope ${$el.selector ? $el.selector : "tr > td"}`)];
};
const setupColumns = (el, opts) => {
  const gripWidth = getTestGripSize(el);
  const $el = {
    grips: /* @__PURE__ */ new Map(),
    isDragging: false,
    mouseDownHandler: createMouseDownHandler(el),
    mouseMoveHandler: createMouseMoveHandler(el),
    mouseUpHandler: createMouseUpHandler(el),
    mouseLeaveHandler: createMouseUpHandler(el),
    fitWidth: opts.fitWidth,
    margin: opts.margin === "dynamic" ? gripWidth : opts.margin,
    colCount: opts.colCount,
    widths: opts.widths,
    selector: opts.selector
  };
  elMap.set(el, $el);
  const els = getColEls(el);
  const headers = els.slice(0, opts.colCount);
  setColWidths(el, headers);
  el.style.width = $el.fitWidth ? "" : "min-content";
  const len = opts.colCount;
  for (let i = 0; i < len; i++) {
    if (opts.fitWidth && i === len - 1) continue;
    const grip = createGrip();
    grip.addEventListener("mousedown", $el.mouseDownHandler);
    el.appendChild(grip);
    $el.grips.set(grip, i);
  }
  positionGrips(el);
  el.classList.add("resizable-cols-setup");
};
const positionGrips = (el) => {
  let xPos = 0;
  const $el = getElInfo(el);
  for (const grip of $el.grips.keys()) {
    const col = $el.grips.get(grip);
    const colBox = getBox(getColEls(el)[col]);
    const gripBox = getBox(grip);
    grip.style.left = `${xPos + colBox.width - gripBox.width / 2}px`;
    xPos += colBox.width;
  }
};
const setColWidths = (el, children) => {
  const $el = getElInfo(el);
  const header = children ?? getColEls(el).slice(0, $el.colCount);
  const len = $el.colCount;
  let width = 0;
  const minTotalWidth = len * $el.margin;
  for (let i = 0; i < len; i++) {
    const col = header[i];
    const colBox = getBox(col);
    setWidth(col, colBox.width, el);
    width += getBox(col).width;
  }
  if (width < minTotalWidth) {
    el.style.minWidth = `${minTotalWidth}px`;
  } else {
    el.style.minWidth = "";
  }
};
const teardownColumns = (el) => {
  const $el = getElInfo(el);
  el.removeEventListener("mousedown", $el.mouseDownHandler);
  (void 0).removeEventListener("mousemove", $el.mouseMoveHandler);
  (void 0).removeEventListener("mouseup", $el.mouseUpHandler);
  for (const key of Object.keys($el)) {
    delete $el[key];
  }
  elMap.delete(el);
  el.classList.remove("resizable-cols-setup");
  removeGrips(el);
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-table"
  },
  __name: "LibTable",
  __ssrInlineRender: true,
  props: {
    resizable: { default: () => ({}) },
    values: { default: () => [] },
    itemKey: { default: "" },
    cols: { default: () => [] },
    rounded: { type: Boolean, default: true },
    border: { type: Boolean, default: true },
    cellBorder: { type: Boolean, default: true },
    header: { type: Boolean, default: true },
    colConfig: { default: () => ({}) }
  },
  setup(__props) {
    const props = __props;
    const widths = ref([]);
    const resizableOptions = computed(() => ({
      colCount: props.cols.length,
      widths,
      selector: ".cell",
      ...props.resizable
    }));
    const getExtraClasses = (row, col, isHeader) => {
      const res = {
        bl: !isHeader && row === props.values.length - 1 && col === 0,
        br: !isHeader && row === props.values.length - 1 && col === props.cols.length - 1,
        tr: (isHeader || !props.header) && row === 0 && col === props.cols.length - 1,
        tl: (isHeader || !props.header) && row === 0 && col === 0,
        "first-row": (isHeader || !props.header) && row === 0,
        "last-row": row === props.values.length - 1,
        "first-col": col === 0,
        "last-col": col === props.cols.length - 1
      };
      return keys(res).filter((key) => res[key]);
    };
    const extraClasses = computed(() => Object.fromEntries(
      [...Array(props.values.length + 1).keys()].map((row) => [...Array(props.cols.length).keys()].map((col) => [
        `${row - 1}-${col}`,
        getExtraClasses(row <= 0 ? 0 : row - 1, col, row === 0).join(" ")
      ])).flat()
    ));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<table${ssrRenderAttrs(mergeProps({
        class: unref(twMerge)(
          `table
		table-fixed
		border-separate
		border-spacing-0
		overflow-x-scroll
		scrollbar-hidden
		[&_.grip]:w-[5px]
		relative
		w-full
		box-content
		[&_thead]:font-bold
		[&_td]:p-1
		[&_td]:overflow-x-hidden
		[&.resizable-cols-error]:cursor-not-allowed
		[&.resizable-cols-error]:user-select-none
		`,
          _ctx.cellBorder && `
			[&_td]:border-neutral-500
			[&_td:not(.last-row)]:border-b
			[&_td:not(.first-col)]:border-l
		`,
          _ctx.border && `
			[&_thead_td]:bg-neutral-200
			[&_td]:border-neutral-500
			dark:[&_thead_td]:bg-neutral-800
			dark:[&_td]:border-neutral-500
			[&_td.first-row]:border-t
			[&_td.last-row]:border-b
			[&_td.last-col]:border-r
			[&_td.first-col]:border-l
		`,
          _ctx.rounded && `
			[&_td.br]:rounded-br
			[&_td.bl]:rounded-bl
			[&_td.tr]:rounded-tr
			[&_td.tl]:rounded-tl
		`,
          _ctx.$attrs.class
        )
      }, _attrs, ssrGetDirectiveProps(_ctx, unref(vResizableCols), resizableOptions.value)))}>`);
      if (_ctx.header) {
        _push(`<thead><tr><!--[-->`);
        ssrRenderList(_ctx.cols, (col, i) => {
          var _a;
          ssrRenderSlot(_ctx.$slots, `header-${col.toString()}`, {
            class: [
              extraClasses.value[`-1-${i}`],
              "cell",
              ((_a = _ctx.colConfig[col]) == null ? void 0 : _a.resizable) === false ? "no-resize" : ""
            ].join(" "),
            style: `width:${widths.value.length > 0 ? widths.value[i] : ``}; `,
            colKey: col
          }, () => {
            var _a2, _b;
            _push(`<td class="${ssrRenderClass([
              extraClasses.value[`-1-${i}`],
              "cell",
              ((_a2 = _ctx.colConfig[col]) == null ? void 0 : _a2.resizable) === false ? "no-resize" : ""
            ].join(" "))}" style="${ssrRenderStyle(`width:${widths.value.length > 0 ? widths.value[i] : ``}; `)}">${ssrInterpolate(((_b = _ctx.colConfig[col]) == null ? void 0 : _b.name) ?? col)}</td>`);
          }, _push, _parent);
        });
        _push(`<!--]--></tr></thead>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<tbody><!--[-->`);
      ssrRenderList(_ctx.values, (item, i) => {
        _push(`<tr><!--[-->`);
        ssrRenderList(_ctx.cols, (col, j) => {
          ssrRenderSlot(_ctx.$slots, col, {
            item,
            value: item[col],
            class: extraClasses.value[`${i}-${j}`] + " cell"
          }, () => {
            _push(`<td class="${ssrRenderClass(extraClasses.value[`${i}-${j}`] + " cell")}">${ssrInterpolate(item[col])}</td>`);
          }, _push, _parent);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibTable/LibTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibTable-CEd54N0w.mjs.map
