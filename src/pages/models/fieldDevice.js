import { deleteField, addField, editField, addFieldAttr, deleteFieldAttr, editFieldAttr, getAttrDevice, getAllDevice, addAttrDevice, deleteAttrDevice } from '../services/fieldsService';

const initialState = {
    deviceList:[],
    allDevice:[],
    selectedField:{},
    selectedAttr:{},
    //  切换添加设备状态
    forAddStatus:false,
    selectedRowKeys:[],
    isLoading:false,
    // 添加维度模态弹窗visible
    addModal:false,
    //  维度分组的visible
    setModal:false,
    //  维度属性的visible
    attrModal:false,
    //  判断是否是根属性节点
    isRootAttr:false,
    // 添加子级属性
    forSub:false,
    //  编辑属性
    editAttr:false,
};

export default {
    namespace:'fieldDevice',
    state:initialState,
    effects:{
        *cancelable({ task, payload, action }, { call, race, take}) {
            yield race({
                task:call(task, payload),
                cancel:take(action)
            })
        },
        *fetchAttrDevice(action, { call, put, select }){
            yield put({type:'toggleLoading'});
            let { fieldDevice:{ selectedField, selectedAttr }} = yield select();
            let { data } = yield call(getAttrDevice, { attr_id:selectedAttr.key, app_type:'4' });
            if ( data && data.code == 0 ){
                yield put({type:'getDevice', payload:{data:data.data}});
            } 
        },
        *fetchAll(action, { call, put, select }){
            yield put({type:'toggleStatus', payload:true});
            let { meter_name } = action.payload || {};
            let { fieldDevice:{ selectedAttr }} = yield select();
            let obj = {
                attr_id:selectedAttr.key,
                app_type:'4'
            };
            if ( meter_name ){
                obj['meter_name'] = meter_name;
            }
            let { data } = yield call(getAllDevice, obj);
            if ( data && data.code == 0 ){
                yield put({type:'getAll', payload: { data:data.data}});
            }
        },
        *add(action, { call, put, select }){
            let { values, resolve, reject } = action.payload || {};
            let { user:{ company_id }, fields:{ energyInfo }} = yield select();          
            let { data } = yield call(addField, { field_name:values.field_name, field_type:values.field_type, company_id, energy_type:energyInfo.type_id });
            if ( data && data.code ==0 ) {
                yield put({type:'fields/fetchField', payload:{ needsUpdate:true }});
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *edit(action, { call, put, select }){
            let { field_name, field_id, field_type, resolve, reject } = action.payload || {};
            let { user :{ company_id }} = yield select();
            let { data } = yield call(editField, { field_id, company_id, field_name, field_type });
            if ( data && data.code == 0 ){
                yield put({type:'fields/fetchField', payload:{ needsUpdate:true }});
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *delete(action, { call, put, select }){
            let { field_id, resolve, reject } = action.payload;
            let { data } = yield call(deleteField,{ field_id });
            if (data && data.code ==0){
                yield put({type:'fields/fetchField', payload:{ needsUpdate:true }});
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *addAttr(action, { call, put, select }){
            let { field_attr, resolve, reject } = action.payload || {};
            let { fieldDevice:{ selectedField, selectedAttr, forSub, forAddStatus } } = yield select();
            let parent_id;
            if (forSub){
                //  添加下级
                parent_id = selectedAttr.key;
            } else {
                //  添加同级
                parent_id = selectedAttr.parent_id;
            }
            let { data } = yield call(addFieldAttr, { attr_name:field_attr, field_id:selectedField.field_id, parent_id});            
            if ( data && data.code == 0 ){               
                yield put.resolve({type:'fields/fetchFieldAttrs', needsUpdate:true, passField:selectedField });  
                if ( forAddStatus ){
                    yield put({ type:'fetchAll'});
                } else {
                    yield put({ type:'fetchAttrDevice'});
                }
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *editAttr(action, { call, put, select }){
            let { field_attr, resolve, reject } = action.payload || {};
            let { fieldDevice:{ selectedField, selectedAttr, forAddStatus }} = yield select();
            let { data } = yield call(editFieldAttr, { attr_name:field_attr, attr_id:selectedAttr.key, field_id:selectedField.field_id})
            if ( data && data.code == 0){
                yield put.resolve({type:'fields/fetchFieldAttrs', needsUpdate:true, passField:selectedField });
                if ( forAddStatus ){
                    yield put({ type:'fetchAll'});
                } else {
                    yield put({ type:'fetchAttrDevice'});
                }
                if ( resolve && typeof resolve === 'function' ) resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *deleteAttr(action, { call, put, select }){
            let { fieldDevice:{ selectedAttr, selectedField, forAddStatus }} = yield select();
            let { data } = yield call(deleteFieldAttr, { attr_id:selectedAttr.key });
            if ( data && data.code == 0 ){
                yield put.resolve({type:'fields/fetchFieldAttrs', needsUpdate:true, passField:selectedField });         
                if ( forAddStatus ){
                    yield put({ type:'fetchAll'});
                } else {
                    yield put({ type:'fetchAttrDevice'});
                }
            }
        },
        *addDevice(action, { call, put, select}){
            let { fieldDevice: { selectedAttr, selectedRowKeys }} = yield select();
            let { resolve, reject } = action.payload || {};
            let { data } = yield call(addAttrDevice, { attr_id:selectedAttr.key, attrmeters:selectedRowKeys});
            if ( data && data.code == 0 ){
                yield put({ type:'fetchAttrDevice' });
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        },
        *deleteDevice(action, { call, put, select }){
            let { fieldDevice: { selectedAttr, selectedRowKeys }} = yield select();
            let { data } = yield call(deleteAttrDevice, { attr_id:selectedAttr.key, details:selectedRowKeys});
            let { resolve, reject } = action.payload || {};
            if ( data && data.code == 0 ){
                yield put({ type:'fetchAttrDevice' });
                if ( resolve && typeof resolve === 'function') resolve();
            } else {
                if ( reject && typeof reject === 'function') reject(data.msg);
            }
        }
        
    },
    reducers:{
        toggleLoading(state){
            return { ...state, isLoading: true };
        },
        getDevice(state, { payload : {data} }){
            return { ...state, deviceList:data, isLoading:false };
        },
        getAll(state, { payload: { data }}){
            return { ...state, allDevice:data  };
        },
        toggleField(state, { payload:{ visible, field }}){
            return { ...state, setModal:visible, selectedField:field };
        },
        toggleAttr(state, { payload }){
            return { ...state, selectedAttr:payload, isRootAttr:Boolean(payload.parent_id) ? false : true };
        },
        toggleStatus(state, { payload}){
            return { ...state, forAddStatus:payload, selectedRowKeys:[] };
        },
        toggleAddModal(state, { payload }){
            return { ...state, addModal:payload };
        },
        toggleAttrModal(state, { payload }){
            let { visible, forSub, editAttr } = payload;
            return { ...state, attrModal:visible, forSub, editAttr };
        },
        select(state, { payload }){
            return { ...state, selectedRowKeys:payload };
        },
        reset(state){
            return initialState;
        }
        
    }
}
