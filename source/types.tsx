/* c8 ignore start */
/**
 *@public
 */
 export type NextFunction = () => Promise<any> | void;

 /**
  *@public
  */
 export interface CookieAttributes {
   /**
    * Define when the cookie will be removed. Value can be a Number
    * which will be interpreted as days from time of creation or a
    * Date instance. If omitted, the cookie becomes a session cookie.
    */
   expires?: number | Date | undefined;
 
   maxAge?: number;
 
   /**
    * Define the path where the cookie is available. Defaults to '/'
    */
   path?: string | undefined;
 
   /**
    * Define the domain where the cookie is available. Defaults to
    * the domain of the page where the cookie was created.
    */
   domain?: string | undefined;
 
   /**
    * A Boolean indicating if the cookie transmission requires a
    * secure protocol (https). Defaults to false.
    */
   secure?: boolean | undefined;
 
   /**
    * Asserts that a cookie must not be sent with cross-origin requests,
    * providing some protection against cross-site request forgery
    * attacks (CSRF)
    */
   sameSite?: 'strict' | 'lax' | 'none' | undefined;
 }
 
 /**
  *@internal
  */
 export type ClientCookies = {
   [key: string]: CookieAttributes & { value: string };
 };
 /**
  * @public
  */
 export type NextContextRequest = {
   params: any;
   host: string;
   protocol: string;
   secure: boolean;
   url: string;
   ip: string | undefined;
   get: (k: string) => any;
   header: (k: string) => any;
   text: () => Promise<string>;
   json: () => Promise<any>;
   method: string;
   path: string;
   query: any;
   cookies: any;
   headers: any;
 };
 /**
  * @public
  */
 export type NextContextResponse = {
   clearCookie: (name: string, options?: CookieAttributes) => void;
   cookie: (name: string, value: string, options?: CookieAttributes) => void;
   append: (k: string, v: string) => void;
   set: (...args: [key: string, v: any] | [o: any]) => void;
   get: (key: string) => any;
   redirect: (r: string) => void;
   return: (id: string | symbol, r: any) => void;
   json: (j: any) => void;
   status: (s: number) => void;
 };
 /**
  * @public
  */
 export type NextContextType = 'page' | 'route' | 'action' | 'layout';
 /**
  * @public
  */
 export interface NextContext {
   type: NextContextType;
   req: NextContextRequest;
   res: NextContextResponse;
 }
 /**
  * @internal
  */
 export type NextContextResponseInternal = {
   _private: {
     return: { [id: string | symbol]: any };
     cookies?: ClientCookies;
     headers: any;
     redirect?: string;
     json?: any;
     status?: number;
   };
 } & NextContextResponse;
 /**
  * @internal
  */
 export interface NextContextInternal extends NextContext {
   res: NextContextResponseInternal;
 }
 
 /**
  *@public
  */
 export type MiddlewareFunction = (
   context: NextContext,
   next: NextFunction,
 ) => Promise<any> | void;
 /* c8 ignore stop */
 