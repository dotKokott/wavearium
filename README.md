# wavearium
WaveEdit like wavetable editor for viewing, searching, creating and collecting of wavetables. Focusing on the Piston Honda MKIII format for now.


## Technology decision
- For now we are going with svelte ts and will add a backend when it becomes necessary.

## Next challenges
- Display wave
- Display partial settings
- Editable partial settings
- Waveform <-> partial research

### Learnings
- WebAudio is only allowed to create sound following a user interaction. Therefore a button 
```
//attach a click listener to a play button
document.querySelector('button')?.addEventListener('click', async () => {
	await Tone.start()
	console.log('audio is ready')
})
```

- [Tone.Oscillator has a partials attribute](https://tonejs.github.io/docs/14.7.77/Oscillator.html#partials) that can be used to create wavetable synth


