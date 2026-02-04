import { AxiosResponse } from './../../node_modules/.pnpm/axios@1.13.4/node_modules/axios/index.d';
/**标准成功返回格式 */
export type ResponseType extends AxiosResponse={
    f:string
}
/**标准失败返回格式 */
export type ErrorResponseType={
    code:number,
    detail:string,
    message:string
}