<script lang="ts">
	import { onMount } from 'svelte';
  import { is_client } from 'svelte/internal';
	import * as Tone from 'tone';	
	import Keyboard from './components/keyboard.svelte';
	import PartialsEditor from './components/partialsEditor.svelte';
	import Waveform from './components/waveform.svelte';
	import OutputWaveform from './components/outputWaveform.svelte';
	import { BufferOscillator } from './lib/BufferOscillator';

	import { WaveFile } from 'wavefile';

	export let osc = new Tone.Oscillator(440, 'sine').toDestination();

	export let bufferOscillator : BufferOscillator = null;
	
	export let partialCount = 2;
	export let frequency = 85;

	onMount(async () => {		
		setTimeout(() => {
			//TODO: Why do we need to wait 100ms to make sure the partials watch works in waveform component?
			osc.partials = Array.from({length: partialCount}, () => 1);		

			fetch('./wave_files/piston_honda_mk3/1.wav')
  				.then(async (response) => {
					const buffer = await response.arrayBuffer();
					
					
					const wavefile = new WaveFile(new Uint8Array(buffer));										
					const floatBuffer = wavefile.getSamples(false);
										
					const index = 2;
					const waveLength = 256;

					// map PCM data to float array -1 to 1
					const floatArray = new Float32Array(floatBuffer.length);
					for (let i = 0; i < floatBuffer.length; i++) {
						floatArray[i] = floatBuffer[i] / 32768;
					}	
					
					// get a slice of the wave
					//const wave = floatArray.slice(index * waveLength, (index + 1) * waveLength);
					const wave = floatArray.slice(index * waveLength, (waveLength * index) + waveLength);
					console.log(wave);
					bufferOscillator = new BufferOscillator(wave).toDestination();	

				
				})
			// wav.fromDataURI('./wave_files/piston_honda_mk3/1.wav');

			// const buffer = new Tone.Buffer('./wave_files/piston_honda_mk3/1.wav', () => {
			// 	const buf = buffer.get();
			// 	const index = 1;				
				
			// 	const originalSampleRate = 10_000;
			// 	const sampleRate = Tone.context.sampleRate;
			// 	const conversion = sampleRate / originalSampleRate;				
				
			// 	// Our original buffers are 256 samples but because WebAudio resamples it at 48000
			// 	// we have annoying non-power of two buffer sizes.
			// 	const sliceLength = buf.length / 64;                                            
			// 	const originalSliceLength = sliceLength / conversion;
			// 	console.log(originalSliceLength);
			// 	const currentBuffer = buf.getChannelData(0).slice(sliceLength * index, (sliceLength * index) + sliceLength)
			// 	Tone.context.decodeAudioData
			// 	bufferOscillator = new BufferOscillator(currentBuffer).toDestination();								
			// });			
			
		}, 100)		
	});
	
	function playTone() {					
		bufferOscillator.frequency.value = frequency;

		if(bufferOscillator.state !== "started") {
			bufferOscillator.start();
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
	<button on:click={() => bufferOscillator.stop()}>Stop</button>
	<button on:click={ randomizePartials }>Randomize partials</button>
	
	<div>
		<!-- <PartialsEditor oscillator={bufferOscillator} on:partialsChanged={ playTone } /> -->
	</div>
	<div>
		<Keyboard osc={bufferOscillator} />
	</div>
	<div>
		<OutputWaveform node={bufferOscillator} width={1024} height={1024 / 2}></OutputWaveform>
	</div>	
	<div>
		<Waveform oscillator={bufferOscillator} width={1024} height={1024 / 2}></Waveform>
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