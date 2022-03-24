import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IsFroalaRemoteCommand } from './is-froala.interfaces';

@Injectable()
export class IsFroalaService {
    private command$: Subject<IsFroalaRemoteCommand> = new Subject();

    executeRemoteCommand(cmd: IsFroalaRemoteCommand): void {
        this.command$.next(cmd);
    }

    onCommand(): Observable<IsFroalaRemoteCommand> {
        return this.command$.asObservable();
    }
}