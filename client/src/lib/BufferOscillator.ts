import { optionsFromArguments, Oscillator, Signal, ToneOscillatorNode, ToneOscillatorType, Unit } from 'tone';
import type { Degrees, Frequency, Radians } from 'tone/build/esm/core/type/Units';
import { ExtendedToneOscillatorType, ToneOscillatorInterface, ToneOscillatorOptions, generateWaveform } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { Source } from 'tone/build/esm/source/Source';

import FFT from 'fft.js';
import { readOnly } from 'tone/build/esm/core/util/Interface';

export class BufferOscillator extends Source<ToneOscillatorOptions> implements ToneOscillatorInterface {
    
    readonly name: string = "BufferOscillator";
    private _oscillator: ToneOscillatorNode | null = null;
    
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

    private _originalBufferSize = 0;
    
    private _fft = null;

    get buffer() {
        return this._buffer;
    }
    set buffer(buffer: Float32Array) {
        this._originalBufferSize = buffer.length;        
        this._bufferSize = Math.pow(2, Math.ceil(Math.log2(buffer.length)));
        this._buffer = new Float32Array(this._bufferSize);
        this._buffer.set(buffer);        

        this._fft = new FFT(this._bufferSize);

        const bufferComplex = this._fft.createComplexArray();        
        this._fft.toComplexArray(this._buffer, bufferComplex);

        let outputComplex = this._fft.createComplexArray();

        this._fft.transform(outputComplex, bufferComplex);

        const realPart = [];
        const imgPart = [];

        outputComplex = outputComplex.slice(0, this._originalBufferSize);

        outputComplex.forEach((v, i) => {
            if(i % 2 === 0) {
                realPart.push(v);
            } else {
                imgPart.push(v);
            }
        })

        this._wave = this.context.createPeriodicWave(realPart, imgPart);        
    }

    // When we have the partials, we can use this to generate the buffer
    // private _getRealImaginary(phase: Radians) : Float32Array[] {
	// 	// const fftSize = 4096;
	// 	// let periodicWaveSize = fftSize / 2;

	// 	const real = new Float32Array(this._bufferSize);
	// 	const imag = new Float32Array(this._bufferSize);
        
    //     this._partialCount = this._bufferSize / 2;



    //     // const realPart = [];
    //     // const imgPart = [];

    //     // for(let i = 0; i < this._partialCount; i++) {
    //     //     const partial = this._partials[i];
    //     //     const amp = partial / this._partialCount;
    //     //     const freq = i + 1;
    //     //     const real = amp * Math.cos(freq * phase);
    //     //     const img = amp * Math.sin(freq * phase);
    //     //     realPart.push(real);
    //     //     imgPart.push(img);
    //     // }

    //     // return [new Float32Array(realPart), new Float32Array(imgPart)];
    // }

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
        return new Promise((resolve, reject) => {
            resolve(this._buffer.slice(0, this._originalBufferSize));
        });        
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