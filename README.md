# Directus Extension upsert

As the name suggests a basic extension for incrementing fields in a single API call.

> Tested with Directus 9.22.4

## Installation

The package is published to npm:
`npm install directus-extension-upsert`

**Manual Installation**
- Download or fork the repository
- Install the requirements\
  `npm install`
- Build the extension\
  `npm run build`
- Move the result to your extension folder\
  `mv dist extensions/hooks/directus-extension-upsert`
- Restart your Directus instance

## Usages

This endpoint will intercept any `POST` requests to `/upsert/:collection` and check if the record exists and if so, update it, otherwise it will create it.


```
URL
  http://localhost:8055/upsert/:collection
Method
  POST
Headers
  Authorization: ...
  Content-Type: application/json
Body
{
    "key": {
        "key": "test2"
    },
    "body": {
      "key": "test2",
      "value": "testindddddg"
    }
}
```
**response**
```
{
    "success": true,
    "msg": "Create Success",
    "code": 201,
    "data": null
}
```

or

```
{
    "success": true,
    "msg": "Update Success",
    "code": 201,
    "data": null
}
```
