import { Observable, ReplaySubject } from 'rxjs';
import { FSA } from '../../typings/fsa';

export default function takeUntil(source: Observable<any>, type:string) {
    return source
        .multicast(
            () => new ReplaySubject(1),
            messages => messages
                .takeWhile(
                    (message:FSA) => message.type !== type
                ).concat(messages.take(1))
        )
}