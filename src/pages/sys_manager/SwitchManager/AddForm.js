import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message, InputNumber, Divider, Tooltip, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';
import AMapLoader from '@amap/amap-jsapi-loader';

const { Option } = Select;
const { Search } = Input;

function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}

let baudrateList = [{ key:1, value:600}, { key:2, value:1200}, { key:3, value:2400 }, { key:4, value:4800 }, { key:5, value:7200}, { key:6, value:9600}, { key:7, value:19200 }];
let protocolList = [{ key:1, value:'DL/T 645—1997协议'}, { key:2, value:'交流采样装置通信协议'}, { key:30, value:'DL/T 645—2007'}, { key:31, value:'串行接口连接窄带低压载波通信模块接口协议'}, { key:32, value:'CJ-T_188' }]

function AddForm({ info, gatewayList, gatewayId, groupList, ACModel, ACBrand, onDispatch, onClose }){
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const [form] = Form.useForm();
    let [value, setValue] = useState('');
    let [brandList, setBrandList] = useState(ACBrand);
    useEffect(()=>{
        form.setFieldsValue({
            gateway_id: info.forEdit ? info.currentMach.gateway_id : null,
            meter_name : info.forEdit ? info.currentMach.meter_name : null,
            model_code:info.forEdit ? info.currentMach.model_code : null,
            register_code: info.forEdit ? info.currentMach.register_code : null,
            order_by : info.forEdit ? info.currentMach.order_by : null,
            port: info.forEdit ? info.currentMach.port : null,
            baudrate:info.forEdit ? info.currentMach.baudrate : null,
            protocol:info.forEdit ? info.currentMach.protocol : null,
            passw:info.forEdit ? info.currentMach.passw : null,
            parentAdr : info.forEdit ? info.currentMach.parentAdr : null,
            brand: info.forEdit ? info.currentMach.brand : null,
            grp:info.forEdit ? info.currentMach.grp ? info.currentMach.grp : null : null
        });
       
    },[info]);
    return (
        <div>
            <Form
                {...layout} 
                name="add-form"
                form={form}
                onFinish={values=>{
                    console.log(values);
                    if ( info.forEdit ) {
                        values.mach_id = info.currentMach.mach_id;
                    }
                    if ( values.grp ){
                        values.grp_name = groupList.filter(i=>i.grp === values.grp )[0].grp_name;
                    }
                    new Promise((resolve,reject)=>{
                        onDispatch({ type:'gateway/addACSync', payload:{ values, resolve, reject, forEdit:info.forEdit, gateway_id:gatewayId }});
                    })
                    .then(()=>{
                        onClose();
                        form.resetFields();
                        message.success(`${info.forEdit ? '修改' : '添加'}空调设备成功`);
                    })
                    .catch(msg=>{
                        message.error(msg);
                    })
                }}
            >
                
                <Form.Item name='gateway_id' label='选择网关' rules={[{ required:true, message:'必须挂载到某个网关下'}]}>
                    <Select>
                        {
                            gatewayList.map((item,index)=>(
                                <Option value={item.mach_id} key={item.mach_id}>{ item.meter_name }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                
                <Form.Item name='meter_name' label='设备名称' rules={[{ required:true, message:'设备名称不能为空'}]}>
                    <Input />
                </Form.Item>
               
                <Form.Item name='model_code' label='设备模型' rules={[{ required:true, message:'请选择设备模型'}]}>
                    <Select>
                        {
                            ACModel.map((item,index)=>(
                                <Option value={item.model_code} key={item.model_code}>{ item.model_desc }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                
                <Form.Item name='register_code' label='注册码' rules={[ { required:true, message:'注册码不能为空' }]}>
                    <Input disabled={ info.forEdit ? true : false } />
                </Form.Item>
                
                <Form.Item name='order_by' label='排序值' rules={[ { required:true, message:'请指定设备排序值' }]}>
                    <Input placeholder='排序值须按照真实连接顺序' suffix={
                        <Tooltip title='排序值须按照真实连接顺序'>
                            <InfoCircleOutlined />
                        </Tooltip>
                    } />
                </Form.Item>
                <Form.Item name='port' label='端口号' rules={[{ required:true, message:'请指定终端通道端口号'}]}>
                    <InputNumber style={{ width:'100%' }} min={1} max={31} placeholder='端口号取值范围 : 1 ~ 31 ' />
                </Form.Item>
                <Form.Item name='baudrate' label='波特率'>
                    <Select>
                        {
                            baudrateList.map((item,index)=>(
                                <Option key={item.key} value={item.key}>{ item.value + ' ' + 'bps' }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='protocol' label='通信协议类型'>
                    <Select>
                        {
                            protocolList.map((item, index)=>(
                                <Option key={item.key} value={item.key}>{ item.value }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='passw' label='通信密码'>
                    <Input.Password />
                </Form.Item>
                <Form.Item name='parentAdr' label='所属网关通信地址'>
                    <Input />
                </Form.Item>
                <Form.Item name='brand' label='空调品牌'>
                    <Select onSelect={()=>{
                        setValue('');
                        setBrandList(ACBrand);
                    }} dropdownRender={menu=>{
                        return (
                            <div>
                                { menu }
                                <Divider style={{ margin: '4px 0' }} />
                                <div style={{ display: 'flex', alignItems:'center', flexWrap: 'nowrap', padding:'4px 10px' }}>
                                    <Input style={{ flex: 'auto', marginRight:'10px', }} value={value} onChange={e=>setValue(e.target.value)} />
                                    <Button type='primary' onClick={()=>{
                                        let temp = ACBrand.filter(item=>item.brand_name.includes(value));
                                        setBrandList(temp);
                                    }}>查询</Button>
                                </div>
                            </div>
                        )
                    }}>
                        {
                            brandList.map((item,index)=>(
                                <Option key={item.brand} value={item.brand}>{ item.brand_name }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item name='grp' label='网关分组'>
                    <Select notFoundContent={<div>还没有设置网关分组</div>}>
                        {
                            groupList.map((item,index)=>(
                                <Option key={item.grp} value={item.grp}>{ item.grp_name }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button type="primary" style={{margin:'0 10px'}} onClick={()=>{
                        form.resetFields();
                        onClose();
                    }}> 取消 </Button>
                </Form.Item>
            </Form>
            
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddForm, areEqual);