export default state => ({
  inProgress: state.auth.loginInProgress,
  error: state.auth.loginError,
});