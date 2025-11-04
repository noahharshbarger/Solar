## How API Helpers Make Testing Easier

When you use API helpers, you can easily swap out real network calls for mock data in your tests. This lets you test your UI and logic without depending on a live backend.

### Example: Mocking Project Fetches in a Test

```js
// api.js
export function fetchProjects() {
  return fetch('/api/projects').then(res => res.json());
}

// __mocks__/api.js (for testing)
export function fetchProjects() {
  return Promise.resolve({ items: [
    { project_id: 1, project_name: 'Test Project', designs: [] }
  ] });
}

// In your test file
import * as api from '../__mocks__/api';
import ProjectsPage from '../ProjectsPage';

test('renders projects from mock API', async () => {
  // Use the mock fetchProjects instead of the real one
  const projects = await api.fetchProjects();
  expect(projects.items[0].project_name).toBe('Test Project');
});
```

**Why is this useful?**
- You can test your UI and logic without waiting for real API responses.
- You can simulate errors, loading states, and edge cases easily.
- Your tests run faster and are more reliable.
# Why Do We Use API Helper Functions in React Projects?

## The Big Picture

When building modern web apps, we often need to fetch data from a backend API. If every component handled its own API calls, our code would quickly become messy, repetitive, and hard to maintain. API helper functions solve this by centralizing all data-fetching logic in one place.

## Key Benefits (Explained)

- **Separation of concerns:**
  - UI components should focus on displaying data, not fetching it. API helpers keep responsibilities clear, like having a chef cook and a waiter serve.
- **Reusability:**
  - The same API function can be used in many places. If you need project data in three different pages, you only write the fetch logic once.
- **Maintainability:**
  - If your API changes (e.g., a new URL or header), you update one helper function instead of hunting through dozens of files.
- **Testability:**
  - You can write unit tests for your API helpers without worrying about UI. This makes bugs easier to find and fix.
- **Readability:**
  - Components are easier to read and understand when they only handle state and rendering, not networking details.
- **Team workflow:**
  - Frontend and backend developers can work independently. Frontend can use mock helpers, backend can change endpoints, and everyone stays in sync.

## Real-World Analogy

Think of API helpers like a library reference desk. Instead of every student searching the whole library for a book, they ask the librarian (the helper function), who knows exactly where to look. This saves time and avoids confusion.

## How Does It Work?

- API helpers (like `fetchProjects`, `fetchDesignDetails`) handle all the details of making requests, parsing responses, and error handling.
- Components import and call these functions, then update their state with the results.
- If you need to add a new feature (like fetching user info), you just add a new helper function.

## Example

```js
// api.js
export function fetchProjects({ page = 1, perPage = 10 } = {}) {
  // ...fetch logic...
}
export function fetchDesignDetails(designId) {
  // ...fetch logic...
}

// In your component
import { fetchProjects, fetchDesignDetails } from '../../api';

useEffect(() => {
  fetchProjects().then(setProjects);
}, []);
```

## Teaching Tips

- Show how changing the API URL in one place updates all components instantly.
- Demonstrate adding a new API helper for a new feature—no UI changes needed.
- Encourage students to keep UI and data logic separate for cleaner, more professional code.
- Point out how this pattern is used in real companies and open-source projects.

---

**Summary:**
API helpers make your codebase easier to read, maintain, and scale. They help teams work faster and with fewer bugs. This is a best practice in all modern React projects.
