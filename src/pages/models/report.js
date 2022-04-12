import { 
    getReportData
} from '../services/reportService';
import { getAlarmAnalyze } from '../services/alarmService';
import moment from 'moment';
const date = new Date();
const initialState = {
    // currentDate:moment(date).subtract(1,'months'),
    currentDate:moment(date),
    isLoading:true,
    reportInfo:{},
};

export default {
    namespace:'report',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        *cancelAll(action, { put }){
            yield put({ type:'reset'});
        },
        *initReport(action, { put, select, call, all }){
            let { resolve, reject } = action.payload || {};
            yield put({ type:'user/toggleTimeType', payload:'2'});
            yield put.resolve({ type:'gateway/fetchCompanyTree'});
            yield put({ type:'fetchReport', payload:{ resolve, reject }});
        },
        *fetchReport(action, { put, select, call, all }){
            let { gateway:{ currentCompany }, report:{ currentDate }} = yield select();
            let { resolve, reject } = action.payload || {};
            yield put({ type:'toggleLoading'});
            let [data] = yield all([
                call(getReportData, { company_id:currentCompany.key, begin_date:currentDate.startOf('month').format('YYYY-MM-DD'), end_date:currentDate.endOf('month').format('YYYY-MM-DD') }),
                put.resolve({ type:'alarm/fetchAlarmAnalyze', payload:{ company_id:currentCompany.key, currentDate }})
            ]);
            if ( data.data && data.data.code === '0'){
                yield put({ type:'getReportResult', payload:{ data:data.data.data }});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        }
    },
    
    reducers:{    
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        getReportResult(state, { payload:{ data }}){
            return { ...state, reportInfo:data, isLoading:false };  
        },
        getMachs(state, { payload:{ data }}){
            return { ...state, ruleMachs:data };
        },
        setDate(state, { payload }){
            return { ...state, currentDate:payload };
        },
        reset(state){
            return initialState;
        } 
    }
}


