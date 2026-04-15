export interface IAuthSignInReq {
    email?: string
    tel?: string
    password: string
}
export interface IAuthSignUpReq {
    email: string
    tel: string
    password: string
    name:string
lastName:string
}

export interface IAuthVerifyCodeReq {
    email: string
    code: number
}
export interface IAuthForgorPasswordReq {
    key: string
    code: number
}
export interface IAuthNewPasswordReq {
    key: string
    password: string
}
export interface IAuthResendReq {
    email:string
}