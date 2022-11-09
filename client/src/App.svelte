<script lang="ts">
	import { onMount } from 'svelte';
  import { is_client } from 'svelte/internal';
	import * as Tone from 'tone';	
	import Keyboard from './components/keyboard.svelte';
	import PartialsEditor from './components/partialsEditor.svelte';
	import Waveform from './components/waveform.svelte';
	import CustomOscillator from './lib/CustomOscillator';

	export let osc = new Tone.Oscillator(440, 'sine').toDestination();

	export let customOscillator : CustomOscillator;
	export let osc2 : Tone.ToneOscillatorNode;
	
	export let partialCount = 2;
	export let frequency = 220;

	onMount(async () => {
		setTimeout(() => {
			//TODO: Why do we need to wait 100ms to make sure the partials watch works in waveform component?
			osc.partials = Array.from({length: partialCount}, () => 1);		

			const buffer = new Tone.Buffer('./wave_files/piston_honda_mk3/1.wav', () => {
				const buf = buffer.get();
				const index = 0;
				// TODO: This kind of works but we need to understand why the buffer size is not what we expect
				const sliceLength = buf.length / 64;                                            
				const currentBuffer = buf.getChannelData(0).slice(sliceLength * index, (sliceLength * index) + sliceLength)
				
				customOscillator = new CustomOscillator(currentBuffer, frequency);
			});			
			
		}, 100)		
	});
	
	function playTone() {				
		customOscillator.OscillatorNode.frequency.value = frequency;

		if(customOscillator.OscillatorNode.state !== "started") {
			customOscillator.OscillatorNode.start();
		}

		// osc.frequency.value = frequency;	
		
		// if(osc.state !== "started") {
		// 	osc.start();		
		// }

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
		<input bind:value={frequency} type="range" min="20" max="2000" on:input={ playTone }/>
	</div>
	<div>				
		Partial count: { partialCount }
		<input bind:value={ partialCount } type="range" min="1" max="128" on:input={ updateOscPartials }/>		
	</div>

	<button on:click={() => playTone()}>Play</button>
	<button on:click={() => customOscillator.OscillatorNode.stop()}>Stop</button>
	<button on:click={ randomizePartials }>Randomize partials</button>
	
	<div>
		<PartialsEditor oscillator={osc} on:partialsChanged={ playTone } />
	</div>
	<div>
		<Keyboard osc={osc} />
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