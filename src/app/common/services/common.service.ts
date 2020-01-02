import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // public commonPopUpData = new BehaviorSubject(undefined);

  constructor(private _snackBar: MatSnackBar  ) {
  }

  openSnackBar(message: string, className: string | string[]) {
    this._snackBar.open(message, 'Close', {
      duration: 3000, horizontalPosition: 'right', verticalPosition: 'top', panelClass: className
    });
  }

  getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Redirect to someother component and again back to same component
  static resetPage(router: any) {
    let url = router.url;
    router.navigateByUrl('/index', { skipLocationChange: true }).then(() => {
      router.navigate([url]);
    });
  }

  // Redirect to someother component and again back to same component
  static resetWholePage(router: any) {
    let url = router.url;
    router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      router.navigate([url]);
    });
  }

}
