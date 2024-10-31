export const BASE_URL = "https://norma.nomoreparties.space/api";

interface ApiResponse {
  success: boolean;
  [key: string]: any;
}

const checkResponse = (res: Response): Promise<any> => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка ${res.status}`);
};

const checkSuccess = (res: ApiResponse): ApiResponse | never => {
  if (res && res.success) {
    return res;
  }
  throw new Error(`Ответ не success: ${JSON.stringify(res)}`);
};

export const request = (endpoint: string, options?: RequestInit): Promise<ApiResponse> => {
  return fetch(`${BASE_URL}${endpoint}`, options)
    .then(checkResponse)
    .then(checkSuccess)
    .catch((error) => {
      console.error('Error in API request:', error);
      throw error;
    });
};
