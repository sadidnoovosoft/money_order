1) Register api

- URL: POST `/api/auth/register`

- Query Params (key-value pairs) (optional)
    - {}

- Request Body (json) (optional)
 ```json
  {
    "username": "sadid",
    "password": "1234"
  }
  ```
  
- Response
 ```json
   {
     "status": "success",
     "message": "User registered successfully!"
   }
   ```

2) Login api

- URL: POST `/api/auth/login`

- Query Params (key-value pairs) (optional)
  - {}

- Request Body (json) (optional)
 ```json
  {
    "username": "sadid",
    "password": "1234"
  }
  ```

- Response
 ```json
   {
     "message": "Login successful", 
     "username": "sadid"
   }
  ```
  Cookies
 ```json
   {
     "access_token": "eyJ1OTQwNjM5ImV4cCI6MTY5NDA2NzUwNX0.ahj6zc23ego5wclHr5RlBJAdCOqch79ouAz_GU4qQiU"
   }
  ```