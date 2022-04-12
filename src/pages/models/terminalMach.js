import { getMachs, getMachDetail } from '../services/terminalMachService';
import moment from 'moment';
var date = new Date();
const initialState = {
    // 所有设备类型
    typeList:[],
    currentType:{},
    // 某种具体设备
    machList:[],
    // 用于加载设备列表
    isLoading:true,
    // 用于加载设备详情
    machLoading:true,
    machDetailInfo:{},
    currentPage:1,
    total:0
}

export default {
    namespace:'terminalMach',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        // 统一管理所有action
        *init(action, { put }){
            yield put.resolve({ type:'fetchMachTypes'});
            yield put.resolve({ type:'fetchSeriesMach'});
        },
        // 统一取消所有action
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *initMachList(action, { put }){
            let { keepNode } = action.payload || {};
            yield put.resolve({ type:'gateway/fetchCompanyTree', payload:{ keepNode }});
            yield put({ type:'fetchMachList'});
        },
        *fetchMachList(action, { put, select, call }){
            try {
                let { user:{ userInfo, company_id }, gateway:{ currentNode }} = yield select();
                let { gateway_id, currentPage } = action.payload || {};
                currentPage = currentPage || 1;
                let obj = { page:currentPage, pagesize:9 };
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
                if ( gateway_id ){
                    obj['gateway_id'] = gateway_id;
                }
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getMachs, obj );   
                if ( data && data.code === '0'){
                    yield put({ type:'getMachsResult', payload:{ data:data.data, currentPage, total:data.count }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *fetchMachDetail(action, { put, select, call }){
                let { mach_id, referDate } = action.payload || {};
                yield put({ type:'toggleMachLoading'});
                let { data } = yield call(getMachDetail, { mach_id, date_time:referDate.format('YYYY-MM-DD') });
                if ( data && data.code === '0'){
                    yield put({ type:'getMachDetailResult', payload:{ data:data.data }});
                }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        toggleMachLoading(state){
            return { ...state, machLoading:true };
        },
        getMachsResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, machList:data, currentPage, total, isLoading:false };
        },
        getMachDetailResult(state, { payload:{ data }}){
            return { ...state, machDetailInfo:data, machLoading:false };
        },
        // getMachTypes(state, { payload:{ data }}){
        //     let currentType = data && data.length ? data[0] : {};
        //     data = data.filter(i=>i.key !== 'all');
        //     return { ...state, typeList:data };
        // },
        // getSeriesMach(state, { payload:{ data, currentPage, total }}){
        //     return { ...state, machList:data.meterList || [], total, currentPage, isLoading:false };
        // },
        // getMachDetail(state, { payload:{ data }}){
        //     return { ...state, machDetailInfo:data, machLoading:false };
        // },
        // toggleMachType(state, { payload }){
        //     return { ...state, currentType:payload, machList:[] };
        // },
        setCurrentMach(state, { payload }){
            return { ...state, currentMach:payload };
        },
        resetMach(state){
            return { ...state, machLoading:true, machDetailInfo:{} };
        },
        reset(state){
            return initialState;
        }
    }
}