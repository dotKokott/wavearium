import { Context, FrequencyUnit, OfflineContext, optionsFromArguments, Oscillator, Signal, ToneOscillatorNode, ToneOscillatorType, Unit } from 'tone';
import type { Degrees, Frequency, Radians } from 'tone/build/esm/core/type/Units';
import { ExtendedToneOscillatorType, ToneOscillatorInterface, ToneOscillatorOptions, generateWaveform } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { Source } from 'tone/build/esm/source/Source';

import FFT from 'fft.js';
import { readOnly } from 'tone/build/esm/core/util/Interface';

export class BufferOscillator extends Source<ToneOscillatorOptions> implements ToneOscillatorInterface {
    
    readonly name: string = "BufferOscillator";
    _oscillator: ToneOscillatorNode | null = null;
    
    readonly baseType: OscillatorType | 'pulse' | 'pwm' = 'custom';
    readonly type: ExtendedToneOscillatorType = 'custom';

    frequency: Signal<'frequency'>;
    detune: Signal<'cents'>;


    private _wave?: PeriodicWave;
    private _partials: number[] = [];
	get partials(): number[] {
		return this._partials.slice(0, this.partialCount);
	}    
	set partials(partials) {
		this._partials = partials;
		this._partialCount = this._partials.length;

        const [real, imag] = this._getRealImaginary(this._phase);

        this._wave = this.context.createPeriodicWave(real, imag);

        if(this._oscillator) {
            this._oscillator.setPeriodicWave(this._wave);
        }
	}

    private _partialCount: number;
    get partialCount(): number {
		return this._partialCount;
	}
    set partialCount(p) {
        // const fullPartials = new Float32Array(p);
        // // copy over the partials array
        // this._partials.forEach((v, i) => fullPartials[i] = v);
        // this._partials = Array.from(fullPartials);        
    }

    // ! => cannot be null
    private _phase!: Radians;
	get phase(): Degrees {
		return this._phase * (180 / Math.PI);
	}    

	set phase(phase) {
		this._phase = phase * Math.PI / 180;
	}    

    private _buffer : Float32Array;
    private _bufferSize = 0;

    get periodicWaveSize(): number {
        return this._bufferSize / 2;
    }

    private _originalBufferSize = 0;
    
    private _fft = null;

    private _inverse : Float32Array;

    get buffer() {
        return this._buffer;
    }
    set buffer(buffer: Float32Array) {                
        this._bufferSize = Math.pow(2, Math.ceil(Math.log2(buffer.length)));
        this._originalBufferSize = this._bufferSize;        
        this._buffer = new Float32Array(this._bufferSize);
        this._buffer.set(buffer);                

        this._fft = new FFT(this._bufferSize);

        const bufferComplex = this._fft.createComplexArray();        
        this._fft.toComplexArray(this._buffer, bufferComplex);

        let outputComplex = this._fft.createComplexArray();

        this._fft.transform(outputComplex, bufferComplex);
        
        let realPart = [];
        let imgPart = [];
        
        const partials = [];
        for (let i = 0; i < this.periodicWaveSize; i++) {
            realPart[i] = outputComplex[i * 2];
            imgPart[i] = outputComplex[i * 2 + 1];
            partials[i] = Math.sqrt(realPart[i] * realPart[i] + imgPart[i] * imgPart[i]);
            // what is the difference to this one: partials.push(outputComplex[i] + outputComplex[i + 1]);

            // normalize partials to 0 - 1
            partials[i] /= this.periodicWaveSize;
        }

        this.partials = partials;
               
        // TODO: understand why this is still neccessary for a clean waveform
        // realPart = realPart.slice(0, buffer.length / 2);
        // imgPart = imgPart.slice(0, buffer.length / 2);

		// const _inverseComplex = this._fft.createComplexArray();
        // this._fft.inverseTransform(_inverseComplex, outputComplex);   
        
        // this._inverse = new Float32Array(this._bufferSize);

        // _inverseComplex.forEach((v, i) => {
        //     if(i % 2 === 0) {
        //         this._inverse[i] = v;
        //     }            
        // })

        //this._wave = this.context.createPeriodicWave(realPart, imgPart);        
    }

    // When we have the partials, we can use this to generate the buffer
    private _getRealImaginary(phase : number) : Float32Array[] {
		const fftSize = this._bufferSize;
		let periodicWaveSize = this.periodicWaveSize;

		const real = new Float32Array(periodicWaveSize);
		const imag = new Float32Array(periodicWaveSize);
        
        this._partialCount = this._bufferSize / 2;

        let partialCount = this.partials.length;
        periodicWaveSize = partialCount;
        if(this._partials.length === 0) {
            return [real, imag];
        }

        for (let n = 0; n < periodicWaveSize; n++) {
            const p = this._partials[n];
            if (p === 0) {
                real[n] = 0;
                imag[n] = 0;
            }


            real[n] = -p * Math.sin(phase * n);
            imag[n] = p * Math.cos(phase * n);
        }

        return [real, imag];
    }



    constructor(buffer: Float32Array, frequency?: Frequency) {
        // TODO: understand this options structure
        super(optionsFromArguments(Oscillator.getDefaults(), arguments, ["frequency"]));

        const options = optionsFromArguments(Oscillator.getDefaults(), arguments, ["frequency"]);
        
		this.detune = new Signal<"cents">({
			context: this.context,
			units: "cents",
			value: options.detune,
		});        
		
        this.frequency = new Signal<"frequency">({
			context: this.context,
			units: "frequency",
			value: frequency || 440,
		});        
        readOnly(this, "frequency");
        
        // this._partials = PARTIALS_FROM_WAVE
        // this._partialCount = fftSize / 2;

        
        this.phase = options.phase;
        
        this.buffer = buffer;
    }

	static getDefaults(): ToneOscillatorOptions {
		return Object.assign(Source.getDefaults(), {
			detune: 0,
			frequency: 440,
			partialCount: 0,
			partials: [],
			phase: 0,
			type: "custom" as const,
		});
	}    

    protected _start(time: Unit.Time): void {
        const computedTime = this.toSeconds(time);

		const oscillator = new ToneOscillatorNode({
			context: this.context,
			onended: () => this.onstop(this),
		});  
        
        this._oscillator = oscillator;
        this._oscillator.setPeriodicWave(this._wave);

		this._oscillator.connect(this.output);
		this.frequency.connect(this._oscillator.frequency);
		this.detune.connect(this._oscillator.detune);

		// start the oscillator
		this._oscillator.start(computedTime);        
    }
    protected _stop(time: Unit.Time): void {
		const computedTime = this.toSeconds(time);
		if (this._oscillator) {
			this._oscillator.stop(computedTime);
		}        
    }
    protected _restart(time: number): this  {
		const computedTime = this.toSeconds(time);
		this.log("restart", computedTime);
		if (this._oscillator) {
			this._oscillator.cancelStop();
		}
		this._state.cancel(computedTime);
		return this;
    }     
    

    asArray(length: number) : Promise<Float32Array> {
        // TODO: use inverse fft on the real and imaginary part to get the buffer
        return new Promise((resolve, reject) => {
            resolve(this._buffer.slice(0, this._originalBufferSize));            
        });     

        // let outputComplex = this._fft.createComplexArray();
        // const [real, imag] = this._getRealImaginary(this.phase);

        // for(let i = 0; i < real.length; i++) {
        //     outputComplex[i * 2] = real[i];
        //     outputComplex[i * 2 + 1] = imag[i];
        // }

        // const _inverseComplex = this._fft.createComplexArray();        
        // this._fft.inverseTransform(_inverseComplex, outputComplex);

        // const _inverse = new Float32Array(this._bufferSize);

        // _inverseComplex.forEach((v, i) => {
        //     if(i % 2 === 1) {
        //         _inverse[i] = v;
        //     }            
        // })

        // return new Promise((resolve, reject) => {
        //     resolve(imag);            
        // });
        
    }    

	dispose(): this {
		super.dispose();
		if (this._oscillator !== null) {
			this._oscillator.dispose();
		}
		this._wave = undefined;
		this.frequency.dispose();
		this.detune.dispose();
		return this;
	}    
}