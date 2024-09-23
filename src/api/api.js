import { request } from "../utils/utilApi";

const Api = {
    getIngredients() {
      return request("ingredients");
    },

    createOrder(ingredients) {
      return request("orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });
    }
  };

  export default Api;
