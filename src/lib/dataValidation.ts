/**
 * Data validation and sanitization utilities
 */

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate transaction ID format
 */
export function validateTransactionId(id: string): boolean {
  const sanitized = sanitizeString(id);
  // Transaction IDs should be alphanumeric with hyphens/underscores, 6-20 chars
  const transactionIdRegex = /^[A-Za-z0-9_-]{6,20}$/;
  return transactionIdRegex.test(sanitized);
}

/**
 * Validate service ID
 */
export function validateServiceId(id: string): boolean {
  const sanitized = sanitizeString(id);
  // Service IDs should be lowercase letters, numbers, hyphens
  const serviceIdRegex = /^[a-z0-9-]+$/;
  return serviceIdRegex.test(sanitized);
}

/**
 * Validate numeric amount
 */
export function validateAmount(amount: number): boolean {
  return typeof amount === 'number' && 
         !isNaN(amount) && 
         isFinite(amount) && 
         amount >= 0 && 
         amount <= 999999.99; // Max reasonable amount
}

/**
 * Sanitize and validate JSON data
 */
export function validateAndSanitizeJsonData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeString(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => validateAndSanitizeJsonData(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const sanitizedKey = sanitizeString(key);
      sanitized[sanitizedKey] = validateAndSanitizeJsonData(value);
    }
    return sanitized;
  }
  
  return data;
}