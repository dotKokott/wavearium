<script lang=ts>
    import { onMount } from 'svelte';    
    import { scale } from '../lib/utils';
    
    export let buffer : Float32Array;
    
    export let normalizeCurve = true;
    export let lineWidth = 2;
    export let lineColor = "#ff66b3";
        
    let canvas = null;
    let ctx = null;      
    
    $: buffer, redrawWaveform();

    onMount(() => {
        const resizeObserver = new ResizeObserver(() => {            
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            console.log('Resize')
        });

        ctx = canvas.getContext('2d');         
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;                 

        redrawWaveform();

        return () => {
            resizeObserver.disconnect();
        }
    })

    function drawWavetable(values : Float32Array) {
        if(!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height)
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
            const x = scale(i, 0, values.length, lineWidth, canvas.width - lineWidth);
            const y = scale(v, max, min, 0, canvas.height - lineWidth);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
		}

        ctx.lineCap = "round";
        ctx.strokeStyle = lineColor;
        ctx.stroke();		      
    }

    async function redrawWaveform() {
        drawWavetable(buffer);       
    }
</script>

<div class={`canvas_wrapper ${$$props.class}`}>
    <canvas bind:this={canvas}></canvas>
</div>

<style>
    .canvas_wrapper {
        border: 1px solid black;
        height: 500px;
    }
    canvas {
        border: 1px solid #ff66b3;
    }    
</style>