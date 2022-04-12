import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Spin, Select, Input, Tree } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import style from './AgentManager.css';
import IndexStyle from '@/pages/IndexPage.css';
import InfoIcons from '../../../public/info-icons-2.png';
import FullscreenHeader from '@/pages/components/FullscreenHeader';
import AgentMap from './AgentMap';
import LineChart from './LineChart';
import PieChart from './PieChart';
import ScrollTable from '@/pages/components/ScrollTable';
// import MultiLineChart from './MultiLineChart';
// import RegionBarChart from '../alarm_manager/AlarmSum/RegionBarChart';
const { Search } = Input;
const { Option } = Select;

const userTypes = [
    { key:0, title:'全部'},
    { key:1, title:'企业用户' },
    { key:2, title:'燃气公司'},
    { key:3, title:'市局'},
    { key:4, title:'安装公司'},
    { key:5, title:'家用终端'}
]
function isFullscreen(){
    return document.fullscreenElement    ||
           document.msFullscreenElement  ||
           document.mozFullScreenElement ||
           document.webkitFullscreenElement || false;
}

function AgentManager({ dispatch, user, gateway }){
    let { monitorInfo, treeLoading, treeData, currentNode, companyList } = gateway;
    let { userInfo, msg, AMap, containerWidth, authorized } = user;
    let [userType, setUserType] = useState(0);
    let loaded = Object.keys(monitorInfo).length ? true : false; 
    useEffect(()=>{
        return ()=>{
            dispatch({ type:'gateway/resetMonitorInfo'});
        }
    },[])
    useEffect(()=>{
        if ( authorized ){
            dispatch({ type:'gateway/fetchIndex'});
        }
    },[authorized]);
    let isFulled = isFullscreen();
    return (
        
        <div className={style['container']}>
             {
                isFulled
                ?
                <FullscreenHeader title='可燃气体智慧监测平台' />
                :
                null
            }
            {
                authorized && loaded && !treeLoading
                ?
                <AgentMap companyList={monitorInfo.companys} msg={msg} AMap={AMap} currentNode={currentNode} userType={userType} dispatch={dispatch} />
                :
                null
            }

            {
                userInfo.agent_id 
                ?
                <div className={style['left']} style={{ width:'14%', top: isFulled ? '60px' : '1rem' , height : isFulled ? 'calc( 100% - 60px)' : '100%'}}>
                    <Select className={style['custom-select']} style={{ width:'100%', height:'32px' }} value={0} dropdownStyle={{ border:'1px solid #23b9f8', backgroundColor:'rgba(0, 0, 0, 0.45)', padding:'0'  }} dropdownRender={()=>{
                        return (
                            <div style={{ color:'#fff'}}>
                            {
                                treeLoading
                                ?
                                <Spin className={style['spin']} />
                                :
                                <div>
                                    <div style={{ backgroundColor:'#1890ff', fontSize:'0.8rem', cursor:'pointer', textAlign:'center', padding:'4px 10px' }} onClick={()=>{
                                        dispatch({ type:'gateway/toggleCurrentNode', payload:{ key:'zh', type:'country' }});
                                    }}>重置</div>
                                    <div style={{ display:'flex', alignItems:'center', fontSize:'0.8rem', padding:'0 1.2rem', margin:'1rem 0' }}>
                                        <span>用户类型</span>
                                        <Select size='small' className={style['custom-select-2']} style={{ width:'120px', marginLeft:'4px' }} value={userType} onChange={value=>{
                                            setUserType(value);
                                            if ( value ){
                                                dispatch({ type:'gateway/setTreeByUserType', payload:{ userType:value }});
                                            } else {
                                                dispatch({ type:'gateway/setTree', payload:{ keyword:'' }})
                                            }
                                        }} >
                                            {
                                                userTypes.map((item)=>(
                                                    <Option key={item.key} value={item.key}><div>{ item.title }</div></Option>
                                                ))
                                            }
                                        </Select>
                                    </div>
                                    {
                                        treeLoading 
                                        ?
                                        null
                                        :
                                        <Search 
                                            placeholder='可输入省/市/区/企业查询'
                                            style={{ margin:'0 0 1rem 0', padding:'0 1.2rem' }} 
                                            className={IndexStyle['custom-search-input']}
                                            allowClear={true}
                                            onSearch={value=>{
                                                dispatch({ type:'gateway/setTree', payload:{ keyword:value }});
                                            
                                            }}
                                        />
                                    }
                                    <Tree
                                        className={style['custom-tree']}
                                        defaultExpandAll={true}
                                        // expandedKeys={expandedKeys}
                                        // onExpand={temp=>{
                                        //     dispatch({ type:'fields/setExpandedKeys', payload:temp });
                                        // }}
                                        selectedKeys={[currentNode.key]}
                                        treeData={treeData}
                                        onSelect={(selectedKeys, {node})=>{ 
                                            dispatch({ type:'gateway/toggleCurrentNode', payload:node });                                                                                        
                                        }}
                                    />
                                </div>

                            }
                            </div>
                        )
                    }}><Option value={0} key={0}>当前项目名称</Option></Select>
                </div>
                :
                null
            }
            
            <div className={style['right']} style={{ top: isFulled ? '60px' : '0' , height : isFulled ? 'calc( 100% - 60px)' : '100%'}}>
                {/* 规模概要 */}
                <div className={style['card-container']} style={{ height:'20%' }}>
                    <div className={style['card-title']}>
                        <div className={style['card-title-content']}>
                            <span className={style['symbol']}></span>
                            <span style={{ margin:'0 6px'}}>规模概要</span>
                            <span className={style['symbol']}></span>
                        </div>
                        <div className={style['symbol2']}></div>
                    </div>
                    <div className={style['card-content']}>
                        <div className={style['flex-container']}>
                            {
                                monitorInfo.infoList && monitorInfo.infoList.length 
                                ?
                                monitorInfo.infoList.map((item,i)=>(
                                    <div className={style['flex-item']} key={i} style={{ height:'50%' }}>
                                        <div className={style['flex-icon']} style={{ backgroundImage:`url(${InfoIcons})`, backgroundPosition:`-${ i * ( containerWidth <= 1440 ? 24 : 38 )}px 0`}}></div>
                                        <div className={style['flex-content']}>
                                            <div className={style['flex-text']} style={{ color:item.color || '#23b9f8' }}>{ item.title }</div>
                                            <div>
                                                <span className={style['flex-data']} style={{ color:item.color || '#fff' }}>{ item.value }</span>
                                                <span className={style['flex-unit']} style={{ color:item.color || '#fff'}}>{ item.unit }</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                                :
                                null
                            }         
                        </div>
                    </div>
                </div>
                {/* 告警趋势 */}
                <div className={style['card-container']} style={{ height:'25%' }}>
                    <div className={style['card-title']}>
                        <div className={style['card-title-content']}>
                            <span className={style['symbol']}></span>
                            <span style={{ margin:'0 6px'}}>告警趋势</span>
                            <span className={style['symbol']}></span>
                        </div>
                        <div className={style['symbol2']}></div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <LineChart data={monitorInfo.view } />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                {/* 告警概况 */}
                <div className={style['card-container']} style={{ height:'25%' }}>
                    <div className={style['card-title']}>
                        <div className={style['card-title-content']}>
                            <span className={style['symbol']}></span>
                            <span style={{ margin:'0 6px'}}>告警概况</span>
                            <span className={style['symbol']}></span>
                        </div>
                        <div className={style['symbol2']}></div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded 
                            ?
                            <PieChart data={monitorInfo.cateCodeArr} />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
                {/* 告警排名 */}
                <div className={style['card-container']} style={{ height:'30%' }}>
                    <div className={style['card-title']}>
                        <div className={style['card-title-content']}>
                            <span className={style['symbol']}></span>
                            <span style={{ margin:'0 6px'}}>告警排名</span>
                            <span className={style['symbol']}></span>
                        </div>
                        <div className={style['symbol2']}></div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded 
                            ?
                            <ScrollTable 
                                thead={[{ title:'排名', dataIndex:'rank', width:'15%', collapse:true }, { title: userInfo.agent_id ? '项目' : '终端', dataIndex:'rankName', width:'65%', collapse:true }, { title:'告警次数', dataIndex:'cnt', width:'20%' }]}
                                data={ monitorInfo.rankList || []} 
                                scrollNum={6}
                                forIndex={true}                            
                            />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default connect(({ user, gateway })=>({ user, gateway }))(AgentManager);