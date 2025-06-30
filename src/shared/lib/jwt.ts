import { jwtDecode } from 'jwt-decode'

export type JwtPayload = {
  userId: string
  role: string
}

export type DecodedJwtToken = {
  payload: JwtPayload
  iat: number
  exp: number
  sub: string
}

export const decodeToken = (token: string) => {
  try {
    console.log('Token decoded...')
    return jwtDecode(token) as DecodedJwtToken
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}
