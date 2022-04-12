import { getLoginLog, getActionLog } from '../services/logService';

const initialState = {
    logData:{},
    logType:'',
    currentPage:1,
    total:0,
    isLoading:false,  
};

export default {
    namespace:'log',
    state:initialState,
    effects:{
        *initLog(action, { put }){
            yield put.resolve({ type:'gateway/fetchCompanyTree'});
            yield put({ type:'fetchLog'});
        },
        *fetchLog(action, {call, select, all, put}){ 
            try {
                let { user:{ company_id, userInfo }, gateway:{ currentCompany }} = yield select();
                let { currentPage, logType } = action.payload || {};
                currentPage = currentPage || 1;
                let params = { company_id:userInfo.agent_id ? currentCompany.key : company_id, page:currentPage, pagesize:12 } 
                if ( userInfo.agent_id ) {
                    params.agent_id = userInfo.agent_id;
                }
                logType = logType || 'login';
                yield put({type:'toggleLoading'});
                let { data } = yield call(
                    logType === 'login' ? getLoginLog : getActionLog,params
                );
                if ( data && data.code === '0'){
                    yield put({type:'getLoginLog', payload:{ data:data.data, total:data.count, currentPage }});
                }
            } catch(err){
                console.log(err);
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getLoginLog(state, { payload:{ data, currentPage, total }}){
            return { ...state, logData:data, currentPage, total, isLoading:false };
        },
        reset(){
            return initialState;
        }
    }
}
