import React from 'react';
import { Table } from 'antd';
import Loading from '@/pages/components/Loading';
import PageItem from './PageItem';
import style from '../RunningReport.css';
import IndexStyle from '@/pages/IndexPage.css';
import LineChart from './LineChart';
import BarChart from './BarChart';

function PageItem4({ title, data, isLoading }){
    let { avgPower, avgPressure, avgSpeed, elePrice, loadRatio, loadTime, runTime, saveCost } = data.realtimeParam || {};
    const content = (
        <div style={{ height:'100%' }}>
            <div style={{ height:'13%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>节能目标</div>
                    </div>
                    <div className={style['card-content']}>
                        <div>目前空压系统年运行时间<span className={style['data']}>{`${runTime} 小时`}</span>，电价<span className={style['data']}>{`${elePrice} 元/kwh`}</span>，节能金额<span className={style['data']}>{`${saveCost ? Math.round(saveCost) : 0 } 元`}</span></div>
                        {/* <div style={{ margin:'2rem 0' }}>
                            <div className={style['label-container-wrapper']} style={{ width:'33.3%'}}>
                                <div className={style['label-container']} >
                                    <div className={style['data']} style={{ color:'#fff'}}>180.5万千瓦时</div>
                                    <span className={style['sub-text']}>每年节省能耗</span>
                                </div>
                            </div>
                            <div className={style['label-container-wrapper']} style={{ width:'33.3%'}}>
                                <div className={style['label-container']}>
                                    <div className={style['data']} style={{ color:'#fff'}}>180.5万千瓦时</div>
                                    <span className={style['sub-text']}>每年节省能耗</span>
                                </div>
                            </div>
                            <div className={style['label-container-wrapper']} style={{ width:'33.3%'}}>
                                <div className={style['label-container']} >
                                    <div className={style['data']} style={{ color:'#fff'}}>180.5万千瓦时</div>
                                    <span className={style['sub-text']}>每年节省能耗</span>
                                </div>
                            </div>
                            
                        </div> */}
                    </div>
                </div>
            </div>
            <div style={{ height:'33.3%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>气站运行参数</div>
                    </div>
                    <div className={style['card-content']}>
                        <table className={style['table-container']}>
                            <thead>
                                <tr>
                                    <th style={{ width:'260px'}}>项目</th>
                                    <th style={{ width:'100px'}}>单位</th>
                                    <th>本月数据</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ width:'260px'}}>平均系统压力</td>
                                    <td>bar</td>
                                    <td>{ avgPressure || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>平均瞬时流量</td>
                                    <td>m³/min</td>
                                    <td>{ avgSpeed || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>平均功率</td>
                                    <td>kw</td>
                                    <td>{ avgPower || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>空压机累计运行时间</td>
                                    <td>小时</td>
                                    <td>{ runTime || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>空压机累计加载时间</td>
                                    <td>小时</td>
                                    <td>{ loadTime || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>稼动率</td>
                                    <td>%</td>
                                    <td>{ loadRatio || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>电单价</td>
                                    <td>元</td>
                                    <td>{ elePrice || 0 }</td>
                                </tr>
                                <tr>
                                    <td style={{ width:'260px'}}>节省成本</td>
                                    <td>元</td>
                                    <td>{ saveCost ? Math.round(saveCost) : 0 }</td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </div>
            </div>
            {/* <div style={{ height:'33.3%', paddingBottom:'1rem' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>其他收益</div>
                    </div>
                    <div className={style['card-content']}>
                        <div className={style['label-container-wrapper']} style={{ width:'50%'}}>
                            <div className={style['label-container']}>
                                将节省的电费作为投入增加固定资产， 不增加企业的支出
                            </div>
                        </div>
                        <div className={style['label-container-wrapper']} style={{ width:'50%'}}>
                            <div className={style['label-container']}>
                                将节省的电费作为投入增加固定资产， 不增加企业的支出
                            </div>
                        </div>
                        <div className={style['label-container-wrapper']} style={{ width:'50%'}}>
                            <div className={style['label-container']}>
                                将节省的电费作为投入增加固定资产， 不增加企业的支出
                            </div>
                        </div>
                        <div className={style['label-container-wrapper']} style={{ width:'50%'}}>
                            <div className={style['label-container']} >
                                将节省的电费作为投入增加固定资产， 不增加企业的支出
                            </div>
                        </div>                          
                    </div>
                </div>
            </div> */}
           
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
export default React.memo(PageItem4, areEqual);