import { Injectable } from "@angular/core";
import { Subject } from "rxjs";


export class SharedService {

    private translateNotify = new Subject<any>();

    translateObservable$ = this.translateNotify.asObservable();

    public notifyOther(data: any) {
        if (data) {
            this.translateNotify.next(data);
        }
    }

}