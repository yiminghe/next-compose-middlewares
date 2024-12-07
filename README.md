# next-compose-middlewares
- Using koa style middlewares inside nextjs
- Unified request/response context(express api) across Page and Route/Action
- SetCookie/clearCookie both inside Page and Route/Action
- Easily access request/response context between components inside Page and functions inside Route/Action 

[![NPM version][npm-image]][npm-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]
![Build Status](https://github.com/yiminghe/next-compose-middlewares/actions/workflows/ci.yaml/badge.svg)
[![next-compose-middlewares](https://img.shields.io/endpoint?url=https://cloud.cypress.io/badge/simple/5v7p13/main&style=flat&logo=cypress)](https://cloud.cypress.io/projects/5v7p13/runs)

[npm-image]: http://img.shields.io/npm/v/next-compose-middlewares.svg?style=flat-square
[npm-url]: http://npmjs.org/package/next-compose-middlewares
[coveralls-image]: https://img.shields.io/coveralls/yiminghe/next-compose-middlewares.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yiminghe/next-compose-middlewares?branch=main
[node-image]: https://img.shields.io/badge/node.js-%3E=_18.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/next-compose-middlewares.svg?style=flat-square
[download-url]: https://npmjs.org/package/next-compose-middlewares


## demo

```
pnpm i
npm run dev
```

## docs

[Docs](https://github.com/yiminghe/next-compose-middlewares/blob/main/docs/index.md)

## Usage

### nextjs middleware
`src/middleware.ts`

```js
export { middleware } from 'next-compose-middlewares/middleware';
```

### extends type

```ts
declare module 'next-compose-middlewares' {
  interface NextContext {
    user: string;
  }
}
```

### page
`src/app/page.tsx`

```js
import React from 'react';
import { withPageMiddlewares, getNextContext } from 'next-compose-middlewares';

export default withPageMiddlewares([
  async (context, next) => {
    context.user = 'test';
    await next();
  }])(
  async () => {
    const { user } = getNextContext();
    return (
      <>
        <p>{user}</p>
      </>
    );
  },
);
```

### action
`src/action/getUser.ts`

```js
import { withActionMiddlewares, getNextContext } from 'next-compose-middlewares';

export default withActionMiddlewares([
  async (context, next) => {
    context.user = 'test';
    await next();
  }])(
  async () => {
    const { user } = getNextContext();
    return user;
  },
);
```

### route
`src/app/get/route.ts`

```js
import { withRouteMiddlewares,getNextContext } from 'next-compose-middlewares';

export const GET = withRouteMiddlewares([
  async (context, next) => {
    context.user = 'test';
    await next();
  }])(
  async () => {
    const { user, res } = getNextContext();
    res.json({ user });
  },
);
```

### nginx

```
location /rewrite {
    proxy_set_header X-Forwarded-URI $request_uri;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Host $host:$server_port;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:3000/dynamic;
    proxy_http_version 1.1;
    # Disable buffering for streaming support
    proxy_buffering off;
    proxy_set_header X-Accel-Buffering no;
}
```