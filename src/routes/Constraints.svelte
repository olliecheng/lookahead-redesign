<script lang="ts">
    import { ControlType, type State } from "../state";

    import Control from "./components/Control.svelte";
    import Overlay from "./components/Overlay.svelte";
    export let state: State;

    // developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomInt(min: number, max: number) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    $: random_time = "0800";
    setInterval(() => {
        let hour = getRandomInt(0, 15);
        random_time =
            hour.toString().padStart(2, "0") + random_time[2] + random_time[3];
    }, 193);
    setInterval(() => {
        let min = getRandomInt(0, 60);
        random_time =
            random_time[0] + random_time[1] + min.toString().padStart(2, "0");
    }, 87);

    let settings = [
        {
            label: "Minimise clashes?",
            status: true,
        },
        {
            label: "Do you skip lectures?",
            status: false,
        },
        {
            label: "Minimise days on campus?",
            status: false,
        },
        {
            label: "Enforce breaks between classes?",
            status: false,
        },
        {
            label: "Minimise breaks between classes?",
            status: false,
        },
    ];

    let days = [
        {
            day: "Mon",
            status: true,
        },
        {
            day: "Tue",
            status: true,
        },
        {
            day: "Wed",
            status: true,
        },
        {
            day: "Thu",
            status: true,
        },
        {
            day: "Fri",
            status: true,
        },
    ];
</script>

<Control
    config={{
        control: state.controls.constraints,
        title: "Constraints",
        clockwise: false,
        fg: "var(--color-theme-2)",
    }}
>
    <svelte:fragment slot="header">
        <button
            style="text-align: right;"
            on:click={() => {
                state.controls = {
                    ...state.controls,
                    constraints: ControlType.Background,
                    full: ControlType.Foreground,
                };
            }}
        >
            ↗<br />Next
        </button>
    </svelte:fragment>

    <div class="constraints" slot="body">
        <div class="days">
            {#each days as day}
                <div class="day-container">
                    <div class="day">{day.day}</div>
                    <div class="checked">
                        {#if day.status}
                            YES<span class="check-logo">√</span>
                        {:else}
                            NO<span class="check-logo">×</span>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
        <div class="time">
            <div>day.start <strong>0800h</strong></div>
            <div class="dotted"></div>
            <div>day.end <strong>2000h</strong></div>
        </div>
        {#each settings as setting}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                class="entry {setting.status ? 'yes' : 'no'}"
                on:click={() => {
                    setting.status = !setting.status;
                }}
            >
                <div class="setting-name">
                    {setting.label}
                </div>
                <div class="dotted"></div>
                <div class="checked">
                    {#if setting.status}
                        YES<span class="check-logo">√</span>
                    {:else}
                        NO<span class="check-logo">×</span>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</Control>

<Overlay>
    <div class="time-machine">
        <div class="time-display">{random_time}</div>
        <button>I'm feeling lucky</button>

        <input
            type="text"
            inputmode="numeric"
            pattern="\d*"
            id="name"
            name="name"
            class="time-display"
            data-1p-ignore
            minlength="4"
            maxlength="4"
            size="4"
            autocomplete="off"
        />
    </div>
</Overlay>

<style lang="scss">
    .time-machine {
        display: grid;
        width: 500px;
        height: 300px;
        padding: 50px;
        font-size: 2em;
        gap: 20px;
        background: var(--color-bg-0);
        grid-template-columns: 3fr 2fr;

        .time-display {
            font-size: 4em;
        }
    }

    .time {
        margin-bottom: 12px;
        display: flex;
        text-transform: uppercase;

        strong {
            font-variant-caps: all-small-caps;
        }
    }

    .days {
        display: flex;
        flex-direction: row;
        gap: 50px;
        margin-bottom: 15px;

        .day-container {
            display: flex;
            flex-direction: column;
        }

        .day {
            font-weight: bold;
        }
    }

    .constraints {
        min-width: 30em;
    }

    .checked {
        font-variant-caps: all-small-caps;
        font-variant-numeric: oldstyle-nums;
        text-align: right !important;
    }

    .dotted {
        flex-grow: 2;
        border-bottom: 2px dotted var(--color);
        margin-bottom: 6px;
        margin: 0 6px 6px 6px;
    }

    .entry {
        display: flex;
        padding: 2px 20px;
        margin-left: -20px;
        margin-right: -20px;
        cursor: default;

        .setting-name {
            letter-spacing: -1px;
        }

        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */

        &.yes .checked {
            color: var(--color-theme-2);
        }

        &.no .checked {
            color: var(--color-theme-1);
        }

        &:hover {
            .checked {
                color: var(--color);
            }

            &.yes {
                background-color: var(--color-theme-bg-yes);
            }

            &.no {
                background-color: var(--color-theme-bg-no);
            }
        }
    }

    .check-logo {
        margin-left: 10px;
        font-weight: bold;
    }
</style>
