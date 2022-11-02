# wavearium
WaveEdit like wavetable editor for viewing, searching, creating and collecting of wavetables. Focusing on the Piston Honda MKIII format for now.


## How to develop
Run `npm run dev` in client folder

## Technology decision
- For now we are going with svelte ts and will add a backend when it becomes necessary.

## Next challenges
- How to turn .wav file into partials / custom oscillator?
	- ctx.createPeriodicWave?
- Implement waveform drawing
- More beautiful partial settings (find svelte UI toolkit)
- Understand piano css

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
