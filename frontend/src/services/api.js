// Centralized API service for FitGenie
// Base URL configuration
const API_BASE_URL = 'http://localhost:5000';

/**
 * Custom API Error class for better error handling
 */
class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic request handler
 * @param {string} endpoint - API endpoint (e.g., '/analyze-clothing')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} - Parsed response data
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-OK responses
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }
      
      throw new ApiError(
        errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    // Parse response dynamically
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else if (contentType && contentType.includes('text/')) {
      return await response.text();
    } else {
      // Return raw response for other content types
      return response;
    }
  } catch (error) {
    // Re-throw ApiError as-is
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Wrap network errors
    throw new ApiError(
      error.message || 'Network request failed',
      0,
      { originalError: error }
    );
  }
}

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<any>}
 */
export async function get(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  return request(url, {
    method: 'GET',
  });
}

/**
 * POST request with JSON body
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<any>}
 */
export async function post(endpoint, data = {}) {
  return request(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * POST request with FormData (for file uploads)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - FormData object
 * @returns {Promise<any>}
 */
export async function postFormData(endpoint, formData) {
  return request(endpoint, {
    method: 'POST',
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary
  });
}

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<any>}
 */
export async function put(endpoint, data = {}) {
  return request(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body data
 * @returns {Promise<any>}
 */
export async function patch(endpoint, data = {}) {
  return request(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>}
 */
export async function del(endpoint) {
  return request(endpoint, {
    method: 'DELETE',
  });
}

// =============================================================================
// API ENDPOINT METHODS
// =============================================================================

/**
 * Analyze clothing image
 * @param {File} imageFile - Image file to analyze
 * @returns {Promise<Object>} - Dynamic analysis result
 */
export async function analyzeClothing(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return postFormData('/analyze-clothing', formData);
}

/**
 * Analyze skin tone from face image
 * @param {File} imageFile - Face image file to analyze
 * @returns {Promise<Object>} - Dynamic analysis result
 */
export async function analyzeSkin(imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  return postFormData('/analyze-skin', formData);
}

/**
 * Get weather data for a city
 * @param {string} city - City name
 * @returns {Promise<Object>} - Dynamic weather data
 */
export async function getWeather(city) {
  return get('/weather', { city });
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if error is an API error
 * @param {Error} error
 * @returns {boolean}
 */
export function isApiError(error) {
  return error instanceof ApiError;
}

/**
 * Get error message from any error type
 * @param {Error} error
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (isApiError(error)) {
    return error.message;
  }
  return error?.message || 'An unexpected error occurred';
}

/**
 * Update base URL (useful for environment-specific configuration)
 * @param {string} newBaseUrl
 */
export function setBaseUrl(newBaseUrl) {
  // This could be enhanced to update a mutable config object
  console.warn('Base URL update not implemented in current version');
}

// Default export for convenience
export default {
  get,
  post,
  postFormData,
  put,
  patch,
  del,
  analyzeClothing,
  analyzeSkin,
  getWeather,
  isApiError,
  getErrorMessage,
  setBaseUrl,
};
