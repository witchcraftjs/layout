import { computed, defineComponent, mergeModels, mergeDefaults, useModel, ref, reactive, mergeProps, unref, useSSRContext, watch, toRaw } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';
import { u as useDivideAttrs } from './useDivideAttrs-nfucohOx.mjs';
import { i as isBlank } from './isBlank-HbqDBAiD.mjs';
import { t as twMerge } from './twMerge-D_Q1Xw-o.mjs';
import { b as baseInteractivePropsDefaults, g as getFallbackId } from './props-Dju_GRu4.mjs';
import './keys-D_QFUzvn.mjs';
import 'tailwind-merge';

const hasModifiers = (e) => e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function useSuggestions($inputValue, $modelValue, emit, opts, debug = false) {
  var _a;
  if (typeof ((_a = opts.suggestions) == null ? void 0 : _a[0]) === "object" && !opts.suggestionLabel && !opts.suggestionsFilter) {
    throw new Error("`suggestionLabel` or `suggestionsFilter` must be passed if suggestions are objects.");
  }
  const isOpen = ref(false);
  const activeSuggestion = ref(-1);
  watch(isOpen, (val) => {
    emit("update:isOpen", val);
  });
  watch(activeSuggestion, (val) => {
    emit("update:activeSuggestion", val);
  });
  const defaultSuggestionsLabel = (item) => {
    if (isObject(item)) {
      throw new Error("`suggestionLabel` must be passed if suggestions are objects.");
    }
    return item;
  };
  const suggestionLabel = computed(() => opts.suggestionLabel ?? defaultSuggestionsLabel);
  const defaultSuggestionsFilter = (input, items) => input === "" ? [...items] : items.filter((item) => suggestionLabel.value(item).toLowerCase().includes(input.toLowerCase()));
  const suggestionsFilter = computed(() => opts.suggestionsFilter ?? defaultSuggestionsFilter);
  const suggestionsList = computed(() => {
    if (opts.suggestions) {
      const res = suggestionsFilter.value($inputValue.value, opts.suggestions);
      return res;
    }
    return void 0;
  });
  const suggestionAvailable = computed(() => {
    var _a2;
    return (((_a2 = suggestionsList.value) == null ? void 0 : _a2.length) ?? 0) > 0;
  });
  const moreThanOneSuggestionAvailable = computed(() => {
    var _a2;
    return (((_a2 = suggestionsList.value) == null ? void 0 : _a2.length) ?? 0) > 1;
  });
  const exactlyMatchingSuggestion = computed(() => {
    var _a2;
    return (_a2 = opts.suggestions) == null ? void 0 : _a2.find((suggestion) => $inputValue.value === suggestionLabel.value(suggestion));
  });
  const isValidSuggestion = computed(() => !opts.restrictToSuggestions && opts.isValid || suggestionAvailable.value);
  const openable = computed(
    () => opts.canOpen && (isBlank($inputValue.value) && opts.allowOpenEmpty || suggestionAvailable.value)
  );
  const filteredSuggestions = computed(() => {
    if (opts.suggestions) {
      const res = suggestionAvailable.value ? suggestionsList.value : opts.suggestions;
      if (opts.restrictToSuggestions && !isValidSuggestion.value) return res;
      if (opts.preventDuplicateValues && opts.values) {
        return res.filter((suggestion) => !opts.values.includes(suggestionLabel.value(suggestion)));
      }
      return res;
    }
    return void 0;
  });
  const closeSuggestions = () => {
    if (debug) console.log("closeSuggestions");
    isOpen.value = false;
    activeSuggestion.value = -1;
  };
  const openSuggestions = () => {
    var _a2;
    if (debug) console.log("openSuggestions", { openable: openable.value });
    if (!openable.value) return;
    if (activeSuggestion.value === -1) {
      if (exactlyMatchingSuggestion.value) {
        activeSuggestion.value = ((_a2 = suggestionsList.value) == null ? void 0 : _a2.indexOf(exactlyMatchingSuggestion.value)) ?? -1;
      } else {
        activeSuggestion.value = 0;
      }
    }
    isOpen.value = true;
  };
  function enterSuggestion(num) {
    var _a2;
    if (num < -1 || num > (((_a2 = filteredSuggestions.value) == null ? void 0 : _a2.length) ?? 0)) return;
    if (debug) console.log("enterSuggestion", num);
    if (filteredSuggestions.value === void 0) return;
    const suggestion = filteredSuggestions.value[num];
    const val = suggestionLabel.value(suggestion);
    $modelValue.value = val;
    $inputValue.value = val;
    closeSuggestions();
    emit("submit", val, toRaw(suggestion));
  }
  const enterSelected = () => {
    if (activeSuggestion.value === -1) {
      if (!opts.restrictToSuggestions) {
        if (debug) console.log("enterSelected, unrestricted, emitting submit");
        emit("submit", $inputValue.value);
      } else {
        if (debug) console.log("enterSelected, no active suggestion, ignoring");
      }
      return;
    }
    if (debug) console.log("enterSelected");
    enterSuggestion(activeSuggestion.value);
  };
  const selectSuggestion = (num) => {
    var _a2;
    if (debug) console.log("selectSuggestion", num);
    if (num >= -1) {
      activeSuggestion.value = num;
    }
    if (num === Infinity && (((_a2 = filteredSuggestions.value) == null ? void 0 : _a2.length) ?? 0) > 0) {
      activeSuggestion.value = filteredSuggestions.value.length - 1;
    }
  };
  const toggleSuggestions = () => {
    isOpen.value ? closeSuggestions() : openSuggestions();
  };
  const prevSuggestion = () => {
    if (!filteredSuggestions.value) return;
    if (activeSuggestion.value > 0) {
      activeSuggestion.value--;
    } else if (filteredSuggestions.value) {
      activeSuggestion.value = filteredSuggestions.value.length - 1;
    }
  };
  const nextSuggestion = () => {
    if (!filteredSuggestions.value) return;
    if (activeSuggestion.value >= filteredSuggestions.value.length - 1) {
      activeSuggestion.value = 0;
    } else {
      activeSuggestion.value++;
    }
  };
  const firstSuggestion = () => {
    selectSuggestion(0);
  };
  const lastSuggestion = () => {
    selectSuggestion(Infinity);
  };
  const cancel = () => {
    if (debug) console.log("cancel");
    $inputValue.value = $modelValue.value;
    closeSuggestions();
  };
  watch(() => opts.canOpen, (val) => {
    if (!val) {
      if (debug) console.log("canOpen changed to false, closing suggestions");
      closeSuggestions();
    }
  });
  watch(openable, (val) => {
    if (!val) {
      if (debug) console.log("openable changed to false, closing suggestions");
      closeSuggestions();
    }
  });
  watch(isValidSuggestion, () => {
    if (!isValidSuggestion.value) {
      if (debug) console.log("isValidSuggestion changed to false, opening suggestions");
      openSuggestions();
    }
  });
  watch($modelValue, () => {
    $inputValue.value = $modelValue.value;
    if (debug) console.log("modelValue changed");
  });
  const defaultSuggestionSelector = (suggestions, input) => {
    var _a2;
    if (input.length === 0) return 0;
    let longestMatch;
    let ii = -1;
    for (let i = 0; i < suggestions.length; i++) {
      const suggestion = suggestions[i];
      const label = suggestionLabel.value(suggestion);
      const labelPart = label.slice(0, input.length);
      if (labelPart === input) {
        if (label.length > (((_a2 = longestMatch == null ? void 0 : longestMatch[0]) == null ? void 0 : _a2.length) ?? 0)) {
          longestMatch = label;
          ii = i;
        }
      }
    }
    return ii;
  };
  watch($inputValue, () => {
    var _a2;
    if (debug) console.log("input changed:", $inputValue.value, "modelValue:", $modelValue.value);
    if ($modelValue.value === $inputValue.value) return;
    if (suggestionAvailable.value) {
      if (debug) console.log("input changed, suggestion available, opening suggestions");
      openSuggestions();
    }
    if (!opts.restrictToSuggestions) {
      if (debug) console.log("input changed, unrestricted, setting modelValue");
      $modelValue.value = $inputValue.value;
    }
    if (exactlyMatchingSuggestion.value && suggestionsList.value) {
      if (debug) console.log("input changed, exactly matching, setting activeSuggestion");
      selectSuggestion(suggestionsList.value.indexOf(exactlyMatchingSuggestion.value));
    } else {
      if (debug) console.log("input changed, not exactly matching, finding longest match");
      const i = ((_a2 = opts.suggestionSelector) == null ? void 0 : _a2.call(opts, filteredSuggestions.value ?? [], $inputValue.value)) ?? defaultSuggestionSelector(filteredSuggestions.value ?? [], $inputValue.value);
      selectSuggestion(i);
    }
  });
  return {
    list: suggestionsList,
    filtered: filteredSuggestions,
    active: activeSuggestion,
    available: suggestionAvailable,
    moreThanOneAvailable: moreThanOneSuggestionAvailable,
    hasExactlyMatching: exactlyMatchingSuggestion,
    /** Whether there is a valid suggestion that can be submitted. If `restrictToSuggestions` is true, this will be true if isValid is true, otherwise this is considered to be true if suggestions are available. */
    hasValidSuggestion: isValidSuggestion,
    openable,
    getLabel: suggestionLabel,
    isOpen,
    open: openSuggestions,
    close: closeSuggestions,
    enterSelected,
    enterSuggestion,
    toggle: toggleSuggestions,
    cancel,
    select: selectSuggestion,
    prev: prevSuggestion,
    next: nextSuggestion,
    first: firstSuggestion,
    last: lastSuggestion
  };
}
function useSuggestionsInputAria(id, isOpen, activeSuggestion, suggestions) {
  const ariaInputProps = computed(() => ({
    "aria-autocomplete": suggestions !== void 0 ? "both" : void 0,
    "aria-controls": suggestions !== void 0 ? `suggestions-${id.value}` : void 0,
    role: suggestions ? "combobox" : void 0,
    "aria-expanded": suggestions !== void 0 ? isOpen.value : void 0,
    "aria-activedescendant": isOpen.value ? `suggestion-${id.value}-${activeSuggestion.value}` : void 0
  }));
  return ariaInputProps;
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{
    name: "lib-suggestions",
    inheritAttrs: false
  },
  __name: "LibSuggestions",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels(/* @__PURE__ */ mergeDefaults({
    id: {},
    label: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    border: { type: Boolean },
    unstyle: { type: Boolean },
    preventDuplicateValues: { type: Boolean },
    values: {},
    filterKeydown: { type: Function },
    filterBlur: { type: Function },
    filterFocus: { type: Function },
    suggestions: {},
    suggestionLabel: { type: Function },
    restrictToSuggestions: { type: Boolean },
    updateOnlyOnSubmit: { type: Boolean },
    suggestionsFilter: { type: Function },
    allowOpenEmpty: { type: Boolean },
    canOpen: { type: Boolean },
    isValid: { type: Boolean },
    suggestionSelector: { type: Function }
  }, {
    isValid: true,
    canOpen: true,
    values: void 0,
    filterKeydown: void 0,
    ...baseInteractivePropsDefaults
  }), {
    "modelValue": { required: true },
    "modelModifiers": {},
    "inputValue": { default: "" },
    "inputValueModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["submit", "update:isOpen", "update:activeSuggestion"], ["update:modelValue", "update:inputValue"]),
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a;
    const $ = useDivideAttrs(["item"]);
    const emits = __emit;
    const fallbackId = getFallbackId();
    const props = __props;
    const $modelValue = useModel(__props, "modelValue");
    const $inputValue = useModel(__props, "inputValue");
    if (typeof ((_a = props.suggestions) == null ? void 0 : _a[0]) === "object" && !props.suggestionLabel && !props.suggestionsFilter) {
      throw new Error("`suggestionLabel` or `suggestionsFilter` must be passed if suggestions are objects.");
    }
    const el = ref(null);
    ref(false);
    const suggestions = reactive(useSuggestions(
      $inputValue,
      $modelValue,
      emits,
      props
    ));
    const inputKeydownHandler = (e) => {
      var _a2;
      if ((_a2 = props.filterKeydown) == null ? void 0 : _a2.call(props, e)) return;
      if (hasModifiers(e)) return;
      if (e.key === "Enter") {
        suggestions.enterSelected();
        e.preventDefault();
      } else if (e.key === "Escape") {
        suggestions.cancel();
        e.preventDefault();
      } else if (!suggestions.isOpen && ["ArrowDown", "ArrowUp", "PageUp", "PageDown"].includes(e.key) && suggestions.available) {
        suggestions.open();
        e.preventDefault();
        if (e.key === "PageUp") {
          suggestions.first();
        } else if (e.key === "PageDown") {
          suggestions.last();
        }
      } else if (e.key === "ArrowUp") {
        suggestions.prev();
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        suggestions.next();
        e.preventDefault();
      } else if (e.key === "PageUp") {
        suggestions.first();
        e.preventDefault();
      } else if (e.key === "PageDown") {
        suggestions.last();
        e.preventDefault();
      }
    };
    const inputBlurHandler = (e) => {
      var _a2;
      if ((_a2 = props.filterBlur) == null ? void 0 : _a2.call(props, e)) return;
      if (!suggestions.isOpen) return;
      if (props.restrictToSuggestions) {
        suggestions.cancel();
      } else {
        $modelValue.value = $inputValue.value;
      }
      if (suggestions.isOpen) {
        suggestions.close();
      }
    };
    const inputFocusHandler = (e) => {
      var _a2;
      if ((_a2 = props.filterFocus) == null ? void 0 : _a2.call(props, e)) return;
      suggestions.open();
    };
    __expose({
      suggestions,
      el,
      /** A simple keydown handler that can be passed to an input to control the component while still focused inside it. */
      inputKeydownHandler,
      /** A blur handler for the input that controls the component. This also takes care of making clicking on a suggestion work, since otherwise if canOpen is set to false in the blur handler, no click event will fire. */
      inputBlurHandler,
      /** A focus handler for the input that controls the component. */
      inputFocusHandler
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      if (suggestions.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          id: `suggestions-${_ctx.id ?? unref(fallbackId)}`,
          class: unref(twMerge)(
            `
			suggestions
			bg-bg
			dark:bg-fg
		`,
            (_a2 = unref($).attrs) == null ? void 0 : _a2.class
          ),
          "data-open": suggestions.isOpen,
          role: "listbox",
          ref_key: "el",
          ref: el
        }, { ...unref($).attrs, class: void 0 }, _attrs))}><!--[-->`);
        ssrRenderList(suggestions.filtered, (item, index) => {
          var _a3;
          _push(`<div${ssrRenderAttrs(mergeProps({
            id: `suggestion-${_ctx.id ?? unref(fallbackId)}-${index}`,
            role: "option",
            class: unref(twMerge)(
              `
					px-1
					user-select-none
					cursor-pointer
					px-2
				`,
              index === suggestions.active && `bg-accent-200 dark:bg-accent-800`,
              (_a3 = unref($).itemAttrs) == null ? void 0 : _a3.class
            ),
            ref_for: true
          }, { ...unref($).itemAttrs, class: void 0 }, {
            "aria-selected": index === suggestions.active ? true : false,
            "aria-label": suggestions.getLabel(item),
            key: item
          }))}>`);
          ssrRenderSlot(_ctx.$slots, "item", {
            item,
            index
          }, () => {
            _push(`${ssrInterpolate(item)}`);
          }, _push, _parent);
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../ui/dist/runtime/components/LibSuggestions/LibSuggestions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LibSuggestions = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));

export { LibSuggestions as L, _sfc_main as _, useSuggestionsInputAria as u };
//# sourceMappingURL=LibSuggestions-CUh2Ev_y.mjs.map
