import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Upload, Radio, message, Button, Modal, Select, Timeline } from 'antd';
import { PlusOutlined, FileDoneOutlined } from '@ant-design/icons';
import style from '../MachManager.css';

const { TextArea } = Input;
const { Option } = Select;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function validator(a,value){
    if ( !value ) {
        return Promise.reject('该字段不能为空');
    } else {
        return Promise.resolve();
    }
}

function ProgressContainer({ info, type, progressLog, onClose, }){
    const [fileList, setFileList] = useState([]);
    const [previewInfo, setPreviewInfo] = useState({});
    const handlePreview = (file)=>{
        // file.thumbUrl 默认编译成200*200像素的64位字符串, 用FileReader重新解析
        if ( !file.preview ) {
            getBase64(file.originFileObj)
                .then(data=>{
                    file.preview = data;
                    setPreviewInfo({
                        visible:true,
                        img:data,
                        title:file.name
                    });
                })
        } else {
            setPreviewInfo({
                visible:true,
                img:file.preview,
                title:file.name
            })
        }
    };
    const handleBeforeUpload = (file)=>{
        const isJPG = file.type === 'image/jpeg';
        const isJPEG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';
        const isPNG = file.type === 'image/png';
        if (!(isJPG || isJPEG || isGIF || isPNG)) {
            message.error('只能上传JPG 、JPEG 、GIF、 PNG格式的图片')
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('图片不能超过5M');
        }
        return false;
    };
    
    return (
        <div style={{ margin:'20px 0'}}>  
            {
                progressLog && progressLog.length 
                ?
                <Timeline mode='left' className={style['progress-container']}>
                    {
                        progressLog.map((item,index)=>(
                            <Timeline.Item label={item.log_date} key={index}>
                                <div className={style['progress-item']}>
                                    <div className={style['progress-item-title']}>
                                        <div style={{ color:'rgba(255, 255, 255, 0.65)' }}>{ item.record_time }</div>
                                        <div style={{ color:'#fff'}}>
                                           { `${item.oper_name}-${item.mobile}` }
                                        </div>
                                        <div style={{ color:'#008d40' }}>{ type === 2 ? '完成清洁' : '完成维护' }</div>
                                    </div>
                                    <div className={style['progress-item-content']}>
                                        <div style={{ color:'#1b8ffe' }}>{ item.oper_desc }</div>
                                        {
                                            item.img.length 
                                            ?
                                            <div className={style['img-container']}>
                                                {
                                                    item.img.map(img=>(
                                                        <div className={style['img-wrapper']} style={{ backgroundImage:`url(${img})`}}></div>
                                                    ))
                                                }                                                    
                                            </div>
                                            :
                                            null
                                        }
                                    </div>
                                </div>
                            </Timeline.Item>
                        ))
                    }
                </Timeline>
                :
                <div style={{ color:'#fff' }}>
                    
                    <FileDoneOutlined style={{ fontSize:'1.4rem', marginRight:'6px' }} />{ `没有${ type === 2 ? '清洁' : '维护'}记录`}
                </div>
            }        
           
                     
            <Modal visible={previewInfo.visible} width='1200px' title={previewInfo.title} footer={null} onCancel={()=>setPreviewInfo({ ...previewInfo, visible:false })}>
                <img src={previewInfo.img} style={{ width:'100%'}} />
            </Modal>
        </div>
    )
}

export default ProgressContainer;