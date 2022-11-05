# wavearium
WaveEdit like wavetable editor for viewing, searching, creating and collecting of wavetables. Focusing on the Piston Honda MKIII format for now.


## How to develop
Run `npm run dev` in client folder

## Technology decision
- For now we are going with svelte ts and will add a backend when it becomes necessary.

## Next challenges
- Look into WebAudio how their custom oscillator works
- Find out how to turn buffer into periodicWave with Real and Img values
- How to turn .wav file into partials / custom oscillator?
	- ctx.createPeriodicWave?
- Load wavetable .json from https://github.com/GoogleChromeLabs/web-audio-samples/tree/main/src/demos/wavetable-synth/wave-tables
- Implement waveform drawing
- More beautiful partial settings (find svelte UI toolkit)
- Understand piano css

## References
- Wavetable synth from scratch in Rust and WebAssembly: https://cprimozic.net/blog/buliding-a-wavetable-synthesizer-with-rust-wasm-and-webaudio/#demo
- https://github.com/corbanbrook/dsp.js DSP library containing FFT and IFFT
- https://github.com/moonchanyong/typefft TS FFT library
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


