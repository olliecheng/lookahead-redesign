<script lang="ts">
    export let enabled = true;
</script>

<div class="fixed {enabled ? 'enabled' : 'disabled'}">
    <div class="contents">
        <slot></slot>
    </div>
</div>

<style>
    .fixed {
        display: flex;
        &.disabled {
            display: none;
        }

        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;

        background: rgba(0, 0, 0, 0.5);

        justify-content: center;
        align-items: center;

        z-index: 10000;
    }

    .contents {
    }
</style>
