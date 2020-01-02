import { OnDestroy, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "../../environments/environment";
import { SharedService } from "./shared.service";
import { Subscription } from "rxjs";


export abstract class I18nComponent implements OnDestroy {

    sharedService: SharedService;
    private subscription: Subscription;

    constructor(private translateService: TranslateService, sharedService: SharedService) {
        this.sharedService = sharedService;
        translateService.setDefaultLang(environment.somDefaultLanguage);
        let chosenLang = localStorage.getItem('currentLanguage');
        if (chosenLang == null) {
            chosenLang = environment.somDefaultLanguage;
            localStorage.setItem('currentLanguage', chosenLang);
        }
        this.subscription = this.sharedService.translateObservable$.subscribe((lang) => {
            this.translateService.use(lang);
        });
        this.sharedService.notifyOther(chosenLang);
    }

    changeLanguage(lang: string) {
        localStorage.setItem('currentLanguage', lang);
        this.sharedService.notifyOther(lang);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}