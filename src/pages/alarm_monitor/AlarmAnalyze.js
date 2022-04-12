import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Select, Table, Modal, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';
import PieChart from './PieChart';
import MultiBarChart from './MultiBarChart';
import style from '@/pages/IndexPage.css';

const { Option } = Select;

function AlarmAnalyze({ dispatch, user, alarm }){
    let { authorized, userInfo, timeType } = user;
    useEffect(()=>{
        if ( authorized ) {
            dispatch({ type:'alarm/initAlarmAnalyze'});
        }
    },[authorized]);
    let { chartLoading, chartInfo } = alarm;
    return (
        <div style={{ height:'100%' }}>
            {
                chartLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'50px', color:'#fff', display:'flex', alignItems:'center' }}>
                <CustomDatePicker onDispatch={()=>{
                    dispatch({ type:'alarm/fetchAlarmAnalyze'});
                }} />
            </div>
            <div style={{ height:'calc( 100% - 50px)'}}>
                <div style={{ height:'28%' }}>
                    <div className={style['card-container-wrapper']} style={{ width:'50%'}}>
                        <div className={style['card-container']}>
                            <PieChart data={ chartInfo.typeGroupArr || {}} title='告警分析' />
                        </div>
                    </div>
                    <div className={style['card-container-wrapper']} style={{ width:'50%', paddingRight:'0' }}>
                        <div className={style['card-container']}>
                            <PieChart data={ chartInfo.cateCodeArr || {}} title='处理进度' forStatus={true} />
                        </div>
                    </div>
                </div>
                <div style={{ height:'32%', paddingBottom:'1rem' }}>
                    <div className={style['card-container']}>
                        <MultiBarChart timeType={timeType} data={ chartInfo.view ? chartInfo.view : {}} category={chartInfo.view && chartInfo.view.date ? chartInfo.view.date : []} title='告警趋势' theme='dark' />
                    </div>
                </div>
                <div style={{ height:'40%' }}>
                    <div className={style['card-container']}>
                        <MultiBarChart forRank={true} timeType={timeType} data={chartInfo.warningRank ? { '告警数':chartInfo.warningRank.map(i=>i.cnt)} : {}} category={chartInfo.warningRank ? chartInfo.warningRank.map(i=>i.rankName) : []} title='告警排名' theme='dark' />
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default connect(({ user, alarm })=>({ user, alarm }))(AlarmAnalyze);