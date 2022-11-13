<script lang=ts>
    import { onMount } from 'svelte';    
    import * as Tone from 'tone';
  import type { BufferOscillator } from '../lib/BufferOscillator';
    import { scale } from '../lib/utils';

    export let width = 512;
    export let height = 256;
    export let normalizeCurve = true;
    export let lineWidth = 2;
    export let resolution = 1024;

    let canvas = null;
    let ctx = null;
    
    let waveform : Tone.Waveform;

    let draw = true;

    export let node : BufferOscillator;
    
    // $ oscillator, redrawWaveform();

    onMount(() => {      
        canvas = document.getElementById('outputWaveform');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';                
        ctx = canvas.getContext('2d');     


        document.addEventListener("keydown", e => {
            // e object has the key property to tell which key was pressed
            switch (e.key) {
                case "p":
                    draw = !draw;
                    break;
            }
        });

        waveform = new Tone.Waveform(resolution);                

        redrawWaveform();
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
        requestAnimationFrame(redrawWaveform);

        node?.connect(waveform);  
        if(draw) {                  
            const values = waveform.getValue();

            drawWavetable(values);              
        }        
    }
</script>

<div class="canvas_wrapper">
    <canvas id="outputWaveform" width="{width}" height="{height}"></canvas>
    <pre>
        
    </pre>
</div>

<style>
    canvas {
        background-color: black;
        border: 1px solid lime;
    }    
</style>