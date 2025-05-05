# HTTP Client for Next.js 14

A modern, SOLID-compliant HTTP client implementation for Next.js 14 applications.

## Features

- Support for all common HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Authentication with Bearer token
- Error handling with toast notifications using Sonner
- Form validation error handling
- Configurable base URL, timeout, rate limiting, and more
- Type-safe responses and error handling
- Follows SOLID principles and Next.js 14 best practices

## Usage

### Basic Usage

```typescript
import { getHttpClient } from '@/lib/http';

// Simple GET request
const { data } = await getHttpClient().get('/users');

// POST request with data
const { data } = await getHttpClient().post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Authentication

```typescript
import { getHttpClient, setAuthToken, removeAuthToken } from '@/lib/http';

// Set authentication token
setAuthToken('your-jwt-token');

// Make authenticated request
const { data } = await getHttpClient().get('/protected-route');

// Remove token when logging out
removeAuthToken();
```

### Error Handling

The client automatically displays toast error messages when requests fail. For form validation errors:

```typescript
import { getHttpClient, handleFormError } from '@/lib/http';

try {
  await getHttpClient().post('/users', userData);
} catch (error) {
  // Handle form validation errors
  const formErrors = handleFormError(error);
  if (formErrors) {
    // Use formErrors to display validation messages in your form
    // formErrors = { email: ['Email is already taken'], name: ['Name is required'] }
  }
}
```

### Server Actions

```typescript
'use server';

import { getHttpClient } from '@/lib/http';
import { cookies } from 'next/headers';

export async function fetchData() {
  // Get token from HTTP-only cookie
  const token = cookies().get('auth_token')?.value;
  
  if (token) {
    const client = getHttpClient();
    client.setAuthToken(token);
    const { data } = await client.get('/api/data');
    return data;
  }
  
  throw new Error('Authentication required');
}
```

### Custom Configuration

```typescript
import { createHttpClient } from '@/lib/http';

const customClient = createHttpClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  retries: 2,
  headers: {
    'X-Custom-Header': 'value'
  }
});

const { data } = await customClient.get('/endpoint');
```

## Architecture

This HTTP client follows SOLID principles:

- **Single Responsibility**: Each class/function has one responsibility
- **Open/Closed**: Extensible but closed for modification
- **Liskov Substitution**: Interfaces are properly used
- **Interface Segregation**: Clean interfaces with focused methods
- **Dependency Inversion**: Dependencies are injected when needed

The implementation uses:
- Axios for the underlying HTTP requests
- Sonner for toast notifications
- TypeScript for type safety 