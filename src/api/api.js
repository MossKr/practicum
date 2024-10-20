import { BASE_URL } from "../utils/utilApi";

class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  _request(endpoint, options) {
    return fetch(`${this.baseUrl}${endpoint}`, options).then(this._checkResponse);
  }

  getIngredients() {
    return this._request("/ingredients");
  }

  createOrder({ ingredients, token }) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return this._request("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": formattedToken,
      },
      body: JSON.stringify({ ingredients }),
    });
  }

  register(email, password, name) {
    return this._request("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
  }

  login(email, password) {
    return this._request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  }

  logout(token) {
    return this._request("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  }

  resetPassword(email) {
    return this._request("/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  }

  resetPasswordConfirm(password, token) {
    return this._request("/password-reset/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, token }),
    });
  }

  refreshToken(token) {
    return this._request("/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  }

  getUser(token) {
    return this._request("/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });
  }

  updateUser(token, userData) {
    return this._request("/auth/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      body: JSON.stringify(userData),
    });
  }
}

const api = new Api(BASE_URL);

export default api;
