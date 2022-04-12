import request, { requestImg } from '../utils/request';
import { translateObj } from '../utils/translateObj';
import { apiToken } from '../utils/encryption';

export function getPageIndex(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/home', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getCompanyTree(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getcompanytree', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getDeviceModel(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getmodel', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}
export function getGasCompanys(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getcombustcompany', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getGateways(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getgateway', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getDeviceRecord(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getmaintainrecord', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/addgateway', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/updategateway', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function deleteGateway(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/deletegateway', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function getDevices(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/getmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function addDevice(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/addmach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function updateDevice(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/updatemach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}

export function delDevice(data = {}){
    let token = apiToken();
    data.token = token;
    let str = translateObj(data);
    return request('/combust/deletemach', { 
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:str
        }); 
}


