<script lang="ts">
    import { ControlType, type State } from "../state";
    import Control from "./components/Control.svelte";
    export let state: State;
</script>

<Control
    config={{
        control: state.controls.subjectSelect,
        title: "Subjects",
        clockwise: true,
        fg: "var(--color-theme-1)",
    }}
>
    <svelte:fragment slot="header">
        <button
            style="text-align: right;"
            on:click={() => {
                state.controls = {
                    ...state.controls,
                    subjectSelect: ControlType.Background,
                    constraints: ControlType.Foreground,
                };
            }}
        >
            ↗<br />Next
        </button>
    </svelte:fragment>

    <div class="subject" slot="body">
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
</Control>

<style lang="scss">
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
</style>
