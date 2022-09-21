import api from './config'

export interface InputData  {
    payload ?: any,
    url:string,
    header?:any
    token?:string
} 

export async function Get(data:InputData){

    if(typeof data.payload !=='undefined' && typeof data.payload.token !=='undefined')
        api.defaults.headers.get['Authorization'] = `Bearer ${data.payload.token}`;
    
    return await api.get(data.url)
    .then((res) => {
        return res.data;
    }).catch(error => {
        if(error.response!==undefined)
            return {status:error.response.status, msg:error.message};
        else
            return {status:404, msg:"failed"};

    });
}

export async function Post(data:InputData){
    if(data.payload.token)
        api.defaults.headers.post['Authorization'] = `Bearer ${data.payload.token}`;
    if(data.token)
        api.defaults.headers.post['Authorization'] = `Bearer ${data.token}`;

    return await api.post(data.url,data.payload)
    .then((res) => {
        return res.data;
    }).catch(error => {
        if(error.response!==undefined)
            return {status:error.response.status, msg:error.message};
        else
            return {status:404, msg:"failed"};
    });
}