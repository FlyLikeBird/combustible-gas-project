import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'dva/router';
import { Table, Button, Card, Form, Modal, Input, message } from 'antd';
import { LockOutlined, UserOutlined, DownloadOutlined, FilePdfOutlined } from '@ant-design/icons';
import loginBg from '../../../public/login_bg.jpg';
import switchBg from '../../../public/switch_bg.png';
import switchImg from '../../../public/switch.webp';
import style from './LoginPage.css';
// import { Document, Page, pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 0, span: 24 },
};

function LoginPage({ dispatch, user }) {  
    const { thirdAgent } = user;
    const [form] = Form.useForm();
   
    return (        
        localStorage.getItem('user_id') && location.pathname === '/login'
        ?
        <Redirect to='/' />
        :
        <div className={style.container} >
            {/* <div className={style['logo-container']}>
                <img src={Object.keys(thirdAgent).length ? thirdAgent.logo_path : ''} style={{ marginRight:'20px' }} />
            </div> */}
            
            <div className={style['title-container']}>可燃气体监测系统</div>
            <div className={style['login-container']}>
                <div className={style['img-container']} style={{ backgroundImage:`url(${switchBg})`}}><img src={switchImg} style={{ width:'60%', marginLeft:'50px', marginTop:'50px'}} /></div>
                <div className={style['form-container']}>
                    <div className={style['title']}>用户登录</div>
                    <Form
                        {...layout}
                        className={style['form']}
                        form={form}
                    >
                        <Form.Item                            
                            name="user_name"
                            rules={[{required:true, message:'账号不能为空!'}]}
                        >
                            <Input addonBefore={<UserOutlined />} bordered='false' />
                        </Form.Item>
                        <Form.Item                           
                            name="password"
                            rules={[{required:true, message:'密码不能为空!'}]}
                        >
                            <Input.Password addonBefore={<LockOutlined />} bordered='false' />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" style={{width:'100%', height:'40px', border:'none', backgroundColor:'#ffa84e', boxShadow:'0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d' }} onClick={()=>{
                                form.validateFields()
                                .then(values=>{
                                    new Promise((resolve,reject)=>{
                                        dispatch({type:'user/login', payload:values, resolve, reject })
                                    }).then(()=>{})
                                    .catch(msg=>{
                                        message.error(msg);
                                    })
                                })
                            }}>登录</Button>
                        </Form.Item>
                    </Form>
                    
                </div>
                
                {/* <div style={{ textAlign:'center' }}><a onClick={()=>setVisible(true)} style={{ marginRight:'1rem' }}>开放api.pdf</a><a style={{ marginRight:'1rem' }} onClick={()=>setVisible(true)}>查看</a><a style={{ marginRight:'1rem' }} onClick={()=>{
                    if ( dataURL ){
                        let linkBtn = document.createElement('a');
                        linkBtn.download = '开发api.pdf' ;          
                        linkBtn.href = dataURL;
                        let event;
                        if( window.MouseEvent) {
                            event = new MouseEvent('click');
                        } else {
                            event = document.createEvent('MouseEvents');
                            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        }
                        linkBtn.dispatchEvent(event);
                    } else {
                        message.info('文件还在加载，请稍后再点击下载');
                    }
                }}>下载</a></div> */}
            </div>        
            <div className={style['bg-container']} style={{ backgroundImage:`url(${loginBg})` }}></div>
            
        </div>
    )
}

export default connect(({ user })=>({ user }))(LoginPage);
