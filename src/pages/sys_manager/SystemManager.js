import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Menu, message } from 'antd';
import style from '@/pages/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import AddCompany from './add_company';
import AddUser from './add_user';
import RolePermission from './role_permission';
import LogManager from './log_manager';
import ContactManager from './contact_manager';
import PwdManager from './pwd_manager';

let subMenuMaps = {
    'sys_setting_company':AddCompany,
    'sys_setting_user':AddUser,
    'sys_setting_role':RolePermission,
    'sys_setting_log':LogManager,
    'sys_setting_contact':ContactManager,
    'sys_setting_pwd':PwdManager
};

function SystemManager({ dispatch, user, switchMach }){
    let { currentMenu } = user;
    let { gatewayList, gatewayLoading, currentGateway, currentSwitch } = switchMach;
    const [subMenu, toggleSubMenu] = useState('');
    useEffect(()=>{
        if ( currentMenu.child && currentMenu.child.length ){
            toggleSubMenu(currentMenu.child[0]);
        }
    },[currentMenu]);
    
    let sidebar = (
        <div>
            <div className={style['card-container'] + ' ' + style['topRadius'] + ' ' + style['float-menu-container']}  style={{ padding:'0', height:'auto', paddingBottom:'10px' }}>
                <div className={style['card-title']} style={{ color:'#fff' }}>导航功能</div>
                <div className={style['card-content']} style={{ padding:'0' }}>
                    <Menu mode='inline' selectedKeys={[subMenu.menu_code]} onClick={e=>{
                        let temp = currentMenu.child.filter(i=>i.menu_code === e.key)[0];
                        toggleSubMenu(temp);
                    }}>
                        {
                            currentMenu.child && currentMenu.child.length 
                            ?
                            currentMenu.child.map((item,index)=>(
                                <Menu.Item key={item.menu_code}>{ item.menu_name }</Menu.Item>
                            ))
                            :
                            null
                        }
                    </Menu>
                </div>
            </div>
        </div>
    
    ); 
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
   
}

export default connect(({ user, switchMach })=>({ user, switchMach }))(SystemManager);