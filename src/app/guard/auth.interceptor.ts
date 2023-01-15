import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginService } from "../services/login.service"

@Injectable()

export class AuthInterceptor implements HttpInterceptor{

    constructor(private service: LoginService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const token = this.service.getToken();

        if(token !== null){

            const authRequest = req.clone({
                headers: req.headers.set("Authorization", `Bearer ${token}` )
            })

            return next.handle(authRequest)
        }

        return next.handle(req)
    }
}