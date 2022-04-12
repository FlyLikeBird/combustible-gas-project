import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Select, Input,  Popconfirm, message } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import AddForm from './AddForm';
const { Option } = Select;

function GroupManager({ dispatch, user, gateway, menu }){
    let { gatewayList, currentGateway, groupList } = gateway;
    let inputRef = useRef();
    let [info, setInfo] = useState({ visible:false, forEdit:false, currentMach:null });
    useEffect(()=>{
        if ( user.authorized ){
            dispatch({ type:'gateway/fetchGroup' });
        }
    },[user.authorized]);
    let btnMaps = {};
    if ( menu.child && menu.child.length ){
        menu.child.forEach(item=>{
            btnMaps[item.menu_code] = true;
        })
    }
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return index + 1;
                // return `${ ( pageNum - 1) * pagesize + index + 1}`;
            }
        },
        { 
            title:'所属网关',
            render:(row)=>(<span>{ currentGateway.meter_name }</span>)
        },
        { title:'注册码', dataIndex:'register_code' },
        { title:'分组编码', dataIndex:'grp' },
        { title:'分组名', dataIndex:'grp_name' },        
        {
            title:'操作',
            render:(row)=>(
                <div>                 
                    <span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }} onClick={()=>{
                        setInfo({ visible:true, forEdit:true, currentMach:row });
                    }}>修改</span>
                
                    <Popconfirm title='确定删除此网关分组吗' okText='确定' cancelText='取消' onConfirm={()=>{
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'gateway/delGroupSync', payload:{ resolve, reject, grp_id:row.id }})
                        })
                        .then(()=>{
                            message.success('删除网关分组成功');
                        })
                        .catch(msg=>message.info(msg))
                    }}><span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }}>删除</span></Popconfirm>                                     
                </div>
            )
        }
    ] 
    return (
            <div className={style['card-container']}>
                    <div style={{ display:'flex', alignItems:'center', height:'50px', color:'#fff', padding:'1rem' }}>              
                        <Select style={{ width:'160px', marginRight:'20px' }} className={style['custom-select']} value={currentGateway.mach_id} onChange={value=>{
                            let temp = gatewayList.filter(i=>i.mach_id === value )[0];
                            dispatch({ type:'gateway/toggleGateway', payload:temp });
                            dispatch({ type:'gateway/fetchGroup'});
                        }}>
                            {
                                gatewayList.map((item,index)=>(
                                    <Option value={item.mach_id} key={item.mach_id}>{ item.meter_name }</Option>
                                ))
                            }
                        </Select>                
                        <Button type="primary"  onClick={() => setInfo({ visible:true, forEdit:false }) }>添加网关分组</Button>                                      
                    </div>
                   
                    <Table
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        columns={columns}
                        dataSource={groupList}
                        locale={{emptyText:'查询的网关分组为空'}}
                        bordered={true}
                        rowKey="id"
                    
                        pagination={false}
                        // onChange={pagination=>{
                        //     dispatch({ type:'alarm/setPageNum', payload:pagination.current });
                        //     dispatch({ type:'alarm/fetchRecordList', payload:{ cate_code:activeKey, keywords:value }} )
                        // }}
                    />
                    <Modal
                        visible={info.visible}
                        footer={null}
                        width="40%"
                        bodyStyle={{ padding:'40px'}}
                        closable={false}
                        className={style['modal-container']}
                        onCancel={()=>setInfo({ visible:false, forEdit:false })}
                    >
                        <AddForm 
                            info={info}
                            gatewayList={gatewayList}
                            currentGateway={currentGateway}
                            onDispatch={action=>dispatch(action)}
                            onClose={()=>setInfo({ visible:false, forEdit:false })} 
                        />
                    </Modal>
                </div>
    )
}

export default connect(({ user, gateway })=>({ user, gateway }))(GroupManager);