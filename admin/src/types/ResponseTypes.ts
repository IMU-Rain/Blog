/**标准成功返回格式 */
export type ResponseType={
    f:string
}
/**标准失败返回格式 */
export type ErrorResponseType={
    code:number,
    detail:string,
    message:string
}