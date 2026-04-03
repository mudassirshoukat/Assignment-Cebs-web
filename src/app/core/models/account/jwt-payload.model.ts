export interface JwtPayloadModel {
    // Standard claims
    aud: string; // Audience
    iss: string; // Issuer
    exp: number; // Expiration time (seconds since epoch)
    sub: string; // Subject (User ID/GUID)
    email: string; // User email
    iat: number; // Issued at time
    nbf: number; // Not before time

    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}
