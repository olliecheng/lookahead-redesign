<script lang="ts">
    import { Status, type State } from "../state";
    export let state: State;
</script>

<div class="path {state.status < Status.SubjectSelect ? "disabled" : "enabled"}">
    <svg xmlns="http://www.w3.org/2000/svg" width="83px" viewBox="30 -20 83 91">
        <path
            d="M 30 -20 L 30 71 L 113 71"
            stroke="#458588"
            stroke-width="16"
            fill="none"
        />
    </svg>
</div>

<style>
    .path {
        position: absolute;
        /* top: -20px; */
        /* left: 30px; */
        top: -26px;
        left: 30px;

        z-index: -99;

        stroke-dasharray: 300;
        stroke-dashoffset: 300;

        /* animation: draw 1000ms; */
        transition: stroke-dashoffset 1.5s linear;
    }

    .enabled.path {
        stroke-dashoffset: 0;
    }

    #first {
        width: 10px;
        height: 10px;

        /* offset-path: path("M 30 -20 L 30 71 L 113 71"); */

        /* stroke-dasharray: 0; */
        /* stroke-dashoffset: 520; */

        animation: go 1s infinite ease-in-out;
    }
    @keyframes go {
        100% {
            offset-distance: 100%;
        }
    }

    @keyframes draw {
        100% {
            stroke-dashoffset: 0;
        }
    }
</style>
