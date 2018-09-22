/**
 *
 * Asynchronously loads the component for Bubbles
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
