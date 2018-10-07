/**
 *
 * Asynchronously loads the component for AppConnectCard
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
