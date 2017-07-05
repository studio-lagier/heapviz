import { Sample } from './state';

function getPrev(start: number, samples: Sample[]) {
    if (start === 0) return 0;
    let nextStart = 0;
    for (let i = start - 1; i > 0; i--) {
        if (samples[i].nodeCount > 0) {
            nextStart = i;
            break;
        }
    }
    return nextStart;
}

function getNext(end: number, samples: Sample[]) {
    if (end === samples.length) return end;
    let nextEnd = end;
    for (let i = end + 1; i < samples.length; i++) {
        if (samples[i].nodeCount > 0) {
            nextEnd = i;
            break;
        }
    }
    return nextEnd;
}

export function getStart(start: number, end: number, samples: Sample[], direction: boolean) {
    const nextStart = direction ? getNext(start, samples) : getPrev(start, samples);
    if (start === nextStart || nextStart > end) return start
    return nextStart;
}

export function getEnd(start: number, end: number, samples: Sample[], direction: boolean) {
    const nextEnd = direction ? getNext(end, samples) : getPrev(end, samples);
    if (end === nextEnd || nextEnd < start) return end;
    return nextEnd;
}