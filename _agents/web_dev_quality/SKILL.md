---
name: Web Development Quality and Debugging
description: Guidelines and best practices for developing error-free web applications and efficient debugging.
---

# Web Development Quality and Debugging Skill

This skill provides a comprehensive framework for building robust, maintainable, and error-free web applications while providing effective strategies for debugging when issues arise.

## 🚀 Developing Error-Free Web Apps

### 1. Robust Architecture & Modularity
- **Separation of Concerns**: Keep logic, presentation, and data fetching separate.
- **Small, Focused Components**: Break down UIs into small, reusable components with a single responsibility.
- **Pure Functions**: Favor pure functions for business logic to make testing and reasoning easier.

### 2. Defensive Programming
- **Input Validation**: Always validate data from external sources (APIs, user input) using libraries like Zod or Joi.
- **Graceful Degradation**: Ensure the app remains functional (or fails gracefully) if an external service or a non-critical feature fails.
- **Error Boundaries**: Use React Error Boundaries (or equivalent) to prevent the entire app from crashing due to a single component error.

### 3. Type Safety & Documentation
- **Leverage Typing**: Use TypeScript or JSDoc extensively to catch type-related errors at compile-time/development-time.
- **Clear Naming**: Use descriptive names for variables, functions, and components.
- **Meaningful Comments**: Document *why* complex logic exists, not just *what* it does.

### 4. Comprehensive Testing
- **Unit Tests**: Test individual functions and components in isolation.
- **Integration Tests**: Verify that different parts of the system work together correctly (e.g., component + API).
- **End-to-End (E2E) Tests**: Simulate real user flows to ensure critical paths (like checkout or login) are working.

### 5. Automated Quality Guards
- **Linting**: Use ESLint with strict configurations (e.g., `eslint-config-airbnb`) to enforce code quality and consistency.
- **Formatting**: Use Prettier to ensure a consistent code style across the project.
- **Pre-commit Hooks**: Use Husky to run linters and tests before code is committed.

---

## 🔍 Effective Debugging Strategies

### 1. Root Cause Analysis (RCA)
- **Reproduce First**: Never try to fix a bug you haven't successfully reproduced.
- **Isolate the Issue**: Systematically narrow down the source of the problem by disabling components or code blocks.
- **Check the Basics**: Verify network requests, console errors, and environmental variables first.

### 2. Mastering DevTools
- **Browser DevTools**: Use the Network tab for API issues, the Elements tab for styling/DOM issues, and the Sources tab for step-through debugging.
- **Node.js Inspector**: Use `--inspect` to debug backend logic with the same power as browser tools.
- **React/Vue DevTools**: Use framework-specific tools to inspect state, props, and component hierarchies.

### 3. Strategic Logging
- **Meaningful Logs**: Avoid `console.log('here')`. Instead, use `console.log({ user, action, timestamp })`.
- **Log Levels**: Use `console.warn` and `console.error` appropriately.
- **Production Logging**: Use services like Sentry or LogRocket to capture errors and user sessions in production.

### 4. The "Rubber Duck" Method
- Explain the problem out loud (even to a rubber duck). This often helps you spot flaws in your logic or assumptions.

### 5. Binary Search Debugging (Git Bisect)
- Use `git bisect` to find the exact commit that introduced a regression by binary searching through your commit history.
