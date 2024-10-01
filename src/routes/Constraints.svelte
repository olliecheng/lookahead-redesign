<script lang="ts">
    import { Status, type State } from "../state";
    export let state: State;

    let disabled = "disabled";
    $: disabled = state.status === Status.Constraints ? "enabled" : "disabled";

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

<div class="frame {disabled}">
    <div class="cockpit {disabled}">
        <h2>Constraints</h2>
        <div class="constraints">
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
            {#each settings as setting}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
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
    </div>
</div>

<style lang="scss">
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

    .cockpit {
        --color: var(--color-text);

        &.disabled {
            --color: var(--color-text-disabled);
        }

        color: var(--color);
        display: inline-block;
        padding: 16px 26px;
        font-size: 2em;
        background: var(--color-bg-0);
    }

    h2 {
        font-size: 3rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: -3px;
        margin: 0 0 0.7rem 0;
    }

    .enabled h2:before {
        content: "►";
        color: var(--color-theme-1);
        margin-right: 4pt;
    }

    .constraints {
        min-width: 30em;

        table {
            border-collapse: collapse;
            margin-left: -6px;
            width: 100%;

            th,
            td {
                padding: 4px 6px;
                text-align: left;
                white-space: nowrap;
            }

            tbody tr.entry:hover {
                background-color: var(--color-theme-bg);
            }

            #subject-input {
                cursor: text;
            }
        }
    }

    .entry {
        display: flex;
        padding: 2px 20px;
        margin-left: -20px;
        cursor: default;

        .dotted {
            flex-grow: 2;
            border-bottom: 2px dotted var(--color);
            margin-bottom: 6px;
            margin: 0 6px 6px 6px;
        }

        -webkit-user-select: none; /* Safari */
        -ms-user-select: none; /* IE 10 and IE 11 */
        user-select: none; /* Standard syntax */
    }

    .checked {
        font-variant-caps: all-small-caps;
        font-variant-numeric: oldstyle-nums;
        text-align: right !important;
    }

    .enabled {
        .entry {
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
    }

    .check-logo {
        margin-left: 10px;
        font-weight: bold;
    }
</style>
