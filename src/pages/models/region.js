import { getManagerList, addManager, updateManager, delManager, sendMsg, checkMsg } from '../services/regionService';
const initialState = {
    managerList:[],
    isLoading:true,
    currentPage:1,
    total:0
}

export default {
    namespace:'region',
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
        *initManagerList(action, { put }){
            yield put.resolve({ type:'gateway/fetchCompanyTree'});
            yield put({ type:'fetchManagerList'});
        },
        *fetchManagerList(action, { put, call, select }){
            try {
                let { user:{ userInfo, company_id }, gateway:{ currentCompany }} = yield select();
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getManagerList, { company_id:userInfo.agent_id ? currentCompany.key : company_id });
                if ( data && data.code === '0'){
                    yield put({ type:'getListResult', payload:{ data:data.data, total:data.count }});
                } 
            } catch(err){
                console.log(err);
            }  
        },
        *add(action, { put, call, select }){
            try {
                let { values, resolve, reject, forEdit } = action.payload || {};
                let { user:{ userInfo, company_id }, gateway:{ currentCompany }} = yield select();       
                values['company_id'] = userInfo.agent_id ? currentCompany.key : company_id;
                let { data } = yield call( forEdit ? updateManager : addManager, values );
                if ( data && data.code === '0'){
                    yield put({ type:'fetchManagerList' });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *del(action, { put, call, select }){
            try {
                let { resolve, reject, person_id } = action.payload || {};
                let { data } = yield call(delManager, { person_id });
                if ( data && data.code === '0'){
                    yield put({ type:'fetchManagerList' });
                    if ( resolve && typeof resolve === 'function' ) resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *sendMsgAsync(action, { put, call, select }){
            let { phone } = action.payload || {};
            let { data } = yield call(sendMsg, { phone });
        },
        *checkMsgAsync(action, { put, call, select }){
            let { values, forEdit, resolve, reject } = action.payload || {};
            let { mobile, vcode } = values;
            let { data } = yield call(checkMsg, { phone:mobile, vcode });
            if ( data && data.code === '0'){
                yield put({ type:'add', payload:{ values, resolve, reject, forEdit }});
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getListResult(state, { payload:{ data, total, page } }){
            return { ...state, managerList:data, isLoading:false };
        },
        
    
        reset(state){
            return initialState;
        }
    }
}