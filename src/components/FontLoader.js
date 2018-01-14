import Loadable from 'react-loadable';

import LoadingSpinner from './LoadingSpinner';
import fontRegular from '../fonts/SourceCodeProRegular.json';

function fetchFont(font) {
  return fetch(font)
    .then(response => response.json())
    .then(data => new THREE.Font(data));
}

const FontLoader = Loadable.Map({
  loader: {
    fontRegular: () => fetchFont(fontRegular),
  },
  loading: LoadingSpinner,
  render: (fonts, { children }) => children(fonts),
});

export default FontLoader;
