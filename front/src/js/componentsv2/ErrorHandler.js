import { toast } from 'react-toastify';

class ErrorHandler {
  static showError(error) {
    toast.error(error, {
      autoClose: 4000,
      pauseOnHover: false,
      pauseOnFocusLoss: false
    });
  }
}

export default ErrorHandler;
