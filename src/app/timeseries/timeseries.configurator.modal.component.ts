import { Component, Inject, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorsSacGwh } from './validators.sac';
import { PORTAL_API_URL } from '../in-app-config/app.tokens';
import { Http, Response } from '@angular/http';
import { IErrorResult } from '../search/result';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../notifications/notification.service';

export class Timeseries {
  sosUrl: string;
  offering: string;
  procedure: string;
  observedProperty: string;
  featureOfInterest: string;

  fromDate: Date;
  toDate: Date;

  uom: string;
  timeseriesName: string;

  data: any;
}

export class SosCapabilities {
  sosUrl: string;
  title: string;

  offerings: string[];
  procedures: string[];
  observedProperties: string[];
  featuresOfInterest: string[];
}

@Component({
  selector: 'app-sac-gwh-timeseries-configurator-modal',
  templateUrl: 'timeseries.configurator.modal.component.html',
  // styleUrls: ['timeseries.component.css'],
})

export class TimeseriesConfiguratorModalComponent {
  @ViewChild('timeseriesConfiguratorRef') public modal: ModalDirective;

  configurationForm: FormGroup;
  formErrors: any = {};
  validationMessages = {};

  timeseries: Timeseries = new Timeseries();
  sosCapabilities: SosCapabilities = new SosCapabilities();

  onCloseCallback: (ts: Timeseries) => void;

  _fromDate: Date;
  _toDate: Date;

  okButtonCaption = 'add';
  loading = false;

  /**
   * Constructor with injected services.
   *
   * @param portalApiUrl
   * @param http
   * @param fb
   * @param notificationService
   */
  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private http: Http,
              private fb: FormBuilder,
              private notificationService: NotificationService) {
    this.buildForm();
  }

  onValueChanged(data?: any) {
    if (this.configurationForm) {
      const form = this.configurationForm;

      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          this.formErrors[field] = '';         // clear previous error message (if any)
          const control = form.get(field);
          if (control /*&& control.dirty */ && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }
  }

  /**
   * Shows the current modal
   */
  showModal(ts: Timeseries, onCloseCallback: (ts: Timeseries) => void) {

    if (isNullOrUndefined(ts)) {
      this.okButtonCaption = 'add';
      this.timeseries = new Timeseries();
      this.sosCapabilities = new SosCapabilities();
      this.timeseries.fromDate = moment().startOf('day').toDate();
      this.timeseries.toDate = moment().startOf('day').add(1, 'd').toDate();
    } else {
      this.okButtonCaption = 'update';
      // this is only a shallow copy! We're not really interested in the data object as this is loaded from
      // the backend after changing it
      this.timeseries = Object.assign({}, ts);
      this.timeseries.fromDate = ts.fromDate;
      this.timeseries.toDate = ts.toDate;
    }

    console.log(this._fromDate);
    console.log(this._toDate);
    this._fromDate = this.timeseries.fromDate;
    this._toDate = this.timeseries.toDate;
    this.buildForm();
    this.fetchSosCapabilities();
    this.onCloseCallback = onCloseCallback;

    this.modal.show();
  }

  hideModal() {
    this.modal.hide();
  }

  submitChanges() {
    this.hideModal();
    this.timeseries = Object.assign({}, this.configurationForm.getRawValue());
    this.timeseries.sosUrl = this.sosCapabilities.sosUrl;
    this.timeseries.fromDate = this._fromDate;
    this.timeseries.toDate = this._toDate;
    window.setTimeout(this.onCloseCallback, 1000, this.timeseries);
  }

  fetchSosCapabilities() {
    let sosUrl = this.configurationForm.get('sosUrl');
    let observable;

    console.log(sosUrl);
    if (isNullOrUndefined(sosUrl.value) ||
      sosUrl.value.trim() === '') {
      observable = Observable.of(new SosCapabilities());
    } else {
      observable = this.http.get(`${this.portalApiUrl}/sos/getCapabilities?sosUrl=${sosUrl.value}`)
        .map((response) => {
          console.log(response.toString());
          console.log(response.json());
          return <SosCapabilities>(response.json() || {type: '', message: ''});
        })
        .catch((errorResponse: Response) => this.handleError(errorResponse));
    }

    observable.subscribe(
      (response => {
        this.loading = false;
        this.sosCapabilities = response;

        console.log(this.sosCapabilities);
        // again... REALLY?! ARE YOU FUCKING KIDDING ME??!?!?!
        // see https://stackoverflow.com/questions/39681674/use-disable-with-model-driven-form
        if (this.sosCapabilities.featuresOfInterest && this.sosCapabilities.featuresOfInterest.length > 0) {
          this.configurationForm.get('featureOfInterest').enable();
        } else {
          this.configurationForm.get('featureOfInterest').disable();
        }

        if (this.sosCapabilities.offerings && this.sosCapabilities.offerings.length > 0) {
          this.configurationForm.get('offering').enable();
        } else {
          this.configurationForm.get('offering').disable();
        }

        if (this.sosCapabilities.observedProperties && this.sosCapabilities.observedProperties.length > 0) {
          this.configurationForm.get('observedProperty').enable();
        } else {
          this.configurationForm.get('observedProperty').disable();
        }

        if (this.sosCapabilities.procedures && this.sosCapabilities.procedures.length > 0) {
          this.configurationForm.get('procedure').enable();
        } else {
          this.configurationForm.get('procedure').disable();
        }

        this.notificationService.addNotification(response);
      }),
      (error => {
        this.loading = false;
        this.notificationService.addErrorResultNotification(error);
      })
    );
  }

  onFromDateChanged(event: any) {
    console.log(event);
    this.configurationForm.get('fromDate').setValue(event);
  }

  onToDateChanged(event: any) {
    console.log(event);
    this.configurationForm.get('toDate').setValue(event);
  }

  private buildForm() {
    this.configurationForm = this.fb.group({
      timeseriesName: [this.timeseries.timeseriesName, [ValidatorsSacGwh.nonEmpty]],
      sosUrl: [this.timeseries.sosUrl, [ValidatorsSacGwh.nonEmpty, ValidatorsSacGwh.isHttpUrl]],
      offering: {
        value: this.timeseries.offering,
        disabled: true
      },
      // OK, this must be the stupidest way to have implemented that on Angular side.
      // see https://stackoverflow.com/questions/39681674/use-disable-with-model-driven-form
      // I mean really?!?! WHAT THE ACTUAL FUCK?! Why can't I put a function here?! Think about that later...
      procedure: {
        value: this.timeseries.procedure,
        disabled: true
      },
      featureOfInterest: {
        value: this.timeseries.featureOfInterest,
        disabled: true
      },
      observedProperty: {
        value: this.timeseries.observedProperty,
        disabled: true
      },
      fromDate: [this.timeseries.fromDate],
      toDate: [this.timeseries.toDate]
    });

    this.formErrors = {
      timeseriesName: '',
      sosUrl: '',
      offering: '',
      procedure: '',
      featureOfInterest: '',
      observedProperty: ''
    };

    this.validationMessages = {
      timeseriesName: {
        nonEmpty: 'Name must not be empty / all spaces.'
      },
      sosUrl: {
        nonEmpty: 'SOS Url must not be empty / all spaces.',
        isHttpUrl: 'SOS Url must be a http(s) URL.'
      }
    };

    this.configurationForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  /**
   *
   * @param errorResponse
   * @returns {any}
   */
  private handleError(errorResponse: Response) {
    console.log(errorResponse);
    this.loading = false;

    if (errorResponse.headers.get('content-type') && errorResponse.headers.get('content-type').startsWith('text/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText} while querying backend: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResult.details});
    } else if (errorResponse.status === 0) {
      let message: String = `Unknown response status. Are you connected to the backend?`;
      return Observable.throw(<IErrorResult>{message: message});
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResponse.text()});
    }
  }
}
