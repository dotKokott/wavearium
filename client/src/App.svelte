<script lang="ts">
import { onMount } from 'svelte';
	import * as Tone from 'tone';

	export let osc = new Tone.Oscillator("F3").toDestination();

	export let analyser = new Tone.Analyser("waveform", 256);
	
	export let partialCount = 8;
	export let frequency = 440;

	onMount(() => {

	});

	function playTone() {
		osc.partials = new Array(partialCount).fill(0).map(() => Math.random());
		osc.frequency.value = frequency;
		
		// start and stop after 1 second
		osc.start().stop("+1");		
	}
		

	// computed
	// $: doubled = count * 2

	// watch
	// $: if(count % 2 == 0) { console.log(' do something ') }
</script>

<main>
	<h1>Synthesizer</h1>	
	
	<div>
		Frequency: { frequency }
		<input bind:value={frequency} type="range" min="20" max="1000" on:change={ playTone }/>
	</div>
	<div>				
		Partial count: { partialCount }
		<input bind:value={partialCount} type="range" min="1" max="128" on:change={ playTone }/>
		
	</div>

	<button on:click={() => playTone()}>Play sound</button>
	
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>