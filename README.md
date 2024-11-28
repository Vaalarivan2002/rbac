This project is an RBAC system built using NodeJS and MongoDB. I have tried my best to apply clean coding practices. I have used JWT tokens for authentication.

Roles:
* User
* Admin
* Moderator

Available routes:
* POST localhost:3000/auth/login                -> needs username, password, role fields in the body of the request
* POST localhost:3000/auth/register             -> needs username, password, role fields in the body of the request
* POST localhost:3000/auth/logout               -> needs username field in the body of the request
* GET localhost:3000/users/user                 -> only users are allowed in this route
* GET localhost:3000/users/admin                -> only admins are allowed in this route
* GET localhost:3000/users/moderator            -> only moderators are allowed in this route

Keys for .env file: https://docs.google.com/document/d/1fXjK7jLO-elue1M3DRcFtYzFpZvvSfGSo_1JD3ny2Hs/edit?usp=sharing
