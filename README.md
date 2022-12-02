# wavearium
WaveEdit like wavetable editor for viewing, searching, creating and collecting of wavetables. Focusing on the Piston Honda MKIII format for now.

## How to develop
Run `npm run dev` in client folder

## Next challenges
- PartialEditing works!

	- Try if there is a difference when internally it keeps the same amount of partials

- implement asArray for changed partials
- Waveform switching
- Better partial display
- Can we morph?
- Figure out wave -> partial -> wave <-> partial, something about the phasors and inverseFFT I suspect
- Check this out: https://github.com/Tonejs/Tone.js/blob/c313bc6/Tone/source/oscillator/Oscillator.ts#L315

	- Real and img can be calculated easily from partials
- Why are our buffers so big as opposed to 256?
- Why can't we set type to 'custom' for the ToneOscillatorNode
- optional Load wavetable .json from https://github.com/GoogleChromeLabs/web-audio-samples/tree/main/src/demos/wavetable-synth/wave-tables
- More beautiful partial settings (find svelte UI toolkit)
- Understand piano css

## References
- Wavetable synth from scratch in Rust and WebAssembly: https://cprimozic.net/blog/buliding-a-wavetable-synthesizer-with-rust-wasm-and-webaudio/#demo
- https://github.com/corbanbrook/dsp.js DSP library containing FFT and IFFT
- https://github.com/moonchanyong/typefft TS FFT library
- Current tone.js docs https://tonejs.github.io/docs/14.7.77/index.html

### Learnings
- WebAudio is only allowed to create sound following a user interaction. Therefore a button 
```js
//attach a click listener to a play button
document.querySelector('button')?.addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})
```

- [Tone.Oscillator has a partials attribute](https://tonejs.github.io/docs/14.7.77/Oscillator.html#partials) that can be used to create wavetable synth

- How to draw waveform from oscillator: https://github.com/Tonejs/ui/blob/master/src/gui/vis/vis-base.ts#L34

- We are using Oscillator.asArray(resolution) to get the wave values right now, we have to see how this translates to waveform .wav files.

- A waveedit / piston honda wavetable .wav file is 64 waves * 256 samples per wave

- To go from .wav file to oscillator we need to do the following:

	1. Slice the wav file into the individual waveforms, which are PCM data, which basically means list of amplitudes, which can be called the **signal**
	2. Do an FFT in order to get the sine and cosine coefficients of the signal, also called real and imaginary values of the periodic waveform
	3. With the real and img values we can then create a custom oscillator

- fft.js seems to give us the complex numbers we need

	- but it wants the input power of two, can we just scale it up and fill with zeros?	

- I would really like to understand how to make old JS libs work in TS

- Our files are 10.000 Hz sample rate and 16 bit per sample
- WebAudio resamples the file to its own sample rate: 48.000


