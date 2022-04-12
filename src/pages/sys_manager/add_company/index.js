import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Table, Button, Modal, Drawer, Popconfirm, Select, message, Tree, Spin, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import UserForm from './UserForm';
import style from '@/pages/IndexPage.css';
import Loading from '@/pages/components/Loading';

const { Option } = Select;

function AddCompanyManager({dispatch, user, gatewayList, userList }){
    const [info, setInfo] = useState({ visible:false, currentCompany:null, forEdit:false });
    const { authorized } = user;
    const { isLoading, companyList, currentPage, total } = userList;
    const columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 14 + index + 1}`;
            }
        },
        {
            title:'公司名',
            dataIndex:'company_name',
            key:'company_name'
        },
        {
            title:'操作',
            render:row=>(
                <div>
                    <Button size='small' type='primary' icon={<EditOutlined />} style={{ marginRight:'1rem' }} onClick={()=>{
                        setInfo({ visible:true, currentCompany:row, forEdit:true });
                    }}>修改</Button>
                    <Popconfirm title='确定删除此公司吗?' okText='确定' cancelText='取消' onConfirm={()=>{
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'userList/delCompanyAsync', payload:{ resolve, reject, company_id:row.company_id }})
                        })
                        .then(()=>{
                            message.success(`删除${row.company_name}成功`);
                        })
                        .catch(msg=>message.error(msg))
                    }}><Button size='small' type='primary' icon={<DeleteOutlined />} danger >删除</Button></Popconfirm>
                </div>
            )
        }
    ];
   
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'userList/fetchCompanyList'});
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
                    <div style={{ padding:'1rem'}}>
                        <Button style={{ marginRight:'10px' }} type="primary" onClick={()=>setInfo({ visible:true, currentCompany:null, forEdit:false })}>添加企业</Button>
                    </div> 
                    <Table 
                        rowKey="company_id" 
                        columns={columns} 
                        dataSource={companyList} 
                        bordered={true}
                        className={style['self-table-container'] + ' ' + style['dark']}
                        pagination={{ 
                            current:currentPage, 
                            total:companyList.length, 
                            pageSize:14, 
                            showSizeChanger:false 
                        }}
                        onChange={(pagination)=>dispatch({ type:'userList/setPage', payload:pagination.current })}
                    />
                    <Modal
                        width={640}
                        visible={info.visible}
                        bodyStyle={{ padding:'40px 24px'}}
                        onCancel={()=>setInfo({ visible:false, forEdit:false })}
                        footer={null}
                    >
                        <UserForm 
                            info={info}
                            onDispatch={action=>dispatch(action)}
                            onClose={()=>setInfo({ visible:false, forEdit:false })}
                            AMap={user.AMap}
                        /> 
                    </Modal>                     
                </div>         
    )
}

export default connect(({userList, user })=>({userList, user }))(AddCompanyManager);
