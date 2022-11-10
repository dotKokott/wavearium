<script lang="ts">
    import { onMount } from 'svelte';
    import type { ToneOscillatorNode } from 'tone';
    import type { Frequency } from 'tone/build/esm/core/type/Units';
    
    export let osc : ToneOscillatorNode;

    function playNote(frequency : Frequency) {
        osc.frequency.value = frequency;
        osc.start();
    }

    function stopNote() {
        osc.stop();
    }

    onMount(() => {
        const piano = document.getElementById("piano");
        piano.addEventListener("mousedown", e => {
            playNote(e.target.dataset.note);
        });

        piano.addEventListener("mouseup", e => {
            stopNote();
        }); 
        
        document.addEventListener("keydown", e => {
            // e object has the key property to tell which key was pressed
            switch (e.key) {
                case "d":
                    playNote("C4");
                    break;
                case "r":
                    playNote("C#4");
                    break;                     
                case "f":
                    playNote("D4");
                    break;  
                case "t":
                    playNote("D#4");
                    break;  
                case "g":
                    playNote("E4");
                    break;  
                case "h":
                    playNote("F4");
                    break;  
                case "u":
                    playNote("F#4");
                    break;  
                case "j":
                    playNote("G4");
                    break;  
                case "i":
                    playNote("G#4");
                    break;  
                case "k":
                    playNote("A4");
                    break;  
                case "o":
                    playNote("A#4");
                    break;  
                case "l":
                    playNote("B4");
                    break;  
                default:
                return;
            }
        });   
    });
</script>

<div>
    <ul id="piano">
        <li data-note="C4" class="key">
            <div data-note="C#4" class="black-key">R</div>
            D
        </li>
        <li data-note="D4" class="key">
            <div data-note="D#4" class="black-key">T</div>
            F
        </li>
        <li data-note="E4" class="key">
            G
        </li>
        <li data-note="F4" class="key">
            <div data-note="F#4" class="black-key">U</div>
            H
        </li>
        <li data-note="G4" class="key">
            <div data-note="G#4" class="black-key">I</div>
            J
        </li>
        <li data-note="A4" class="key">
            <div data-note="A#4" class="black-key">O</div>
            K
        </li>
        <li data-note="B4" class="key">
            L
        </li>
    </ul>
</div>

<style>
 div {
     /* font-family: 'Roboto', sans-serif; */
     display: flex;
     justify-content: center;
     align-items: center;
     /* min-height: 100vh; */
}
 ul {
     list-style: none;
     display: flex;
}
 ul .key {
    cursor: pointer;
     position: relative;
     width: 60px;
     height: 180px;
     border: 1px solid black;
     border-right: none;
     background: #fffff0;
     border-radius: 5px;
     box-shadow: 0px 3px 5px #666;
     cursor: pointer;
     display: flex;
     justify-content: center;
     align-items: flex-end;
     padding-bottom: 10px;
     font-weight: bold;
     color: black;
}
 ul .key:last-child {
     border-right: 1px solid black;
}
 ul .black-key {
     position: absolute;
     top: -1px;
     left: 37.5px;
     width: 45px;
     height: 120px;
     background: black;
     border-radius: 5px;
     box-shadow: 0px 3px 5px #666;
     z-index: 999;
     display: flex;
     justify-content: center;
     align-items: flex-end;
     padding-bottom: 10px;
     color: white;
}    
</style>
