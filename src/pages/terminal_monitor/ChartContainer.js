import React, { useEffect, useState, useRef } from 'react';
import { DatePicker } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import LineChart from './LineChart';
import style from './TerminalMonitor.css';
import Loading from '@/pages/components/Loading';
import moment from 'moment';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function ChartContainer({ info, data, machLoading, dispatch }){
    let [referDate, setReferDate] = useState(moment(new Date()));
    let inputRef = useRef();
    let item = info.currentMach || {};
    useEffect(()=>{
        dispatch({ type:'terminalMach/fetchMachDetail', payload:{ mach_id:info.currentMach.mach_id, referDate }})
    },[info])
    return (
        <div style={{ position:'relative' }}>
            <div className={style['inline-container']}>
                <div className={style['inline-item-wrapper']} style={{ padding:'0', width:'100%' }}>
                    <div className={style['inline-item']}>
                        <div className={style['inline-item-content']} style={{ background:'transparent' }}>
                            <div style={{ width:'50%', height:'200px', backgroundPosition:'50% 0', backgroundImage:`url(${item.simple_img_path})`, backgroundSize:'contain', backgroundRepeat:'no-repeat' }}></div>
                            <div style={{ width:'50%', paddingRight:'1rem' }}>
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
            </div>

            
                <div style={{ position:'relative', height:'350px' }}>
                    {
                        machLoading 
                        ?
                        <Loading />
                        :
                        null
                    }
                    <div style={{ position:'absolute', right:'0', top:'0', zIndex:'4' }}>
                        <div style={{ display:'inline-flex', alignItems:'center' }}>
                            <div className={style['date-picker-button-left']} onClick={()=>{
                                let temp = new Date(referDate.format('YYYY-MM-DD'));
                                let result = moment(temp).subtract(1,'days');
                                dispatch({ type:'terminalMach/fetchMachDetail', payload:{ mach_id:info.currentMach.mach_id, referDate:result }})
                                setReferDate(result);
                            }}><LeftOutlined /></div>
                            <DatePicker size='small' className={style['custom-date-picker']} ref={inputRef} locale={zhCN} allowClear={false} value={referDate} onChange={value=>{
                                dispatch({ type:'terminalMach/fetchMachDetail', payload:{ referDate:value }});
                                setReferDate(value);
                                if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
                            }} />
                            <div className={style['date-picker-button-right']} onClick={()=>{
                                let temp = new Date(referDate.format('YYYY-MM-DD'));
                                let result = moment(temp).add(1,'days');
                                dispatch({ type:'terminalMach/fetchMachDetail', payload:{ mach_id:info.currentMach.mach_id, referDate:result }})
                                setReferDate(result);
                            }}><RightOutlined /></div>
                        </div>
                    </div>
                    {
                        Object.keys(data).length
                        ?
                        <LineChart data={data} />
                        :
                        null
                    }
                </div>
        </div>
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.info !== nextProps.info || prevProps.machLoading !== nextProps.machLoading || prevProps.data !== nextProps.data ) {
        return false;
    } else {
        return true;
    }
}

export default React.memo(ChartContainer, areEqual);