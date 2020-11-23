import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface LooseObject {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})

export class InputDataControllerService {
  constructor(private router: Router, private activeRoute: ActivatedRoute) { }
  //TODO doesn't work anymore, probably because of the guard 
  start(parent: any) {
    const parentName = parent.activeRoute.component.name;
    const params = this.activeRoute.snapshot.queryParams;

    const temp: LooseObject = {
      inputData:  {
        ua: parseInt(params.ua, 10) || 80000,
        ca: parseInt(params.ca, 10) || 1600,
        ub: parseInt(params.ub, 10) || 80000,
        cb: parseInt(params.cb, 10) || 1696,
        sig: params.sig || '0.95',
        tail: params.tail || '1'
      },

      paramsToAdd: null,

      setQueryParams() {
        this.paramsToAdd = {... this.inputData};

        if (this.paramsToAdd.sig === '0.95') {
          delete this.paramsToAdd.sig;
        }
        if (this.paramsToAdd.tail === '1') {
          delete this.paramsToAdd.tail;
        }

        parent.router.navigate([], {
          relativeTo: parent.router.url,
          queryParams: this.paramsToAdd,
          replaceUrl: true,
        });
      }
    };

    return temp;
  }
}
