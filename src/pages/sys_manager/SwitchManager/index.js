import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Table, Input, Select, Button, Popconfirm, message } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import AddForm from './AddForm';
const { Option } = Select;
let protocolList = [{ key:1, value:'DL/T 645—1997协议'}, { key:2, value:'交流采样装置通信协议'}, { key:30, value:'DL/T 645—2007'}, { key:31, value:'串行接口连接窄带低压载波通信模块接口协议'}, { key:32, value:'CJ-T_188' }]
let baudrateList = [{ key:1, value:600}, { key:2, value:1200}, { key:3, value:2400 }, { key:4, value:4800 }, { key:5, value:7200}, { key:6, value:9600}, { key:7, value:19200 }];

function SwitchManager({ dispatch, user, gateway, menu }){
    let { gatewayList, groupList, ACList, ACBrand, ACModel, currentPage, total } = gateway;
    let [info, setInfo] = useState({ visible:false, forEdit:false, currentMach:null });
    let [option, setOption] = useState(0.1);
    let inputRef = useRef();
    let selectOptions = [{ mach_id:0.1, meter_name:'全部网关'}, ...gatewayList];
    useEffect(()=>{
        dispatch({ type:'gateway/initACList' });
    },[]);
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
                return `${ ( currentPage - 1) * 12 + index + 1}`;
            }
        },
        { title:'所属网关', dataIndex:'gateway', width:140, ellipsis:true },
        { title:'设备名', dataIndex:'meter_name' },
        { title:'注册码', dataIndex:'register_code' },
        { title:'设备类型', dataIndex:'model_desc', width:180, ellipsis:true },
        { title:'设备品牌', dataIndex:'brand_name' },
        { title:'端口号', dataIndex:'port', width:70 },
        {
            title:'通讯协议类型',
            dataIndex:'protocol',
            width:220,
            ellipsis: true,
            render:(value)=>{
                let temp = protocolList.filter(i=>i.key === value )[0];
                return (<span>{ temp ? temp.value : '-- --' }</span>)
            }
        },
        {
            title:'波特率',
            dataIndex:'baudrate',
            render:(value)=>{
                let temp = baudrateList.filter(i=>i.key === value )[0];
                return (<span>{ ( temp ? temp.value : '-- --' ) + ' ' + 'bps' }</span>)
            }
        },
        {
            title:'分组名',
            dataIndex:'grp_name',
            render:(value)=>(<span>{ value || '-- --'}</span>)
        },
        { title:'排序值', dataIndex:'order_by', width:70 },
        {
            title:'操作',
            render:(row)=>(
                <div>                 
                    <span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }} onClick={()=>{
                        setInfo({ visible:true, forEdit:true, currentMach:row });
                    }}>修改</span>          
                    <Popconfirm title='确定删除此空调设备吗' okText='确定' cancelText='取消' onConfirm={()=>{
                        new Promise((resolve, reject)=>{
                            dispatch({ type:'gateway/delACSync', payload:{ resolve, reject, mach_id:row.mach_id, gateway_id:option }})
                        })
                        .then(()=>{
                            message.success('删除空调设备成功');
                        })
                        .catch(msg=>message.info(msg))
                    }}><span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }}>删除</span></Popconfirm>                    
                </div>
            )
        }
    ];
    return (
            <div className={style['card-container']}>
                    <div style={{ display:'flex', alignItems:'center', height:'50px', color:'#fff', padding:'1rem' }}>              
                        <Select style={{ width:'160px', marginRight:'20px' }} className={style['custom-select']} value={option} onChange={value=>{
                            setOption(value);
                            dispatch({ type:'gateway/fetchACList', payload:{ gateway_id:value } });
                        }}>
                            {
                                selectOptions && selectOptions.length 
                                ?
                                selectOptions.map((item,index)=>(
                                    <Option key={item.mach_id} value={item.mach_id}>{ item.meter_name }</Option>
                                ))
                                :
                                null
                            }
                        </Select>                                             
                        <Button type="primary"  onClick={() => setInfo({ visible:true, forEdit:false }) }>添加空调设备</Button>                       
                    </div>
                    
                    <Table
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        columns={columns}
                        dataSource={ACList}
                        locale={{emptyText:'查询的空调设备为空'}}
                        bordered={true}
                        rowKey='mach_id'  
                        pagination={{
                            current:currentPage,
                            total,
                            pageSize:12,
                            showSizeChanger:false
                        }}                     
                        onChange={pagination=>{
                            dispatch({ type:'gateway/fetchACList', payload:{ gateway_id:option, currentPage:pagination.current }} )
                        }}
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
                            gatewayId={option}
                            ACModel={ACModel}
                            ACBrand={ACBrand}
                            groupList={groupList}
                            onDispatch={action=>dispatch(action)}
                            onClose={()=>setInfo({ visible:false, forEdit:false })} 
                        />
                    </Modal>
                </div>
    )
}

export default connect(({ user, gateway })=>({ user, gateway }))(SwitchManager);