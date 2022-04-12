import React, { useState, useEffect } from 'react';
import { Form, Select, Input, InputNumber, Button, message, Tooltip, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from '@/pages/routes/IndexPage.css';

const { Option } = Select;
const { Search } = Input;

function AddForm({ info, gatewayList, currentGateway, onDispatch, onClose }){
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const [form] = Form.useForm();
   
    useEffect(()=>{
            form.setFieldsValue({
                mach_id : info.forEdit ? info.currentMach.mach_id : gatewayList[0].mach_id,
                grp : info.forEdit ? info.currentMach.grp : null,
                grp_name : info.forEdit ? info.currentMach.grp_name : ''
            });       
    },[info]);
    return (
            <Form
                {...layout} 
                name="add-form"
                form={form}
                onFinish={values=>{
                    values.mach_id = currentGateway.mach_id;
                    if ( info.forEdit ){
                        values.grp_id = info.currentMach.id;
                    }
                    new Promise((resolve,reject)=>{
                        onDispatch({ type:'gateway/addGroupSync', payload:{ values, resolve, reject, forEdit:info.forEdit }});
                    })
                    .then(()=>{
                        onClose();
                        message.success(`${info.forEdit ? '修改' : '添加'}网关分组成功`);
                    })
                    .catch(msg=>{
                        message.error(msg);
                    })
                }}
            >             
                <Form.Item name='mach_id' label='选择网关' rules={[{ required:true, message:'必须挂载到某个网关下'}]}>
                    <Select>
                        {
                            gatewayList.map((item,index)=>(
                                <Option value={item.mach_id} key={item.mach_id}>{ item.meter_name }</Option>
                            ))
                        }
                    </Select>
                </Form.Item>  
                <Form.Item name='grp' label='分组编码' rules={[{ required:true, message:'分组编码不能为空'}]}>
                    <InputNumber style={{ width:'100%' }} min={0} max={98} placeholder='分组编码范围:0 ~ 98' />
                </Form.Item>          
                <Form.Item name='grp_name' label='分组名称' rules={[{ required:true, message:'分组名称不能为空'}]}>
                    <Input />
                </Form.Item>
                
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
                    <Button type="primary" htmlType="submit">确定</Button>
                    <Button type="primary" style={{margin:'0 10px'}} onClick={()=>{
                        form.resetFields();
                        onClose();
                    }}> 取消 </Button>
                </Form.Item>
            </Form>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info  ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddForm, areEqual);