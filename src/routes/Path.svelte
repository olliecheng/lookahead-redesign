<script lang="ts">
    import { ControlType, type State } from "../state";
    export let state: State;
</script>

<div
    id="path1"
    class="path {state.controls.subjectSelect === ControlType.Disabled
        ? 'disabled'
        : 'enabled'}"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="83px" viewBox="30 -20 83 91">
        <path
            d="M 30 -20 L 30 71 L 113 71"
            stroke="#458588"
            stroke-width="16"
            fill="none"
        />
    </svg>
</div>
<svg
    id="path2"
    class="path {state.controls.constraints === ControlType.Disabled
        ? 'disabled'
        : 'enabled'}"
    xmlns="http://www.w3.org/2000/svg"
    width="83px"
    viewBox="0 0 83 310"
>
    <path
        d="M 0 0 L 0 310 L 83 310"
        stroke="#458588"
        stroke-width="16"
        fill="transparent"
    />
</svg>

<style lang="scss">
    @import "./animations.scss";

    .path {
        z-index: -99;
    }
    #path2 {
        position: absolute;
        top: -26px;
        left: 14px;

        @include animate-path(600);
    }

    #path1 {
        position: absolute;
        /* top: -20px; */
        /* left: 30px; */
        top: -26px;
        left: 30px;

        @include animate-path(300);
    }
</style>
