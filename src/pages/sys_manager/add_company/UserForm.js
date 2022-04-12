import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Checkbox, Button, Select, DatePicker, Switch, Modal, message } from 'antd';
import AMapLoader from '@amap/amap-jsapi-loader';
import CodeImg from '../../../../public/code.jpg';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

const { Search } = Input;
const { Option } = Select;
const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
const passwordReg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";\'<>?,.\/]).{8,20}$/ ;
let msg = '密码需是包含字母/数字/特殊字符且长度8-15位的字符串';
let map = null;
let loaded = false;
let points = [];
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

function UserForm({ AMap, info, onDispatch, forEdit, onClose }){
    let [pos, setPos] = useState({});
    let [visible, setVisible] = useState(false);
    let [addInfo, setAddInfo] = useState({});
    let [value, setValue] = useState('');
    let [content, setContent] = useState('');
    let [form] = Form.useForm();
    useEffect(()=>{        
        if ( !AMap ){
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
            company_name : info.forEdit ? info.currentCompany.company_name : null,
            link_user: info.forEdit ? info.currentCompany.link_user : null,
            link_phone: info.forEdit ? info.currentCompany.link_phone : null,
            is_experience : info.forEdit ? info.currentCompany.is_experience : false 
        });
        if ( info.forEdit && info.currentCompany ) {
            setPos({ lng:info.currentCompany.lng, lat:info.currentCompany.lat, company_address:info.currentCompany.company_address, province:info.currentCompany.province, city:info.currentCompany.city, area:info.currentCompany.area });
            setValue(info.currentCompany.company_address);
        }
    },[info]);
    return (
        <div>
            <Form 
                {...layout} 
                form={form}
                name="nest-messages"
                onFinish={values=>{
                    if ( !Object.keys(pos).length ) {
                        message.info('请选择公司定位');
                        return ;
                    }
                    if ( info.forEdit ){
                        values['company_id'] = info.currentCompany.company_id;
                    }
                    if ( values.is_experience ){
                        values['invalid_date'] = values.invalid_date.format('YYYY-MM-DD HH:mm:ss');
                    }
                    values['lat'] = pos.lat;
                    values['lng'] = pos.lng;
                    values['company_address'] = pos.company_address;
                    values['province'] = pos['province'];
                    values['city'] = pos['city'];
                    values['area'] = pos['area'];
                    new Promise((resolve,reject)=>{
                        onDispatch({ type:'userList/addCompanyAsync', payload:{ values, resolve, reject, forEdit:info.forEdit }})
                    }).then((result)=>{
                        if ( info.forEdit ) {
                            message.success('修改企业成功');
                            onClose();
                        } else {
                            setAddInfo({ user_name:result.user_name, password:result.password, company_name:values['company_name']  });
                        }
                        form.resetFields();
                        if ( points && points.length ) {
                            map.remove(points);
                            map.setFitView();
                            setContent('');
                            setPos({});
                        }
                    }).catch(msg=>{
                        message.error(msg);
                    })                 
                }}
            >
                <Form.Item name='company_name' label="公司名称" rules={[{ required: true, message:'公司名称不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='link_user' label="责任人姓名" rules={[{ required: true, message:'责任人姓名不能为空' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name='link_phone' label="联系方式" rules={[{ required:true, message:'请输入联系方式'}, { pattern:phoneReg, message:'请输入合法的手机号码', validateTrigger:'onBlur'} ]}>
                  <Input />
                </Form.Item>
                <Form.Item label="公司地址">                   
                        {
                            Object.keys(pos).length 
                            ?
                            <div style={{ display:'flex', alignItems:'center', height:'30px', borderRadius:'2px' }}>
                                <Input value={value} onChange={e=>setValue(e.target.value)} style={{ color:'rgba(0, 0, 0, 0.85)', flex:'1', whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden' }} />
                                {/* <span style={{  }}>{ `经度:${pos.lng}  |  维度:${pos.lat}` }</span> */}
                                <span style={{ color:'#4b96ff', cursor:'pointer' }} onClick={()=>setVisible(true)}>重新定位</span>
                            </div>
                            :
                            <Button type='primary' onClick={()=>setVisible(true)}>打开定位</Button>
                        }
                </Form.Item>
                {
                    info.forEdit 
                    ?
                    null 
                    :
                    <Form.Item name='user_name' label="用户名">
                        <Input placeholder="不填则自动分配" />
                    </Form.Item>
                }
                {
                    info.forEdit 
                    ?
                    null
                    :
                    <Form.Item name='password' label="密码">
                        <Input.Password placeholder="不填则自动分配" />
                    </Form.Item> 
                }
                {
                    info.forEdit 
                    ?
                    null
                    :
                    <Form.Item name='is_experience' valuePropName="checked" wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                        <Checkbox>是否为体验账号</Checkbox>
                    </Form.Item>
                }                
                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => {
                    return prevValues.is_experience !== currentValues.is_experience;
                }}>                     
                    {({ getFieldValue }) => { 
                        let isTemp = getFieldValue('is_experience');
                        return ( 
                            isTemp 
                            ?
                            <Form.Item label='体验失效时间' name='invalid_date' rules={[{ required: true, message:'请选择失效时间' }]}>
                                <DatePicker locale={zhCN} showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                            :
                            null
                        )
                        
                    }}                    
                </Form.Item>        
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType='submit'>{ info.forEdit ? '修改' : '创建' }</Button>
                    <Button style={{ marginLeft:'10px' }} onClick={()=>onClose(false)}>取消</Button>
                </Form.Item>
            </Form>
            <Modal width={640} closable={false} visible={Object.keys(addInfo).length ? true : false } footer={null}>
                <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'1.6rem', color:'#1890ff', margin:'6px 0' }}>{ addInfo.company_name + '新建成功'}</div>
                    <div style={{ padding:'1rem', background:'#f3f3f3', display:'flex', justifyContent:'center' }}>
                        <div style={{ marginRight:'6px' }}>账号: <span style={{ color:'#1890ff'}}>{ addInfo.user_name }</span></div>
                        <div>密码: <span style={{ color:'#1890ff'}}>{ addInfo.password }</span></div>
                    </div>
                    <div>
                        <img src={CodeImg} />
                        <div>小程序</div>
                    </div>
                    <div>
                        <Button type='primary' onClick={()=>{
                            setAddInfo({});
                            onClose();

                        }}>确认</Button>
                    </div>
                </div>
            </Modal>
            <Modal visible={visible} footer={null} onCancel={()=>setVisible(false)} width='1000px'  title={
                <div>
                    <Search style={{ width:'260px' }}  placeholder='请输入公司名称或详细地址定位' value={content} onChange={e=>setContent(e.target.value)} onSearch={value=>{            
                        if( AMap && value ){
                            AMap.plugin('AMap.PlaceSearch',function(){
                                let placeSearch = new AMap.PlaceSearch({
                                    extensions:'all',
                                });
                                placeSearch.search(value,function(status, result){
                                    // console.log(status);
                                    // console.log(result);
                                    if ( status === 'complete' && result.poiList.pois && result.poiList.pois.length ) {
                                        // 搜索到结果,默认取第一条搜索值
                                        let infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                                        result.poiList.pois.forEach(point=>{ 
                                            let pos = [point.location.lng, point.location.lat];
                                            let marker = new AMap.Marker({
                                                position:pos,
                                                map
                                            });
                                            marker.extData = { company_name:point.name, lng:pos[0], lat:pos[1], address:point.address, province:point.pname, city:point.cityname, area:point.adname, company_address:point.address };
                                            marker.content = `<div><p style="font-weight:bold;">${point.name}</p><p>地址:${point.address}</p><p>电话:${point.tel}</p></div>`;
                                            marker.on('mouseover', handleShowInfo);
                                            marker.on('click',handleClick);  
                                            points.push(marker);                               
                                        });
                                       
                                        function handleClick(e){
                                            setPos(e.target.extData);
                                            setValue(e.target.extData.company_address);
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
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info || prevProps.AMap !== nextProps.AMap ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(UserForm, areEqual);

