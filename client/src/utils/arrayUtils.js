export function findLast(array, predicate) {
  if (array.findLast) {
    return array.findLast(predicate);
  }
  return [...array].reverse().find(predicate);
}
