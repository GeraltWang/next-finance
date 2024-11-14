import type { JwtVariables } from 'hono/jwt'
import type { User } from '@prisma/client'

export type Variables = {
	JWT: JwtVariables<Pick<User, 'id' | 'email'>>['jwtPayload']
	USER: Pick<User, 'id' | 'email'>
}

/**
 * Define your environment variables here
 *
 * Access these in your API (fully type-safe):
 * @see https://hono.dev/docs/helpers/adapter#env
 */
export type Bindings = {
	DATABASE_URL: string
	NEXT_PUBLIC_URL: string
	WEBHOOK_SECRET: string
	JWT_SECRET: string
}
