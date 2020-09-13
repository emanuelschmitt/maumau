function cloneArray<T>(arr: T[]) {
  return JSON.parse(JSON.stringify(arr));
}

export function swap<T>(arr: T[], indexA: number, indexB: number) {
  const clone = cloneArray(arr);
  if (arr.length <= 1) {
    return clone;
  }
  const temp: T = arr[indexA];
  clone[indexA] = arr[indexB];
  clone[indexB] = temp;

  return clone;
}
