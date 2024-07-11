import HttpService from "./htttp.service";

class AuthService {
  // authEndpoint = process.env.API_URL;

  login = async (payload) => {
    const loginEndpoint = "login";
    return await HttpService.post(loginEndpoint, payload);
  };

  register = async (credentials) => {
    const registerEndpoint = "register";
    return await HttpService.post(registerEndpoint, credentials);
  };

  logout = async () => {
    const logoutEndpoint = "logout";
    return await HttpService.post(logoutEndpoint);
  };

  forgotPassword = async (payload) => {
    const forgotPassword = "password-forgot";
    return await HttpService.post(forgotPassword, payload);
  };

  resetPassword = async (credentials) => {
    const resetPassword = "password-reset";
    return await HttpService.post(resetPassword, credentials);
  };
  addSignal = async (credentials) => {
    const addSignal = "signal/add";
    return await HttpService.post(addSignal, credentials);
  };

  getSignals = async () => {
    const getSignal = "signal/get";
    return await HttpService.get(getSignal);
  };

  updateSignal = async (newInfo) => {
    const updateSignal = `signal/update/${newInfo.selectedSignalId}`;
    return await HttpService.patch(updateSignal, newInfo.selectedSignal);
  };

  deleteSignal = async (id) => {
    const updateSignal = `signal/delete/${id.id}`;
    return await HttpService.delete(updateSignal);
  };
}

export default new AuthService();
