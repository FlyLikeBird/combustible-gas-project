import React, { Component, useState } from 'react';
import { connect } from 'dva';
import { Link, Route, Switch } from 'dva/router';
import { Table, Button, Modal, Card, Select, Popconfirm, Tree, Spin, message, Input } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined, RadarChartOutlined, CloseOutlined } from '@ant-design/icons';
import style from './FieldGroup.css'
const { Option } = Select;

function FieldGroup( { fields, fieldDevice, dispatch}) {
        const [value, setValue] = useState('');
        let { allFields, energyInfo, expandedKeys, treeLoading } = fields;
        let { isRootAttr, selectedField, selectedAttr, deviceList, allDevice, forAddStatus, selectedRowKeys, isLoading, calcRuleList  } = fieldDevice;
        let fieldAttrs = allFields[energyInfo.type_code] && allFields[energyInfo.type_code].fieldAttrs ? allFields[energyInfo.type_code]['fieldAttrs'][selectedField.field_name] : [];
        const columns = forAddStatus 
        ?
        [
            {
                title:'注册码',
                dataIndex:'register_code'
            },
            {
                title:'设备名称',
                dataIndex:'meter_name',
                key:'meter_name'
            },
            {
                title:'已关联属性',
                dataIndex:'attr_name',
                key:'attr_name'
            },
        ]
        :
        [
            {
                title:'所属维度名称',
                dataIndex:'attr_name',
                key:'attr_name'
            },
            {
                title:'设备名称',
                dataIndex:'meter_name',
                key:'meter_name'
            },
            {
                title:'注册码',
                dataIndex:'register_code'
            }
        ];
        const rowSelection = {
            selectedRowKeys,
            onChange: selectedKeys => dispatch({type:'fieldDevice/select', payload:selectedKeys})
        };
        
        return (
            <div className={style['container']}>
                <Card
                    className={style['attr-container']}
                    title={
                        <div className={style['button-container']}>
                            <div><Button type="primary" disabled={isRootAttr} onClick={()=>dispatch({type:'fieldDevice/toggleAttrModal', payload:{ visible:true, forSub:false, editAttr : false}})}>添加同级</Button></div>
                            <div><Button type="primary" onClick={()=>dispatch({type:'fieldDevice/toggleAttrModal', payload:{ visible:true, forSub:true, editAttr:false }})}>添加下级</Button></div>
                            <div><Button type="primary" onClick={()=>dispatch({type:'fieldDevice/toggleAttrModal', payload: { visible:true, forSub:false, editAttr:true }})}>编辑属性</Button></div>
                            <div><Button type="primary" onClick={()=>dispatch({type:'fieldDevice/deleteAttr' })} disabled={isRootAttr}>删除属性</Button></div>
                        </div>
                    }
                >
                    {
                        treeLoading
                        ?
                        <Spin />
                        :
                        <Tree
                            expandedKeys={expandedKeys}
                            onExpand={temp=>{
                                dispatch({ type:'fields/setExpandedKeys', payload:temp });
                            }}
                            selectedKeys={[selectedAttr.key]}
                            treeData={fieldAttrs}
                            onSelect={(selectedKeys, {node})=>{
                                dispatch({type:'fieldDevice/toggleAttr', payload:node});
                                if ( forAddStatus ){
                                    dispatch({ type:'fieldDevice/fetchAll', payload:{ meter_name : value }})
                                } else {
                                    dispatch({type:'fieldDevice/fetchAttrDevice'});
                                }
                            }}
                        />
                    }
                </Card>
                <Card className={style['device-container']}>
                    <div className={style['button-container']}>
                        <Button type="primary" disabled={forAddStatus ? true : false} onClick={()=>{                           
                            dispatch({type:'fieldDevice/fetchAll'});
                        }}>添加设备</Button>
                        <Button type="primary" style={{marginLeft:'6px'}} disabled={ forAddStatus ? true : selectedRowKeys && selectedRowKeys.length ? false : true } onClick={()=>{
                            if ( selectedRowKeys.length ) {
                                new Promise((resolve, reject)=>{
                                    dispatch({type:'fieldDevice/deleteDevice', payload:{ resolve, reject }})
                                })
                                .then(()=>{
                                    
                                })
                                .catch(msg=>message.error(msg))
                            } else {
                                message.info('请至少选中一个设备')
                            }
                        }}>删除关联设备</Button>
                        {
                            forAddStatus 
                            ?
                            <Input style={{ width:'160px', marginLeft:'20px' }} placeholder='请输入设备名' value={value} onChange={e=>setValue(e.target.value)} />
                            :
                            null
                        }
                        {
                            forAddStatus
                            ?
                            <Button type='primary' onClick={()=>{
                                dispatch({ type:'fieldDevice/fetchAll', payload:{ meter_name:value }})                               
                            }}>查询</Button>
                            :
                            null
                        }
                    </div>
                    {
                        isLoading 
                        ?
                        <Spin className={style['spin']} />
                        :
                        <Table 
                            columns={columns} 
                            className={style['table-container']}
                            dataSource={ forAddStatus ? allDevice : deviceList} 
                            bordered={true} 
                            locale={{emptyText: forAddStatus ? '没有可关联的设备' : '还没有关联任何设备'}}
                            rowKey={ forAddStatus ? 'mach_id' : 'detail_id' }
                            rowSelection={rowSelection} 
                            title={()=>{
                                return (
                                    <div>

                                        <div className={style['title-container']}>
                                            <span>{ forAddStatus ? '未关联设备' : '已关联设备'}</span>
                                        </div>
                                    </div>
                                )
                            }} 
                            footer={ forAddStatus ? ()=>{
                                return (
                                    <div>                                   
                                        <Button type="primary" onClick={()=>{
                                            if ( !selectedRowKeys.length ) {
                                                message.info('请选择要关联的设备')
                                            } else {
                                                new Promise((resolve, reject)=>{
                                                    dispatch({type:'fieldDevice/addDevice', payload:{ resolve, reject }})   
                                                })
                                                .then(()=>{
                                                    dispatch({ type:'fieldDevice/toggleStatus', payload:false });
                                                })
                                                .catch(msg=>{
                                                    message.error(msg);
                                                })
                                            }
                                            setValue('');
                                        }}>关联设备</Button>
                                        <Button type="primary" style={{marginLeft:'6px'}} onClick={()=>{
                                            dispatch({type:'fieldDevice/toggleStatus', payload:false});
                                            setValue('');
                                        }}>取消</Button>                                                        
                                    </div>

                                )
                            }: null } 
                        /> 
                    }
                                     
                </Card>

            </div>
        )
}

FieldGroup.propTypes = {
    
};

export default connect(({fields, fieldDevice}) => ({fields, fieldDevice}))(FieldGroup);
