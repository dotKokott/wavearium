<script lang=ts>
    import { onMount } from "svelte";
    import { BufferOscillator } from "../lib/BufferOscillator";

    export let buffer : Float32Array;

    // export let width = 512;
    // export let height = 256;
    export let frequency = 440;

    let oscillator : BufferOscillator;

    $: buffer && (oscillator = new BufferOscillator(buffer, frequency));

    onMount(() => {
        console.log('created');
        // oscillator = new BufferOscillator(buffer, frequency);
    })

    onresize = () => {
        // oscillator?.stop();
        // oscillator?.start();
    }

    function play() {        
        oscillator?.toDestination();

        oscillator?.start();
    }

    function stop() {
        oscillator?.stop();
    }    
</script>

<div on:mousedown={play} on:mouseup={stop} class="waveform_wrapper">
    <span>I am an oscillator</span>
</div>

<style>
    .waveform_wrapper {
        border: 1px solid black;
    }    
</style>