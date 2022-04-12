import React from 'react';
import PageItem from './PageItem';
import { Spin } from 'antd';
import Loading from '@/pages/components/Loading';
import IndexStyle from '@/pages/IndexPage.css';
import style from '../RunningReport.css';
import LineChart from './LineChart';
import BarChart from './BarChart';

function PageItem3({ title, data, text, maxDay, isLoading }){
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
            <div style={{ height:'20%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>流量/压力总体情况</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            text.map((item,index)=>(
                                <div className={style['desc-text']} key={index}><span className={style['num']}>{ index + 1 }. </span>{ item }</div>

                            ))
                        }
                    </div>
                </div>
            </div>
            <div style={{ height:'38.3%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>瞬时流量曲线</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <LineChart xData={data.date} yData={data.speed} unit='m³/min' theme='dark' maxDay={maxDay} />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
                    </div>
                </div>
            </div>
            <div style={{ height:'38.3%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>压力曲线</div>
                    </div>
                    <div className={style['card-content']}>
                        {
                            loaded
                            ?
                            <LineChart xData={data.date} yData={data.pressure} maxDay={maxDay} unit='bar' theme='dark' />
                            :
                            <Spin className={IndexStyle['spin']} />
                        }
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
export default React.memo(PageItem3, areEqual);