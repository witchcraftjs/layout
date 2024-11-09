import { computed, ref } from 'vue';

const useAriaLabel = (props, fallbackId) => {
  const id = computed(() => props.id ?? fallbackId);
  const labelExists = ref(false);
  const aria = computed(() => ({
    "aria-label": labelExists.value ? void 0 : props.label,
    "aria-labelledby": labelExists.value ? `label-${id.value}` : void 0
  }));
  return aria;
};

export { useAriaLabel as u };
//# sourceMappingURL=useAriaLabel-DmRBLde2.mjs.map
