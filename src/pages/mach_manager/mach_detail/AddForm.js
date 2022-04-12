import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message, Tooltip, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from '../MachManager.css';
import IndexStyle from '@/pages/IndexPage.css';
import AMapLoader from '@amap/amap-jsapi-loader';
import ContactManagerForm from '@/pages/sys_manager/contact_manager/AddForm';

const { Option } = Select;
const { Search } = Input;
let map;
let loaded = false;
let points = [];
function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}

function getDeepValue(node, result){
    if ( node.children && node.children.length ){
        node.children.forEach(item=>{
            result.push({ title:item.title, key:item.key, children:item.children });
            getDeepValue(item, result);
        })
    }
}

function getNodeChildren(node, result){
    result.push({ title:node.title, key:node.key, children:node.children });
    if ( node.children && node.children.length ){
        node.children.forEach(item=>{
            getNodeChildren(item, result);
        })
    }
}
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
function AddForm({ info, AMap, forDevice, gatewayList, isAgent, gatewayModelList, networkModelList, deviceModelList, managerList, companyList, gasCompanys, onDispatch, onClose }){

    const [form] = Form.useForm();
    const [currentModel, setCurrentModel] = useState('');
    const [visible, setVisible] = useState(false);
    const [personInfo, setPersonInfo] = useState({ visible:false, forEdit:false });
    const [pos, setPos] = useState({});
    // console.log(currentRule);
    useEffect(()=>{        
        if ( !AMap && !forDevice ){
            AMapLoader.load({
                key:'26dbf93c4af827e4953d7b72390e3362',
                
            })
            .then((MapInfo)=>{
                onDispatch({ type:'user/setMap', payload:MapInfo });
            })
            .catch(e=>{
                console.log(e);
            })
        }
        return ()=>{
            if ( map && map.destroy ){
                map.destroy();
            }
            form.resetFields();
            setPos({});
            setCurrentModel('');
            map = null;
            loaded = false;
            points = [];

        }
    },[]);
    useEffect(()=>{
        if ( AMap ){
            if ( !loaded && visible ) {
                map = new AMap.Map('my-map',{
                    resizeEnable:true,
                    zoom:10
                });
                loaded = true;
            }
        }
    },[AMap, visible]);
    useEffect(()=>{
        form.setFieldsValue({
            meter_name : info.forEdit ? info.currentMach.meter_name : null,
            register_code: info.forEdit ? info.currentMach.register_code : null,
            combust_id: info.forEdit ? info.currentMach.combust_id : null,
            gateway_id: info.forEdit ? info.currentMach.gateway_id ? info.currentMach.gateway_id : 0 : null,
            order_by : info.forEdit ? info.currentMach.order_by ? info.currentMach.order_by : null : null,
            combust_link_name:info.forEdit ? info.currentMach.combust_link_name : null,
            combust_link_mobile:info.forEdit ? info.currentMach.combust_link_mobile : null,
            position: info.forEdit ? info.currentMach.position : null
        });
        if ( !forDevice && info.currentMach ) {
            setPos({ lng:info.currentMach.lng, lat:info.currentMach.lat });
        }
        if ( info.currentMach ){
            setCurrentModel(info.currentMach.model_code);
        }
        
    },[info]);

    return (
        <div>
            <Form
                {...layout} 
                name="add-form"
                className={style['form-container']}
                form={form}
                onFinish={values=>{
                    if ( !forDevice && !Object.keys(pos).length ) {
                        message.info('请选择设备坐标');
                        return ;
                    }
                    if ( !currentModel ) {
                        message.info(`请选择${ forDevice ? '可燃气体探测器' : '监控主机'}型号`)
                        return ;
                    }
                    values.lat = pos.lat;
                    values.lng = pos.lng;
                    values.model_code = currentModel;
            
                    let temp = gasCompanys.filter(i=>i.combust_id === values.combust_id)[0] || {};
                    values.combust_company_name = temp.combust_company_name;
                    // console.log(values);
                    if ( info.forEdit ) {
                        values.mach_id = info.currentMach.mach_id;
                    }
                    new Promise((resolve,reject)=>{
                        onDispatch({ type: forDevice ? 'gateway/addDeviceAsync' : 'gateway/addGatewayAsync', payload:{ values, resolve, reject, forEdit:info.forEdit }});                      
                    })
                    .then(()=>{
                        onClose();
                        message.success(`${info.forEdit ? '修改' : '添加'}${ forDevice ? '可燃气体探测器' : '监控主机' }成功`);
                    })
                    .catch(msg=>{
                        message.error(msg);
                    })
                }}
            >
                {
                    forDevice 
                    ?
                    <Form.Item name='gateway_id' label='选择主机' rules={[{ required:true, message:'请选择主机类型'}]}>
                        {
                            
                            <Select>
                                {
                                    gatewayList.concat({ mach_id:0, meter_name:'独立式探头' }).map((item,index)=>(
                                        <Option key={item.mach_id} value={item.mach_id}>{ item.meter_name }</Option>
                                    ))
                                }
                            </Select>
                        }
                    </Form.Item>
                    :
                    null
                }         
                <Form.Item label={ forDevice ? '选择探测器型号' : '选择主机型号'} shouldUpdate={(prevValues, currentValues) => {
                    return prevValues.gateway_id !== currentValues.gateway_id;
                }}>                     
                    {({ getFieldValue }) => { 
                        let gatewayId = getFieldValue('gateway_id');
                        let modelList = !forDevice ? gatewayModelList : gatewayId === 0 ? networkModelList : deviceModelList;   
                        return (   
                            <div style={{ display:'flex', flexWrap:'wrap' }}>
                                {
                                    modelList && modelList.length 
                                    ?
                                    modelList.map((item,i)=>(
                                        <div key={item.model_code} style={{ width:'33.3%', padding:'0 6px 6px 0'  }} onClick={()=>{
                                            setCurrentModel(item.model_code);
                                        }}>
                                            <div style={{ padding:'0 1rem 1rem 1rem', position:'relative', backgroundColor:'rgba(255, 255, 255, 0.1)', textAlign:'center', width:'100%', borderWidth:'1px', borderStyle:'solid', borderColor:item.model_code === currentModel ? '#1890ff' : 'transparent', cursor:'pointer', borderRadius:'6px' }}>
                                                <img src={item.img_path} style={{ height:'180px' }} />
                                                <span style={{ position:'absolute', left:'50%', bottom:'0', color:'rgb(24 144 255)', fontWeight:'bold', transform:'translateX(-50%)', whiteSpace:'nowrap' }}>{ item.model_desc }</span>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    null
                                }
                            </div> 
                        )
                        
                    }}                    
                </Form.Item>                                 
                {
                    forDevice 
                    ?
                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues)=>{
                        return prevValues.gateway_id !== currentValues.gateway_id;
                    }}>
                        {({ getFieldValue })=>{
                            let gatewayId = getFieldValue('gateway_id');
                            return (
                                gatewayId === 0 
                                ?
                                null
                                :
                                <Form.Item name='order_by' label='主机通道号' rules={[{ required:true, message:'主机通道号不能为空'}]} >                      
                                    <Select>
                                        {
                                            [1,2,3,4].map((item,index)=>(
                                                <Option key={item} value={item}>{ item }</Option>
                                            ))
                                        }
                                    </Select>                      
                                </Form.Item>
                            )
                        }}
                    </Form.Item>
                    :
                    null
                }
                <Form.Item name='meter_name' label={forDevice ? '设备名称' : '主机名称'} rules={[{ required:true, message:'设备名称不能为空'}]}>
                    <Input />
                </Form.Item>
                
                <Form.Item name='register_code' label='注册码' rules={[ { required:true, message:'注册码不能为空' }]}>
                    <Input />
                </Form.Item>
                {
                    isAgent && !info.forEdit
                    ?
                    <Form.Item name='company_id' label='选择公司' rules={[{ required:true, message:'请选择归属公司'}]}>
                        {
                            companyList.length  
                            ?
                            <Select>
                                {
                                    companyList.map((item)=>(
                                        <Option key={item.key} value={item.key}>{ item.title }</Option>
                                    ))
                                }
                            </Select>
                            :
                            null
                        }
                    </Form.Item>
                    :
                    null
                }                
                {
                    forDevice 
                    ?
                    null
                    :
                    <Form.Item label='设备坐标' >
                        {
                            Object.keys(pos).length 
                            ?
                            <div style={{ display:'flex', alignItems:'center', padding:'0 10px', height:'30px', backgroundColor:'#333333', borderRadius:'2px' }}>
                                <span style={{ color:'#fff', flex:'1', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden' }}>{ `经度:${pos.lng}  |  维度:${pos.lat}` }</span>
                                <span style={{ color:'#4b96ff', cursor:'pointer' }} onClick={()=>setVisible(true)}>重新定位</span>
                            </div>
                            :
                            <Button type='primary' onClick={()=>setVisible(true)}>选择设备所在地</Button>
                        }
                    </Form.Item>
                }
                <Form.Item name='combust_id' label='所属燃气公司'>
                    {
                        gasCompanys && gasCompanys.length 
                        ?
                        <Select>
                            {
                                gasCompanys.map((item,index)=>(
                                    <Option key={item.combust_id} value={item.combust_id}>{ item.combust_company_name }</Option>
                                ))
                            }
                        </Select>
                        :
                        null
                    }
                </Form.Item>
                {
                    forDevice 
                    ?
                    <Form.Item name='combust_link_name' label='燃气公司负责人'>
                        <Input />
                    </Form.Item>
                    :
                    null
                }
                {
                    forDevice 
                    ?
                    <Form.Item name='combust_link_mobile' label='燃气公司联系方式'>
                        <Input />
                    </Form.Item>
                    :
                    null
                }
                {
                    forDevice 
                    ?
                    <Form.Item name='person_id' label='选择责任人'>
                    {                      
                        <div style={{ display:'flex', alignItems:'center' }}>
                            {
                                managerList && managerList.length 
                                ?
                                <Select>
                                    {
                                        managerList.map((item,index)=>(
                                            <Option key={item.person_id} value={item.person_id}>{ item.name }</Option>
                                        ))
                                    }
                                </Select>
                                :
                                null
                            }
                            <Button type='primary' ghost onClick={()=>setPersonInfo({ visible:true, forEdit:false })}>添加责任人</Button>
                        </div>                    
                    }
                    </Form.Item>
                    :
                    null
                }
                {
                    forDevice 
                    ?
                    <Form.Item name='position' label='位置' rules={[{ required:true, message:'位置信息不能为空' }]}>
                        <Input placeholder='请填入探测器安装位置' />
                    </Form.Item>
                    :
                    null                    
                }
                
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" ghost style={{ marginRight:'1rem' }} onClick={()=>{
                        form.resetFields();
                        setPos({});
                        onClose();
                    }}> 取消 </Button>
                    <Button type="primary" htmlType="submit">确认{ info.forEdit ? '修改' : '添加'} </Button>            
                </Form.Item>
            </Form>
            <Modal visible={visible} footer={null} onCancel={()=>setVisible(false)} width='1000px' title={
                <div>
                    <Search style={{ width:'260px' }} placeholder='请输入公司名称' onSearch={value=>{            
                        if( AMap && value ){
                            AMap.plugin('AMap.PlaceSearch',function(){
                                let placeSearch = new AMap.PlaceSearch({
                                    extensions:'all',
                                });
                                placeSearch.search(value,function(status, result){
                                    // console.log(status);
                                    // console.log(result);
                                    if ( points.length && map.remove ) map.remove(points);
                                    if ( status === 'complete' && result.poiList.pois && result.poiList.pois.length ) {
                                        // 搜索到结果,默认取第一条搜索值
                                        let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                                        result.poiList.pois.forEach(point=>{ 
                                            let pos = [point.location.lng, point.location.lat];
                                            let marker = new AMap.Marker({
                                                position:pos,
                                                map
                                            });
                                            marker.extData = { company_name:point.name, lng:pos[0], lat:pos[1], address:point.address, province:point.pname, city:point.cityname, area:point.adname };
                                            marker.content = `<div><p style="font-weight:bold;">${point.name}</p><p>地址:${point.address}</p><p>电话:${point.tel}</p></div>`;
                                            marker.on('mouseover', handleShowInfo);
                                            marker.on('click',handleClick);  
                                            points.push(marker);                               
                                        });
                                       
                                        function handleClick(e){
                                            setPos({ lng:e.target.extData.lng, lat:e.target.extData.lat});
                                            setVisible(false);
                                        }
                                        function handleShowInfo(e){
                                            infoWindow.setContent(e.target.content);
                                            infoWindow.open(map, e.target.getPosition());
                                        }
                                        map.setFitView();
                                        
                                    } else {
                                        message.info('请输入完整的关键词查询');
                                    }
                                });
                            })
                        } else {
                            message.info('查询位置不能为空');
                        }
                    }}/>
                </div>
            }>
                <div id='my-map' style={{ width:'940px', height:'600px' }}></div>
            </Modal>
            <Modal
                visible={personInfo.visible}
                footer={null}
                width="40%"
                bodyStyle={{ padding:'40px'}}
                closable={false}
                className={IndexStyle['modal-container']}
                onCancel={()=>setPersonInfo({ visible:false, forEdit:false })}
            >
                <ContactManagerForm 
                    info={personInfo}
                    onDispatch={action=>onDispatch(action)}                            
                    onClose={()=>setPersonInfo({ visible:false, forEdit:false })} 
                />
            </Modal>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info || prevProps.AMap !== nextProps.AMap || prevProps.managerList !== nextProps.managerList ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddForm, areEqual);