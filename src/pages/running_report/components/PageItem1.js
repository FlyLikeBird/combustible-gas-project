import React from 'react';
import { Spin } from 'antd';
import Loading from '@/pages/components/Loading';
import PageItem from './PageItem';
import style from '../RunningReport.css';
import IndexStyle from '@/pages/IndexPage.css';
import InfoBg from '../../../../public/report_info_bg.png';
import PieChart from './PieChart';
import RadarChart from './RadarChart';

function PageItem1({ title, data, isLoading }){
    let loaded = Object.keys(data).length ? true : false;
    let infoList = loaded ? [{ title:'总告警', value:data.cateGroupArr.total }, { title:'安全告警', value:data.cateGroupArr.safe }, { title:'设备故障告警', value:data.cateGroupArr.fault }, { title:'通讯异常告警', value:data.cateGroupArr.link }] : [];
    let machList = loaded 
                ?
                [
                    { title:'总设备', value:data.info ? data.info.machCnt : 0, unit:'个'  },
                    { title:'主机数', value:data.info ? data.info.gatewaysCnt : 0, unit:'组'  },
                    { title:'在线设备', value:data.info ? data.info.inLineCnt : 0, unit:'个'  },
                    { title:'离线设备', value:data.info ? data.info.outLinkCnt : 0, unit:'个'  },
                    { title:'本月新增设备', value:data.info ? data.info.addMachCnt : 0, unit:'个'  },
                    { title:'本月巡检设备', value:data.info ? data.info.maintainMachCnt : 0, unit:'个'  }

                ]
                :
                [];
    const content = (
        <div style={{ height:'100%' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ display:'flex', height:'18%', justifyContent:'center', margin:'2rem 0' }}>
                {
                    infoList.map((item,i)=>(
                        <div key={i} style={{ width:'160px', height:'74px', marginRight:'1.4rem', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', backgroundImage:`url(${InfoBg})`, backgroundRepeat:'no-repeat', backgroundSize:'contain' }}>
                            <div>{ item.title }</div>
                            <div>
                                <span style={{ fontSize:'1.6rem', fontWeight:'bold', color:'#04a3fe'}}>{ item.value }</span>
                                <span style={{ fontSize:'0.8rem', color:'#04a3fe', margin:'0 4px'}}>件</span>    
                            </div>
                        </div>
                    ))
                }
            </div>
            
            <div style={{ height:'40%', margin:'2rem 0' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>安全隐患评价</div>
                    </div>
                    <div className={style['card-content']}>
                        {/* <div className={style['card-container']} style={{ width:'50%' }}>
                            {
                                loaded
                                ?
                                <RadarChart data={data.grade} />
                                :
                                <Spin className={IndexStyle['spin']} />
                            }
                        </div> */}
                        <div className={style['card-container']} style={{ width:'100%' }}>
                            <div className={style['circle-container']}>
                                <div className={style['circle-symbol']}>
                                    <div className={style['symbol-text']}>
                                        <span>{ data && data.grade ? Math.round(data.grade) : 0}</span>
                                        <span style={{ fontSize:'1rem' }}>分</span>
                                    </div>

                                </div>
                                <div className={style['circle-text']}>安全隐患综合评定</div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div style={{ height:'30%', margin:'2rem 0' }}>
                <div className={style['card-container']}>
                    <div className={style['card-title']}>
                        <div className={style['symbol']}></div>
                        <div>设备健康情况</div>
                    </div>
                    <div className={style['card-content']}>
                        <div className={style['info-container']}>
                            {
                                machList.map((item,i)=>(
                                    <div className={style['info-item']} key={i}>
                                        <div className={style['info-item-label']}>{ item.title }</div>
                                        <div className={style['info-item-content']}>{ item.value + ' ' + item.unit }</div>
                                    </div>
                                ))
                            }
                        </div>
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
export default React.memo(PageItem1, areEqual);