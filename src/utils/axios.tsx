import axios from 'axios';
// import { GET } from './constants/requestTypes';
const GET = 'get';
interface HttpConfig {
  method: string;
  url: string;
  data?: any;
  contentType?: string;
}

export const httpConfig = async (
  url: string,
  method: string = GET,
  data: any = null,
  contentType: string = 'application/json'
) => {
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const overrideKey = import.meta.env.VITE_OVERRIDE_KEY || 'V3R1TmxHb05KWnV4RnZ1VkNCY09DZHRlQ2dEOTkyZkM';

  return {
    method,
    url,
    baseURL: apiBaseUrl,
    data,
    headers: {
      'Accept': contentType,
      'Content-Type': contentType,
      'Override-Key': overrideKey
    }
  };
};

const httpClient = async ({ method, url, data, contentType }: HttpConfig) => {
  const config = await httpConfig(url, method, data, contentType);
  
  // Add response interceptor
  const client = axios.create();
  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        return Promise.reject({
          message: error.response.data?.message || 'Request failed',
          status: error.response.status,
          data: error.response.data
        });
      }
      return Promise.reject({
        message: error.message || 'An unexpected error occurred'
      });
    }
  );

  return client(config);
};

export default httpClient;



interface ValidationResponse {
  isValid: boolean;
  message?: string;
  data?: {
    status?: boolean;
    code?: string;
    error?: string;
    message?: string;
    payment?: {
      id: number;
      reference: string;
      amount: number;
      currency: string;
      status: string;
      email: string;
      created_at: string;
      metadata?: string;
    };
  };
}

interface PaymentDetailsResponse {
  payments: Array<{
    id: number;
    reference: string;
    amount: number;
    currency: string;
    status: string;
    email: string;
    created_at: string;
    metadata?: string;
  }>;
  references: string[];
  total: number;
}


interface PaymentInitializationResponse {
  status: boolean;
  message?: string;
  data?: {
    access_code: string;
    payment_url: string;
    reference?: string;
    amount?: number;
    currency?: string;
    [key: string]: any; // For any additional fields
  };
  error?: string;
}


export const validateReference = async (reference: string): Promise<ValidationResponse> => {
  try {
    const response = await httpClient({
      method: 'get',
      url: `multipay/verify/${reference}`
    });

    // Handle successful response
    return {
      isValid: response.data?.status === true,
      message: response.data?.message,
      data: response.data
    };
  } catch (error: any) {
    console.log('validateReference error:', error);
    
    // Handle axios errors (API returned an error response)
    if (axios.isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data;
      return {
        isValid: false,
        message: errorData.message || errorData.error || 'Invalid payment reference',
        data: errorData
      };
    }
    
    // Handle other errors (network issues, etc.)
    throw new Error(error.message || 'Failed to validate reference');
  }
};



// export const validateBatchReferences = async (references: string[]): Promise<Record<string, boolean>> => {
// export const validateBatchReferences = async (references: string[]): Promise<PaymentDetailsResponse> => {
//   try {
//     const response = await httpClient({
//       method: 'post',
//       url: 'multipay/fetch-details',
//       data: {
//         references
//       }
//     });

//      if (!response.data?.payments) {
//       throw new Error("Invalid response format");
//     }

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "Failed to validate references");
//     }
//     throw new Error("An unexpected error occurred");
//   }
// };


export const validateBatchReferences = async (references: string[]): Promise<PaymentDetailsResponse> => {
  try {
    // console.log('Sending batch validation request with references:', references);
    
    const response = await httpClient({
      method: 'post',
      url: 'multipay/fetch-details',
      data: {
        references
      }
    });

    if (!response || !response.data) {
      throw new Error("No response data received from server");
    }

    if (response.data.status === false) {
      throw new Error(response.data.message || "API returned error status");
    }

    const payments = response.data.payments || response.data.data?.payments;
    
    if (!payments) {
      throw new Error("Invalid response format - no payments data found");
    }

    // Return the data in the expected format
    return {
      ...response.data,
      payments: payments
    };
    
  } catch (error: any) {
    // console.error('validateBatchReferences error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          `Request failed with status ${error.response?.status}` ||
                          "Failed to validate references";
      throw new Error(errorMessage);
    }
    
    // Re-throw the error if it's already an Error object
    if (error instanceof Error) {
      throw error;
    }
    
    // Handle any other type of error
    throw new Error(`An unexpected error occurred: ${String(error)}`);
  }
};


export const initializePayment = async (references: string[]) => {
    try {
      const response = await httpClient({
        method: 'post',
        url: 'multipay/initialise',
        data: {
          payments: references
        }
      });
      return response.data as PaymentInitializationResponse;
    } catch (error) {
      console.error('Payment initialization failed:', error);
      throw new Error(
        error.response?.data?.message ||
        error.message || 
        'Failed to initialize payment'
      );
    }
  };