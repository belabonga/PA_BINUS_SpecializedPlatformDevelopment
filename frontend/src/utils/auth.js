export const getToken = () => localStorage.getItem("auth_token");

export const getUser = () => {
  const raw = localStorage.getItem("auth_user");
  return raw ? JSON.parse(raw) : null;
};

export const saveAuth = (token, user) => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
  window.dispatchEvent(new Event("auth-updated"));
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
  window.dispatchEvent(new Event("auth-updated"));
};
