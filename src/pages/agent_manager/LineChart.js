import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';

function LineChart({ data }){
    let seriesData = [];
    seriesData.push({
        type:'line',
        name:'告警数',
        symbol:'none',
        smooth:true,
        itemStyle:{
            color:'#ff8481',
        },
        lineStyle:{
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10,
            shadowOffsetY:2
        },
        areaStyle:{
            color:{        
                type:'linear',
                x:0,
                y:0,
                x2:0,
                y2:1,
                colorStops: [{
                    offset: 0, color: '#ff8481' // 0% 处的颜色
                }, {
                    offset: 1, color: 'transparent' // 100% 处的颜色
                }]    
            }
        },
        data:data.value || []
    })
    return (
       
            <ReactEcharts
                notMerge={true}
                style={{ height:'100%' }}
                option={{
                    tooltip:{
                        trigger:'axis'
                    },
                    grid:{
                        top:30,
                        bottom:6,
                        left:10,
                        right:20,
                        containLabel:true
                    },
                    xAxis: {
                        type: 'category',
                        axisTick:{ show:false },
                        axisLabel:{ 
                            color:'#b0b0b0', 
                            formatter:(value)=>{
                                let temp = value.split('-');
                                return temp[2] || value;
                            }
                        },
                        axisLine:{
                            show:true,
                            lineStyle:{
                                color:'rgba(18, 168, 254, 0.8)'
                            }
                        },
                        data:data.date || []
                    },
                    yAxis: {
                        type: 'value',
                        name:'件',
                        nameTextStyle:{
                            color:'#b0b0b0'
                        },
                        nameGap:10,
                        axisTick:{ show:false },
                        axisLabel:{ color:'#b0b0b0' },
                        axisLine:{ show:false },
                        splitLine:{
                            lineStyle:{
                                color:'#1f242c'
                            }
                        }
                    },
                    series: seriesData
                }}
            />
        
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(LineChart, areEqual);