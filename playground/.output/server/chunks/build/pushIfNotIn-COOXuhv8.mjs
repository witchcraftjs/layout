import { i as isArray } from './isArray-DAX_U8q6.mjs';

function pushIfNotIn(mutated, ...entries) {
  for (const value of entries) {
    if (isArray(value)) {
      for (const val of value) {
        if (!mutated.includes(val)) mutated.push(val);
      }
    }
  }
  return mutated;
}

export { pushIfNotIn as p };
//# sourceMappingURL=pushIfNotIn-COOXuhv8.mjs.map
