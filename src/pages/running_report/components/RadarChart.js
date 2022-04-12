import React, { useState, useRef } from 'react';
import { connect } from 'dva';
import { Radio, Card, Button,  } from 'antd';
import { LineChartOutlined, BarChartOutlined, PieChartOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactEcharts from 'echarts-for-react';
import html2canvas from 'html2canvas';

const indicatorTypes = {
    'load_ratio':'稼动率',
    'empty_ratio':'空载率',
    'air_ele_ratio':'气电比',
    'air_save_cost':'气成本比',
    'air_cost_ratio':'节省效率'
};
const textMaps = {
    '稼动率':'load_ratio',
    '空载率': 'empty_ratio',
    '气电比' : 'air_ele_ratio',
    '气成本比':'air_save_cost',
    '节省效率':'air_cost_ratio'
};
function RadarChart({ data }) {
    let seriesData = [], indicator = [];
    Object.keys(data).forEach(key=>{
        indicator.push({ name:indicatorTypes[key], max:100 });
        seriesData.push(data[key]);
    });
    return (    
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%'}}
            option={{
                tooltip:{
                    show:false
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        formatter:(value, indicator)=>{                        
                            return `${value} {a|${data[textMaps[value]]}}`
                        },
                        textStyle: {
                            color: '#babac1',
                            rich:{
                                a:{
                                    backgroundColor:'#4cd0ef',
                                    color:'#fff',
                                    padding:[2,6],
                                    borderRadius:6
                                }
                            }
                        }
                    },
                    radius:'65%',
                    splitNumber:4,
                    splitArea: {
                        areaStyle: {
                            color: ['transparent']
                        }
                    },
                    splitLine:{
                        lineStyle:{
                            width:1,
                            color:'#47d0cf'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#47d0cf'
                        }
                    },
                    indicator
                },                    
                series:{
                    type: 'radar',
                    name:'安全隐患评分',
                    symbol:'none',
                    label:{
                        distance:2
                    },
                    data: [
                        {
                            value: seriesData,
                            lineStyle:{
                                opacity:0
                            },
                            areaStyle:{
                                opacity:0.9,
                                color:{
                                    type:'linear',
                                    x:0,
                                    y:0,
                                    x2:0,
                                    y2:1,
                                    colorStops: [{
                                        offset: 0, color: '#5c93ee' // 0% 处的颜色
                                    }, {
                                        offset: 1, color: '#a320f3' // 100% 处的颜色
                                    }],
                                    
                                },
                            }
                        }

                    ]
                }
            }}
        /> 
           
    );
}

export default RadarChart;
