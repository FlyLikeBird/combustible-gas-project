import { 
    getPageIndex,
    getCompanyTree,
    getDeviceModel, getGasCompanys, getGateways, addGateway, updateGateway, deleteGateway, 
    getDevices, addDevice, updateDevice, delDevice,
    getDeviceRecord
} from '../services/gatewayService';
const initialState = {
    treeLoading:true,
    treeData:[],
    sourceTreeData:{},
    // 企业树状结构的当前节点，值为 省|市|区|企业终端
    currentNode:{},
    companyList:[],
    currentCompany:{},
    gasCompanys:[],
    activeKey:'gateway',
    sceneType:0,
    gatewayModelList:[],
    deviceModelList:[],
    networkModelList:[],
    gatewayList:[],
    currentGateway:{},
    isLoading:true,
    currentPage:1,
    total:0,
    deviceList:[],
    recordList:[],
    monitorInfo:{}
}

export default {
    namespace:'gateway',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *fetchIndex(action, { call, put }){
            yield put.resolve({ type:'fetchCompanyTree', payload:{ keepNode:{ key:'zh' }} });
            let { data } = yield call(getPageIndex);
            if ( data && data.code === '0'){
                yield put({ type:'getPageIndexResult', payload:{ data:data.data }});
            } 
        },
        *initGateway(action, { put, call, all }){
            yield put.resolve({ type:'fetchCompanyTree' });
            yield all([
                put({ type:'fetchModel', payload:{ is_gateway:1 }}),
                put({ type:'fetchModel', payload:{ is_gateway:0 }}),
                put({ type:'fetchModel', payload:{ is_gateway:0, is_network:1 }}),
                put({ type:'region/fetchManagerList'}),
                put({ type:'fetchGasCompanys'}),
                put({ type:'fetchGateway'}),
                put({ type:'fetchDevices'})
            ])
        },
        *fetchCompanyTree(action, { put, call, select }){
            let { gateway:{ treeData, sourceTreeData }} = yield select();
            let { single, keepNode, forceUpdate } = action.payload || {};
            if ( !treeData.length || forceUpdate ){
                yield put({ type:'toggleTreeLoading'});
                let { data } = yield call(getCompanyTree);
                if ( data && data.code === '0'){
                    yield put({ type:'getCompanyTreeResult', payload:{ data:data.data, single, keepNode }});
                }
            } else {
                // 更新缓存里的树状图结构
                yield put({ type:'getCompanyTreeResult', payload:{ data:sourceTreeData, single, keepNode } });
            }
        },
        *fetchModel(action, { put, call, select }){
            let { is_gateway, is_network } = action.payload || {};
            let { data } = yield call(getDeviceModel, { is_gateway, is_network });
            if ( data && data.code === '0'){
                if ( is_gateway === 1 ) {
                    yield put({ type:'getGatewayModelResult', payload:{ data:data.data }});
                } else if ( is_network === 1 ) {
                    yield put({ type:'getNetworkModelResult', payload:{ data:data.data }});
                } else {
                    yield put({ type:'getDeviceModelResult', payload:{ data:data.data }});
                }
            }
        },
        *fetchGasCompanys(action, { put, call, select }){
            let { data } = yield call(getGasCompanys);
            if ( data && data.code === '0'){
                yield put({ type:'getGasCompanysResult', payload:{ data:data.data }});
            }
        },
        *fetchGateway(action, { put, call, select }){
            try {
                let { user:{ userInfo, company_id }, gateway:{ sceneType, gatewayList, currentNode }} = yield select();
                let { keyword, currentPage } = action.payload || {};
                currentPage = currentPage || 1;   
                let obj = { page:currentPage, pagesize:14 };
                if ( sceneType ){
                    obj['scene_type'] = sceneType;
                }
                if ( userInfo.agent_id ){
                    obj['agent_id'] = userInfo.agent_id;
                    if ( currentNode.type === 'province') {
                        obj['province'] = currentNode.title;
                    }
                    if ( currentNode.type === 'city') {
                        obj['city'] = currentNode.title;
                    }
                    if ( currentNode.type === 'area') {
                        obj['area'] = currentNode.title;
                    }
                    if ( currentNode.type === 'company') {
                        obj['company_id'] = currentNode.key;
                    }
                } else {
                    // 企业账号
                    obj['company_id'] = company_id;
                }          
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getGateways, obj);
                if ( data && data.code === '0'){
                    yield put({ type:'getGatewaysResult', payload:{ data:data.data, currentPage, total:data.count }});
                }              
            } catch(err){
                console.log(err);
            }  
        },
        *addGatewayAsync(action, { put, call, select }){
            try {
                let { values, resolve, reject, forEdit } = action.payload || {};
                let { user:{ userInfo, company_id }, gateway:{ currentNode }} = yield select();  
                if ( !userInfo.agent_id ) {
                    values['company_id'] = company_id;     
                }
                let { data } = yield call( forEdit ? updateGateway : addGateway, values );
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGateway' });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
           
        },
        *delGatewayAsync(action, { put, call, select }){
            try {
                let { user:{ company_id }} = yield select();
                let { resolve, reject, mach_id } = action.payload || {};
                let { data } = yield call(deleteGateway, { company_id, mach_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchGateway' });
                    yield put({ type:'fetchDevices'});
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },      
        // 探测器设备
        *fetchDevices(action, { select, put, call }){
            let { user:{ userInfo, company_id }, gateway:{ sceneType, currentNode }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            let obj = { page:currentPage, pagesize:14 };
            if ( sceneType ){
                obj['scene_type'] = sceneType;
            }
            if ( userInfo.agent_id ){
                obj['agent_id'] = userInfo.agent_id;
                if ( currentNode.type === 'province') {
                    obj['province'] = currentNode.title;
                }
                if ( currentNode.type === 'city') {
                    obj['city'] = currentNode.title;
                }
                if ( currentNode.type === 'area') {
                    obj['area'] = currentNode.title;
                }
                if ( currentNode.type === 'company') {
                    obj['company_id'] = currentNode.key;
                }
            } else {
                // 企业账号
                obj['company_id'] = company_id;
            }
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getDevices, obj);
            if ( data && data.code === '0'){
                yield put({ type:'getDevicesResult', payload:{ data:data.data, currentPage, total:data.count }});
            }
        },      
        *addDeviceAsync(action, { put, select, call }){
            let { user:{ userInfo, company_id }, gateway:{ currentNode }} = yield select();
            let { values, resolve, reject, forEdit } = action.payload || {};
            if ( !userInfo.agent_id ) {
                values['company_id'] = company_id;     
            }
            values['gateway_id'] = values['gateway_id'] === 0 ? null : values['gateway_id'];
            let { data } = yield call( forEdit ? updateDevice : addDevice, values);
            if ( data && data.code === '0'){
                yield put({ type:'fetchDevices' });
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *delDeviceAsync(action, { put, select, call }){
            let { resolve, reject, mach_id } = action.payload || {};
            let { data } = yield call(delDevice, { mach_id });
            if ( data && data.code === '0'){
                yield put({ type:'fetchDevices' });
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *fetchDeviceRecord(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { resolve, reject, mach_id, type } = action.payload || {};
            let { data } = yield call(getDeviceRecord, { company_id, mach_id, type });
            if ( data && data.code === '0'){
                yield put({ type:'getRecordResult', payload:{ data:data.data }});
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleTreeLoading(state){
            return { ...state, treeLoading:true };
        },
        getPageIndexResult(state, { payload:{ data }}){
            let infoList = [];
            infoList.push({ title:'用户数', value:data.info.totalCompany || 0, unit:'个' });
            infoList.push({ title:'终端数量', value:data.info.totalMach || 0, unit:'个' });
            infoList.push({ title:'告警设备', value:data.info.warningMach || 0, unit:'个', color:'#fd0606' });
            infoList.push({ title:'总告警数', value:data.info.warningCnt || 0, unit:'件', color:'#f2b949' });
            data.infoList = infoList;
            return { ...state, monitorInfo:data };
        },
        getCompanyTreeResult(state, { payload:{ data, single, keepNode }}){
            let result = [], companyList = [];
            formatTreeData(data, result, companyList, single);
            // single模式时节点初始状态为公司节点，选择树结构的根节点
            return { ...state, treeData:result, sourceTreeData:data, currentNode: keepNode && keepNode.key ? keepNode : single ? companyList.length ? companyList[0] : {} : result && result.length ? result[0] : {}, companyList, currentCompany:companyList && companyList.length ? companyList[0] : {}, treeLoading:false };
        },
        // 筛选树结构
        setTree(state, { payload:{ keyword, single }}){
            let prevTreeData = [], result = [], prevCompanyList = [], companyList = [];
            formatTreeData(state.sourceTreeData, prevTreeData, prevCompanyList, single);
            if ( keyword ){
                getNewTree(prevTreeData, result, keyword );
                getNodeCompanys(result, companyList);
            } else {
                result = prevTreeData;
                companyList = prevCompanyList; 
            }
            return { ...state, treeData:result, currentNode: single ? companyList && companyList.length ? companyList[0] : {} : result && result.length ? result[0] : {} }
        },
        setTreeByUserType(state, { payload:{ userType }}){
            let prevTreeData = [], result = [];
            formatTreeData(state.sourceTreeData, prevTreeData, [], false);
            filterUserType(prevTreeData, result, userType);          
            return { ...state, treeData:result, currentNode:{ type:'user' } };
        },
        getGatewayModelResult(state, { payload:{ data }}){
            return { ...state, gatewayModelList:data };
        },
        getNetworkModelResult(state, { payload:{ data }}){
            return { ...state, networkModelList:data };
        },
        getDeviceModelResult(state, { payload:{ data }}){
            return { ...state, deviceModelList:data };
        },
        setCompany(state, { payload:{ company_id }}){
            let temp = state.companyList.filter(i=>i.key === company_id )[0];
            return { ...state, currentCompany:temp || {}};
        },
        setActiveKey(state, { payload }){
            return { ...state, activeKey:payload };
        },
        toggleCurrentNode(state, { payload }){
            return { ...state, currentNode:payload };
        },
        setSceneType(state, { payload }){
            return { ...state, sceneType:payload }; 
        },
        getGasCompanysResult(state, { payload:{ data }}){
            return { ...state, gasCompanys:data };
        },
        getGatewaysResult(state, { payload:{ data, currentPage, total }}){
            let { gateways } = data;
            return { ...state, gatewayList:gateways, isLoading:false, currentPage, total };
        },
        getDevicesResult(state, { payload:{ data, currentPage, total }}){
            let { machs } = data;
            return { ...state, deviceList:machs, isLoading:false, currentPage, total };
        },
        
        toggleGateway(state, { payload }){
            return { ...state, currentGateway:payload };
        },
        getRecordResult(state, { payload :{ data }}){
            return { ...state, recordList:data };
        },
        resetMonitorInfo(state){
            return { ...state, monitorInfo:{}};
        },
        reset(state){
            return initialState;
        }
    }
}
// "data": {
//     "广东省": {
//         "惠州市": {
//             "仲恺高新区": [
//                 {
//                     "title": "测试燃气监测企业",
//                     "key": 44
//                 }
//             ]
//         }
//     }
// },
function formatTreeData(data, result, companyList, single){
    if ( !data ) return;
    Object.keys(data).forEach(province=>{
        let provinceData = {};
        provinceData.title = province;
        
        provinceData.key = province;
        provinceData.type = 'province';
        provinceData.children = [];
        provinceData.disabled = single ? true : false;
        Object.keys(data[province]).forEach(city=>{
            let cityData = {};
            cityData.title = city;
            cityData.key = city;
            cityData.type = 'city';
            cityData.disabled = single ? true : false;
            cityData.children = [];
            // 考虑直辖市两个层级的情况，此时data[province][city]为数组
            if ( data[province][city].length ) {
                cityData.children = data[province][city].map(item=>{
                    // 汇总所有企业终端用户
                    companyList.push(item);
                    return { ...item, type:'company' };
                });
            } else {
                Object.keys(data[province][city]).forEach(area=>{
                    let areaData = {};
                    areaData.title = area;
                    areaData.key = area;
                    areaData.type = 'area';
                    areaData.disabled = single ? true : false;
                    areaData.children = data[province][city][area].map(item=>{
                        // 汇总所有企业终端用户
                        companyList.push(item);
                        return { ...item, type:'company' };
                    });
                    cityData.children.push(areaData);
                });
            }
            provinceData.children.push(cityData);
        });
        result.push(provinceData);
    });
}


function getNewTree(data, result, keyword ) {
    data.forEach(item=>{
        if ( keyword && item.title.includes(keyword)) {
            result.push(item);
            return ;
        } else {
            if ( item.children && item.children.length ){
                getNewTree(item.children, result, keyword );
            }
        }
    })
}

function getNodeCompanys(data, companyList){
    data.forEach(item=>{
        if ( item.type === 'company') {
            companyList.push(item);
        }
        if ( item.children && item.children.length ) {
            getNodeCompanys(item.children, companyList);
        }
    })
}

function filterUserType(data, result, userType){
    data.forEach(item=>{
        if ( item.combust_type === userType ) {
            result.push(item);
        }
        if ( item.children && item.children.length ){
            filterUserType(item.children, result, userType);
        }
    })
}
