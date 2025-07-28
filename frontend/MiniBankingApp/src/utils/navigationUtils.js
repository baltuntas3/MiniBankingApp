// Navigation utility for programmatic routing
let navigate = null;

export const setNavigateFunction = (navigationFunction) => {
  navigate = navigationFunction;
};

export const navigateToLogin = (message = null) => {
  if (message) {
    sessionStorage.setItem('authMessage', message);
  }
  
  if (navigate) {
    navigate('/auth/login', { replace: true });
  } else {
    // Fallback to window.location if navigate is not available
    window.location.href = '/auth/login';
  }
};