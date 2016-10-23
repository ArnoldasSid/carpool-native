export default state => ({
  loggedIn: state.auth.loggedIn,
  authToken: state.auth.authToken,
  userEmail: state.auth.userEmail,
  userId: state.auth.userId,
})