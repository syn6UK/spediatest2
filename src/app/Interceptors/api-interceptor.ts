import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.

    // Clone the request and replace the original headers with
    let headerSet = req.clone({
      url: req.url.replace('http://', 'https://')
    });

    // Set the content type for post and put requests
    if(req.method !== 'get' && req.method !== 'delete'){
      headerSet = headerSet.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      })
    }

    // send cloned request with header to the next handler.
    return next.handle(headerSet);
  }
}
