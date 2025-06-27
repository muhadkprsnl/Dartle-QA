import { jwtDecode } from "jwt-decode"

interface TokenPayload {
    username: string
    exp: number
}

export function isTokenValid(token: string): boolean {
    try {
        const decoded = jwtDecode<TokenPayload>(token)
        const isExpired = decoded.exp * 1000 < Date.now()
        return !isExpired
    } catch (error) {
        return false
    }
}

export function getTokenPayload(token: string): TokenPayload | null {
    try {
        return jwtDecode<TokenPayload>(token)
    } catch {
        return null
    }
}
