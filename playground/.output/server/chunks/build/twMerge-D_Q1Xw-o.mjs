import { extendTailwindMerge } from 'tailwind-merge';

const _twMergeExtend = {
  extend: {
    classGroups: {
      "focus-outline": [{ "focus-outline": ["", "no-offset", "none"] }]
    }
  }
};
const twMerge = extendTailwindMerge(_twMergeExtend);

export { twMerge as t };
//# sourceMappingURL=twMerge-D_Q1Xw-o.mjs.map
