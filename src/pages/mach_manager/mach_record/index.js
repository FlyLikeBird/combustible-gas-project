import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Table, Input, Modal, Button, message } from 'antd';
import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import TableContainer from './TableContainer';
import ProgressContainer from './ProgressContainer';
import IndexStyle from '@/pages/IndexPage.css';
import style from '../MachManager.css';

function MachRecord({ dispatch, user, gateway, type }){
    let [info, setInfo] = useState({ visible:false, currentMach:null });
    let { currentCompany } = user;
    let { gatewayList, recordList, deviceList, gasCompanys, isLoading, currentPage, total } = gateway;
    useEffect(()=>{
        dispatch({ type:'gateway/fetchDevices'});
    },[])
    let columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 14 + index + 1}`;
            }
        },
        { title:'设备名', dataIndex:'meter_name' },
        { title:'设备类型', dataIndex:'model_desc'},
        { title:'注册码', dataIndex:'register_code'},
        { 
            title:'所属主机', 
            dataIndex:'gateway_id',
            render:id=>{
                let obj = gatewayList.filter(i=>i.mach_id === id)[0];
                return (<span>{ obj ? obj.meter_name : '' }</span>)
            }
        },
        { title:'所属燃气公司', dataIndex:'combust_company_name'},
        { title:'安装日期', dataIndex:'install_date' },
        { title:'位置', dataIndex:'position' },
        {
            title:'操作',
            render:row=>(
                <Button size='small' type='primary' icon={<SearchOutlined />} style={{ marginRight:'1rem' }} onClick={()=>{
                    setInfo({ visible:true, currentMach:row });
                    new Promise((resolve, reject)=>{
                        dispatch({ type:'gateway/fetchDeviceRecord', payload:{ mach_id:row.mach_id, type, resolve, reject }})
                    })
                    .catch(msg=>message.error(msg));
                }}>查看</Button>                 
            )
        }
    ];
    return (
        <div className={IndexStyle['card-container']} >
            <Table
                className={IndexStyle['self-table-container'] + ' ' + IndexStyle['dark']}
                columns={columns}
                rowKey='mach_id'
                dataSource={deviceList}
              
                pagination={{current:currentPage, total, pageSize:14, showSizeChanger:false }}
                onChange={(pagination)=>{
                    dispatch({type:'userList/fetchUserList', payload:{ pageNum:pagination.current}});
                }}
            />
            <Modal
                visible={info.visible}
                footer={null}
                width="30%"
                bodyStyle={{ padding:'40px'}}
                className={IndexStyle['modal-container']}
                onCancel={()=>setInfo({ visible:false, currentMach:null })}
            >
                <ProgressContainer info={info} type={type} onClose={()=>setInfo({ visible:false, currentMach:null })} progressLog={recordList} />
            </Modal>
        </div>
    )
}

export default connect(({ user, gateway })=>({ user, gateway }))(MachRecord);