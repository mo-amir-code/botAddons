

interface SignInUserType {
    email: string
    password: string
}

interface RegisterUserType extends SignInUserType {
    fullName: string
}


export type {
    RegisterUserType,
    SignInUserType
}