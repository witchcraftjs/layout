import { defineComponent, useAttrs, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import 'tailwind-merge';

const __default__ = {
  name: "lib-pagination"
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...__default__,
  ...{
    name: "lib-pagination",
    inheritAttrs: false
  },
  __ssrInlineRender: true,
  props: {
    total: {},
    current: {},
    route: {},
    customRoute: { type: Function, default: (route, i) => {
      if (i === 0 || i === 1) {
        const num = 1;
        return { href: route, i: num };
      }
      return { href: route + i.toString(), i };
    } },
    extraPages: { default: 3 }
  },
  setup(__props) {
    const commonClasses = `
	block
	focus-outline
	border-b-2
	border-transparent
	transition-all
	outlined:rounded
`;
    const pageClasses = `
	${commonClasses}
	focus-outline
	hover:text-accent-600
	hover:border-b-accent-500
	hover:scale-125
`;
    const currentPageClasses = `
	${commonClasses}
	border-b-accent-500
	scale-125
`;
    const props = __props;
    const $attrs = useAttrs();
    const currentLink = computed(() => props.customRoute(props.route, props.current));
    const currentIsInvalid = computed(() => currentLink.value.i < 0 || currentLink.value.i > props.total);
    watch(() => currentIsInvalid.value, () => {
      if (currentIsInvalid.value) {
        throw new Error(`Current page is out of range: 0 - ${props.total}`);
      }
    });
    const prevLink = computed(() => props.customRoute(props.route, props.current - 1));
    const nextLink = computed(() => {
      const maybeNextLink = props.customRoute(props.route, props.current + 1);
      if (maybeNextLink.i === currentLink.value.i) {
        return props.customRoute(props.route, props.current + 2);
      }
      return maybeNextLink;
    });
    const firstLink = computed(() => props.customRoute(props.route, 0));
    const lastLink = computed(() => props.customRoute(props.route, props.total));
    const extraPagesPrev = computed(() => [...Array(props.extraPages)].map((_, _i) => {
      const num = currentLink.value.i - (props.extraPages - _i);
      if (num <= firstLink.value.i || num >= lastLink.value.i || num >= currentLink.value.i) return void 0;
      return props.customRoute(props.route, num);
    }).filter((entry) => entry !== void 0));
    const extraPagesNext = computed(() => [...Array(props.extraPages + 1)].map((_, i) => {
      const num = currentLink.value.i + i;
      if (num <= firstLink.value.i || num >= lastLink.value.i || num <= currentLink.value.i) return void 0;
      return props.customRoute(props.route, num);
    }).filter((entry) => entry !== void 0).slice(0, props.extraPages));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: unref(twMerge)(`
		flex flex-wrap items-center justify-center gap-2
	`, unref($attrs).class),
        role: "navigation",
        "aria-label": "Pagination Navigation"
      }, _attrs))}>`);
      if (prevLink.value.i > 0 && prevLink.value.i !== currentLink.value.i) {
        ssrRenderSlot(_ctx.$slots, "link", {
          i: prevLink.value.i,
          href: prevLink.value.href,
          text: "Prev",
          ariaLabel: `Go to previous page. Page ${prevLink.value.i}`,
          class: pageClasses
        }, () => {
          _push(`<a class="${ssrRenderClass(pageClasses)}"${ssrRenderAttr("href", prevLink.value.href)}${ssrRenderAttr("aria-label", `Go to previous page. Page ${prevLink.value.i}`)}></a>`);
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1"></div>`);
      if (firstLink.value.i !== currentLink.value.i) {
        ssrRenderSlot(_ctx.$slots, "link", {
          i: 0,
          href: firstLink.value.href,
          text: firstLink.value.i,
          ariaLabel: `Go to page ${firstLink.value.i}`,
          class: pageClasses
        }, () => {
          _push(`${ssrInterpolate(firstLink.value.href)} <a class="${ssrRenderClass(pageClasses)}"${ssrRenderAttr("href", firstLink.value.href)}${ssrRenderAttr("aria-label", `Go to page ${firstLink.value.i}`)}>${ssrInterpolate(firstLink.value.i)}</a>`);
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      if (prevLink.value.i - _ctx.extraPages > firstLink.value.i) {
        _push(`<div class="page-fill"> ... </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(extraPagesPrev.value, (entry) => {
        ssrRenderSlot(_ctx.$slots, "link", {
          class: pageClasses,
          i: entry.i,
          href: entry.href,
          ariaLabel: `Go to page ${entry.i}`
        }, () => {
          _push(`<a class="${ssrRenderClass(pageClasses)}"${ssrRenderAttr("href", entry.href)}${ssrRenderAttr("aria-label", `Go to page ${entry.i}`)}>${ssrInterpolate(entry.i)}</a>`);
        }, _push, _parent);
      });
      _push(`<!--]-->`);
      ssrRenderSlot(_ctx.$slots, "current", {
        class: currentPageClasses,
        tabindex: "0",
        i: currentLink.value.i,
        ariaLabel: `Current page ${currentLink.value.i}`,
        aria_current: true
      }, () => {
        _push(`<div tabindex="0" class="${ssrRenderClass([currentPageClasses, "a"])}"${ssrRenderAttr("aria-label", `Current page ${currentLink.value.i}`)} aria-current="true">${ssrInterpolate(currentLink.value.i)}</div>`);
      }, _push, _parent);
      _push(`<!--[-->`);
      ssrRenderList(extraPagesNext.value, (entry) => {
        ssrRenderSlot(_ctx.$slots, "link", {
          class: pageClasses,
          i: entry.i,
          href: entry.href,
          ariaLabel: `Go to page ${entry.i}`
        }, () => {
          _push(`<a class="${ssrRenderClass(pageClasses)}"${ssrRenderAttr("href", entry.href)}${ssrRenderAttr("aria-label", `Go to page ${entry.i}`)}>${ssrInterpolate(entry.i)}</a>`);
        }, _push, _parent);
      });
      _push(`<!--]-->`);
      if (nextLink.value.i + _ctx.extraPages < _ctx.total) {
        _push(`<div class="page-fill" aria-hidden="true"> ... </div>`);
      } else {
        _push(`<!---->`);
      }
      if (lastLink.value.i !== currentLink.value.i) {
        ssrRenderSlot(_ctx.$slots, "link", {
          class: pageClasses,
          i: lastLink.value.i,
          href: lastLink.value.href,
          text: _ctx.total,
          ariaLabel: `Go to page ${lastLink.value.i}`
        }, () => {
          _push(`<a class="${ssrRenderClass(pageClasses)}"${ssrRenderAttr("href", lastLink.value.href)}${ssrRenderAttr("aria-label", `Go to page ${lastLink.value.i}`)}>${ssrInterpolate(_ctx.total)}</a>`);
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1"></div>`);
      if (nextLink.value.i <= _ctx.total && nextLink.value.i !== currentLink.value.i) {
        ssrRenderSlot(_ctx.$slots, "link", {
          class: pageClasses,
          i: nextLink.value.i,
          href: nextLink.value.href,
          text: "Next",
          ariaLabel: `Go to next page. Page ${nextLink.value.i}`
        }, () => {
          _push(`<a class="${ssrRenderClass(pageClasses)}"${ssrRenderAttr("href", nextLink.value.href)}${ssrRenderAttr("aria-label", `Go to next page. Page ${nextLink.value.i}`)}>Next</a>`);
        }, _push, _parent);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibPagination/LibPagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=LibPagination-BWM4cUv_.mjs.map
