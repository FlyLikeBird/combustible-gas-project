import React from 'react';
import PageItem from './PageItem';
import { Spin } from 'antd';
import Loading from '@/pages/components/Loading';
import IndexStyle from '@/pages/IndexPage.css';
import style from '../RunningReport.css';
import MultiBarChart from '../../alarm_monitor/MultiBarChart';
import PieChart from '../../alarm_monitor/PieChart';

function PageItem2({ title, data, isAgent, isLoading }){
    let loaded = Object.keys(data).length ? true : false;
    const content = (
        <div style={{ height:'100%' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'28%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>告警分析</div>
                    </div>
                    <div className={style['card-content']}>
                        <div className={style['card-container']} style={{ width:'50%' }}>
                            <PieChart forReport={true} data={ data.typeGroupArr || {}} title='告警分析' />
                        </div>
                        <div className={style['card-container']} style={{ width:'50%' }}>
                            <PieChart forReport={true} forStatus={true} data={ data.cateCodeArr || {}} title='告警分析' />
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ height:'32%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>告警趋势</div>
                    </div>
                    <div className={style['card-content']}>
                        <MultiBarChart forReport={true} timeType='2' data={ data.view ? data.view : {}} category={data.view && data.view.date ? data.view.date: []} title='告警趋势' theme='dark' />
                    </div>
                </div>
            </div>
            <div style={{ height:'38%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>告警排名</div>
                    </div>
                    <div className={style['card-content']}>
                        <MultiBarChart forReport={true} forRank={true} timeType='2' data={data.warningRank ? { '告警数':data.warningRank.map(i=>i.cnt)} : {}} category={data.warningRank ? data.warningRank.map(i=>i.rankName) : []} title='告警排名' theme='dark' />
                    </div>
                </div>
            </div>
        </div>
    )
    return <PageItem title={title} content={content} />
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data || prevProps.isLoading !== nextProps.isLoading ){
        return false;
    } else {
        return true;
    }
}
export default React.memo(PageItem2, areEqual);