

## Stack
- Nextjs - 14.0.4
- TypeScript
- tailwind css
- shadcn - components (native support Tailwind) -- there is wizard to run @ 7:00
- 

## install
- uploadthing and uploadthing/react
- cleark @24:25 --- 
    @27:00add mroe social connections
- svix package to enable webhook for clerk

## Features
- Authentication w/ Clerk auth
    SignIn, SignOut, UserButton (manage account)
- Create Event
- Order details
- Search event
- Responsive
- Stripe - payment processing
- Upload file

## extention
- Tailwind css plugin --- inline fold, etc
- 


##  Services to sign up
- Clerk
- Mongo DB
    Mongoose
- Enable webhook for cleark portal
- uploadthing.com (similar to S3 bucket but simpler.  it's only authorized to your server)

## Serverless routes by Nextjs
- Mongoose cached connection


## Run the server
npm run dev


## Structure
/app
    /(auth)
        /(sing-in)
            /[[...sign-in]]
               
        /(sign-out)
            /[[...sign-out]]
        Layout
    /(root)
        layout --- Header & Footer go here
        page -- this is the main content 
    layout
    /components/
        /shared/
            Footer
            Header
            NavItem

middleware.ts ----- clerk public routes definitions
               add ignored routes @28:00










