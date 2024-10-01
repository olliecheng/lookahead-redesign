<script lang="ts">
    import type { State } from "../state";
    import { ControlType } from "../state";

    export let state: State;

    let beginButton: HTMLButtonElement;
    let loadButton: HTMLButtonElement;
    let focus: String | null = null;

    const focusChangeHandler = (e: Event) => {
        if (e.target === beginButton) {
            focus = "begin";
        } else if (e.target === loadButton) {
            focus = "load";
        } else {
            focus = null;
        }
    };

    const blurHandler = () => {
        focus = null;
    };

    const activate = (button: HTMLButtonElement) => {
        return () => {
            button.focus();
        };
    };

    const begin = () => {
        state.controls = {
            ...state.controls,
            initial: ControlType.Disabled,
            subjectSelect: ControlType.Foreground,
        };

        document.getElementById("subject-input")?.focus();
    };
</script>

<svelte:document on:focusin={focusChangeHandler} />

<div class="start">
    <!-- svelte-ignore a11y-autofocus -->
    <button
        bind:this={beginButton}
        autofocus
        on:mouseenter={activate(beginButton)}
        on:click={begin}
        on:blur={blurHandler}
    >
        Begin
    </button>

    <button
        bind:this={loadButton}
        on:mouseenter={activate(loadButton)}
        on:keypress={(e) => {
            if (e.code === "ArrowLeft") {
                beginButton.focus();
            }
        }}
        on:blur={blurHandler}
    >
        Load
    </button>

    <div class="info">
        {#if focus === "begin"}
            create a new timetable
        {:else if focus === "load"}
            load an existing timetable
        {/if}
    </div>
</div>

<style lang="scss">
    @import "./animations.scss";

    .info {
        font-size: 2em;
        margin-top: -10px;
        margin-left: 30px;
        letter-spacing: -1px;
    }

    .start {
        display: flex;
        height: 60px;
        align-items: center;
        gap: 20px;
    }

    button {
        font-size: 3em;
        font-weight: bold;

        text-transform: uppercase;
        letter-spacing: -3px;
        margin: 0 0 1rem 0;

        box-sizing: content-box;
        height: 36px;

        border-radius: 0;
        border: 4px solid transparent;
        padding: 0px 14px 6px 14px;

        background: var(--color-bg-1);
        cursor: pointer;

        &:focus {
            background: var(--color-theme-bg);
            outline: none;
            border: 4px solid var(--color-theme-2);

            @include wavy;

            &:before {
                content: "↗";
                margin-right: 8px;
            }
        }
    }
</style>
