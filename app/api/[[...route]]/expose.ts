import { Hono } from 'hono'

const app = new Hono()
  .get('/', async (c) => {
    const token = c.req.header('Authorization')
    const user = c.get('jwtPayload')

    return c.json({ data: { token, user: user }, message: 'Hello from expose' })
  })
  .get('/accounts', async (c) => {})
  .post('/add-transaction', async (c) => {
    const user = c.get('jwtPayload')

    return c.json({ data: { user }, message: 'transaction created' })
  })

export default app
