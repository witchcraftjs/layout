function removeIfIn(mutated, ...entries) {
  for (const value of entries) {
    const index = mutated.indexOf(value);
    if (index > -1) {
      mutated.splice(index, 1);
    }
  }
  return mutated;
}

export { removeIfIn as r };
//# sourceMappingURL=removeIfIn-CtfXxQlL.mjs.map
