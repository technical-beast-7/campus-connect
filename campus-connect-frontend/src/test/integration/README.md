# Integration Tests

This directory contains integration tests for the Campus Connect frontend application. These tests verify that different parts of the application work together correctly, including API interactions, user flows, and component integration.

## Test Structure

### API Integration Tests (`api-integration.test.tsx`)
Tests the integration between the frontend and backend APIs:
- **POST requests**: Verifies form submissions with correct headers and body
- **GET requests**: Tests data fetching and display
- **PATCH requests**: Tests update operations
- **Error handling**: Network errors, server errors (500), and unauthorized errors (401)

### Simple Integration Tests (`simple-integration.test.tsx`)
Comprehensive integration tests covering:
- **API Integration**: Basic API calls with proper error handling
- **Form Integration**: Form validation and submission flows
- **Navigation Integration**: Routing between different pages
- **State Management**: Context and state updates across components
- **User Interaction Flows**: Complete multi-step user journeys

## Key Features Tested

### 1. Complete User Flows
- Registration → Login → Report Issue
- Authority user login and issue management
- Multi-step form completion with validation

### 2. API Integration
- Proper HTTP method usage (GET, POST, PATCH)
- Correct headers and authentication tokens
- Request body formatting
- Response handling and error states

### 3. Error Handling
- Network connectivity issues
- Server errors (4xx, 5xx)
- Validation errors
- Session expiration

### 4. State Management
- Context providers and consumers
- State updates across multiple components
- Real-time UI updates based on state changes

### 5. Form Validation
- Client-side validation rules
- Real-time error feedback
- Success state handling
- Field-level validation

## Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run integration tests in watch mode
npm run test:integration:watch

# Run integration tests with UI
npm run test:integration:ui

# Run specific test file
npx vitest --run src/test/integration/api-integration.test.tsx
```

## Test Configuration

Integration tests use a separate Vitest configuration (`vitest.integration.config.ts`) with:
- **Environment**: jsdom for DOM simulation
- **Setup**: Custom test setup with mocks and utilities
- **Coverage**: Comprehensive coverage reporting
- **Timeout**: Extended timeouts for integration scenarios

## Mock Strategy

### API Mocking
- Global `fetch` mock for all HTTP requests
- Configurable responses for different scenarios
- Proper error simulation for edge cases

### Component Mocking
- Minimal mocking to test real integration
- Focus on testing actual component interactions
- Mock only external dependencies (APIs, third-party libraries)

## Test Patterns

### 1. Arrange-Act-Assert Pattern
```typescript
// Arrange: Set up test data and mocks
const mockResponse = { success: true, data: {...} }
global.fetch.mockResolvedValueOnce({ ok: true, json: () => mockResponse })

// Act: Perform user actions
await user.type(screen.getByLabelText(/email/i), 'test@example.com')
await user.click(screen.getByRole('button', { name: /submit/i }))

// Assert: Verify expected outcomes
expect(global.fetch).toHaveBeenCalledWith('/api/endpoint', {...})
expect(screen.getByText(/success/i)).toBeInTheDocument()
```

### 2. User-Centric Testing
- Use `userEvent` for realistic user interactions
- Test from the user's perspective
- Focus on behavior rather than implementation

### 3. Async Testing
- Proper use of `waitFor` for async operations
- Test loading states and transitions
- Handle race conditions and timing issues

## Coverage Goals

Integration tests aim to cover:
- **User Flows**: 90%+ of critical user journeys
- **API Integration**: All major API endpoints and error scenarios
- **Component Integration**: Key component interactions
- **Error Boundaries**: Error handling and recovery flows

## Best Practices

### 1. Test Real Scenarios
- Test complete user workflows
- Use realistic test data
- Simulate actual user behavior

### 2. Minimize Mocking
- Mock only what's necessary (external APIs, third-party services)
- Test real component interactions
- Use actual routing and state management

### 3. Clear Test Names
- Describe what the test does from a user perspective
- Include the expected outcome
- Group related tests logically

### 4. Maintainable Tests
- Use helper functions for common operations
- Keep tests focused and atomic
- Avoid test interdependencies

## Debugging Integration Tests

### Common Issues
1. **Timing Issues**: Use `waitFor` for async operations
2. **Mock Problems**: Ensure mocks are properly reset between tests
3. **DOM Queries**: Use appropriate queries and wait for elements
4. **State Issues**: Verify proper cleanup between tests

### Debugging Tools
- Use `screen.debug()` to see current DOM state
- Add `console.log` statements in test components
- Use browser dev tools with `--ui` flag
- Check network tab for actual API calls in development

## Future Enhancements

### Planned Additions
- End-to-end test scenarios
- Performance testing integration
- Accessibility testing automation
- Visual regression testing
- Cross-browser compatibility tests

### Test Data Management
- Implement test data factories
- Add database seeding for integration tests
- Create reusable test fixtures
- Implement test data cleanup strategies