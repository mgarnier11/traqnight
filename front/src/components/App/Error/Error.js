import { toast } from 'react-toastify';

class Error {
  static showError(error) {
    toast.error(error, {
      autoClose: 4000,
      pauseOnHover: false,
      pauseOnFocusLoss: false
    });
  }
}

export default Error;

