import { BASE_URL } from "../utils/utilApi";
import { Ingredient, Order, AuthResponse, UserData } from "../utils/typesTs";

class Api {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async _checkResponse(res: Response): Promise<any> {
    if (res.ok) {
      return await res.json();
    }
    const err = await res.json();
    throw err;
  }
  

  private _request(endpoint: string, options?: RequestInit): Promise<any> {
    return fetch(`${this.baseUrl}${endpoint}`, options).then(this._checkResponse);
  }

  getIngredients(): Promise<{ success: boolean; data: Ingredient[] }> {
    return this._request("/ingredients");
  }

  createOrder({ ingredients, token }: { ingredients: string[], token: string }): Promise<Order> {
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

  register(email: string, password: string, name: string): Promise<AuthResponse> {
    return this._request("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
  }

 async login(email: string, password: string): Promise<AuthResponse> {
  console.log('Attempting login with:', { email, password: '****' });
  const data = await this._request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  console.log('Login response:', data);
  if (data.success && data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    console.log('Tokens saved to localStorage');
  } else {
    console.error('Login successful but no tokens received');
  }
  return data;
}

  
  logout(token: string): Promise<{ success: boolean }> {
    return this._request("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  }

  resetPassword(email: string): Promise<{ success: boolean }> {
    return this._request("/password-reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  }

  resetPasswordConfirm(password: string, token: string): Promise<{ success: boolean }> {
    return this._request("/password-reset/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, token }),
    });
  }

  refreshToken(token: string): Promise<AuthResponse> {
    return this._request("/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  }

  getUser(token: string): Promise<{ success: boolean; user: UserData }> {
    return this._request("/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });
  }

  updateUser(token: string, userData: UserData): Promise<{ success: boolean; user: UserData }> {
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
