/**
 *
 * Asynchronously loads the component for TransferComplete
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
