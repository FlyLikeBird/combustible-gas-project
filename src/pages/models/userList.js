import { 
    getCompanyList, addCompany, updateCompany, delCompany,
    getUserList, getRoleList, createUser, editUser, deleteUser, 
    updatePassword, 
    getRolePermission, editRolePermission } from '../services/userListService';
import { md5 } from '../utils/encryption';

const initialState = {
    list:[],
    // 角色权限相关状态
    roleList:[],
    currentRole:{},
    selectedKeys:[],
    // -- --
    userForm:{},
    currentPage:1,
    total:0,
    isLoading:false,
    // 新增用户和更改用户的模态弹窗
    visible:false,
    forEdit:false,
    selectedRowKeys:[],
    treeLoading:false,
    // 新增企业
    companyList:[]
}

export default {
    namespace:'userList',
    state:initialState,
    effects:{
        *init(action, { call, put }){
            yield put({ type:'permission/fetchRoleList' });
            yield put.resolve({ type:'gateway/fetchCompanyTree'});
            yield put({ type:'fetchUserList'});
        },
        *fetchCompanyList(action, { call, put }){
            let { keyword } = action.payload || {};
            let params = {};
            if ( keyword ){
                params.keyword = keyword;
            }
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getCompanyList, params);
            if ( data && data.code === '0'){
                yield put({ type:'getCompanyListResult', payload:{ data:data.data }});
            }
        },
        *addCompanyAsync(action, { call, put }){
            let { values, resolve, reject, forEdit } = action.payload || {};
            let { data } = yield call( forEdit ? updateCompany : addCompany, values);
            if ( data && data.code === '0'){
                if ( resolve && typeof resolve === 'function') resolve(data.data);
                yield put({ type:'fetchCompanyList'});
                // 更新公司列表和当前公司
                yield put({ type:'gateway/fetchCompanyTree', payload:{ forceUpdate:true }})
            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
        *delCompanyAsync(action, { call, put }){
            let { company_id, resolve, reject } = action.payload || {};
            let { data } = yield call(delCompany, { company_id });
            if ( data && data.code === '0'){
                if ( resolve && typeof resolve === 'function') resolve();
                yield put({ type:'fetchCompanyList'});
                // 更新公司列表和当前公司
                yield put({ type:'gateway/fetchCompanyTree', payload:{ forceUpdate:true }})

            } else {
                if ( reject && typeof reject === 'function' ) reject(data.msg);
            }
        },
        *fetchUserList(action, { call, put, select}){  
            let { user:{ company_id, userInfo }, gateway:{ currentCompany }} = yield select();
            let { pageNum, pagesize } = action.payload || {};
            pageNum = pageNum || 1;
            pagesize = pagesize || 15;
            yield put({ type:'toggleLoading'});
            let { data } = yield call(getUserList, { company_id:userInfo.agent_id ? currentCompany.key : company_id , page:pageNum, pagesize });
            if ( data && data.code === '0'){
                yield put({type:'getUserList', payload:{ data:data.data, count:data.count, currentPage:pageNum }});
            }       
        },
        *add(action, { call, put, select }){
            let { user:{ userInfo, company_id}, gateway:{ currentCompany }} = yield select();
            let { values, resolve, reject, forEdit } = action.payload || {};
            values.is_actived = values.is_actived ? '1' : '0'; 
            values.company_id = userInfo.agent_id ? currentCompany.key : company_id;
            values.confirm_password = values.password = md5(values.password, values.user_name);
            let { data } = yield call( forEdit ? editUser : createUser,values);
            if ( data && data.code == 0 ){
                yield put({type:'fetchUserList'});
                if ( resolve ) resolve();
            } else if ( data && data.code === '1001'){
                yield put({ type:'user/loginOut'});
            } else {
                if ( reject ) reject(data.msg);
            }
        },
        *delete(action, { call, put, select}){
            let { userList : { selectedRowKeys }} = yield select();
            let { data } = yield call(deleteUser, { user_id : selectedRowKeys});
            if ( data && data.code == 0 ){
                yield put({type:'fetchUserList'});
            } else if ( data && data.code === '1001') {
                yield put({ type:'user/loginOut'});
            }
        }
    },
    reducers:{
        toggleLoading(state, { payload}){
            return { ...state, isLoading:true }
        },
        toggleTreeLoading(state){
            return { ...state, treeLoading:true };
        },
        getCompanyListResult(state, { payload:{ data }}){
            return { ...state, companyList:data, isLoading:false }
        },
        getUserList(state, {payload:{ data, count, currentPage }}){
            // //  排除登录的自身账号，只显示下级有管理权限的企业用户列表
            // let list = data.users.filter(user=>user.user_id != localStorage.getItem('user_id'));
            return { ...state, list:data.users, total:count, currentPage, isLoading:false } ;
        },
        getRoleList(state, { payload:{data}}){
            let { roles } = data;
            return { ...state, roleList:roles };
        },
        toggleVisible(state, { payload }){
            let { visible, forEdit, userForm } = payload;
            return { ...state, visible, forEdit, userForm:userForm ? userForm : {}};
        },
        select(state, { payload }){
            return { ...state, selectedRowKeys:payload };
        },
        getPermissionResult(state, { payload:{ data, currentRole }}){
            return { ...state, selectedKeys:data.menuList, currentRole };
        },
        setPermission(state, { payload:{ selectedKeys }}){
            return { ...state, selectedKeys };
        },
        setPage(state, { payload }){
            return { ...state, currentPage:payload };
        },
        resetRoleManager(state){
            return { ...state, roleList:[], currentRole:{}, selectedKeys:[] };
        },
        resetAdminManager(state){
            return { ...initialState, roleList:state.roleList, currentRole:state.currentRole, selectedKeys:state.selectedKeys };
        },
        reset(state){
            return initialState;
        }
    }
}