import React, { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message, Tooltip, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';
const phoneReg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;

const { Option } = Select;
const { Search } = Input;

function validator(a,value){
    if ( !value || (typeof +value === 'number' && +value === +value && +value >=0  )) {
        return Promise.resolve();
    } else {
        return Promise.reject('请填入合适的阈值');
    }
}

let timer = null;

function AddForm({ info, onDispatch, onClose }){
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };
    const [form] = Form.useForm();
    let [count, setCount] = useState(30);
    useEffect(()=>{
        form.setFieldsValue({
            name : info.forEdit ? info.userInfo.name : null,
            mobile: info.forEdit ? info.userInfo.mobile : null,
            department : info.forEdit ? info.userInfo.department : null
        });
    },[info])
    function handleSendMsg(phone){
        if ( phoneReg.exec(phone) ) {
            // 一分钟之后可重新发送
            onDispatch({ type:'region/sendMsgAsync', payload:{ phone }});
            timer = setInterval(()=>{
                setCount(value=>{
                    if ( value === 0 ) {
                        clearInterval(timer);
                        setCount(30);
                    }
                    return value - 1;
                });
            },1000)
        } else {
            message.error('请输入真实的电话号码')
        } 
    }
    useEffect(()=>{
        return ()=>{
            clearInterval(timer);
            timer = null;
            form.resetFields();
        }
    },[])
    return (
            <Form
                {...layout} 
                name="add-form"
                form={form}
                onFinish={values=>{
                    
                    if ( info.forEdit ) {
                        values.person_id = info.userInfo.person_id;
                    }
                    new Promise((resolve, reject)=>{
                        onDispatch({ type:'region/checkMsgAsync', payload:{ values, resolve, reject, forEdit:info.forEdit }})
                    })
                    .then(()=>{
                        onClose();
                        message.success(`${info.forEdit ? '修改' : '添加'}负责人成功`);
                    })
                    .catch(msg=>{
                        message.error(msg);
                    })
                }}
            >
                <Form.Item name='name' label='姓名' rules={[{ required:true, message:'姓名不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item label='手机号' style={{ display:'flex' }}>
                    <Form.Item name='mobile' rules={[{ required:true, message:'手机号不能为空'}, { pattern:phoneReg, message:'请输入合法的手机号码', validateTrigger:'onBlur'}]} noStyle><Input style={{ width:'200px' }} /></Form.Item>                     
                    <Button type='primary' disabled={count === 30 ? false : true } onClick={()=>handleSendMsg(form.getFieldValue('mobile'))}>{ count === 30 ? '发送验证码' : `${count}秒后可重新发送`}</Button>                      
                </Form.Item>
                <Form.Item name='vcode' label='验证码' rules={[{ required:true, message:'验证码不能为空'}]}>
                    <Input />
                </Form.Item>
                <Form.Item name='department' label='部门'>
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
    if ( prevProps.info !== nextProps.info ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(AddForm, areEqual);