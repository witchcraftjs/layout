import { k as keys } from './keys-D_QFUzvn.mjs';
import { computed, useAttrs } from 'vue';

const useDivideAttrs = (divisionKeys) => computed(() => {
  const attrs = useAttrs();
  const res = { attrs: {} };
  const unseen = keys(attrs);
  for (const key of divisionKeys) {
    res[`${key}Attrs`] = {};
    for (const attrKey of unseen) {
      if (attrKey.startsWith(`${key}-`)) {
        res[`${key}Attrs`][attrKey.slice(key.length + 1)] = attrs[attrKey];
        unseen.splice(unseen.indexOf(attrKey), 1);
      } else if (attrKey.startsWith(key)) {
        res[`${key}Attrs`][attrKey.slice(key.length)] = attrs[attrKey];
        unseen.splice(unseen.indexOf(attrKey), 1);
      }
    }
  }
  for (const attrKey of unseen) {
    res.attrs[attrKey] = attrs[attrKey];
  }
  return res;
});

export { useDivideAttrs as u };
//# sourceMappingURL=useDivideAttrs-nfucohOx.mjs.map
