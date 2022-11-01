<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    // TODO: How to get rid of this error?
    import { Oscillator } from 'tone';    

    export let oscillator : Oscillator;     
    const dispatch = createEventDispatcher();   
    
    function changePartial(index : number, value : number) {    
        oscillator.partials = oscillator.partials.map((partial, i) => i === index ? value : partial);

        dispatch('partialsChanged');
    }
</script>

<div class="wrapper">
    {#each oscillator.partials as partial, index}
        <div class="partial">
            <div class="partial_label">{`${index}: ${partial.toString().substring(0, 4)}`}</div>
            <div class="partial_slider">
                <input type="range" min="0" max="1" step="0.01" value="{partial}" on:input={(e) => {
                    // TODO: How to get rid of error value does not exist, event typing?                 
                    changePartial(index, e.target.value);
                }} />
            </div>
        </div>
    {/each}
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;        
        height: 100%;
    }    

    .partial {
        width: 60px;
    }

    .partial_label {        
        padding-left: 50px;
        width: 60px;
    }

    input {
        margin-top: 60px;
        margin-bottom: 60px;
        height: 20px;
        transform: rotate(270deg);
    }
</style>