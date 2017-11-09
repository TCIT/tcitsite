import restToActionRoutes from './restToActionRoutes';
import pathMatch from 'path-match';
const pathMatchFn = pathMatch({end: true})

restToActionRoutes.forEach(route => route['match'] = pathMatchFn(route['url']));
export default restToActionRoutes;