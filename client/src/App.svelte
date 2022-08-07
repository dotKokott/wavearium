<script lang="ts">
	import { onMount } from 'svelte';
	import * as Tone from 'tone';
	import PartialsEditor from './components/partialsEditor.svelte';
	import Waveform from './components/waveform.svelte';

	export let osc = new Tone.Oscillator("F3").toDestination();
	
	export let partialCount = 2;
	export let frequency = 220;

	onMount(() => {
		osc.partials = Array.from({length: partialCount}, () => 1);		
	});

	
	function playTone() {		
		
		osc.frequency.value = frequency;	
		osc.stop();
		osc.start();		
	}

	function randomizePartials() {
		osc.partials = new Array(partialCount).fill(0).map(() => Math.random());
	}

	function updateOscPartials() {		
		osc.partials = new Array(partialCount).fill(0)
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
		<input bind:value={frequency} type="range" min="20" max="2000" on:change={ playTone }/>
	</div>
	<div>				
		Partial count: { partialCount }
		<input bind:value={ partialCount } type="range" min="1" max="128" on:change={ updateOscPartials }/>		
	</div>

	<button on:click={() => playTone()}>Play</button>
	<button on:click={() => osc.stop()}>Stop</button>
	<button on:click={ randomizePartials }>Randomize partials</button>
	
	<div>
		<PartialsEditor oscillator={osc} on:partialsChanged={ playTone } />
	</div>
	<div>
		<Waveform audioNode={osc} width={1024} height={1024 / 2}></Waveform>
	</div>
</main>

<style>
	main {
		/* TODO: I do not know where the 43px top margin is coming from */
		margin-top: -43px;
		background-color: black;
		color: white;
		height: 100%;
		text-align: center;
		/* margin: 0 auto; */
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