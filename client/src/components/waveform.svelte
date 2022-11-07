<script lang=ts>
    import { onMount } from 'svelte';    
    import * as Tone from 'tone';
    import { scale } from '../lib/utils';
    import FFT from 'fft.js';
  
    

    export let width = 512;
    export let height = 256;
    export let normalizeCurve = true;
    export let lineWidth = 2;
    export let resolution = 1024;

    export let audioNode : Tone.Oscillator;    

    let canvas = null;
    let ctx = null;
    
    
    let currentBuffer;
    let fftResult;

    $: audioNode.partials, redrawWaveform();

    onMount(() => {        
        canvas = document.getElementById('waveform');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';        

        ctx = canvas.getContext('2d');                            
        

    


        const buffer = new Tone.Buffer('./wave_files/piston_honda_mk3/1.wav', () => {
			const buf = buffer.get();
            const index = 2;
            // TODO: This kind of works but we need to understand why the buffer size is not what we expect
            const sliceLength = buf.length / 64;                                            
            currentBuffer = buf.getChannelData(0).slice(sliceLength * index, (sliceLength * index) + sliceLength)
            
            const size = 1024 * 2;
            
            const f = new FFT(size);

            const input = new Array(size);
            input.fill(0);
            currentBuffer.forEach((v, i) => {
                input[i] = v;
            });
            

            const inputComplex = f.createComplexArray();

            f.toComplexArray(input, inputComplex);            
            
            const outputComplex = f.createComplexArray();

            f.transform(outputComplex, inputComplex);

            const realPart = outputComplex.map((v, i) => {
                if(i % 2 === 0) {
                    return v;
                }
            }).filter(v => v !== undefined);

            const imgPart = outputComplex.map((v, i) => {
                if(i % 2 !== 0) {
                    return v;
                }
            }).filter(v => v !== undefined);

            console.log(realPart);

            const wave = Tone.context.createPeriodicWave(realPart, imgPart);

            console.log(wave);

            // fft = KissFFT.FFTR(currentBuffer.length)
            // const transform = fftResult.forward(currentBuffer);
            
            // console.log(transform);
            drawWavetable(currentBuffer);
        })	        
    });

    function drawWavetable(values : Float32Array) {
        ctx.clearRect(0, 0, width, height)
        const maxValuesLength = 2048;
        if (values.length > maxValuesLength) {
            const resampled = new Float32Array(maxValuesLength);
            // down sample to maxValuesLength values
            for (let i = 0; i < maxValuesLength; i++) {
                resampled[i] =
                    values[
                        Math.floor((i / maxValuesLength) * values.length)
                    ];
            }
            values = resampled;
        }        

        // max = biggest value in array, minimum 0.001
        // min = smallet value in array, maximum -0.001
        // * 1.1 to make sure the line is not touching the edge
        // it will be used to scale the values to the canvas height
        const max = normalizeCurve
				? Math.max(0.001, ...values) * 1.1
				: 1;
        const min = normalizeCurve
            ? Math.min(-0.001, ...values) * 1.1
            : 0;
                
        ctx.lineWidth = lineWidth;
        ctx.beginPath();     
        
        for (let i = 0; i < values.length; i++) {
            const v = values[i];
            // scaling from minArray to maxArray to minCanvas to maxCanvas
            const x = scale(i, 0, values.length, lineWidth, width - lineWidth);
            const y = scale(v, max, min, 0, height - lineWidth);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
		}

        ctx.lineCap = "round";
        ctx.strokeStyle = "lime";
        ctx.stroke();		      
    }

    async function redrawWaveform() {
        // // TODO: Understand why 1024 in this case is like the resolution rather than sample size
        // const values = await audioNode.asArray(resolution);

        // drawWavetable(values);       
    }
</script>

<div class="canvas_wrapper">
    <canvas id="waveform" width="{width}" height="{height}"></canvas>
    <pre>
        
    </pre>
</div>

<style>
    canvas {
        background-color: black;
        border: 1px solid lime;
    }    
</style>