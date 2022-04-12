import request from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

// 新建企业
export function getCompanyList(data={}) {
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getcompany', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function updateCompany(data={}) {
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/updatecompany', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function delCompany(data={}) {
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/deletecompany', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function addCompany(data={}) {
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/createcompany', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getUserList(data={}) {
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/getuserlist', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function createUser(data={}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/adduser', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        });
}

export function editUser(data={}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/edituser', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        });
}

export function deleteUser(data={}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/deluser', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        });
}

export function updatePassword(data={}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/index/updateuserpw', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        });
}


export function getUserRegion(data={}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/getuserregion', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        });
}

export function setUserRegion(data={}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/user/setuserregion', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        });
}

// 获取公司所有计量区域
export function getAllRegions(data={}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/field/getfieldattrtree', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        });
}




