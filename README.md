# Cache API

Sample cache API using MongoDB database

# Prerequisites

1. MongoDB instance

```bash
docker run -d --name mongodb-instance -p 27017:27017 mongo
```

2. Create `.env` file containing following variables:

```.env
NODE_ENV=development

HOST=0.0.0.0
PORT=5000

MONGO_URL=mongodb://localhost:27017

# default ttl value in milliseconds
DEFAULT_TTL_MS=30000
CACHE_SIZE=5

```

# Starting the service

<br />

1. Install dependencies

```bash
npm install
```

2. Start the service

```bash
npm start
```

**Note:** Browse to `/swagger` to open swagger documentation page.


# Service endpoints

## **Create Entry**

```bash
POST /cache/{key}?ttl={ttl}
```

Creating new cache entry or update one if key exist.

### **Request params**

> **key** {required}: cache key name

> **ttl** {optional}: TTL for cache entry

### **Request example**

```bash
curl "127.0.0.1:5000/cache/100?ttl=250000" -X POST -d '{ "data": "hello" }' -H 'Content-Type: application/json'
```

### **Response example**

```json
{
  "key": "100", "data": "hello"
}
```

*Note:* if cache size is exceeded, the oldest entry is replaced with new one.

---

## **Get One**

```bash
GET /cache/{key}
```

Get cache entry by key. if entry does not exist, an entry is created with random string data for the provided key.

### **Request params**

> **key** {required}: cache key name

### **Response example:**

```json
{
  "key": "101",
  "data": "Hello, world"
}
```

---

## **Get All**

```bash
GET /cache/
```

Get all active cache entries.

### **Response example:**

```json
[
  {"key":"107","data":"klgE+7EYfyXpVOFg"},
  {"key":"103","data":"hoorey"}
]
```

---

## **Delete One**

```bash
DELETE /cache/{key}
```

Delete cache entry by key. The HTTP 204 is returned on success.

> **key** {required}: cache key name

---

## **Delete All**

```bash
DELETE /cache/
```

Delete all cache entries. The HTTP 204 is returned on success.
