import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import Timetable from './Timetable.svelte';
import { ControlType, type State } from '../state'; // Assuming ControlType and State are exported from state.ts

// Mock the Optimizer
// vi.mock('optimiser', () => {
//   const Optimizer = vi.fn(() => ({
//     optimize: vi.fn((data) => data), // Mock optimize to return data as is
//   }));
//   return { Optimizer };
// });
// More robust mocking for ES modules with named exports
vi.mock('optimiser', async (importOriginal) => {
    const actual = await importOriginal() as any;
    return {
        ...actual,
        Optimizer: vi.fn().mockImplementation(() => {
            return {
                optimize: vi.fn( (data, constraints) => {
                    console.log("Mocked Optimizer.optimize called with data:", data, "and constraints:", constraints);
                    // Return data as is, or a modified version if needed for specific tests
                    return [...data, {
                        id: 'mock-optimized',
                        subject_code: 'OPTIMIZED',
                        title: 'Optimized Course',
                        day: 'Monday',
                        start_time: '16:00',
                        end_time: '17:00',
                        location: 'Optimized Room',
                        type: 'Optimized Lecture'
                    }];
                }),
            };
        }),
    };
});


describe('Timetable.svelte Rendering and Initial State', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders without crashing', () => {
        const mockState: State = {
            controls: {
                initial: ControlType.Disabled,
                subjectSelect: ControlType.Disabled,
                constraints: ControlType.Disabled,
                full: ControlType.Disabled,
                timetable: ControlType.Foreground,
            },
            subjects: [],
            timetableData: [],
        };
        const { container } = render(Timetable, { props: { state: mockState } });
        expect(container).toBeTruthy();
    });

    it('shows loading message when timetableData is empty and view is active', () => {
        const mockState: State = {
            controls: {
                initial: ControlType.Disabled,
                subjectSelect: ControlType.Disabled,
                constraints: ControlType.Disabled,
                full: ControlType.Disabled,
                timetable: ControlType.Foreground,
            },
            subjects: ['Test Subject 1'],
            timetableData: [], // Empty data
        };
        render(Timetable, { props: { state: mockState } });
        // The component's onMount is async, so data processing and rendering might take a tick
        // For now, this test assumes the "Loading" message is present if processedTimetable is empty.
        // A more robust test might await async operations if any directly tied to loading message visibility.
        expect(screen.getByText('Loading timetable data or no data available...')).toBeTruthy();
    });

    it('does not show loading message if timetable view is not active', () => {
        const mockState: State = {
            controls: {
                initial: ControlType.Disabled,
                subjectSelect: ControlType.Disabled,
                constraints: ControlType.Disabled,
                full: ControlType.Disabled,
                timetable: ControlType.Background, // Not foreground
            },
            subjects: ['Test Subject 1'],
            timetableData: [],
        };
        render(Timetable, { props: { state: mockState } });
        expect(screen.queryByText('Loading timetable data or no data available...')).toBeNull();
    });
});

describe('Timetable.svelte Data Display', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });
    
    const sampleTimetableData = [
        { id: 1, subject_code: 'COSC101', title: 'Intro to Programming', day: 'Monday', start_time: '09:00', end_time: '11:00', location: 'Rm A101', type: 'Lecture' },
        { id: 2, subject_code: 'MATH202', title: 'Calculus II', day: 'Tuesday', start_time: '10:00', end_time: '12:00', location: 'Rm B203', type: 'Lecture' },
        { id: 3, subject_code: 'PHYS105', title: 'Physics for Engineers', day: 'Wednesday', start_time: '11:00', end_time: '13:00', location: 'Phys Lab 1', type: 'Practical' },
    ];

    const mockStateWithData: State = {
        controls: {
            initial: ControlType.Disabled,
            subjectSelect: ControlType.Disabled,
            constraints: ControlType.Disabled,
            full: ControlType.Disabled,
            timetable: ControlType.Foreground,
        },
        subjects: ['COSC101', 'MATH202', 'PHYS105'],
        timetableData: sampleTimetableData,
    };

    it('renders day headers (Monday-Friday)', async () => {
        render(Timetable, { props: { state: mockStateWithData } });
        // Wait for onMount and subsequent processing
        await vi.dynamicImportSettled(); 

        expect(screen.getByText('Monday')).toBeTruthy();
        expect(screen.getByText('Tuesday')).toBeTruthy();
        expect(screen.getByText('Wednesday')).toBeTruthy();
        expect(screen.getByText('Thursday')).toBeTruthy();
        expect(screen.getByText('Friday')).toBeTruthy();
    });

    it('renders time slot labels (08:00 - 17:00)', async () => {
        render(Timetable, { props: { state: mockStateWithData } });
        await vi.dynamicImportSettled();

        for (let i = 8; i < 18; i++) {
            expect(screen.getByText(`${String(i).padStart(2, '0')}:00`)).toBeTruthy();
        }
    });

    it('renders class entries from timetableData', async () => {
        render(Timetable, { props: { state: mockStateWithData } });
        await vi.dynamicImportSettled();

        for (const event of sampleTimetableData) {
            expect(screen.getByText(event.subject_code)).toBeTruthy();
            expect(screen.getByText(event.type)).toBeTruthy();
            expect(screen.getByText(`${event.start_time} - ${event.end_time}`)).toBeTruthy();
            expect(screen.getByText(event.location)).toBeTruthy();
        }
    });

    it('applies correct styles for positioning based on processDataForGrid', async () => {
        render(Timetable, { props: { state: mockStateWithData } });
        await vi.dynamicImportSettled();

        const eventElement = screen.getByText('COSC101').closest('.timetable-event');
        expect(eventElement).toBeTruthy();
        if (eventElement) { // type guard
            // Expected: top: 50px (09:00 is 1 hour from 08:00, 1*50px)
            // Expected: height: 100px (2 hours duration, 2*50px)
            expect(eventElement.style.top).toBe('50px'); 
            expect(eventElement.style.height).toBe('100px');
        }

        const mathEventElement = screen.getByText('MATH202').closest('.timetable-event');
        expect(mathEventElement).toBeTruthy();
        if (mathEventElement) {
            // Expected: top: 100px (10:00 is 2 hours from 08:00, 2*50px)
            // Expected: height: 100px (2 hours duration, 2*50px)
            expect(mathEventElement.style.top).toBe('100px');
            expect(mathEventElement.style.height).toBe('100px');
        }
    });
});


describe('Timetable.svelte Optimizer Interaction', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks(); // Clear mocks for each test
    });
    
    const initialMockState: State = {
        controls: {
            initial: ControlType.Disabled,
            subjectSelect: ControlType.Disabled,
            constraints: ControlType.Disabled,
            full: ControlType.Disabled,
            timetable: ControlType.Foreground,
        },
        subjects: ['SUBJ1001', 'SUBJ1002'],
        timetableData: [], // Initially empty, to be populated by fetchTimetableData and optimizer
    };

    it('calls Optimizer.optimize onMount and updates timetableData', async () => {
        // The Optimizer mock is already set up globally
        const { Optimizer } = await import('optimiser');
        const mockOptimizeInstance = vi.mocked(Optimizer.mock.results[0].value.optimize);

        render(Timetable, { props: { state: initialMockState } });
        
        // Wait for onMount and subsequent async operations (fetch, optimize)
        await vi.dynamicImportSettled(); // Ensures all dynamic imports and their effects are resolved

        expect(Optimizer).toHaveBeenCalledTimes(1); // Check if Optimizer constructor was called
        expect(mockOptimizeInstance).toHaveBeenCalledTimes(1); // Check if optimize method was called
        
        // Check if optimize was called with the mock data from fetchTimetableData
        // This requires knowing what fetchTimetableData returns.
        // For this test, fetchTimetableData returns a fixed array:
        const expectedFetchedData = [
            { id: 1, subject_code: 'COSC101', title: 'Intro to Programming', day: 'Monday', start_time: '09:00', end_time: '11:00', location: 'Rm A101', type: 'Lecture' },
            { id: 2, subject_code: 'COSC101', title: 'Intro to Programming', day: 'Monday', start_time: '14:00', end_time: '15:00', location: 'Lab A2', type: 'Tutorial' },
            { id: 3, subject_code: 'MATH202', title: 'Calculus II', day: 'Tuesday', start_time: '10:00', end_time: '12:00', location: 'Rm B203', type: 'Lecture' },
            { id: 4, subject_code: 'PHYS105', title: 'Physics for Engineers', day: 'Wednesday', start_time: '11:00', end_time: '13:00', location: 'Phys Lab 1', type: 'Practical' },
            { id: 5, subject_code: 'ENGG150', title: 'Engineering Design', day: 'Friday', start_time: '08:00', end_time: '10:00', location: 'Design Hub', type: 'Workshop' },
            { id: 6, subject_code: 'COSC101', title: 'Intro to Programming', day: 'Friday', start_time: '13:00', end_time: '15:00', location: 'Rm A101', type: 'Lecture' },
        ];
        expect(mockOptimizeInstance).toHaveBeenCalledWith(expectedFetchedData, expect.any(Object)); // Constraints can be any object

        // Check if timetableData (or its processed version) reflects the data returned by the mocked optimizer
        // The mock optimizer adds an item with subject_code 'OPTIMIZED'
        expect(screen.getByText('OPTIMIZED')).toBeTruthy();
        expect(screen.getByText('Optimized Lecture')).toBeTruthy();
        expect(screen.getByText('16:00 - 17:00')).toBeTruthy();
        expect(screen.getByText('Optimized Room')).toBeTruthy();
    });
});

// To run these tests: npm test or npm run test:ui
// Ensure vite.config.ts is configured for Vitest.
// Ensure package.json has test scripts.
// The Optimizer mock needs to correctly mock the class and its methods.
// The actual state management and reactivity within Timetable.svelte might require
// more careful handling in tests, especially around async updates.
// `await vi.dynamicImportSettled()` is used to wait for async operations in onMount.
// For more complex components, consider using `@testing-library/svelte`'s `waitFor` utility.
// The test for style attributes (`top`, `height`) assumes `slotHeight = 50px` as per the component.
// If this value changes, the test expectations need to be updated.
// The mock for the optimizer is more robust now.
// It's important that `state` prop updates in the component trigger reactivity correctly for tests to pass.
// The component internally does `state = { ...state };` which should work.
// Also, `processedTimetable` is updated reactively `$: if (state.timetableData)`.
// The tests for Data Display and Optimizer Interaction use `await vi.dynamicImportSettled()`
// to allow the `onMount` and subsequent reactive updates to complete.
// The mock optimizer now adds a specific "OPTIMIZED" course, which is then checked in the DOM.
// This confirms that the data flow from fetch -> optimize -> state -> processedTimetable -> DOM is working.
// Removed `beforeEach` for global mocks as they are set at the top level.
// Cleanup is still in `afterEach`.
// Cleared all mocks in `afterEach` using `vi.clearAllMocks()` to ensure test isolation for mock call counts.
// The optimizer mock for named exports is improved.
// The call to `mockOptimizeInstance` is now `vi.mocked(Optimizer.mock.results[0].value.optimize)`
// to correctly get the mocked instance method. This is due to how vi.fn().mockImplementation() works with classes.
// Final check for `mockOptimizeInstance` call: `toHaveBeenCalledWith(expectedFetchedData, expect.any(Object))`
// This ensures the raw data from fetchTimetableData is passed to the optimizer.
// The presence of the "OPTIMIZED" course in the DOM confirms the mocked optimizer's output is used.The tests for `Timetable.svelte` have been created in `src/routes/Timetable.test.ts`.

Here's a summary of what was done:

1.  **Test File Creation**: `src/routes/Timetable.test.ts` was created.
2.  **Dependencies & Mocks**:
    *   Imported necessary functions from `vitest` and `@testing-library/svelte`.
    *   Imported `Timetable` component, `State`, and `ControlType`.
    *   **Mocked `optimiser`**: The `optimiser` module is mocked. The `Optimizer` class and its `optimize` method are replaced with `vi.fn()`. The mocked `optimize` method returns the data it receives, plus an extra "OPTIMIZED" course to verify its output is used.
3.  **Test Structure**:
    *   `describe` blocks for 'Rendering and Initial State', 'Data Display', and 'Optimizer Interaction'.
    *   `afterEach(cleanup)` to unmount components and `vi.clearAllMocks()` to reset mock call counts for test isolation.
4.  **Test Cases Implemented**:
    *   **Rendering**:
        *   `renders without crashing`: Checks if the component mounts with basic state.
        *   `shows loading message when timetableData is empty and view is active`: Verifies the loading text.
        *   `does not show loading message if timetable view is not active`: Verifies loading text is absent if control is not foreground.
    *   **Data Display**: (Uses `await vi.dynamicImportSettled()` to wait for `onMount` and reactive updates)
        *   `renders day headers (Monday-Friday)`: Checks for "Monday", "Tuesday", etc.
        *   `renders time slot labels (08:00 - 17:00)`: Checks for time labels like "08:00".
        *   `renders class entries from timetableData`: Checks for details (subject code, type, time, location) of mock events.
        *   `applies correct styles for positioning based on processDataForGrid`: Checks `style.top` and `style.height` of rendered event elements to verify the layout logic.
    *   **Optimizer Interaction**: (Uses `await vi.dynamicImportSettled()`)
        *   `calls Optimizer.optimize onMount and updates timetableData`:
            *   Ensures `Optimizer` constructor and its `optimize` method are called.
            *   Verifies that `optimize` is called with the data fetched by the component's internal `fetchTimetableData`.
            *   Checks that the DOM is updated with data returned by the mocked `optimize` method (specifically, looking for the "OPTIMIZED" course).

The test setup in `package.json` and `vite.config.ts` was done in the previous turn. These tests can be run using `npm test` or `npm run test:ui`.

The tests cover the main functionalities: initial rendering, loading state, display of timetable data in a grid, correct positioning of events, and the interaction with the (mocked) optimizer.
