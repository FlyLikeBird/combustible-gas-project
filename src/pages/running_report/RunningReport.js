import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { Spin, Select, DatePicker, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import style from './RunningReport.css';
import IndexStyle from '@/pages/IndexPage.css';
import PageItem1 from './components/PageItem1';
import PageItem2 from './components/PageItem2';
import reportBg from '../../../public/report_bg.jpg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Loading from '@/pages/components/Loading';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

const { Option } = Select;
let canDownload = false;
function getBase64(dom){
    return html2canvas(dom, { dpi:96, scale:2 })
        .then(canvas=>{
            let MIME_TYPE = "image/png";
            return canvas.toDataURL(MIME_TYPE);
        })
}

function getPromise(dispatch, action){
    return new Promise((resolve, reject)=>{
        // forReport字段为了优化请求流程，不重复请求维度接口，共享维度属性树全局状态
        dispatch({ ...action, payload:{ resolve, reject, forReport:true }});
    })
}


function AnalyzeReport({ dispatch, user, gateway, alarm, report }){
    let [finishLoading, setFinishLoading] = useState(false);
    let { userInfo, authorized } = user;
    let { companyList, currentCompany } = gateway;
    let { chartInfo } = alarm;
    let { isLoading, reportInfo, currentDate } = report;
    let containerRef = useRef();
    let inputRef = useRef();
    let dateStr = currentDate.format('YYYY-MM-DD').split('-');
    useEffect(()=>{
        return ()=>{
            canDownload = false;
            dispatch({ type:'report/reset'});
        }
    },[]);
    useEffect(()=>{
        if ( authorized ){
            new Promise((resolve, reject)=>{
                dispatch({ type:'report/initReport', payload:{ resolve, reject }})
            })
            .then(()=>{
                canDownload = true;
            })
            .catch(err=>{
                console.log(err);
            });
        }
    },[authorized])
    const handleDownload = ()=>{
        let container = containerRef.current;
        if ( container ){
            let pageDoms = container.getElementsByClassName(style['page-container']);
            Promise.all(Array.from(pageDoms).map(dom=>getBase64(dom)))
            .then(base64Imgs=>{
                // console.log(base64Imgs);
                // 初始比例 870 * 900 
                var pdf = new jsPDF('p', 'px', [522, 540]);
                base64Imgs.map((img, index)=>{
                    pdf.addImage(img, 'JPEG', 0, 0, 522, 540);
                    if ( index === base64Imgs.length - 1 ) return ;
                    pdf.addPage();
                })
                pdf.save(`可燃气体监测${dateStr[0]}年${dateStr[1]}月运行报告.pdf`);
                setFinishLoading(false);
                
            })
        }
    };
    // console.log(currentDate.endOf('month'));
    // console.log(currentDate.endOf('month').toDate());
    return (
        <div className={IndexStyle['card-container']} style={{ borderRadius:'0', backgroundColor:'#05050f', position:'relative', overflow: finishLoading ? 'hidden' : 'hidden auto'}}>
            {
                finishLoading 
                ?
                <div className={style['mask']} onClick={e=>e.stopPropagation()}>
                    <div className={style['content']}>
                        <div style={{ color:'#fff' }}>报告生成中，请稍后...</div>
                        <Spin size='large' />
                    </div>
                </div>
                :
                null
            }
            <div className={style['download-btn']} onClick={()=>{
                if ( canDownload ){
                    setFinishLoading(true);
                    handleDownload();
                } else {
                    message.info('数据加载中，请稍后');
                }
            }}><DownloadOutlined style={{ fontSize:'1.2rem' }} /></div>
            <div style={{ position:'fixed', left:'1rem', top:'50%', transform:'translateY(-50%)', color:'#fff' }}>
                {/* {
                    userInfo.agent_id 
                    ?
                    <div style={{ display:'flex', alignItems:'center', margin:'2rem 0' }}>
                        <span style={{ marginRight:'4px' }}>选择公司 :</span>
                        <Select className={IndexStyle['custom-select']} style={{ width:'180px' }} value={currentCompany.key} onChange={value=>{
                            dispatch({ type:'gateway/setCompany', payload:{ company_id:value }});
                            dispatch({ type:'report/fetchReport'});
                        }}>
                            {
                                companyList.length 
                                ?
                                companyList.map((item,i)=>(
                                    <Option key={item.key} value={item.key}>{ item.title }</Option>
                                ))
                                :
                                null
                            }
                        </Select>
                    </div>
                    :
                    null
                } */}
                <div style={{ display:'flex', alignItems:'center', margin:'2rem 0' }}>
                    <span style={{ marginRight:'4px' }}>选择月份 :</span>
                    <DatePicker ref={inputRef} className={style['custom-date-picker']} style={{ width:'180px' }} locale={zhCN} allowClear={false} picker='month' value={currentDate} onChange={value=>{
                        dispatch({ type:'report/setDate', payload:value });
                        dispatch({ type:'report/fetchReport'});
                        
                        if ( inputRef.current && inputRef.current.blur ) inputRef.current.blur();
                    }} />
                </div>
                
            </div>
            <div className={style['container']} ref={containerRef}>
                <div className={style['page-container']} style={{ backgroundImage:`url(${reportBg})`, backgroundColor:'#060022', position:'relative' }}>
                    <div style={{ position:'absolute', left:'50%', width:'90%', top:'1rem', color:'#04a3fe', transform:'translateX(-50%)', display:'flex', justifyContent:'space-between', borderBottom:'1px solid rgba(255, 255, 255, 0.2)', color:'rgba(255, 255, 255, 0.6)' }}>
                        <div>{ userInfo.agent_id ? '管理者' : '企业' }</div>
                        {/* {
                            userInfo.agent_id 
                            ?   
                            <div>{ currentCompany.title }</div>
                            :
                            null
                        } */}
                    </div>
                    <div style={{ position:'absolute', top:'300px', left:'50%', transform:'translateX(-50%)', color:'#55aaf8', fontSize:'1.2rem', fontWeight:'bold' }}>{ `${dateStr[0]}年${dateStr[1]}月`}</div>
                </div>
                <PageItem1 title='本月总览' data={reportInfo} isLoading={isLoading} />
                <PageItem2 title='告警分析' data={chartInfo} isLoading={isLoading} isAgent={userInfo.agent_id ? true : false } />
            </div>
        </div>
    )
}

export default connect(({ user, gateway, alarm, report })=>({ user, gateway, alarm, report }))(AnalyzeReport);