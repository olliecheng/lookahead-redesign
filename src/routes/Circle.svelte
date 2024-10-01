<script lang="ts">
    import { Status, type State } from "../state";
    export let state: State;

    let left = 0;
    let top = 0;
    let visible = false;

    const handleMouseMove = (e) => {
        visible = true;
        left = e.clientX;
        top = e.clientY;
    };

    const handleMouseLeave = (e) => {
        visible = false;
    };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    id="overlay"
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    style:display={state.status === Status.FirstLoad ? "block" : "none"}
></div>

<div
    id="circle"
    style:top="{top}px"
    style:left="{left}px"
    style:opacity={visible ? 1 : 0}
>
<div class="begin-prompt">press begin ↰</div>
</div>

<style lang="scss">
    #overlay {
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        cursor: none;
    }

    #circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        position: fixed;
        transform: translate(-50%, -50%);
        pointer-events: none; /* Allows interaction through the circle */

        // background: radial-gradient(closest-side, var(--color-bg-0) 25%, rgba(251,247,240, 0));
        pointer-events: none;
        backdrop-filter: invert(75%);
    }

    .begin-prompt {
        position: absolute;
        top: 60px;
        left: 80px;
        text-wrap: nowrap;

        font-size: 2em;
    }
</style>
