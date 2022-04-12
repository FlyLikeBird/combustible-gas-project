import React, { useRef, useEffect } from 'react';
import { connect } from 'dva';
import Header from '@/pages/components/Header';
import style from './IndexPage.css';

function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}

function IndexPage({ dispatch, children, user }){
    let isFulled = isFullscreen();
    let { userMenu, currentMenu, thirdAgent, msg, userInfo, audioAllowed } = user;
    return (
        <div className={style['container'] + ' ' + style['dark']} >
            <Header dispatch={dispatch} audioAllowed={audioAllowed} userInfo={userInfo} userMenu={userMenu} currentMenu={currentMenu} thirdAgent={thirdAgent} msg={msg} isFulled={isFulled} />
            <div style={{ height: isFulled && ( currentMenu.menu_code === '/' || currentMenu.menu_code === 'index' ) ? '100%' : 'calc( 100% - 60px)' }}>
                { children }
            </div>
        </div>
    )
}

export default connect(({ user })=>({ user }))(IndexPage);