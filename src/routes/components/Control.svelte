<script lang="ts">
    import { ControlType } from "../../state";

    export let config = {
        title: "title",
        control: ControlType.Disabled,
        clockwise: true,
        fg: "var(--color-theme-1)",
    };

    let classes = "disabled";
    $: config,
        (() => {
            classes =
                config.control +
                (config.control !== ControlType.Disabled ? " enabled" : "");
        })();

    let vars = "";
    $: config,
        (() => {
            vars = [
                "--fg:" + config.fg,
                "--direction:" + (config.clockwise ? "1" : "-1"),
            ].join("; ");
        })();
</script>

<div class="frame {classes}" style={vars}>
    <div class="control">
        <div class="header">
            <h2 class="always">{config.title}</h2>
            <div style="flex-grow: 2" />
            <div class="header-buttons">
                <slot name="header"></slot>
            </div>
        </div>
        <div class="subject">
            <slot name="body">contents go here</slot>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../animations.scss";

    .header {
        &,
        .header-buttons {
            display: flex;
            gap: 10px;
        }

        .header-buttons {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.1s linear;
        }
    }

    // set colour of text in frame
    .frame {
        --color: var(--color-text);

        &.disabled {
            --color: var(--color-text-disabled);
        }

        color: var(--color);
        position: relative;
    }

    // general styling
    .control {
        display: inline-block;
        padding: 16px 26px;
        font-size: 2em;
        background: var(--color-bg-0);

        h2 {
            font-size: 3rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: -3px;
            margin: 0 0 0.7rem 0;
        }
    }

    // ANIMATIONS
    .frame {
        @include dashed-background(var(--color-bg-0));
        margin: 0 0 var(--margin-top) 0;
    }

    .frame.disabled {
        pointer-events: none;
    }

    .frame.enabled {
        --border-width: 3px;
        --border-length: 20px;
        --margin-top: 10px;
        display: inline-block;
        margin-left: -var(--border-width);
        padding: var(--border-width);

        --rotate-deg: calc(-3deg * var(--direction));
        transform: rotate(var(--rotate-deg));
        -webkit-transform: rotate(var(--rotate-deg));
        margin: var(--margin-top) 0 0 80px;
        transition:
            margin 0.3s ease,
            -webkit-transform 0.6s ease;
    }

    // styling changes when ENABLED (either FOREGROUNDED or BACKGROUNDED)
    .enabled {
        // source: https://programming.earthonline.us/fantastic-css-border-animation-b02e06828beb
        @include dashed-background(var(--fg));
    }

    // styling changes when FOREGROUNDED - should override everything else
    .fg {
        animation: linearGradientMove 0.5s infinite ease;
        animation-delay: 1s;
        z-index: 100;

        h2:before {
            content: "►";
            color: var(--fg);
            margin-right: 4pt;
        }

        .header-buttons {
            opacity: 1;
            pointer-events: inherit;
        }
    }

    .bg {
        @include dashed-background(var(--color-bg-1));
    }

    // keyframes and mixins
    @keyframes linearGradientMove {
        100% {
            background-position:
                calc(var(--border-length) * var(--direction)) 0,
                calc(var(--border-length) * -1 * var(--direction)) 100%,
                0 calc(var(--border-length) * -1),
                100% var(--border-length);
        }
    }
</style>
