// LEARNING OBJECTIVE:
// This tutorial will teach you how to build a strongly-typed REST API client in TypeScript.
// By defining types for your API requests and responses, you'll ensure data integrity,
// catch potential errors during development (not at runtime!), and improve code readability.
// We'll focus on using interfaces to define our data structures and a generic function
// to handle HTTP requests, making it reusable and type-safe.

// First, let's define the types for the data we expect to receive from our API.
// Using interfaces is a fundamental way to enforce structure in TypeScript.
// This interface represents a single 'Todo' item, as you might find in a typical API.
interface Todo {
  userId: number; // The ID of the user who owns the todo.
  id: number;     // A unique identifier for the todo item.
  title: string;  // The main text content of the todo.
  completed: boolean; // Indicates whether the todo is finished or not.
}

// Now, let's define a generic function to make HTTP GET requests.
// Generics (using '<T>') allow us to write functions that can work with any type,
// but still provide type safety for that specific type.
// Here, 'T' will represent the expected type of the API response.
async function fetchApiData<T>(url: string): Promise<T> {
  // The 'async' keyword means this function will return a Promise.
  // 'Promise<T>' signifies that this Promise will resolve with a value of type 'T'.

  try {
    // We use the built-in 'fetch' API, which is a modern standard for making network requests.
    const response = await fetch(url);

    // A crucial step for API interaction: checking if the request was successful.
    // 'response.ok' is true for HTTP status codes in the 200-299 range.
    if (!response.ok) {
      // If the response is not OK, we throw an error. This helps us catch network/server issues.
      // We include the status text for better debugging.
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }

    // 'response.json()' parses the response body as JSON.
    // Crucially, we cast this to 'T' (our generic type). TypeScript will now ensure
    // that the data we get back conforms to the structure defined by our 'Todo' interface (or whatever 'T' is).
    const data: T = await response.json();
    return data;
  } catch (error) {
    // A general catch block for any network or parsing errors.
    console.error("Error fetching API data:", error);
    // Re-throwing the error allows calling code to handle it.
    throw error;
  }
}

// Example Usage:
// Now, let's use our strongly-typed API client function.

// We'll use a public API for demonstration: JSONPlaceholder, which provides fake API data.
const USERS_API_URL = 'https://jsonplaceholder.typicode.com/todos/1'; // Example URL for a single todo item

// This is an immediately invoked async function expression (IIAFE).
// It's a common pattern to run async code at the top level in a module.
(async () => {
  console.log("Attempting to fetch todo data...");

  try {
    // Here's where the magic happens! We call our generic fetch function.
    // We explicitly tell TypeScript that we expect a 'Todo' object as the response.
    const todoItem: Todo = await fetchApiData<Todo>(USERS_API_URL);

    // Now, 'todoItem' is strongly typed as 'Todo'. We can access its properties
    // with full confidence and benefit from autocompletion and type checking.
    console.log("Fetched Todo:", todoItem);
    console.log("Todo Title:", todoItem.title); // Autocompletion works here!
    console.log("Is it completed?", todoItem.completed); // Type safety in action!

    // If you tried to access a property that doesn't exist on 'Todo', like:
    // console.log(todoItem.nonExistentProperty);
    // TypeScript would immediately show an error *before* you even run the code!

  } catch (error) {
    // If the fetchApiData function throws an error (e.g., network issue, API down),
    // we catch it here and display a user-friendly message.
    console.error("Failed to retrieve todo item:", error);
  }
})();