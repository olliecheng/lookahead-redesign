<script lang="ts">
	import Header from "./Header.svelte";
	import Cockpit from "./Cockpit.svelte";
	import Begin from "./Begin.svelte";
	import Circle from "./Circle.svelte";
	import Path from "./Path.svelte";
	import Constraints from "./Constraints.svelte";
	import "../app.css";
	import { initialState } from "../state";

	let state = initialState();
</script>

<div class="app">
	<Header />

	<Begin bind:state />

	<main>
		<Circle bind:state />
		<Path bind:state />
		<Cockpit bind:state />
		<div class="settings">
			<Constraints bind:state />
		</div>
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		position: relative;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}

	.settings {
		display: flex;
	}
</style>
