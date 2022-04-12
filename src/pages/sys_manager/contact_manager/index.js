import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Select, Popconfirm, Input, message } from 'antd';
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';
import AddForm from './AddForm';
import Loading from '@/pages/components/Loading';
const { Option } = Select;

function RegionManager({ dispatch, user, region, gateway, menu }){
    let { userInfo, authorized } = user;
    let { managerList, currentPage, isLoading, total } = region;
    let { companyList, currentCompany } = gateway;
    let [info, setInfo] = useState({ visible:false, forEdit:false, userInfo:null });
    let [value, setValue] = useState('');
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'region/initManagerList' }); 
        }
    },[authorized]);
    let btnMaps = {};
    if ( menu.child && menu.child.length ){
        menu.child.forEach(item=>{
            btnMaps[item.menu_code] = true;
        })
    };
    
    let columns = [
        {
            title:'序号',
            width:'60px',
            fixed:'left',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 15 + index + 1}`;
            }
        },
        { title:'姓名', dataIndex:'name' },
        { title:'手机号', dataIndex:'mobile' },
        { title:'所属部门', dataIndex:'department' },
        { title:'创建时间', dataIndex:'create_time' },
        {
            title:'操作',
            render:(row)=>(
                <div>
                    {
                        true
                        // btnMaps['sw_person_update']
                        ?
                        <span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }} onClick={()=>{
                            setInfo({ visible:true, forEdit:true, userInfo:row });
                        }}>修改</span>
                        :
                        null
                    }
                    {
                        // btnMaps['sw_person_del']
                        true
                        ?
                        <Popconfirm title='确定删除此责任人吗' okText='确定' cancelText='取消' onConfirm={()=>{
                            new Promise((resolve, reject)=>{
                                dispatch({ type:'region/del', payload:{ resolve, reject, person_id:row.person_id }})
                            })
                            .then(()=>{
                                
                            })
                            .catch(msg=>message.info(msg))
                        }}><span style={{ cursor:'pointer', color:'#4b96ff', margin:'0 6px' }}>删除</span></Popconfirm>
                        :
                        null
                    }                    
                </div>
            )
        }
    ] 
    return (
            <div style={{ height:'100%' }}>
                {
                    isLoading 
                    ?
                    <Loading />
                    :
                    null
                }
                <div style={{ height:'40px' }}>
                    {
                        true
                        // btnMaps['sw_person_add']
                        ?
                        <div style={{ display:'flex', alignItems:'center', color:'#fff' }}>
                            {
                                userInfo.agent_id 
                                ?
                                <div>
                                    <span>选择公司</span>
                                    <Select className={style['custom-select']} value={currentCompany.key} style={{ width:'180px', margin:'0 1rem 0 4px' }} onChange={value=>{
                                        dispatch({ type:'gateway/setCompany', payload:{ company_id:value }});
                                        dispatch({ type:'region/fetchManagerList'});
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
                            <Button style={{ marginRight:'20px' }} type="primary"  onClick={() => setInfo({ visible:true, forEdit:false }) }>添加责任人</Button>                
                            {/* <Input style={{ width:'120px', marginRight:'0.5rem' }} allowClear={true} className={style['custom-input']} value={value} onChange={e=>setValue(e.target.value)} />
                            <Button type='primary' icon={<SearchOutlined />} onClick={()=>{
                                dispatch({ type:'region/fetchManagerList', payload:{ name:value }});
                            }}>查询</Button> */}
                        </div>
                        :
                        null
                    }
                </div>
                <div className={style['card-container']} style={{ height:'calc( 100% - 40px)'}}>
                    <Table
                        className={style['self-table-container'] + ' ' + style['dark'] }
                        columns={columns}
                        dataSource={managerList}
                        locale={{emptyText:'该公司还没有添加任何责任人'}}
                        bordered={true}
                        rowKey="person_id"  
                        // pagination={{
                        //     current:currentPage,
                        //     total,
                        //     pageSize:15,
                        //     showSizeChanger:false
                        // }}                  
                        // onChange={pagination=>{
                        //     dispatch({ type:'region/fetchManagerList', payload:{ name:value, page:pagination.current }} )
                        // }}
                    />
                </div>                   
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
                        onDispatch={action=>dispatch(action)}                            
                        onClose={()=>setInfo({ visible:false, forEdit:false })} 
                    />
                </Modal>
            </div>
    )
}

export default connect(({ user, gateway, region })=>({ user, gateway, region }))(RegionManager);