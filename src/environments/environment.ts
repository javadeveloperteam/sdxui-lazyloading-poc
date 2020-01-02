// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  somAdminUrl: 'http://localhost:9100/servicedx-admin-service/',
  somSenderUrl: 'http://localhost:9200/servicedx-sender-service/',
  somOauthUrl: 'https://dev.servicedx.com/servicedx-oauth-server/',
  WMS_URL: 'https://dev.servicedx.com/servicedx-wms-service/',
  somSinkUrl: 'https://dev.servicedx.com/servicedx-sink-service/',
  somDefaultLanguage: 'en',
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
