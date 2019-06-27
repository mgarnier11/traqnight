import { Component } from 'react';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { handleError } from '../redux/actions/error-actions';

const mapStateToProps = state => {
  return { errors: state.errors };
};

function mapDispatchToProps(dispatch) {
  return {
    handleError: () => dispatch(handleError())
  };
}

class ErrorComponent extends Component {
  constructor(props) {
    super(props);

    this.onOpen = this.onOpen.bind(this);
  }

  onOpen() {
    this.props.handleError();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors.length !== this.props.errors.length) {
      const error = this.props.errors[this.props.errors.length - 1];
      if (!error.handled) {
        toast.error('Erreur Code : ' + error.code + ', ' + error.message, {
          position: 'top-center',
          autoClose: 4000,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          onOpen: this.onOpen
        });
      }
    }
  }

  render() {
    return '';
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorComponent);

export class ErrorHandler {
  static showError(error) {
    toast.error(error, {
      autoClose: 4000,
      pauseOnHover: false,
      pauseOnFocusLoss: false
    });
  }
}
