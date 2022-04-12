import React from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';

function TableContainer({ dispatch, gatewayList, currentKey, data, onSelect, currentPage, total }){
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
            currentKey === 'gateway'
            ?
            null
            : 
            { 
                title:'所属主机', 
                dataIndex:'gateway_id',
                render:id=>{
                    let obj = gatewayList.filter(i=>i.mach_id === id)[0];
                    return (<span>{ obj ? obj.meter_name : '-- --' }</span>)
                }
            },
            { title:'所属公司', dataIndex:'company_name' },
            { title:'所属燃气公司', dataIndex:'combust_company_name'},
            { title:'安装日期', dataIndex:'install_date' },
            currentKey === 'gateway' ? null : { title:'位置', dataIndex:'position' },
            {
                title:'操作',
                render:row=>(
                    <div>
                        <Button size='small' type='primary' icon={<EditOutlined />} style={{ marginRight:'1rem' }} onClick={()=>{
                            onSelect({ visible:true, currentMach:row, forEdit:true });
                        }}>修改</Button>
                        <Popconfirm title='确定删除此设备吗?' okText='确定' cancelText='取消' onConfirm={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type: currentKey === 'gateway' ? 'gateway/delGatewayAsync' : 'gateway/delDeviceAsync', payload:{ resolve, reject, mach_id:row.mach_id }})
                            })
                            .then(()=>{
                                message.success(`删除${row.meter_name}成功`);
                            })
                            .catch(msg=>message.error(msg))
                        }}><Button size='small' type='primary' icon={<DeleteOutlined />} danger >删除</Button></Popconfirm>
                    </div>
                )
            }
        ];
    columns = columns.filter(i=>i);
    return (
        <Table
            className={style['self-table-container'] + ' ' + style['dark']}
            columns={columns}
            rowKey='mach_id'
            dataSource={data}
            pagination={{current:currentPage, total, pageSize:14, showSizeChanger:false }}
            onChange={(pagination)=>{
                dispatch({ type:'gateway/fetchGateway', payload:{ currentPage:pagination.current }});
                dispatch({ type:'gateway/fetchDevices', payload:{ currentPage:pagination.current }});
            }}
        />
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.currentKey !== nextProps.currentKey || prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(TableContainer, areEqual);