import shuffle from '../../src/utils/shuffle';

describe('shuffle', () => {
  test('should shuffle array', () => {
    const current = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    const shuffled = shuffle([...current]);

    expect(current).toBe(current);
    expect(current).not.toEqual(shuffled);
  });
});
