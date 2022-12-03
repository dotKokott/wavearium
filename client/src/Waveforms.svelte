<script lang="ts">
    import { onMount } from "svelte";    
    import { WaveFile } from 'wavefile';
    import PlayableWaveform from "./components/playableWaveform.svelte";    

    let buffers : Float32Array[] = [];

    onMount(() => {
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
                    const waveCount = floatBuffer.length / waveLength;
                    
					const newBuffers = new Array(waveCount);
                    
                    for(let i = 0; i < waveCount; i++) {
                        newBuffers[i] = (floatArray.slice(i * waveLength, (waveLength * i) + waveLength));
                    }
                    
                    console.log(newBuffers.length);

                    buffers = newBuffers;		
				})        
    })
</script>

<main class="waveforms">    
    <div>
        {#each buffers as buffer}
            <PlayableWaveform buffer={buffer} />
        {/each}
    </div>
</main>



<style>

    /*
    Colors:
        #3c3744 Black Coffee
        #ff66b3 Hot Pink
        #faff7f Laser Yellow
        #a9def9 Uranian Blue
        #f46036 Portland Orange

    */
	main {		
        font: 'Arial';
		background-color: #3c3744;
		color: white;
		height: 100%;
		text-align: center;		
	}
</style>