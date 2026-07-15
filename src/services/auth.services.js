// src/services/auth.service.js
import api from "#lib/api";
import { unwrap } from "./_helpers";

export function register({ name, email, password }) {
  return api.post("/auth/register", { name, email, password }).then(unwrap);
}

export function sendVerificationEmail(email) {
  return api.post("/auth/verify-email/send", { email }).then(unwrap);
}

export function confirmVerificationEmail({ email, code }) {
  return api.post("/auth/verify-email/confirm", { email, code }).then(unwrap);
}

export function login({ email, password }) {
  // header x-platform: web -> backend set refreshToken sbg cookie httpOnly
  return api
    .post(
      "/auth/login",
      { email, password },
      { headers: { "x-platform": "web" } },
    )
    .then(unwrap);
}

export function getMe() {
  return api.get("/auth/me").then(unwrap);
}

export function refreshToken() {
  // tidak perlu body, cookie httpOnly terkirim otomatis (withCredentials)
  return api.post("/auth/refresh").then(unwrap);
}

export const changePassword = async (data) => {
  const response = await api.patch("/auth/change-password", {
    oldPassword: data.oldPassword,
    newPassword: data.newPassword,
  });

  return response.data;
};

export function forgotPassword(email) {
  return api.post("/auth/forgot-password", { email }).then(unwrap);
}

export function verifyResetCode({ email, code }) {
  return api
    .post("/auth/forgot-password/verify-code", { email, code })
    .then(unwrap);
}

export function resetPassword({ resetToken, newPassword }) {
  return api
    .post("/auth/reset-password", { resetToken, newPassword })
    .then(unwrap);
}

export function logout() {
  return api.post("/auth/logout").then(unwrap);
}
