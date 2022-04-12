import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Table, Button, Modal, Drawer, Popconfirm, Select, message, Tree, Spin, Tag } from 'antd';
import UserForm from './UserForm';
import style from '@/pages/IndexPage.css';
import Loading from '@/pages/components/Loading';

const { Option } = Select;

function AddUserManager({dispatch, user, userList, gateway, permission }){
    const [info, setInfo] = useState({ visible:false, forEdit:null, currentUser:null });
    const { userInfo, authorized } = user;
    const { companyList, currentCompany } = gateway;
    const { roleList } = permission;
    const { list, total, currentPage, isLoading, selectedRowKeys, treeLoading, regionList, allRegions } = userList;
    const columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 15 + index + 1}`;
            }
        },
        {
            title:'用户名',
            dataIndex:'user_name',
            key:'user_name',
            render:(value, row)=>{
                if ( +row.user_id === +localStorage.getItem('user_id') ) {
                    return <span>{ value } <Tag color="geekblue">登录账号</Tag></span>
                } else {
                    return <span>{ value }</span>
                }
            }
        },
        // {
        //     title:'归属代理商',
        //     dataIndex:'agent_name',
        //     key:'agent_name'
        // },
        // {
        //     title:'归属公司',
        //     dataIndex:'company_name',
        //     key:'company_name'
        // },
        {
            title:'真实姓名',
            dataIndex:'real_name',
        },
        {
            title:'角色类型',
            dataIndex:'role_name',
            key:'role_name',
            render: value=>(<span>{ value ? value : '还未分配角色' }</span>)
        },
        {
            title:'邮箱',
            dataIndex:'email'
        },
        {
            title:'最后登录IP',
            dataIndex:'last_login_ip',
            key:'last_login_ip',
            render: value=>(<span>{ value ? value : '还未登录过' }</span>)
        },
        {
            title:'最后登录时间',
            dataIndex:'last_login_time',
            key:'last_login_time',
            render: value=>(<span>{ value ? value : '还未登录过' }</span>)
        },
        {
            title:'是否可登录',
            dataIndex:'is_actived',
            key:'is_actived',
            render:(text,record)=>(
                <span>{record.is_actived==1 ?'是':'否'}</span>
            )
        },
        {
            title:'操作',
            key:'action',     
            render:(row)=>(
                <div className={style['action-container']}>
                    {/* <a style={{marginRight:'10px'}} onClick={()=>{
                        setRegionVisible(true);
                        setCurrentUser(record.user_id);
                        dispatch({type:'userList/fetchUserRegion', payload : record.user_id });
                    }}>管辖区域</a> */}                   
                    <a onClick={()=>setInfo({ visible:true, forEdit:true, currentUser:row })}>编辑</a>                  
                </div>
            )       
        }
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: selectedRowKeys => dispatch({type:'userList/select', payload:selectedRowKeys })
    };
    // console.log(regionList);
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'userList/init'});
        }
    },[authorized]);
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'userList/reset'});
        }
    },[]);
  
    return (
                <div className={style['card-container']}>
                    {
                        isLoading
                        ?
                        <Loading />
                        :
                        null
                    }
                    <div style={{ padding:'1rem', display:'flex', alignItems:'center' }}>
                        {
                            userInfo.agent_id 
                            ?
                            <div>
                                <span>选择公司</span>
                                <Select className={style['custom-select']} value={currentCompany.key} style={{ width:'180px', margin:'0 1rem 0 4px' }} onChange={value=>{
                                    dispatch({ type:'gateway/setCompany', payload:{ company_id:value }});
                                    dispatch({ type:'userList/fetchUserList'});
                                }}>
                                    {
                                        companyList.length 
                                        ?
                                        companyList.map((item,i)=>(
                                            <Option key={item.key} value={item.key}>{ item.title }</Option>
                                        ))
                                        :
                                        null
                                    }
                                </Select>
                            </div>
                            :
                            null
                        }
                        <Button style={{ marginRight:'10px' }} type="primary" onClick={()=>setInfo({ visible:true, forEdit:false, currentUser:null })}>添加用户</Button>
                        <Popconfirm title="确定要删除用户吗?" okText="确定" cancelText="取消" onConfirm={()=>{
                            if ( !selectedRowKeys.length ) {
                                message.info('请先选择要删除的用户');
                            } else {
                                dispatch({type:'userList/delete'});
                            }
                        }}><Button type="primary">删除用户</Button></Popconfirm>
                       
                    </div> 
                    
                    <Table 
                        rowKey="user_id" 
                        columns={columns} 
                        dataSource={list} 
                        bordered={true}
                        className={style['self-table-container'] + ' ' + style['dark']}
                        rowSelection={rowSelection}
                        pagination={{current:currentPage, total, pageSize:15, showSizeChanger:false }}
                        onChange={(pagination)=>{
                            dispatch({type:'userList/fetchUserList', payload:{ pageNum:pagination.current}});
                        }}
                    />
                    <Modal
                        title={info.forEdit ? '修改用户':'创建新用户'}
                        visible={info.visible}
                        destroyOnClose={true}
                        onCancel={()=>setInfo({ visible:false, forEdit:false, currentUser:null })}
                        footer={null}
                    >
                        <UserForm 
                            
                            roleList={roleList}
                            info={info}
                            onAdd={payload=>dispatch({type:'userList/add', payload})}
                            onClose={payload=>setInfo({ visible:false, forEdit:false, currentUser:null })}
                        />
                    </Modal>                     
                </div>         
    )
}

export default connect(({userList, user, gateway, permission })=>({userList, user, gateway, permission}))(AddUserManager);
