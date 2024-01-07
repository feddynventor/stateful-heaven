# stateful-heaven
This project aims to gain the most out of your centralized system implementation.

The proposed setup aims to bring any kind of data source inside `repositories` available via an API and at the same time stateful HTML, with sprinkles of HTMX

It includes as is:
- PostgreSQL as the core _state handler_
- Swagger live documentation
- JWT via cookies or Bearer header
- Bare HTMX implementation accomplished sending HTML strings
- types... and types
- Docker deploy

This template repo has a working authentication page

## Fastify
A custom plugin have been made in order to _NOT immediately serialize_ the data after being processed and formatted by the `controller`s

URIs are implemented via `RouteOption` which aims to the respective `controller`. This can be called by the main `handler` hook, so a JSON will be returned.

Alternatively both the `preHandler` and `handler` can be implemented, respectively with a `controller` and a _renderer_ function, and this will result in a double route aiming to the same controller

`/api/auth/login` -> `Content-type: application/json`

`/auth/login` -> `Content-type: text/html`

This duality logic is implemented logically in `createServer()` where all the routes are registered

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
> That's not new, but rather sick anyways

## Error handling
Current implementation sees non-200 responses being sent as JSON immediately in the controller, skipping the `reply.prepare()` and so the `handler`
This brings the frontend to parse the json object and capture the `.message` property.
HTMX disposes an event hook to the reception of any non-200 HTTP response.
A toast-like message may be displayed.

## Clean Architecture Design
### Data sources
`src/` contains `implementation/` for managing the Fastify instance, and `templates/` which (for now) contains bare HTML files

Then the backend logic:

> Each of these contains **types** like `entities` and **classes** like `repositories`

- core/
- web-crawler/
- http-spaceship/
- rss-feed/

### Add new entity
- Add _relations_ to the DB schema alongside _entity_ types
- _Database Queries_ or whatever _Fetching_ methods inside *Repositories*
- Complete with your own _Business Logic_ methods, encapsulating your class methods

### Implement entity
- HTTP Requests fields inside *Schemas*, so the *Deserializer* and *Swagger* know [so you know better]
- *Presentation Logic* with return codes in *Controllers*
- URIs in *Routes*
- Optional "UI" methods as `handler`s in *Routes* 
