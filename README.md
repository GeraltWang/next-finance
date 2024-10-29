<div style="text-align: center; margin-top: 50px;">
    <h1>Next Finance</h1>
    <img src="public/logo.svg" alt="next-finance logo">
</div>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started 🚀

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Tech Stack 🛠️

- Framework: [`React`](https://react.dev/), [`Next.js`](https://nextjs.org/)
- Styling: [`Tailwind CSS`](https://tailwindcss.com/)
- UI [`shadcn/ui`](https://ui.shadcn.com/)
- ORM: [`Prisma`](https://prisma.io/)
- API: [`hono`](https://hono.dev/)
- Authentication: [`Clerk`](https://clerk.com/)

## Apple Shortcuts

You can use the following shortcut to quickly add expenses to your account.
Before using the shortcut, you need to create a PAT token in the settings page then copy and paste it in the shortcut dictionary `Authorization` key.

- shortcut: [`Add Expense`](https://www.icloud.com/shortcuts/0bdb5dbe57b5462aaf906db47f1eda9f)

## Exposed API Documentation

### Endpoints

- All endpoints are prefixed with `/api/expose`.
- All endpoints require a valid `Bearer <your-pat-token>`token in the`Authorization` header.
- You can generate PAT token in settings page.

#### 1. Get all accounts

- **Endpoint:** `/api/expose/accounts`
- **Method:** `GET`
- **Request Headers:**

  - `Authorization`: Bearer PAT Token

- **Response:**
  ```json
  {
  	"data": [
  		{
  			"id": "string",
  			"name": "string"
  		}
  	]
  }
  ```

#### 2. Get all categories

- **Endpoint:** `/api/expose/categories`
- **Method:** `GET`
- **Request Headers:**

  - `Authorization`: Bearer PAT Token

- **Response:**

  ```json
  {
  	"data": [
  		{
  			"id": "string",
  			"name": "string"
  		}
  	]
  }
  ```

#### 3. Add a new expense

- **Endpoint:** `/api/expose/add-expense`
- **Method:** `POST`
- **Request Headers:**

  - `Authorization`: Bearer PAT Token

- **Request Body:**

  ```json
  {
  	"accountName": "string",
  	"categoryName": "string",
  	"amount": "number",
  	"payee": "string"
  }
  ```

## Learn More 📚

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel 🚀

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
