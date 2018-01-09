import BaseLoadable from 'react-loadable';

import LoadingSpinner from './LoadingSpinner';

function Loadable(options) {
  return BaseLoadable({
    loading: LoadingSpinner,
    ...options,
  });
}

Loadable.Map = (options) => {
  return BaseLoadable.Map({
    loading: LoadingSpinner,
    ...options,
  });
};

export default Loadable;
