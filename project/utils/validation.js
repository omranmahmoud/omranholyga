// Basic validation utility for product data
// You can expand this with more rules as needed

export function validateProduct(product) {
  if (!product) return { valid: false, error: 'No product data provided.' };
  if (!product.name || typeof product.name !== 'string') {
    return { valid: false, error: 'Product name is required.' };
  }
  if (!product.price || typeof product.price !== 'number' || product.price < 0) {
    return { valid: false, error: 'Product price must be a positive number.' };
  }
  // Add more validation rules as needed
  return { valid: true };
}

// Example usage:
// const result = validateProduct({ name: 'Test', price: 10 });
// if (!result.valid) { /* handle error */ }
