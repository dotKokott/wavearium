import * as Tone from 'tone'

export function scale(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((v - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}
