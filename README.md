# stateful-heaven
This project aims to gain the most out of your centralized system implementation.

The proposed setup aims to bring any kind of data source inside `repositories` available via an API and at the same time stateful HTML, with sprinkles of HTMX

It includes as is:
- PostgreSQL as 
- Swagger live documentation
- JWT via cookies or header
- Bare HTMX implementation accomplished sending HTML snippets
- Docker deploy

This template has a working authentication page

## Fastify
A custom plugin have been made in order to _NOT immediately serialize_ the data after being processed and formatted by the `controllers`

Routes containing in the respective `RouteOption` both the controller inside the `preHandler` and a renderer function in the `handler` will result in a double route aiming to the same controller

`/api/auth/login` -> `Content-type: application/json`
`/auth/login` -> `Content-type: text/html`

### prepare()
This is achieved with the `reply.prepare()` middleware which enables you to store the finalized object inside the `.payload` attribute, tight to the `reply` native object instance
This is done in the route `preHandler`

### commit()
The asynchronus cycle continues in the `handler` which is predefined for `/api` calls. It simply sends what you stored with `.prepare()`

### html()
Otherwise in the `route` definition you specify a custom `handler` which describes what `ui` to send with the custom `reply.html()`

## Typesafe
You're still using the same _entity types_ used in the repository and controller business login development 
```
export const userInfo = (user: UserPayload) => `
  <div id="userinfo">Benvenuto, ${user.fullname}</div>
```
> That's rather sick

## Error handling
Current implementation sees non-200 responses being sent as JSON immediately in the controller, skipping the `reply.prepare()` and so the `handler`
This brings the frontend to parse the json object and capture the `.message` property.
HTMX disposes an event hook to the reception of any non-200 HTTP response.
A toast-like message may be displayed.

## Clean Architecture Design
### Data sources

> Each of these contains **types** like `entities` and **classes** like `repositories`

- core/
- web-crawler/
- http-spaceship/
- rss-feed/

### Add new entity
- DB schema
- entities & interfaces
- Database Queries to *Repositories*

### Implement entity
- HTTP Requests *Schemas*
- Business logic & Error codes in *Controllers*
- URI in *Routes*
- Optional ui methods via *Renderer* and `handler` method in *Routes* 