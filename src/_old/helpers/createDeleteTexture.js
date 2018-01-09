import createTextTexture from './createTextTexture';

export default function createDeleteTexture(width, height, options) {
  const text = [
    { font: `900 ${height}px 'Source Code Pro'`, fillStyle: '#FFFFFF' },
    '-',
  ];

  return createTextTexture(width, height, text, options);
}
