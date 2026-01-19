// Objective: Learn to build a reactive timer in Kotlin using Flows to update a UI element in real-time.
// This tutorial will demonstrate how to use Kotlin Flows to create a stream of data (timer ticks)
// and how to collec this stream to update a simple UI representation.
// We will focus on the `flow` builder and `collect` terminal operator.

import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import kotlin.random.Random // Importing for potential future extensions, not strictly needed for basic timer

// --- Core Timer Logic ---

// This function creates a Flow that emits integers (representing seconds) at a specified interval.
// The `flow` builder is used to define a custom asynchronous data stream.
// Parameters:
//   intervalMillis: The time in milliseconds between each emission (each tick of the timer).
// Returns:
//   A Flow of integers, where each integer is the elapsed time in seconds.
fun timerFlow(intervalMillis: Long): Flow<Int> = flow {
    var seconds = 0 // Initialize the counter for seconds
    while (true) { // Create an infinite loop to keep the timer running
        delay(intervalMillis) // Pause execution for the specified interval. This is crucial for not hogging the CPU.
        seconds++ // Increment the seconds counter
        emit(seconds) // 'emit' sends the current value (seconds) downstream to any collectors.
                      // This is how data flows out of the 'flow' builder.
    }
}

// --- Simulated UI Update Function ---

// In a real Android app, this would be a function that updates a TextView or another UI element.
// For this tutorial, we'll simulate it by printing to the console.
// This function is marked as 'suspend' because it's called from a coroutine scope and
// might potentially perform asynchronous operations in a real app (though not in this simple example).
suspend fun updateUi(timeInSeconds: Int) {
    // Simulate updating a UI element with the current time.
    // In Android, this might look like: textView.text = timeInSeconds.toString()
    println("Timer updated: $timeInSeconds seconds")
}

// --- Example Usage ---

// The main function is our entry point to demonstrate the timer.
// We need a CoroutineScope to launch coroutines, which are required for Flows.
fun main() = runBlocking { // runBlocking is used here for simplicity in a standalone example.
                           // In Android, you'd typically use viewModelScope or lifecycleScope.

    println("Starting the reactive timer...")

    // Define the interval for our timer (e.g., 1 second).
    val timerInterval = 1000L // 1000 milliseconds = 1 second

    // Launch a coroutine to collect the timer's emissions.
    // This coroutine will run concurrently with other operations.
    // 'launch' starts a new coroutine that doesn't block the main thread.
    val timerJob = launch {
        timerFlow(timerInterval) // Get our timer Flow
            .collect { seconds -> // The 'collect' terminal operator starts the Flow and processes each emitted value.
                                  // The lambda block is executed every time the 'timerFlow' emits a value.
                                  // 'seconds' here is the value emitted by the flow (the elapsed time).
                updateUi(seconds) // Call our simulated UI update function with the new time.
            }
    }

    // Let the timer run for a short duration (e.g., 5 seconds) before stopping.
    // In a real app, the timer would likely run until the screen is closed or a specific event occurs.
    delay(5500L) // Wait for 5.5 seconds to see a few updates.

    println("Stopping the timer...")
    timerJob.cancel() // 'cancel()' is crucial to stop the coroutine and thus the Flow collection.
                      // This prevents the timer from running indefinitely and leaking resources.

    println("Timer stopped.")
}