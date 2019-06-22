import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Menu } from './Menu';

const connectedMenu = connect(
  (state: any) => ({
    router: state.router,
  }),
  {
    push,
  },
)(Menu);

export default connectedMenu;
