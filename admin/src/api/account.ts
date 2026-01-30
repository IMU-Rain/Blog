import useReuest from "../utils/useRequest";
type loginData={
    username:string,
    password:string
}
export function login(data:loginData){
    useReuest("post","/login",data)
}