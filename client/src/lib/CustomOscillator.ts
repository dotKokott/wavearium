import * as Tone from 'tone';
import FFT from 'fft.js';
import type { Frequency } from 'tone/build/esm/core/type/Units';

class CustomOscillator {
    private buffer : Float32Array;    
    private bufferSize : number = 1024;
    private bufferComplex;
    private outputComplex;

    readonly Wave : PeriodicWave;

    private fft : FFT;
    
    readonly OscillatorNode : Tone.ToneOscillatorNode;

    constructor(buffer : Float32Array, frequency : Frequency = 220) {
        // create new buffer that contains the passed buffer but pads the size to the next power of 2
        this.bufferSize = Math.pow(2, Math.ceil(Math.log2(buffer.length)));
        this.buffer = new Float32Array(this.bufferSize);
        this.buffer.set(buffer);        

        this.fft = new FFT(this.bufferSize);

        this.bufferComplex = this.fft.createComplexArray();
        this.fft.toComplexArray(this.buffer, this.bufferComplex);        

        this.outputComplex = this.fft.createComplexArray();

        this.fft.transform(this.outputComplex, this.bufferComplex);

        const realPart = this.outputComplex.map((v, i) => {
            if(i % 2 === 0) {
                return v;
            }
        }).filter(v => v !== undefined);

        const imgPart = this.outputComplex.map((v, i) => {
            if(i % 2 !== 0) {
                return v;
            }
        }).filter(v => v !== undefined);    
        
        this.Wave = Tone.context.createPeriodicWave(realPart, imgPart);

        this.OscillatorNode = new Tone.ToneOscillatorNode(frequency, 'sine');

        this.OscillatorNode.setPeriodicWave(this.Wave);
    }
}

export default CustomOscillator;