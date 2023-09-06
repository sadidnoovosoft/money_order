1) Register api

- URL: POST `/api/auth/register`

- Query Params (key-value pairs) (optional)
    - {}

- Request Body (json) (optional)
- ```json
  {
    "username": "sadid",
    "role": "admin",
    "password": "3oijemda09woesd903#$232"
  }
  ```
  
- Response
- ```json
   {
     "status": "success",
     "message": "User registered successfully!"
   }
   ```