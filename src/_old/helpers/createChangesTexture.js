import createTextTexture from './createTextTexture';

const CHANGE_SIGNS = 4;

function createChangeTexture(width, height, insertions, deletions, totalChanges, options) {
  const plus = Math.floor((insertions / totalChanges) * CHANGE_SIGNS);
  const minus = Math.floor((deletions / totalChanges) * CHANGE_SIGNS);

  const text = [
    { font: `900 ${height}px 'Source Code Pro'`, fillStyle: '#348900' },
    '+'.repeat(plus),
    { fillStyle: '#C40000' },
    '-'.repeat(minus),
  ];

  return createTextTexture(width, height, text, options);
}

export default createChangeTexture;
