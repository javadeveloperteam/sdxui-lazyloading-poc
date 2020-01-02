import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { SharedService } from './shared.service';

interface SharedLazyModuleConfig {
    moduleName: string;
}
@NgModule({
    imports: [CommonModule],
    providers: [SharedService]
})

export class SharedLazyModule {

    static getTranslateModuleforDashboard(): ModuleWithProviders {
        return TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                deps: [HttpClient],
                useFactory: HttpLoaderForDashboard
            },
            isolate: true
        }
        );
    }

    static getTranslateModuleforUser(): ModuleWithProviders {
        return TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                deps: [HttpClient],
                useFactory: HttpLoaderForUser
            },
            isolate: true
        }
        );
    }

    static getTranslateModuleforLayout(): ModuleWithProviders {
        return TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                deps: [HttpClient],
                useFactory: HttpLoaderForLayout
            },
            isolate: true
        }
        );
    }

}

export function HttpLoaderForDashboard(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/dashboard/', '.json');
}

export function HttpLoaderForLayout(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/layout/', '.json');
}

export function HttpLoaderForUser(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/user/', '.json');
}
