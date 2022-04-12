import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Table, Input, Select, Modal, Button, message } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import TableContainer from './TableContainer';
import AddForm from './AddForm';
import IndexStyle from '@/pages/IndexPage.css';
import style from '../MachManager.css';
import Loading from '@/pages/components/Loading';

const { TabPane } = Tabs;
const { Option } = Select;
let tabList = [{ tab:'监控主机', key:'gateway' }, { tab:'可燃气体探测器', key:'device' }];

function MachDetail({ dispatch, user, gateway, region }){
    let [info, setInfo] = useState({ visible:false, currentMach:null, forEdit:false });
    let { AMap, currentCompany, userInfo, authorized } = user;
    let { managerList } = region;
    let { activeKey, gatewayList, deviceList, sceneType, currentNode, companyList, gasCompanys, gatewayModelList, networkModelList, deviceModelList, isLoading, currentPage, total } = gateway;
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'gateway/initGateway' });
        }
    },[authorized]);
    return (
        <div className={IndexStyle['card-container']} >
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <Tabs
                activeKey={activeKey}
                className={IndexStyle['custom-tabs'] + ' ' + IndexStyle['flex-tabs']}
                onChange={activeKey=>{
                    dispatch({ type:'gateway/setActiveKey', payload:activeKey });
                }}
                tabBarExtraContent={{
                    right:(
                        <div>
                            <span>场景类型 : </span>
                            <Select style={{ width:'100px', marginRight:'6px' }} className={IndexStyle['custom-select']} value={sceneType} onChange={value=>{
                                dispatch({ type:'gateway/setSceneType', payload:value });
                                dispatch({ type:'gateway/fetchGateway' });
                                dispatch({ type:'gateway/fetchDevices'}); 
                            }}>
                                <Option key={0} value={0}>全部</Option>
                                <Option key={1} value={1}>工业场景</Option>
                                <Option key={2} value={2}>家用场景</Option>
                            </Select>
                            <Button type='primary' icon={<PlusCircleFilled />} style={{ marginRight:'1rem' }} onClick={()=>{
                                setInfo({ visible:true, currentMach:null, forEdit:null });
                            }}>添加设备</Button>
                        </div>
                    )
                }}
            >
                {
                    tabList.map((item,i)=>(
                        <TabPane tab={item.tab} key={item.key}>{ ( item.key === activeKey ) && <TableContainer dispatch={dispatch} currentKey={activeKey} gatewayList={gatewayList} data={ activeKey === 'gateway' ? gatewayList : deviceList } currentPage={currentPage} total={total} onSelect={obj=>setInfo(obj)} /> }</TabPane>
                    ))
                }
            </Tabs>
            <Modal
                visible={info.visible}
                title={<div>{ activeKey === 'gateway' ? '添加监控主机' : '添加可燃气体探测器' }</div>}
                footer={null}
                width={780}
                bodyStyle={{ padding:'40px'}}
                closable={false}
                className={IndexStyle['modal-container']}
                destroyOnClose={true}
                onCancel={()=>setInfo({ visible:false, forEdit:false })}
            >
                <AddForm 
                    info={info}
                    gasCompanys={gasCompanys}
                    gatewayList={gatewayList}
                    gatewayModelList={gatewayModelList}
                    deviceModelList={deviceModelList}
                    networkModelList={networkModelList}
                    companyList={companyList}
                    managerList={managerList}
                    AMap={AMap}
                    isAgent={userInfo.agent_id ? true : false }
                    forDevice={ activeKey === 'gateway' ? false : true }
                    onDispatch={action=>dispatch(action)}
                    onClose={()=>setInfo({ visible:false, forEdit:false, currentMach:null })}
                />
            </Modal>
        </div>
    )
}

export default connect(({ user, gateway, region })=>({ user, gateway, region }))(MachDetail);