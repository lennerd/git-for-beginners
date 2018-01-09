import createTextTexture from './createTextTexture';

export default function createAddTexture(width, height, options) {
  const text = [
    { font: `900 ${height}px 'Source Code Pro'`, fillStyle: '#FFFFFF' },
    '+',
  ];

  return createTextTexture(width, height, text, options);
}
