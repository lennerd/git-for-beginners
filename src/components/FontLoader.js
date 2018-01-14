import Loadable from 'react-loadable';

import LoadingSpinner from './LoadingSpinner';
import fontRegular from '../fonts/SourceCodeProRegular.json';
import fontBlack from '../fonts/SourceCodeProBlack.json';
import letterSpacing from '../fonts/letterSpacing';

function fetchFont(font) {
  return fetch(font)
    .then(response => response.json())
    .then(data => new THREE.Font(data));
}

const FontLoader = Loadable.Map({
  loader: {
    fontRegular: () => fetchFont(fontRegular),
    fontBlack: () => fetchFont(fontBlack).then(fontBlack => letterSpacing(fontBlack, 1.2)),
  },
  loading: LoadingSpinner,
  render: (fonts, { children }) => children(fonts),
});

export default FontLoader;
