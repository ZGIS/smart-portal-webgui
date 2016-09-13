import { Injectable } from '@angular/core';
import {MOCK_RESULTS} from "./mock-results";
import {Result} from "./result";

@Injectable()
export class ResultService {
  getResults(): Promise<Result[]> {
    return Promise.resolve(MOCK_RESULTS);
  }
}
