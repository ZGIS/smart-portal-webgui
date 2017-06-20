import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isNullOrUndefined } from 'util';


/**
 * Parses a URI string. All the magic shamelessly borrowed from
 * https://github.com/jhermsmeier/uri.regex who himself borrowed the regex from
 * http://jmrware.com/articles/2009/uri_regexp/URI_regex.html
 *
 * @param value
 * @returns {RegExpMatchArray|null}
 */

function parseUri(value: string): RegExpMatchArray | null {
  let uriRegExp = new RegExp('([A-Za-z][A-Za-z0-9+\\-.]*):(?:(//)(?:((?:[A-Za-z0-9\\-._~!$&\'()*+,;=:]|%[0-9A-Fa-f]{2})*)' +
    '@)?((?:\\[(?:(?:(?:(?:[0-9A-Fa-f]{1,4}:){6}|::(?:[0-9A-Fa-f]{1,4}:){5}|(?:[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:)' +
    '{4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,1}[0-9A-Fa-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){3}|(?:(?:[0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa' +
    '-f]{1,4})?::(?:[0-9A-Fa-f]{1,4}:){2}|(?:(?:[0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1,4}:|(?:(?:[0-9A' +
    '-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})?::)(?:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-' +
    '9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))|(?:(?:[0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})?::[0-9A-Fa-f]{1' +
    ',4}|(?:(?:[0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})?::)|[Vv][0-9A-Fa-f]+\\.[A-Za-z0-9\\-._~!$&\'()*+,;=:]+)\\]|(?:(?:' +
    '25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:[A-Za-z0-9\\-._~!$&\'()*+,;=' +
    ']|%[0-9A-Fa-f]{2})*))(?::([0-9]*))?((?:/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|/((?:(?:[A-Za-z0-9\\-' +
    '._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)?)|((?:[A-Za-z0-9\\-._' +
    '~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})+(?:/(?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@]|%[0-9A-Fa-f]{2})*)*)|)(?:\\?((?:[A-Za-z0-9\\-' +
    '._~!$&\'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?(?:\\#((?:[A-Za-z0-9\\-._~!$&\'()*+,;=:@/?]|%[0-9A-Fa-f]{2})*))?');

  return value.match(uriRegExp);
}

/**
 * Custom Validators.
 */
export class ValidatorsSacGwh {

  /**
   * Validator that checks if the value is filled after trim().
   */
  static nonEmpty(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return (!value || value.trim().length === 0) ?
      {'nonEmpty': true} : null;
  }

  /**
   * Validator that checks if the value is a valid URI.
   */
  static isUri(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return (!value || isNullOrUndefined(parseUri(value))) ?
      {'isUri': true} : null;
  }

  /**
   * Validator that checks if the control value is a http url.
   *
   * @param control
   * @returns {{isUri: boolean}}
   */
  static isHttpUrl(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    let match = isNullOrUndefined(value) ? null : parseUri(value);

    return (isNullOrUndefined(match)
      || match[1].indexOf('http') !== 0 // check for protocol http(s)
      || match[2] !== '//'              // check for both // after protocol
      || match[4].trim().length === 0    // check that host is given
    ) ?
      {'isHttpUrl': true} : null;
  }

  /*
   Validator that takes an argument as example.
   See more at https://github.com/angular/angular/blob/71f5b73296708014b740fb5dd0145c0599de7a19/packages/forms/src/validators.ts
   static withValue(value: number): ValidatorFn {
   return (control: AbstractControl): ValidationErrors | null => {
   const value = control.value;
   return (!value || parseFloat(value) === number) ?
   {'withValue': true}: null;
   };
   }
   */
}
