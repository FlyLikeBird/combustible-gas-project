import React,{ useEffect, useRef } from 'react';
import { history } from 'umi';
import { connect } from 'dva';
import style from './header.css';
import { Menu, Tag } from 'antd';
import { EyeOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import avatarBg from '../../../../public/avatar-bg.png';
import headerBg from '../../../../public/fullscreen-header.png';
import projectTitle from '../../../../public/project-title.png';
import AlarmCom from './AlarmCom';
import WeatherCom from './WeatherCom';


function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}

function enterFullScreen(){
    try {
        if ( document.documentElement.requestFullscreen ) {
            document.documentElement.requestFullscreen();
        }
    } catch(err){
        console.log(err);
    }
    
}

function cancelFullScreen(){
    // let func = el.cancelFullsceen || el.msCancelFullsceen || el.mozCancelFullsceen || el.webkitCancelFullsceen 
    //         || document.exitFullscreen || document.msExitFullscreen || document.mozExitFullscreen || document.webkitExitFullscreen ;
    // if ( func && typeof func === 'function' ) func();
    if ( typeof document.exitFullscreen === 'function' ) {
        document.exitFullscreen();
    }
}

function Header({ dispatch, audioAllowed, userMenu, currentMenu, msg, userInfo, thirdAgent, isFulled }){
    const containerRef = useRef();
    useEffect(()=>{
        if ( containerRef.current ){
            dispatch({ type:'user/setContainerWidth', payload:containerRef.current.offsetWidth });
        }
        function handleResize(){
            dispatch({ type:'user/setContainerWidth', payload:containerRef.current.offsetWidth });
        }
        function handleKeyDown(e){
            if ( e.keyCode === 122 ) {
                e.preventDefault();
                let dom = isFullscreen();
                if ( dom ) {
                    cancelFullScreen();
                } else {
                    enterFullScreen();
                }
            }
        }
        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown)
        return ()=>{
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
        }
    },[]);
    return (
        
        <div ref={containerRef} className={style['container']} style={{ display : isFulled && ( currentMenu.menu_code === 'index' ) ? 'none' : 'flex' }}>
            <div style={{ display:'inline-flex', alignItems:'center' }}>
                <img src={Object.keys(thirdAgent).length ? thirdAgent.logo_path : ''} style={{ height:'50%', marginRight:'10px' }} />
                <img src={projectTitle} style={{ height:'20px' }} />
                {/* <span className={style['title']}>
                    可燃气体监测
                </span> */}
            </div>
            <Menu className={style['header-menu-container']} mode='horizontal' selectedKeys={currentMenu.menu_code} onClick={e=>{
                let temp = userMenu.filter(i=>i.menu_code === e.key )[0];
                dispatch({ type:'user/toggleCurrentMenu', payload:temp });
                let targetURL = e.key === '/' ? '' : e.key;
                history.push('/' + targetURL );
            }}>
                {             
                    userMenu.map((item,index)=>(
                        <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                    ))
                }
            </Menu>
            <div className={style['weather-container']}>
                {
                    isFulled
                    ?
                    <FullscreenExitOutlined style={{ fontSize:'1.4rem', margin:'0 10px' }} onClick={()=>{
                        cancelFullScreen();
                    }} />
                    :
                    <FullscreenOutlined style={{ fontSize:'1.4rem', margin:'0 10px' }} onClick={()=>{
                        enterFullScreen(document.getElementById('root'));
                    }} />
                }
                <AlarmCom dispatch={dispatch} msg={msg} audioAllowed={audioAllowed} />
                <WeatherCom />
                <div style={{ display:'inline-flex', alignItems:'center', marginRight:'6px' }}>
                    <div style={{ width:'24px', height:'24px', borderRadius:'50%', backgroundColor:'#8888ac', backgroundRepeat:'no-repeat', backgroundSize:'cover', backgroundImage:`url(${avatarBg})`}}></div>
                    <div>{ userInfo.user_name }</div>
                    {/* <Tag color="blue">{ userInfo.role_name }</Tag> */}
                </div>
                <div style={{ cursor:'pointer', zIndex:'2' }} onClick={()=>{
                    dispatch({ type:'user/loginOut'});
                }}>
                    <Tag color='#2db7f5'>退出</Tag>
                </div>
            </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.audioAllowed !== nextProps.audioAllowed ||  prevProps.currentMenu !== nextProps.currentMenu || prevProps.msg !== nextProps.msg || prevProps.thirdAgent !== nextProps.thirdAgent || prevProps.isFulled !== nextProps.isFulled ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(Header, areEqual);