import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Select, Table, Modal, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import CustomDatePicker from '@/pages/components/CustomDatePicker';
import Loading from '@/pages/components/Loading';
import AlarmForm from './AlarmForm';
import style from '@/pages/IndexPage.css';

const { Option } = Select;
const statusMaps = {
    '1':{ text:'未处理', color:'#fe2c2d', bgColor:'rgba(255, 44, 45, 0.2)'},
    '2':{ text:'跟进中', color:'#ffa149', bgColor:'rgba(255, 161, 73, 0.2)'},
    '3':{ text:'已处理', color:'#54e054', bgColor:'rgba(84, 224, 84, 0.2)'},
    '4':{ text:'挂起', color:'#ffa149', bgColor:'rgba(255, 161, 73, 0.2)'}
};
let dotStyle = {
    display:'inline-block',
    position:'absolute',
    width:'4px',
    height:'4px',
    borderRadius:'50%',
    left:'4px',
    top:'50%',
    transform:'translateY(-50%)'
}
function AlarmList({ dispatch, user, alarm }){
    let { authorized } = user;
    useEffect(()=>{
        if ( authorized ) {
            dispatch({ type:'alarm/initAlarmList'});
        }
    },[authorized]);
    let [info, setInfo] = useState({ visible:false, current:null });
    let [status, setStatus] = useState(0);
    let [cateCode, setCateCode] = useState(0);
    let { sourceData, currentPage, total, logTypes, progressLog, isLoading } = alarm;
    let columns = [
        {
            title:'序号',
            width:'60px',
            render:(text,record,index)=>{
                return `${ ( currentPage - 1) * 14 + index + 1}`;
            }
        },
        {
            title:'项目',
            ellipsis:true,
            dataIndex:'company_name'
        },
        { title:'设备名', dataIndex:'mach_name' },
        { title:'位置', dataIndex:'position_name', ellipsis:true, render:value=>(<span>{ value || '-- -- '}</span>) },
        { title:'时间', dataIndex:'first_warning_time'},
        { 
            title:'告警类型', 
            dataIndex:'type_name',
            render:value=>(<span className={style['tag-off']}>{ value }</span>)
        },
        {
            title:'告警详情',
            ellipsis:true,
            render:row=>(
                <span style={{ color:'#fe2c2d'}}>{`${ row.warning_info} ; ${row.warning_value}`}</span>
            )
        },
        { title:'处理进度', dataIndex:'status', render:value=>(<span style={{ position:'relative', padding:'2px 10px', color:statusMaps[value].color, backgroundColor:statusMaps[value].bgColor }}><span>{ statusMaps[value].text }</span><span style={{ ...dotStyle, backgroundColor:statusMaps[value].color }}></span></span>)},
        {
            title:'操作',
            render:row=>{
                return (
                    row.status === 3 
                    ?
                    // <div>
                    //     <Button type='primary' size='small' onClick={()=>{
                    //         setInfo({ visible:true, current:row, action_code:'view' });
                    //         dispatch({ type:'alarm/fetchProgressInfo', payload:row.record_id });
                    //     }}>已结单</Button>
                    // </div>
                    null
                    :
                    <div>
                        {/* <Button type='primary' size='small' style={{ marginRight:'6px' }}  onClick={()=>{
                            // 挂起之后还是可以添加进度、结单
                            if (  row.status === 3  ){
                                return;
                            } 
                            setInfo({ visible:true, current:row, action_code:'2' });
                            dispatch({ type:'alarm/fetchProgressInfo', payload:row.record_id });
                        }}>添加进度</Button>
                        <Button type='primary' size='small' style={{ marginRight:'6px' }} onClick={()=>{
                            if (  row.status === 3 || row.status === 4 ){
                                return; 
                            }  
                            setInfo({ visible:true, current:row, action_code:'1' });
                        }}>挂起</Button> */}
                        <Button type='primary' size='small' style={{ marginRight:'6px' }} onClick={()=>{
                            if (  row.status === 3  ){
                                return; 
                            } 
                            setInfo({ visible:true, current:row, action_code:'3' });
                        }}>结单</Button>
                    </div>
                )
            }
        }
    ];
    return (
        <div style={{ height:'100%' }}>
            {
                isLoading 
                ?
                <Loading />
                :
                null
            }
            <div style={{ height:'50px', color:'#fff', display:'flex', alignItems:'center' }}>
                <span style={{ marginRight:'6px' }}>告警类型</span>
                <Select style={{ width:'100px', marginRight:'1rem' }} className={style['custom-select']} value={cateCode} onChange={value=>setCateCode(value)}>
                    <Option key={0} value={0}>全部</Option>
                    <Option key={1} value={1}>燃气告警</Option>
                    {/* <Option key={2} value={2}>越限告警</Option> */}
                    <Option key={3} value={3}>通讯告警</Option>
                    <Option key={4} value={4}>故障告警</Option>
                </Select>
                <span style={{ marginRight:'6px' }}>处理进度</span>
                <Select style={{ width:'100px', marginRight:'1rem' }} className={style['custom-select']} value={status} onChange={value=>setStatus(value)}>
                    <Option key={0} value={0}>全部</Option>
                    <Option key={1} value={1}>未处理</Option>
                    {/* <Option key={2} value={2}>处理中</Option> */}
                    <Option key={3} value={3}>处理完成</Option>
                    {/* <Option key={4} value={4}>挂起</Option> */}
                </Select>
                <CustomDatePicker />
                <Button type='primary' style={{ marginLeft:'1rem' }} icon={<SearchOutlined />} onClick={()=>{
                    dispatch({ type:'alarm/fetchAlarmList', payload:{ status, cateCode }})
                }}>查询</Button>
            </div>
            <div className={style['card-container']} style={{ height:'calc( 100% - 50px)'}}>
                <Table
                    className={style['self-table-container'] + ' ' + style['dark']}
                    columns={columns}
                    rowKey='record_id'
                    dataSource={sourceData}
                    pagination={{current:currentPage, total, pageSize:12, showSizeChanger:false }}
                    onChange={(pagination)=>{
                        dispatch({ type:'alarm/fetchAlarmList', payload:{ status, cateCode, page:pagination.current }})
                    }}
                />
            </div>
            <Modal 
                visible={info.visible} 
                footer={null} 
                width='40%'
                destroyOnClose={true} 
                bodyStyle={{ padding:'40px' }}
                onCancel={()=>setInfo({ visible:false })}
            >
                <AlarmForm 
                    info={info} 
                    logTypes={logTypes}
                    onClose={()=>setInfo({ visible:false })} 
                    onDispatch={(action)=>dispatch(action)}
                    status={status}
                    cateCode={cateCode}
                    // recordHistory={recordHistory}
                    progressLog={progressLog}
                />
            </Modal>
        </div>
    )
}

export default connect(({ user, alarm })=>({ user, alarm }))(AlarmList);