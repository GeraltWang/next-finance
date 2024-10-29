import type { JwtVariables } from 'hono/jwt'

export type Variables = JwtVariables<{ id: string; email: string }>

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
