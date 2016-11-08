export default state => ({
  inProgress: state.auth.registrationInProgress,
  error: state.auth.registrationError,
});