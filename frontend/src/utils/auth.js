export const getToken = () => localStorage.getItem("shan_token");

export const getUser = () => {
  const raw = localStorage.getItem("shan_user");
  return raw ? JSON.parse(raw) : null;
};

export const saveAuth = (token, user) => {
  localStorage.setItem("shan_token", token);
  localStorage.setItem("shan_user", JSON.stringify(user));
  window.dispatchEvent(new Event("auth-updated"));
};

export const logout = () => {
  localStorage.removeItem("shan_token");
  localStorage.removeItem("shan_user");
  window.dispatchEvent(new Event("auth-updated"));
};
