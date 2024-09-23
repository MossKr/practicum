const API_URL = "https://norma.nomoreparties.space/api";

class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getIngredients() {
        console.log("API: Fetching");
        try {
            const response = await fetch(`${this.baseUrl}/ingredients`);
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const result = await response.json();
            console.log("API::", result);
            if (!result.success) {
                throw new Error("API вернул неуспешный результат");
            }
            console.log("API: successfully", result.data);
            return result.data;
        } catch (error) {
            console.error("API:", error);
            throw error;
        }
    }
    async createOrder(ingredients) {
        console.log("API: order");
        try {
            const response = await fetch(`${this.baseUrl}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ingredients }),
            });
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            const result = await response.json();
            console.log("API: Raw:", result);
            if (!result.success) {
                throw new Error("API неуспешный результат");
            }
            console.log("API: Order created successfully", result);
            return result;
        } catch (error) {
            console.error("API: Error creating order", error);
            throw error;
        }
    }
}

const api = new Api(API_URL);

export default api;
