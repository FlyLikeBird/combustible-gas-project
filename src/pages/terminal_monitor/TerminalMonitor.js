import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Tree, Pagination, Modal, Input, Spin, Button, Menu, message } from 'antd';
import IndexStyle from '@/pages/IndexPage.css';
import style from './TerminalMonitor.css';
import ColumnCollapse from '@/pages/components/ColumnCollapse';
import ChartContainer from './ChartContainer';
import Loading from '@/pages/components/Loading';
const { Search } = Input;

let machList = [];
for ( var i=0;i<10;i++){
    machList.push({ title:'工作组A-可燃气体探测'+i, status:'正常', num:'GSAD24879', pos:'D区天然气入口', onlineStatus:'在线', warning:'低报', value:'26' });
}

function TerminalMonitor({ dispatch, user, gateway, terminalMach, location }){
    let [currentGateway, setCurrentGateway] = useState({});
    let inputRef = useRef();
    let [info, setInfo] = useState({ visible:false, currentMach:null });
    let { currentMenu, containerWidth, userInfo, authorized } = user;
    let { treeData, treeLoading, currentNode } = gateway;
    let { machList, isLoading, currentPage, total, machLoading, machDetailInfo } = terminalMach;
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'terminalMach/reset'});
        }
    },[])
    useEffect(()=>{
        if ( authorized ) {
            // keepNode字段区分是否从监控首页定位点跳转，将跳转选定的节点为当前节点
            dispatch({ type:'terminalMach/initMachList', payload:{ keepNode:location.state }});
        }
    },[authorized])
    let sidebar = (
        <div>
            <div className={IndexStyle['card-container']} style={{ padding:'0', height:'auto', boxShadow:'none' }}>
                <div className={IndexStyle['card-title']}>区域选择</div>
                <div className={IndexStyle['card-content']}>
                    {
                        treeLoading 
                        ?
                        null
                        :
                        <Search
                            placeholder='可输入省/市/区/企业查询'
                            ref={inputRef} 
                            className={IndexStyle['custom-search-input']} 
                            allowClear={true}
                            onSearch={value=>{
                                dispatch({ type:'gateway/setTree', payload:{ keyword:value }});
                                dispatch({ type:'terminalMach/fetchMachList'});
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
                        <Spin className={IndexStyle['spin']} />
                        :
                        <Tree
                            className={IndexStyle['custom-tree']}
                            defaultExpandAll={true}
                            // expandedKeys={expandedKeys}
                            // onExpand={temp=>{
                            //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                            // }}
                            selectedKeys={[currentNode.key ]}
                            treeData={treeData}
                            onSelect={(selectedKeys, {node})=>{ 
                                setCurrentGateway({});
                                dispatch({ type:'gateway/toggleCurrentNode', payload:node });
                                dispatch({ type:'terminalMach/fetchMachList'})                                                                     
                            }}
                        />
                    }
                </div>
            </div>
        </div>
    
    ); 
    let content = (
        <div style={{ height:'100%' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div className={style['inline-container']}>
                <div className={style['inline-container-header']}>
                    { currentGateway.mach_id ? <Button type='primary' size='small' style={{ marginRight:'6px' }} onClick={()=>{
                        setCurrentGateway({});
                        dispatch({ type:'terminalMach/fetchMachList' });
                    }}>返回</Button> : null }
                    { 
                        currentGateway.mach_id 
                        ? 
                        <span>当前主机 : <span style={{ color:'rgb(22 147 254)', fontWeight:'bold' }}>{ currentGateway.meter_name }</span></span>
                        :
                        <span>主机列表</span>
                    }
                </div>
                <div className={style['inline-container-main']}>
                    {
                        machList.length 
                        ?
                        machList.map((item, index)=>(
                            <div className={style['inline-item-wrapper']} key={item.mach_id}>
                                <div className={style['inline-item']} onClick={()=>{                                    
                                    if ( item.is_gateway ){
                                        setCurrentGateway(item);
                                        dispatch({ type:'terminalMach/fetchMachList', payload:{ gateway_id:item.mach_id }});
                                    } else {
                                        setInfo({ visible:true, currentMach:item });
                                    }
                                }} style={{ border:item.warning_name ? '1px solid #ff0000' : '1px solid transparent' }}>
                                    <div className={style['inline-item-title']}>
                                        <span>{ item.meter_name }</span>
                                        <div>
                                            <span style={{ fontSize:'0.8rem', marginRight:'6px' }}>
                                                <span>剩余语音通知: </span>
                                                <span style={{ fontSize:'1rem' }}>{ item.voice_notice_cnt }</span>
                                            </span>
                                            <span className={style['tag']} style={{ backgroundColor:item.warning_name ? '#ff0000' : '#55e255'}}>{ item.warning_name ? '异常' : '正常' }</span>
                                        </div>
                                    </div>
                                    <div className={style['inline-item-content']}>
                                        <div style={{ width:'48%', height:'90%', backgroundPosition:'50% 0', backgroundImage:`url(${item.simple_img_path})`, backgroundSize:'contain', backgroundRepeat:'no-repeat' }}></div>
                                        <div style={{ width:'52%', paddingRight:'1rem' }}>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>设备编号</span>
                                                <span className={style['data']}>{ item.register_code }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>位置</span>
                                                <span className={style['data']}>{ item.position || '-- --' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>通讯状态</span>
                                                <span className={style['data']} style={{ color:item.online_status ? '#55e255' : '#ff0000'}}>{ item.online_status ? '在线' : '离线' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>告警</span>
                                                <span className={style['data']} style={{ color:item.warning_name ? '#ff0000' : '#fff'}}>{ item.warning_name || '-- --' }</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>浓度</span>
                                                <span className={style['data']} style={{ color:item.warning_name === '低报' || item.warning_name === '高报' ? '#ff0000' : '#fff'}}>{ `${ item.concentration === null ? '-- --' : item.concentration} ${ item.concentration === null ? '' : '%LEL'}`}</span>
                                            </div>
                                            <div className={style['text-container']}>
                                                <span className={style['text']}>采集时间</span>
                                                <span className={style['data']} style={{ color:'#fff'}}>{ item.record_time || '-- --' }</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <div className={IndexStyle['empty-text']}>{ `该${currentNode.type === 'company' ? '企业' : '区域'} 下没有绑定的终端设备` }</div>
                    }
                </div>
                <div className={style['inline-container-footer']}>
                    <Pagination 
                        current={currentPage}
                        total={total}
                        pageSize={9}
                        showSizeChanger={false}
                        onChange={page=>{
                            dispatch({ type:'terminalMach/fetchMachList', payload:{ currentPage:page }})
                        }}
                    />
                </div>
            </div>
            <Modal
                visible={info.visible}
                title={<div>{ info.currentMach && info.currentMach.title }</div>}
                footer={null}
                width="40%"
                bodyStyle={{ padding:'40px'}}
                className={IndexStyle['modal-container']}
                onCancel={()=>setInfo({ visible:false, currentMach:null })}
            >
                <ChartContainer 
                    info={info}
                    machLoading={machLoading}
                    data={machDetailInfo}
                    dispatch={dispatch}
                />
            </Modal>
        </div>
    );
    return (
        authorized && userInfo.agent_id 
        ?
        <ColumnCollapse sidebar={sidebar} content={content} />
        :
        <div style={{ position:'relative', height:'100%', background:'#05050f', padding:'1rem' }}>{ content }</div>
    )
   
}

export default connect(({ user, gateway, terminalMach })=>({ user, gateway, terminalMach }))(TerminalMonitor);