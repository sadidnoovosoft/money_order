### 1) Register Customer api

- URL: POST `/api/auth/register`

- Query Params (key-value pairs) (optional)
    - {}

- Request Body (json) (optional)
 ```json
  {
    "username": "admin",
    "email": "admin@email.com",
    "password": "admin"
  }
  ```
  
- Response
 ```json
   {
     "status": "success",
     "message": "User registered successfully!"
   }
   ```

### 2) Login api

- URL: POST `/api/auth/login`

- Query Params (key-value pairs) (optional)
  - {}

- Request Body (json) (optional)
 ```json
  {
    "email": "admin@email.com",
    "password": "admin"
  }
  ```

- Response

 ```json
  {
    "message": "Login successful",
    "username": "admin",
    "email": "admin@email.com"
  }
  ```
  Cookies
 ```json
   {
     "access_token": "eyJ1OTQwNjM5ImV4cCI6MTY5NDA2NzUwNX0.ahj6zc23ego5wclHr5RlBJAdCOqch79ouAz_GU4qQiU"
   }
  ```

### 3) Get customers api

- URL: GET `/api/users/customers`

- Query Params (key-value pairs) (optional)
  - {}

- Request Body (json) (optional)
  - {}

- Response
 ```json
  [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@email.com",
      "role": "customer"
    },
    {
      "id": 2,
      "username": "sadid",
      "email": "sadid@gmail.com",
      "role": "customer"
    }
  ]
   ```

### 4) Get transactions api

- URL: GET `/api/transactions`

- Query Params (key-value pairs) (optional)
 - {}

- Request Body (json) (optional)
  - {}

- Response
 ```json
  [
    {
      "id": 1,
      "type": "Deposit",
      "from_name": null,
      "to_name": "mike",
      "amount": 100
    }
  ]
   ```

### 5) Post transaction api

- URL: POST `/api/transactions`

- Query Params (key-value pairs) (optional)
- {}

- Request Body (json) (optional)
```json
  {
    "from_id": null,
    "to_id": 3,
    "type": "Deposit",
    "amount": 100
  }
```

- Response
 ```json
  {
    "status": "success", "message": "Transaction Completed!"
  }
   ```

### 6) Get Current User api

- URL: GET `/api/auth/current`

- Query Params (key-value pairs) (optional)
- {}

- Request Body (json) (optional)
  - {}

- Response
 ```json
  {
    "username": "admin",
    "email": "admin@email.com",
    "role": "admin"
  }
   ```

### 7) Get Emails api

- URL: GET `/api/emails`

- Query Params (key-value pairs) (optional)
- {}

- Request Body (json) (optional)
  - {}

- Response
 ```json
  [
    {
      "id": "79",
      "email": "sadid@gmail.com",
      "row_count": null,
      "status": "sent"
    },
    {
      "id": "80",
      "email": "sadid@gmail.com",
      "row_count": "3",
      "status": "pending"
    }
  ]
   ```

### 8) Post Email api

- URL: POST `/api/emails`

- Query Params (key-value pairs) (optional)
- {}

- Request Body (json) (optional)
  - {}

- Response
 ```json
  {
    "message": "Email added to queue!"
  }
   ```