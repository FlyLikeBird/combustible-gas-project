import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tree, Spin, Menu, Input, message } from 'antd';
import style from '@/pages/IndexPage.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import MachDetail from './mach_detail';
import MachRecord from './mach_record';
const { Search } = Input;
let subMenuMaps = {
    'mach_manager_detail':MachDetail,
    'mach_manager_clean':MachRecord,
    'mach_manager_fix':MachRecord
};

function MachManager({ dispatch, user, gateway }){
    let { currentMenu, userInfo } = user;
    let { treeLoading, treeData, currentNode, activeKey } = gateway;
    const [subMenu, toggleSubMenu] = useState('');
    let inputRef = useRef();
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
            {
                userInfo.agent_id 
                ?
                <div className={style['card-container']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                    <div className={style['card-title']}>区域选择</div>
                    <div className={style['card-content']}>
                        {
                            treeLoading 
                            ?
                            null
                            :
                            <Search 
                                placeholder='可输入省/市/区/企业查询'
                                ref={inputRef}
                                className={style['custom-search-input']} 
                                allowClear={true}
                                onSearch={value=>{
                                    dispatch({ type:'gateway/setTree', payload:{ keyword:value }});
                                    if ( subMenu.menu_code === 'mach_manager_detail' ) {
                                        dispatch({ type:'gateway/fetchGateway' });
                                        dispatch({ type:'gateway/fetchDevices'});                                     
                                    }
                                    if ( inputRef.current && inputRef.current.input ) inputRef.current.input.blur();
                                    // if ( !value ) {
                                    //     // 重置节点树
                                    //     dispatch({ type:'gateway/setTree', payload:{ keyword:'' }});
                                    // }
                                }}
                            />
                        }
                        {
                            treeLoading
                            ?
                            <Spin className={style['spin']} />
                            :
                            <Tree
                                className={style['custom-tree']}
                                defaultExpandAll={true}
                                // expandedKeys={expandedKeys}
                                // onExpand={temp=>{
                                //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                // }}
                                selectedKeys={[currentNode.key ]}
                                treeData={treeData}
                                onSelect={(selectedKeys, {node})=>{ 
                                    dispatch({ type:'gateway/toggleCurrentNode', payload:node });  
                                    dispatch({ type:'gateway/setCompany', payload:{ company_id:node.key }});
                                    dispatch({ type:'region/fetchManagerList'});
                                    if ( subMenu.menu_code === 'mach_manager_detail' ) {
                                        dispatch({ type:'gateway/fetchGateway' });
                                        dispatch({ type:'gateway/fetchDevices'});                                     
                                    }                                                                                               
                                }}
                            />
                        }
                    </div>
                </div>
                :
                null
            } 
        </div>
    
    ); 
    let Component = subMenuMaps[subMenu.menu_code] || (()=>null);
    let content = <Component menu={subMenu} type={subMenu.menu_code === 'mach_manager_clean' ? 2 : 1} />;
    return (
        <ColumnCollapse sidebar={sidebar} content={content} />
    )
   
}

export default connect(({ user, gateway })=>({ user, gateway }))(MachManager);