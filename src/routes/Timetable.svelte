<script lang="ts">
    import { onMount } from 'svelte';
    import { type State, ControlType } from '../state';
    import { Optimizer } from 'optimiser';
    import Control from './components/Control.svelte';

    export let state: State;

    // Helper to convert "HH:MM" to minutes from midnight
    function timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Define the timetable structure
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlotsStartHour = 8;
    const timeSlotsEndHour = 18; // Display up to 6 PM
    const timeIntervalMinutes = 60; // 1-hour slots

    let processedTimetable: Array<any & { top: number; height: number; dayIndex: number }> = [];

    async function fetchTimetableData(subjects: String[]): Promise<any[]> {
        console.log('Fetching timetable data for subjects:', subjects);
        // Updated mock data structure
        const mockData = [
            { id: 1, subject_code: 'COSC101', title: 'Intro to Programming', day: 'Monday', start_time: '09:00', end_time: '11:00', location: 'Rm A101', type: 'Lecture' },
            { id: 2, subject_code: 'COSC101', title: 'Intro to Programming', day: 'Monday', start_time: '14:00', end_time: '15:00', location: 'Lab A2', type: 'Tutorial' },
            { id: 3, subject_code: 'MATH202', title: 'Calculus II', day: 'Tuesday', start_time: '10:00', end_time: '12:00', location: 'Rm B203', type: 'Lecture' },
            { id: 4, subject_code: 'PHYS105', title: 'Physics for Engineers', day: 'Wednesday', start_time: '11:00', end_time: '13:00', location: 'Phys Lab 1', type: 'Practical' },
            { id: 5, subject_code: 'ENGG150', title: 'Engineering Design', day: 'Friday', start_time: '08:00', end_time: '10:00', location: 'Design Hub', type: 'Workshop' },
            { id: 6, subject_code: 'COSC101', title: 'Intro to Programming', day: 'Friday', start_time: '13:00', end_time: '15:00', location: 'Rm A101', type: 'Lecture' },
        ];
        // Simulate subject filtering based on state.subjects if needed for more realistic mock
        // For now, using a fixed set.
        return new Promise(resolve => setTimeout(() => resolve(mockData), 500));
    }
    
    function processDataForGrid(timetableData: any[]) {
        const slotHeight = 50; // pixels per hour, adjust in SCSS as well
        const gridStartTimeMinutes = timeSlotsStartHour * 60;

        return timetableData.map(item => {
            const startMinutes = timeToMinutes(item.start_time);
            const endMinutes = timeToMinutes(item.end_time);
            const durationMinutes = endMinutes - startMinutes;

            const top = ((startMinutes - gridStartTimeMinutes) / 60) * slotHeight;
            const height = (durationMinutes / 60) * slotHeight;
            const dayIndex = daysOfWeek.indexOf(item.day);
            
            return { ...item, top, height, dayIndex };
        }).filter(item => item.dayIndex !== -1); // Filter out items with invalid days
    }


    onMount(async () => {
        console.log('Timetable component mounted. Current subjects:', state.subjects);

        const timetableRawData = await fetchTimetableData(state.subjects);
        console.log('Fetched mock timetable data:', timetableRawData);

        const optimizer = new Optimizer();
        console.log('Optimizer instantiated:', optimizer);

        const mockConstraints = { /* ... your constraints if any for the optimizer ... */ };
        
        try {
            const optimizedData = optimizer.optimize(timetableRawData, mockConstraints);
            console.log('Optimizer result:', optimizedData);
            state.timetableData = optimizedData; // Optimizer returns the data as is
            processedTimetable = processDataForGrid(state.timetableData);
            state = { ...state }; // Trigger reactivity
        } catch (error) {
            console.error('Error during optimization:', error);
            state.timetableData = timetableRawData; // Fallback
            processedTimetable = processDataForGrid(state.timetableData);
            state = { ...state };
        }
    });

    // Reactive statement to update processedTimetable when state.timetableData changes
    $: if (state.timetableData) {
        processedTimetable = processDataForGrid(state.timetableData);
    }

</script>

<Control
    config={{
        control: state.controls.timetable,
        title: "Optimized Timetable",
        clockwise: true,
        fg: "var(--color-theme-1)"
    }}
>
    <svelte:fragment slot="header">
        <span>Weekly View</span>
    </svelte:fragment>

    <div slot="body" class="timetable-body">
        {#if state.controls.timetable === ControlType.Foreground}
            {#if processedTimetable && processedTimetable.length > 0}
                <div class="timetable-grid">
                    <!-- Time column header -->
                    <div class="grid-header time-header">Time</div>
                    <!-- Day column headers -->
                    {#each daysOfWeek as day}
                        <div class="grid-header day-header">{day}</div>
                    {/each}

                    <!-- Time slots labels -->
                    <div class="time-slots-column">
                        {#each Array(timeSlotsEndHour - timeSlotsStartHour) as _, i}
                            <div class="time-slot-label">
                                {String(timeSlotsStartHour + i).padStart(2, '0')}:00
                            </div>
                        {/each}
                    </div>

                    <!-- Day columns for events -->
                    {#each daysOfWeek as day, dayIdx (day)}
                        <div class="day-column" style="grid-column: {dayIdx + 2};">
                            {#each processedTimetable.filter(item => item.day === day) as event (event.id)}
                                <div class="timetable-event" style="top: {event.top}px; height: {event.height}px;">
                                    <div class="event-subject">{event.subject_code}</div>
                                    <div class="event-type">{event.type}</div>
                                    <div class="event-time">{event.start_time} - {event.end_time}</div>
                                    <div class="event-location">{event.location}</div>
                                </div>
                            {/each}
                        </div>
                    {/each}
                </div>
            {:else}
                <p>Loading timetable data or no data available...</p>
            {/if}
        {:else}
             <!-- Optionally, show a placeholder or nothing if not in foreground -->
        {/if}
    </div>
</Control>

<style lang="scss">
    .timetable-body {
        padding: 15px;
        min-width: 50em; 
        min-height: 30em;
        background-color: var(--color-bg-1);
        color: var(--color-text);
        overflow-x: auto; // Allow horizontal scroll if content overflows
    }

    .timetable-grid {
        display: grid;
        // First column for time, next 5 for days
        grid-template-columns: auto repeat({daysOfWeek.length}, 1fr); 
        grid-template-rows: auto; // Header row
        gap: 5px; // Gap between cells
        position: relative; // For absolute positioning of events within day columns

        .grid-header {
            font-weight: bold;
            padding: 10px 5px;
            text-align: center;
            background-color: var(--color-bg-2); // Slightly different bg for headers
            border-bottom: 1px solid var(--color-border, #ccc);
            position: sticky; // Make headers sticky if the body scrolls
            top: 0;
            z-index: 10;
        }

        .time-header {
            grid-column: 1;
            grid-row: 1;
        }
        .day-header {
            grid-row: 1; // All day headers are in the first row
        }
    }

    .time-slots-column {
        grid-column: 1; // Occupies the first column
        grid-row: 2 / span {timeSlotsEndHour - timeSlotsStartHour + 1}; // Span all time slot rows
        display: flex;
        flex-direction: column;
        
        .time-slot-label {
            height: 50px; // Must match slotHeight in script for alignment
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8em;
            color: var(--color-text-muted, #666);
            border-bottom: 1px dashed var(--color-border-light, #eee);
            &:last-child {
                border-bottom: none;
            }
        }
    }

    .day-column {
        position: relative; // Crucial for positioning events absolutely within it
        grid-row: 2 / span {timeSlotsEndHour - timeSlotsStartHour + 1}; // Span all time slot rows
        border-left: 1px solid var(--color-border-light, #eee);
        min-height: {(timeSlotsEndHour - timeSlotsStartHour) * 50}px; // Corresponds to slotHeight

        &:first-of-type { // Monday column
            // No special style needed unless different from others
        }
    }

    .timetable-event {
        position: absolute;
        left: 2px; // Small gap from the column edge
        right: 2px;
        background-color: var(--color-theme-2-bg, lightblue); // Use theme color
        color: var(--color-theme-2-text, black); // Text color for theme
        border: 1px solid var(--color-theme-2, blue);
        border-radius: 4px;
        padding: 5px;
        font-size: 0.8em;
        overflow-y: hidden; // Hide overflow if event is too short for content
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        transition: background-color 0.3s ease;

        &:hover {
            background-color: var(--color-theme-2-hover-bg, blue);
            color: var(--color-theme-2-hover-text, white);
        }

        .event-subject {
            font-weight: bold;
            margin-bottom: 3px;
        }
        .event-type, .event-time, .event-location {
            font-size: 0.9em;
            margin-bottom: 2px;
        }
    }

    p { // For loading message
        text-align: center;
        margin-top: 20px;
        font-style: italic;
    }
</style>
