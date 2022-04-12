import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import AMapLoader from '@amap/amap-jsapi-loader';
import { Spin } from 'antd';
import arrowNormal from '../../../public/arrow-normal-2.png';
import arrowNormal2 from '../../../public/arrow-normal-3.png';
import arrowError from '../../../public/arrow-warning-2.png';
import style from './AgentManager.css';
let map = null;
let timer = null;
let moveTimer = null;
let points = [];
let warningInfo = null;
let infoWindow = null;

function AgentMap({ companyList, msg, AMap, currentNode, userType, dispatch }) {
    const [isLoading, setLoading] = useState(true);
    let [info, setInfo] = useState({}); 
    
    useEffect(()=>{
        if ( !AMap ){
            AMapLoader.load({
                key:'26dbf93c4af827e4953d7b72390e3362',
                version:'1.4.15',
            })
            .then((MapInfo)=>{                
                // 经纬度转换成容器内像素坐标
                let lng = 113.27324;
                let lat = 23.15792;
                // 添加canvas图层            
                // 添加标记点
                // 南宁（108.27331，22.78121），广州（113.27324，23.15792） 福州（119.27345，26.04769) 惠州(114.38257,23.08464)
                dispatch({ type:'user/setMap', payload:MapInfo });   
            })
        }
        window.handleProjectEntry = (id, name)=>{
            history.push({
                pathname:'/terminal_monitor',
                state:{
                    key:+id,
                    title:name,
                    type:'company'
                }
            })
        }
        return ()=>{
            if ( map && map.destroy ){
                map.destroy();
            }
            clearTimeout(timer);
            timer = null;
            clearTimeout(moveTimer);
            moveTimer = null;
            map = null;
            points = [];
            warningInfo = null;
            infoWindow = null;
            window.handleProjectEntry = null;
        }
    },[]);
    useEffect(()=>{
        if ( AMap ){
            if ( !map ){
                // 清除定位点
                map = new AMap.Map('my-map',{
                    resizeEnable:true,
                    zoom:18,
                    // zoom:12,
                    viewMode:'3D',
                    mapStyle: 'amap://styles/16612875d805eaf4ea70c9173129eb65',
                    // center:[company.lng, company.lat],
                    pitch:65,
                    // showLabel:false,
                    layers: [
                        new AMap.TileLayer(),
                        new AMap.Buildings({
                            zooms: [12, 20],
                            zIndex: 10,
                            opacity:1,
                            // heightFactor: 1//2倍于默认高度，3D下有效
                        })
                    ],
                });
            }
            if ( points.length ) map.remove(points);
            function handleShowInfo(e){
                clearTimeout(timer);
                let target = e.target;
                let { lng, lat, company_name, company_id, totalMach, warningMach } = target.w.extData;
                let pos = map.lngLatToContainer(new AMap.LngLat(lng, lat));
                setInfo({ x:pos.x, y:pos.y, company_name, company_id, totalMach, warningMach });
                timer = setTimeout(()=>{
                    setInfo({});
                },3000)                    
            }
            function handleHideInfo(e){
                clearTimeout(timer);
                timer = setTimeout(()=>{
                    setInfo({});
                },1000)
            }
           
            companyList.forEach(item=>{
                // 添加标记点
                let marker = new AMap.Marker({
                    position:new AMap.LngLat(+item.lng, +item.lat),
                    title:'',
                    icon: item.combust_type === 5 ? arrowNormal2 : arrowNormal,
                    extData:{ province:item.province, city:item.city, area:item.area, lng:+item.lng, lat:+item.lat, company_name:item.company_name, company_id:item.company_id, totalMach:item.totalMach, warningMach:item.warningMach, combust_type:item.combust_type }
                });
                map.add(marker);
                points.push(marker);
                marker.on('mouseover', handleShowInfo);
            });
          
            if ( msg.detail && msg.detail.length ){
                warningInfo = msg.detail[0];
                let marker = new AMap.Marker({
                    position:new AMap.LngLat(warningInfo.lng, warningInfo.lat),
                    title:'',
                    icon:arrowError,
                    // zIndex默认值100
                    zIndex:110,
                    extData:{ is_warning:true, province:warningInfo.province, city:warningInfo.city, area:warningInfo.area, lng:+warningInfo.lng, lat:+warningInfo.lat, company_name:warningInfo.company_name, company_id:warningInfo.company_id, totalMach:warningInfo.totalMach, warningMach:warningInfo.warningMach, combust_type:warningInfo.combust_type }
                });
                map.add(marker);
                points.push(marker);
                var content = `
                    <div class=${style['info-container-2']}>
                        <div class=${style['info-title']}>${ warningInfo.type_name }</div>
                        <div class=${style['info-content']}>
                            <div>
                                <span class=${style['sub-text']}>公司:</span>
                                <span class=${style['data']}>${warningInfo.company_name}</span>
                            </div>
                            <div>
                                <span class=${style['sub-text']}>地点:</span>
                                <span class=${style['data']}>${warningInfo.position_name || '--'}</span>
                            </div>
                            <div>
                                <span class=${style['sub-text']}>时间:</span>
                                <span class=${style['data']}>${warningInfo.date_time}</span>
                            </div>
                            <div>
                                <span class=${style['sub-text']}>设备:</span>
                                <span class=${style['data']}>${warningInfo.mach_name}</span>
                            </div>
                        </div>
                        
                        <div class=${style['info-result']}>${ ( warningInfo.warning_info || '--' ) + ' ' + ( warningInfo.warning_value || '--' )}</div>
                        <div style="text-align:center"><span class=${style['btn']} onclick="handleProjectEntry('${warningInfo.company_id}', '${warningInfo.company_name}')">进入项目</span></div>
                    </div>
                `;
                var position = new AMap.LngLat(warningInfo.lng, warningInfo.lat);
                infoWindow = new AMap.InfoWindow({
                    isCustom:true,
                    content,
                    offset: new AMap.Pixel(5,-50)
                });
                // console.log(infoWindow);
                infoWindow.open(map,position);
                moveTimer = setTimeout(()=>{
                    map.setCenter([warningInfo.lng, warningInfo.lat]);
                },1000) 
            } 
            map.setFitView();
        }
    },[msg, AMap]);
    useEffect(()=>{
        // 通过currentNode.type字段判断用户选择的节点
        if ( map && currentNode.type ) {
            if ( points.length ) {
                map.remove(points);
            }
            let temp;
            // 更新告警信息框的状态
            if ( warningInfo && infoWindow ){
                if ( (currentNode.type === 'company' && currentNode.key !== warningInfo.company_id) || ( currentNode.type === 'user' && ( warningInfo.combust_type !== userType )) ) {       
                    infoWindow.close();
                } else {
                    infoWindow.open(map, new AMap.LngLat(warningInfo.lng, warningInfo.lat))
                }
            }
            if ( currentNode.key === 'zh' && currentNode.type === 'country' ) {
                temp = points;
            } else {
                temp = points.filter(item=>{
                    let { is_warning, province, city, area, company_id, combust_type } = item.De.extData;
                    // 告警信息  
                    if ( currentNode.type === 'province' ) {
                        return currentNode.key === province ;
                    } else if ( currentNode.type === 'city') {
                        return currentNode.key === city;
                    } else if ( currentNode.type === 'area' ) {
                        return currentNode.key === area;
                    } else if ( currentNode.type === 'company' ) {
                        return currentNode.key === company_id;
                    } else if ( currentNode.type === 'user' ) {
                        // 考虑告警信息窗的筛选
                        // type === 'user' 筛选企业/燃气公司/市局/家用终端
                        return combust_type === userType;
                    }
                }); 
            }
            
            // 当切换树图省/市/区/时重置地图的层级和中心点         
            temp.forEach(item=>{
                map.add(item);
            });
            map.setFitView();
        }
    },[currentNode])
    return (
        <div style={{ height:'100%', width:'82%' }}>
            <div className={style['info-container']} style={{ display: Object.keys(info).length ? 'block' : 'none', top: ( info.y - 160 ) + 'px', left: ( info.x - 100 ) + 'px' }}>
                <div className={style['info-title']}>{info.company_name}</div>
                <div className={style['info-content']}>
                    <div>
                        <div style={{ color:'rgba(255,255,255,0.64)', fontSize:'0.8rem' }}>总设备数</div>
                        <div><span className={style['data']}>{ info.totalMach }</span><span className={style['unit']}>个</span></div>
                    </div>
                    <div>
                        <div style={{ color:'rgba(255,255,255,0.64)', fontSize:'0.8rem' }}>告警设备</div>
                        <div><span className={style['data']} style={{ color:'#f30d0d' }}>{ info.warningMach }</span><span className={style['unit']} style={{ color:'#f30d0d' }}>个</span></div>
                    </div>
                </div>
                <div style={{ textAlign:'center' }}><span className={style['btn']} onClick={()=>{ 
                    history.push({
                        pathname:'/terminal_monitor',
                        state:{
                            key:info.company_id,
                            title:info.company_name,
                            type:'company'
                        }
                    }) 
                }}>进入项目</span></div>
            </div>
            <div id='my-map' style={{ height:'100%' }}></div>
        </div>
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.msg !== nextProps.msg || prevProps.AMap !== nextProps.AMap || prevProps.currentNode !== nextProps.currentNode ) {
        return false;
    } else {
        return true;
    }
}
export default React.memo(AgentMap, areEqual);