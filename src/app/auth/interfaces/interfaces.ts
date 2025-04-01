export interface AuthResponse {
    ok: boolean,
    uid?:string,
    name?:string,
    email?:string,
    token?:string,
    msdg?:string
}

export interface Usuario {
    uid:string,
    name:string,
    email?:string
}