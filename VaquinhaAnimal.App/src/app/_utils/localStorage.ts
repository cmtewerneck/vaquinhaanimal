export class LocalStorageUtils {

    // LOCAL STORAGE
    public obterUsuario() {
        return JSON.parse(localStorage.getItem('user')!);
    }

    public obterUsuarioId() {
        return JSON.parse(localStorage.getItem('user.id')!);
    }

    public salvarDadosLocaisUsuario(response: any) {
        this.salvarTokenUsuario(response.accessToken);
        this.salvarUsuario(response.userToken);
    }

    public limparDadosLocaisUsuario() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    public obterTokenUsuario(): string {
        return localStorage.getItem('token')!;
    }

    public salvarTokenUsuario(token: string) {
        localStorage.setItem('token', token);
    }

    public salvarUsuario(user: string) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    //SESSION STORAGE
    public salvarUsuarioSession(user: string) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    public salvarTokenUsuarioSession(token: string) {
        sessionStorage.setItem('token', token);
    }

    public obterTokenUsuarioSession(): string {
        return sessionStorage.getItem('token')!;
    }

    public obterUsuarioSession() {
        return JSON.parse(sessionStorage.getItem('user')!);
    }

    public obterUsuarioIdSession() {
        return JSON.parse(sessionStorage.getItem('user.id')!);
    }

    public salvarDadosLocaisUsuarioSession(response: any) {
        this.salvarTokenUsuarioSession(response.accessToken);
        this.salvarUsuarioSession(response.userToken);
    }

    public limparDadosLocaisUsuarioSession() {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    }

}