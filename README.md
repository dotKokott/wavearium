# wavearium
WaveEdit like wavetable editor for viewing, searching, creating and collecting of wavetables. Focusing on the Piston Honda MKIII format for now.


## Technology decision
- For now we are going with svelte ts and will add a backend when it becomes necessary.

## Next challenges
- Understand piano css
- Implement waveform drawing from the UI examples
- More beautiful partial settings (find svelte UI toolkit)
- Waveform <-> partial research
- Calculate standing wave just from partials

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

- We use Tone.Waveform for now to display the waveform of an audionode. This should be replaced by actually drawing the calculated standing waveform.

- How to draw waveform from oscillator: https://github.com/Tonejs/ui/blob/master/src/gui/vis/vis-base.ts#L34