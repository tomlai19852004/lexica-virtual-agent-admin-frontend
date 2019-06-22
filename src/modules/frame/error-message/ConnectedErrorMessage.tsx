import { connect } from 'react-redux';
import { ErrorMessage, ErrorMessageProps } from './ErrorMessage';

export default connect(
  (state: any) => ({
    error: state.frame.error,
  }),
)(ErrorMessage);
