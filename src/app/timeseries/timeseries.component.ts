import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Timeseries, TimeseriesConfiguratorModalComponent, SosCapabilities } from './';
import { isNullOrUndefined } from 'util';

// TODO should we import that on module level?
// import * as Plotly from 'plotly.js';
let Plotly = require('plotly.js/dist/plotly.js');
let FileSaver = require('file-saver/FileSaver.js');

// import { saveAs } from 'file-saver/FileSaver';

import * as moment from 'moment-timezone';
import { NotificationService } from '../notifications/notification.service';
import { Observable } from 'rxjs/Observable';

import { Http, Response, ResponseContentType } from '@angular/http';
import { IErrorResult } from '../search/result';
import { PORTAL_API_URL } from '../in-app-config/app.tokens';

@Component({
  selector: 'app-sac-gwh-timeseries',
  templateUrl: 'timeseries.component.html',
  styleUrls: ['timeseries.component.css'],
})


export class TimeseriesComponent implements OnInit {
  @ViewChild('timeseriesConfiguratorRef') public modal: TimeseriesConfiguratorModalComponent;

  timeseries: Timeseries[];
  capabilities: SosCapabilities[];

  isLoading = false;

  layout = {
    // title: 'Title of the Graph',
    title: false,
    showlegend: true,
    xaxis: {
      title: 'time of measurement',
      type: 'date',
      hoverformat: '%Y-%m-%d %X',
      domain: [0, 0.9]
    },
    margin: {
      l: 50,
      r: 50,
      b: 50,
      t: 50,
      pad: 4
    }
  };

  options: any;

  /**
   * construtor with injected services
   *
   * @param portalApiUrl
   * @param notificationService
   * @param http
   */
  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private notificationService: NotificationService,
              private http: Http) {
  }

  /**
   * OnInit is called on component initialization
   */
  ngOnInit() {
    console.log('ngOnInit TimeseriesComponent');

    if (isNullOrUndefined(this.timeseries)) {
      this.timeseries = [];
    }

    Plotly.newPlot('plotly', this.timeseries.map((ts) => ts.data), this.layout, this.options);
  }

  /**
   * Opens the configuration dialog for the time series.
   * @param event
   * @param index
   */
  openTimeseriesConfigurator(event: any, index: number) {

    this.modal.showModal(this.timeseries[index], (ts) => {
      // when null then editing was cancelled. Normally the callback does not get called but just to be sure.
      if (!isNullOrUndefined(ts)) {
        this.isLoading = true;
        this.loadTimeseriesData(ts).subscribe(
          (timeseries) => {
            this.isLoading = false;
            // figure out, if we need a new axis
            timeseries.data.yaxis = this.determineOrCreateYAxis(timeseries.uom);
            if (index < 0) {
              this.timeseries.push(timeseries);
              // this.capabilities.push(capa);

              Plotly.addTraces('plotly', timeseries.data);
              Plotly.relayout('plotly', this.layout);
              /*
               Plotly.purge('plotly');
               Plotly.newPlot('plotly', this.timeseries.map((ts)=> ts.data), this.layout);
               */
            } else {
              console.log('updating timeseries');
              this.timeseries[index] = timeseries;
              Plotly.purge('plotly');
              Plotly.newPlot('plotly', this.timeseries.map((t) => t.data), this.layout);
            }
          },
          (error) => {
            this.isLoading = false;
            console.log(error);
            this.notificationService.addErrorResultNotification({
              message: `Error while loading data for ${ts.timeseriesName}: ${error.message}`, details: error.details
            });
          }
        );
      }
    });

    event.stopPropagation();
  }

  /**
   * deletes a trace from the chart
   * @param index
   */
  deleteTimeseries(index: number) {
    console.log(`deleting ${index}`);
    this.timeseries.splice(index, 1);
    Plotly.deleteTraces('plotly', index);
  }

  exportTimeseries(index: number, responseFormat: string) {
    if (!isNullOrUndefined(this.timeseries[index])) {
      // let requestCapa = this.capabilities[index];
      // if (!(requestCapa.responseFormats.filter(elem => elem === 'http://www.opengis.net/waterml/2.0').length > 0)) {
      //   console.log('WaterMl2 not in SosCapa RepsosneFormats');
      // }
      let requestTs = this.timeseries[index];
      requestTs.responseFormat = responseFormat;
      requestTs.data.data = {};
      console.log(`exporting ${JSON.stringify(requestTs)}`);
      this.exportTimeseriesData(requestTs).subscribe(
        response => {
          const contentType: string = response.headers.get('content-type');
          const filename = response.headers.get('x-filename');
          const blob = new Blob([response._body], { type: contentType });
          FileSaver.saveAs(blob, filename);

          // let url = window.URL.createObjectURL(blob);
          // window.open(url);
        },
        (error) => {
          this.isLoading = false;
          console.log(error);
          this.notificationService.addErrorResultNotification({
            message: `Error while requesting Export for ${requestTs.timeseriesName}: ${error.message}`,
            details: error.details
          });
        }
      );
    }
  }

  /**
   * Determines which yaxis to use for a given unit of measurement (uom). It will create the axis in the global layout
   * object, if there is none found and return the 'name'.
   * @param uom
   * @returns {string}
   */
  private determineOrCreateYAxis(uom: String): String {
    let yAxisKeys = Object.keys(this.layout).filter((k) => k.indexOf('yaxis') === 0);

    let yAxisName = yAxisKeys.filter((v) => this.layout[v].title === uom)
      .map((v) => 'y' + v.substring(5))[0];

    if (!yAxisName) {
      console.log(`Creating new axis for ${uom}`);
      // just in case there is no yaxis so far we need the key "yaxis" without any number.
      let yAxisNumber = yAxisKeys.length + 1;

      let yAxisBase = {
        title: uom,
      };

      let yAxisExtras = (yAxisNumber < 2) ? {} : {
        anchor: 'free',
        overlaying: 'y',
        side: 'right',
        position: 0.9 + (yAxisNumber - 2) * 0.1
      };

      yAxisName = 'y' + ((yAxisNumber > 1) ? yAxisNumber : '');
      this.layout['yaxis' + ((yAxisNumber > 1) ? yAxisNumber : '')] = Object.assign(yAxisBase, yAxisExtras);
      console.log(yAxisName);
      console.log(this.layout);
    }
    return yAxisName;
  }

  /**
   * Loads time series data from backend and returns an observable.
   *
   * @param ts
   * @returns {any}
   */
  private loadTimeseriesData(ts: Timeseries): Observable<Timeseries> {
    // we get that from sos observations!
    let tsObservable = this.http.post(`${this.portalApiUrl}/sos/timeseries`, ts)
      .map((response) => {
        console.log(response.toString());
        console.log(response.json());
        ts = <Timeseries>response.json();
        ts.fromDate = moment(ts.fromDate).toDate();
        ts.toDate = moment(ts.toDate).toDate();
        return ts;
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));

    return tsObservable;
  }

  private exportTimeseriesData(ts: Timeseries): Observable<any> {
    // we get that from sos observations!
    let tsObservable = this.http.post(`${this.portalApiUrl}/sos/timeseries/export`, ts, { responseType: ResponseContentType.Blob })
      .map((response) => {
        console.log(response.headers.toJSON());
        // return new Blob([response.blob()], { type: 'application/octet-stream' });
        return response;
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));

    return tsObservable;
  }

  /**
   *
   * @param error
   * @returns {any}
   */
  private handleError(errorResponse: Response) {
    console.log(errorResponse);
    this.isLoading = true;

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
