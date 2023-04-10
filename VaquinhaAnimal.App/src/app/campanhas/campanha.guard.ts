import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { LocalStorageUtils } from '../_utils/localStorage';
import { CampanhaService } from './campanha.service';

@Injectable()
export class CampanhaGuard implements CanActivate {

    localStorageUtils = new LocalStorageUtils();

    constructor(private router: Router, private campanhaService: CampanhaService, private route: ActivatedRoute){}

    canActivate(routeAc: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // if(!this.localStorageUtils.obterTokenUsuario()){
        //     this.router.navigate(['/auth/login/'], { queryParams: { returnUrl: this.router.url }});
        // }

        if(!this.localStorageUtils.obterTokenUsuarioSession()){
            this.router.navigate(['/auth/login/'], { queryParams: { returnUrl: this.router.url }});
        }

        let user = this.localStorageUtils.obterUsuarioSession();
        let claim: any = routeAc.data[0];
        
        if (claim !== undefined) {
            let claim = routeAc.data[0]['claim'];

            if (claim) {
                if (!user.claims) {
                    this.navegarAcessoNegado();
                }
                
                let userClaims = user.claims.find((x: any) => x.type === claim.nome);
                
                if(!userClaims){
                    this.navegarAcessoNegado();
                }
                
                let valoresClaim = userClaims.value as string;

                if (!valoresClaim.includes(claim.valor)) {
                    this.navegarAcessoNegado();
                }
            }
        }

        return true;  
    }

    navegarAcessoNegado() {
        this.router.navigate(['/acesso-negado']);
    }
}