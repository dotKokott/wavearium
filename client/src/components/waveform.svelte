<script lang=ts>
    import { onMount } from 'svelte';    
    import * as Tone from 'tone';

    export let width = 512;
    export let height = 256;

    export let audioNode : Tone.Oscillator;
    let waveform : Tone.Waveform;

    const fftSize = 256;    

    let canvas = null;
    let ctx = null;

    onMount(() => {
        waveform = new Tone.Waveform(fftSize);
        audioNode.connect(waveform);

        canvas = document.getElementById('waveform');
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';        

        ctx = canvas.getContext('2d');

        draw();
    });

    function draw() {
        requestAnimationFrame(draw);        

        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'lime';
        ctx.beginPath();
            
            // create standing wave by adjusting to frequency
            const sliceWidth = width / fftSize;
            let x = 0;
            const values = waveform.getValue();
            for(let i = 0; i < values.length; i++) {                    
                const v = values[i];                    
                const y = (v * height / 2) + (height / 2);
                if(i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            //ctx.lineTo(canvas.width, canvas.height/2);
            ctx.stroke();            
    }
</script>

<div class="canvas_wrapper">
    <canvas id="waveform" width="{width}" height="{height}"></canvas>
</div>

<style>
    canvas {
        background-color: black;
        border: 1px solid lime;
    }    
</style>