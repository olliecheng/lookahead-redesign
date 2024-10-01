<script lang="ts">
    import { Status, type State } from "../state";
    export let state: State;

    let disabled = "disabled";
    let active = "";
    $: disabled = state.status < Status.SubjectSelect ? "disabled" : "enabled";
    $: active = state.status === Status.SubjectSelect ? "active" : "";
</script>

<div class="container {disabled} {active}">
    <div class="frame {disabled} {active}">
        <div class="cockpit {disabled} {active}">
            <h2>Controls</h2>
            <div class="subject">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Subject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each state.subjects as subj}
                            <tr class="entry">
                                <td class="subj-code">SM2</td>
                                <td>{subj}</td>
                            </tr>
                        {/each}
                        <tr>
                            <td class="subj-code"></td>
                            <td id="subject-input" contenteditable="true"
                                >&nbsp;add your own…</td
                            >
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <button
        on:click={() => {
            state.status = Status.Constraints;
        }}>Next</button
    >
</div>

<style lang="scss">
    @import "./animations.scss";

    button {
        pointer-events: none;
    }

    .container {
        display: inline-flex;
        flex-direction: column;

        button {
            // ONLY SHOW WHEN ENABLED
            opacity: 0;
            transition-delay: 1.04s;
            transition-property: opacity;

            pointer-events: inherit;

            align-self: flex-end;
            margin-top: -20px;
            margin-right: 30px;
            height: 50px;
            width: 120px;

            font-size: 3em;
            font-weight: bold;

            text-transform: uppercase;
            letter-spacing: -3px;

            box-sizing: content-box;
            height: 36px;

            border-radius: 0;
            border: 4px solid transparent;
            padding: 0px 14px 6px 14px;

            background: var(--color-bg-1);
            cursor: pointer;

            &:hover {
                background: var(--color-theme-bg);
                outline: none;
                border: 4px solid var(--color-theme-2);

                @include wavy-down;

                &:before {
                    content: "↙";
                    margin-right: 8px;
                }
            }
        }

        &.active button {
            opacity: 1;
        }
    }

    .enabled button {
        visibility: hidden;
    }

    .active button {
        visibility: visible;
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

    .active h2:before {
        content: "►";
        color: var(--color-theme-1);
        margin-right: 4pt;
    }

    .subject {
        table {
            border-collapse: collapse;
            margin-left: -6px;

            th,
            td {
                padding: 4px 6px;
                text-align: left;
            }

            th {
                border-bottom: 2px solid var(--color);
            }

            td + td,
            th + th {
                border-left: 2px solid var(--color);
            }

            tbody tr.entry:hover {
                background-color: var(--color-theme-bg);
            }

            #subject-input {
                cursor: text;
            }
        }
    }

    .subj-code {
        font-variant-caps: all-small-caps;
        font-variant-numeric: oldstyle-nums;
    }

    // ANIMATIONS
    .frame {
        background:
            linear-gradient(90deg, var(--color-bg-0) 50%, transparent 0)
                repeat-x,
            linear-gradient(90deg, var(--color-bg-0) 50%, transparent 0)
                repeat-x,
            linear-gradient(0deg, var(--color-bg-0) 50%, transparent 0) repeat-y,
            linear-gradient(0deg, var(--color-bg-0) 50%, transparent 0) repeat-y;
        margin: 0 0 var(--margin-top) 0;
    }

    .frame.enabled {
        --border-width: 3px;
        --border-length: 20px;
        --margin-top: 10px;
        display: inline-block;
        margin-left: -var(--border-width);
        padding: var(--border-width);

        // source: https://programming.earthonline.us/fantastic-css-border-animation-b02e06828beb
        background:
            linear-gradient(90deg, var(--color-theme-1) 50%, transparent 0)
                repeat-x,
            linear-gradient(90deg, var(--color-theme-1) 50%, transparent 0)
                repeat-x,
            linear-gradient(0deg, var(--color-theme-1) 50%, transparent 0)
                repeat-y,
            linear-gradient(0deg, var(--color-theme-1) 50%, transparent 0)
                repeat-y;

        background-size:
            var(--border-length) var(--border-width),
            var(--border-length) var(--border-width),
            var(--border-width) var(--border-length),
            var(--border-width) var(--border-length);
        background-position:
            0 0,
            0 100%,
            0 0,
            100% 0;

        &.active {
            animation: linearGradientMove 0.5s infinite ease;
            animation-delay: 1s;
        }

        -webkit-transform: rotate(-3deg);
        margin: var(--margin-top) 0 0 80px;
        transition:
            margin 0.3s ease,
            -webkit-transform 0.6s ease;
    }

    @keyframes linearGradientMove {
        100% {
            background-position:
                var(--border-length) 0,
                calc(var(--border-length) * -1) 100%,
                0 calc(var(--border-length) * -1),
                100% var(--border-length);
        }
    }
</style>
