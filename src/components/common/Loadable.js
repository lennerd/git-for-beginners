import BaseLoadable from 'react-loadable';

import LoadingSpinner from './LoadingSpinner';

function Loadable(loader, options) {
  return BaseLoadable({
    loading: LoadingSpinner,
    ...options,
    loader,
  })
}

Loadable.Map = (loader, options) => {
  return BaseLoadable.Map({
    loading: LoadingSpinner,
    ...options,
    loader,
  })
};

export default Loadable;
