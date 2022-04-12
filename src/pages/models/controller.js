import { 
    getRoomList,
    setACParams, 
    getPlanList, pushPlan, addPlan, updatePlan, delPlan,
    getTplList, copyPlanToTpl, delTpl
} from '../services/switchService';

const initialState = {
    currentRoom:{},
    selectedNodes:[],
    roomList:[],
    isLoading:true,
    powerStatus:[0,1],
    modeStatus:[1,3,4],
    // card-卡片容器模式  list-列表模式
    showMode:'card',
    currentPage:1,
    total:0,
    planList:[],
    tplList:[]
}

export default {
    namespace:'controller',
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
        *init(action, { put, select }){
            yield put.resolve({ type:'fields/init'});
            let { fields:{ currentAttr }} = yield select();
            let result = [];
            getSelectedKeys(currentAttr, result);
            yield put({ type:'setSelectedNodes', payload:result });
            yield put({ type:'fetchRoomList'});
        },
        *fetchRoomList(action, { put, select, call }){
            let { controller:{ selectedNodes, powerStatus, modeStatus }} = yield select();
            let { currentPage } = action.payload || {};
            currentPage = currentPage || 1;
            yield put({ type:'toggleLoading' });
            let { data } = yield call(getRoomList, { attr_ids:selectedNodes, power_status:powerStatus, mode_status:modeStatus, page:currentPage, page_size:12 });
            if ( data && data.code === '0'){
                yield put({ type:'getRoomListResult', payload:{ data:data.data, currentPage, total:data.count }});
            }
        },
        // 方案状态管理
        *initPlanList(action, { put }){
            yield put.resolve({ type:'gateway/fetchACList'});
            yield put({ type:'getTplSync'});
            yield put({ type:'getPlanListSync'});
        },
        *getPlanListSync(action, { put, select, call }){
            try {
                let { user:{ company_id }} = yield select();
                let { currentPage } = action.payload || {};
                currentPage = currentPage || 1;
                yield put({ type:'toggleLoading'});
                let { data } = yield call(getPlanList, { company_id, page:currentPage, page_size:12 });
                if ( data && data.code === '0'){
                    yield put({ type:'getPlanListResult', payload:{ data:data.data, currentPage, total:data.count }});
                }
            } catch(err){
                console.log(err);
            }
        },
        *setACSync(action, { put, select, call }){
            try {
                let { values, resolve, reject } = action.payload || {};
                let { mach_id, mode, on_off, wind_speed, temp, antifreeze_state } = values;
                let obj = {};
                obj.mach_id = mach_id;
                obj.mode = mode;
                obj.on_off = on_off;
                obj.wind_speed = wind_speed;
                obj.temp = temp;
                obj.antifreeze_state = antifreeze_state;
                let { data } = yield call(setACParams, obj);
                if ( data && data.code === '0'){
                    yield put({ type:'updateCurrentRoom', payload:{ data:obj }});
                    if ( resolve && typeof resolve === 'function') resolve();
                } else {
                    if ( reject && typeof reject === 'function') reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *pushPlanSync(action, { put, select, call }){
            let { resolve, reject, plan_id } = action.payload;
            let { data } = yield call(pushPlan, { plan_id });
            if ( data && data.code === '0'){
                yield put({ type:'getPlanListSync' });
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
        *addPlanSync(action, { put, select, call }){
            try {
                let { user:{ company_id }} = yield select();
                let { values, resolve, reject, forEdit } = action.payload || {};
                values['company_id'] = company_id;
                let { data } = yield call( forEdit ? updatePlan : addPlan, values);
                if ( data && data.code === '0'){
                    yield put({ type:'getPlanListSync'});
                    if ( resolve && typeof resolve === 'function') resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }
        },
        *delPlanSync(action, { put, select, call }){
            let { plan_id, resolve, reject } = action.payload || {};
            let { data } = yield call(delPlan, { plan_id });
            if ( data && data.code === '0'){
                yield put({ type:'getPlanListSync'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
        // 模板状态管理
        *getTplSync(action, { put, select, call }){
            let { user:{ company_id }} = yield select();
            let { data } = yield call(getTplList, { company_id });
            if ( data && data.code === '0'){
                yield put({ type:'getTplResult', payload:{ data:data.data }});
            }
        },
        *copyToTpl(action, { put, select, call }){
            try {
                let { resolve, reject, plan_id, tpl_name } = action.payload;
                let { data } = yield call(copyPlanToTpl, { plan_id, tpl_name });
                if ( data && data.code === '0'){
                    yield put({ type:'getTplSync'});
                    if ( resolve && typeof resolve === 'function') resolve();
                } else {
                    if ( reject && typeof reject === 'function' ) reject(data.msg);
                }
            } catch(err){
                console.log(err);
            }  
        },
        *delTplSync(action, { put, select, call }){
            let { tempelate_id, resolve, reject } = action.payload || {};
            let { data } = yield call(delTpl, { tempelate_id });
            if ( data && data.code === '0'){
                yield put({ type:'getTplSync'});
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        }
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading:true };
        },
        setSelectedNodes(state, { payload }){
            return { ...state, selectedNodes:payload };
        },
        getRoomListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, roomList:data, currentPage, total, isLoading:false };
        },
        toggleShowMode(state, { payload }){
            return { ...state, showMode:payload };
        },
        setPowerStatus(state, { payload }){
            return { ...state, powerStatus:payload };
        },
        setModeStatus(state, { payload }){
            return { ...state, modeStatus:payload };
        },
        setCurrentRoom(state, { payload }){
            return { ...state, currentRoom:payload };
        },
        updateCurrentRoom(state, { payload:{ data }}){
            return { ...state };
        },
        resetDetail(state){
            return { ...state, currentRoom:{} };
        },
        getPlanListResult(state, { payload:{ data, currentPage, total }}){
            return { ...state, planList:data, currentPage, total, isLoading:false };
        },
        getTplResult(state, { payload:{ data }}){
            return { ...state, tplList:data };
        },
        reset(state){
            return initialState;
        }
    }
}

function getSelectedKeys(data, result){
    if ( data.key ){
        result.push(data.key);
    }
    if ( data.children && data.children.length ){
        data.children.forEach((item)=>{
            getSelectedKeys(item, result);
        })
    }
}