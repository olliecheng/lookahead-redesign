<script lang="ts">
    import { ControlType, type State } from "../state";
    import Control from "./components/Control.svelte";
    export let state: State;

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

<style lang="scss">
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
