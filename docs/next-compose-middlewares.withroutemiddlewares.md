<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [next-compose-middlewares](./next-compose-middlewares.md) &gt; [withRouteMiddlewares](./next-compose-middlewares.withroutemiddlewares.md)

## withRouteMiddlewares() function

create higher order route with middlewares

**Signature:**

```typescript
export declare function withRouteMiddlewares(fns: MiddlewareFunction[]): (Route: RouteFunction) => RouteFunction;
```

## Parameters

<table><thead><tr><th>

Parameter


</th><th>

Type


</th><th>

Description


</th></tr></thead>
<tbody><tr><td>

fns


</td><td>

[MiddlewareFunction](./next-compose-middlewares.middlewarefunction.md)<!-- -->\[\]


</td><td>


</td></tr>
</tbody></table>
**Returns:**

(Route: [RouteFunction](./next-compose-middlewares.routefunction.md)<!-- -->) =&gt; [RouteFunction](./next-compose-middlewares.routefunction.md)

