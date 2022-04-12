import React, { useState, useEffect, useRef } from 'react';
import { Popover, Badge, Button } from 'antd';
import { history } from 'umi';
import { createFromIconfontCN, AlertOutlined, InfoCircleFilled } from '@ant-design/icons';
import ScrollTable from '../ScrollTable';
import style from './header.css';

let alarmTimer = null;

const IconFont = createFromIconfontCN({
    scriptUrl:'//at.alicdn.com/t/font_2314993_bryih7jtrtn.js'
});
function AlarmCom({ dispatch, msg, audioAllowed }){
    const containerRef = useRef();
    const [muted, setMuted] = useState(false);
    useEffect(()=>{  
        if ( !audioAllowed ) {
            function handleAudio(){
                dispatch({ type:'user/setAudioAllowed'});
                setMuted(true);
                alarmTimer = setTimeout(()=>{
                    setMuted(false);
                    document.onclick = null;
                },500);  
            }
            document.onclick = handleAudio;
        }        
        return ()=>{
            clearTimeout(alarmTimer);
            alarmTimer = null;
        }
    },[]);
    useEffect(()=>{
        // 兼容两种情况：
        //  1.登录时通过登录button获取到交互权限
        //  2.刷新时监听整个文档的click事件，当有click时才触发audio的play();
        let audio = document.getElementById('my-audio');
        if ( msg.count ){
            try {           
                if ( !audio ) return;         
                if ( !muted && audioAllowed ){
                    audio.currentTime = 0;
                    audio.play();                                  
                } else {
                    audio.pause();
                }
            } catch(err){
                console.log(err);
            }
        } else {
            if ( audio && audio.pause ) audio.pause();
        }
    },[msg, muted]);

    let thead = [{ title:'位置', dataIndex:'region_name', width:'20%', collapse:true }, { title:'设备', dataIndex:'mach_name', width:'20%', collapse:true }, { title:'分类', dataIndex:'type_name', width:'25%', border:true }, { title:'发生时间', dataIndex:'date_time', key:'time', width:'35%' }];

    return (
        <div ref={containerRef} style={{ cursor:'pointer', display:'inline-flex', alignItems:'center'  }}>
            <AlertOutlined style={{ marginRight:'6px', fontSize:'1.2rem' }} onClick={()=>{
            }} />
            {/* <Popover color='#1d1e32' content={<div style={{ width:'500px'}}><ScrollTable scrollNum={5} thead={thead} data={msg.detail || [] } /></div>}>
                <Badge count={msg.count} onClick={()=>{
                    history.push('/alarm_monitor');
                }} />
            </Popover> */}
            <Badge count={msg.count} onClick={()=>{
                history.push('/alarm_monitor');
            }} />
            <IconFont style={{ fontSize:'1.2rem', margin:'0 0.5rem 0 1rem' }} type={ muted ? 'iconsound-off' : 'iconsound'} onClick={()=>{
                setMuted(!muted);                
            }}></IconFont>
            <span style={{ margin:'0 6px' }}>|</span>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.msg !== nextProps.msg || prevProps.audioAllowed !== nextProps.audioAllowed ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(AlarmCom, areEqual);