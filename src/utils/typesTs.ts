// src/utils/typesTs.ts
export interface Ingredient {
    _id: string;
    name: string;
    type: "bun" | "sauce" | "main";
    proteins: number;
    fat: number;
    carbohydrates: number;
    calories: number;
    price: number;
    image: string;
    image_mobile: string;
    image_large: string;
    __v: number;
}

export type LoadingType = boolean;
export type ErrorType = string | null;

export interface LoadErrorType {
    isLoading: LoadingType;
    error: ErrorType;
}

export interface ConstructorIngredient extends Ingredient {
    uniqueId: string;
}


export interface DragItem {
    id: string;
    index: number;
}

// Типы для состояний
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

// Типы для ответов API
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Тип для заказа
export interface Order {
    name: string;
    order: {
      number: number;
    };
    success: boolean;
  }
  

// Типы для модального окна
export interface ModalProps {
    title?: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

//
export interface AuthResponse {
    success: boolean;
    accessToken: string;
    refreshToken: string;
    user: {
      email: string;
      name: string;
    };
  }
  
  export interface UserData {
    email?: string;
    name?: string;
    password?: string;
  }
