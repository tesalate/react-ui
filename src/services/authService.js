import http from "./httpService";
import * as jwtDecode from "jwt-decode";


const apiEndpoint = "/auth";
const tokenKey = "token";


export async function login(username , password) {
  const { data: jwt } = await http.post(apiEndpoint + "/login", { username, password });
  localStorage.setItem(tokenKey, jwt);
}

export function loginWithJwt(jwt) {
  return localStorage.setItem(tokenKey, jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);  
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  logout,
  getCurrentUser,
  loginWithJwt,
  getJwt
}