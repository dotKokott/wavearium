# wavearium
WaveEdit like wavetable editor for viewing, searching, creating and collecting of wavetables. Focusing on the Piston Honda MKIII format for now.

## How to develop
Run `npm run dev` in client folder

## UI Requirements v1
- Load .wav, show all waveforms in .wav in a list

## Next challenges
### Library / UI
- Display all waveforms of a file in a list
- Create UI in figma?

	- https://www.figma.com/file/hR8wIx2gBHa7gH3CzqnSO5/Wavearium?node-id=0%3A1&t=tu6pBwZkucqyYxKr-0

- Waveform switching
- Better partial display / edit
- More beautiful partial settings (find svelte UI toolkit)

### Audio
- implement asArray or offline context for changed partials so we can look at the snapshot
- Can we morph?
- Figure out wave -> partial -> wave <-> partial, something about the phasors and inverseFFT I suspect
- Check this out: https://github.com/Tonejs/Tone.js/blob/c313bc6/Tone/source/oscillator/Oscillator.ts#L315

	- Real and img can be calculated easily from partials
- Why can't we set type to 'custom' for the ToneOscillatorNode
- optional Load wavetable .json from https://github.com/GoogleChromeLabs/web-audio-samples/tree/main/src/demos/wavetable-synth/wave-tables

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

- A waveedit / piston honda wavetable .wav file is 64 waves * 256 samples per wave, 10.000 Hz sample rate and 16 bit per sample

- To go from .wav file to oscillator we need to do the following:

	1. Slice the wav file into the individual waveforms, which are PCM data, which basically means list of amplitudes, which can be called the **signal**
	2. Do an FFT in order to get the sine and cosine coefficients of the signal, also called real and imaginary values of the periodic waveform
	3. With the real and img values we can then create a custom oscillator

- When an audiofile gets loaded into a buffer WebAudio resamples the file to its own sample rate: 48.000


