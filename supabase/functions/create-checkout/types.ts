
export interface CheckoutRequest {
  planType: 'creator' | 'studio';
}

export interface CheckoutResponse {
  url: string;
}

export interface ErrorResponse {
  error: string;
  details: string;
  timestamp: string;
}

export interface PlanConfig {
  name: string;
  priceId: string;
  description: string;
}

export interface LogDetails {
  [key: string]: any;
}
