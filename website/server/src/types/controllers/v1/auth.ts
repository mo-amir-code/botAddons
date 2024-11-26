

interface SignInUserType {
    email: string
    password: string
}

interface RegisterUserType extends SignInUserType {
    fullName: string
}

interface JWTTokenVerifierType {
    userId: string;
}


export type {
    RegisterUserType,
    SignInUserType,
    JWTTokenVerifierType
}