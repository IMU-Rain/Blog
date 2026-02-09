/** 标准成功返回格式 */
export type ResponseType = {
  message: string;
  data: any;
  total?: number;
  code: number;
};
/**标准失败返回格式 */
export type ErrorResponseType = {
  code: number;
  detail: string;
  message: string;
};
