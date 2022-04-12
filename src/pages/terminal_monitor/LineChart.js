import React, { useRef } from 'react';
import ReactEcharts from 'echarts-for-react';
import style from '@/pages/IndexPage.css';

function LineChart({ data }){    
    const seriesData = [];
    seriesData.push({
        type:'line',
        symbol:'none',
        name:'当前浓度',
        itemStyle:{ color:'#04a3fe' },
        data:data.value.map(i=>i || 0) || []
    });
    seriesData.push({
        type:'line',
        symbol:'none',
        name:'低报',
        data:data.value.map(i=> data.low  || 0),
        itemStyle:{
            color:'#f9ae1e'
        },
        lineStyle:{
            type:'dashed'
        },
        markPoint:{
            symbol:'rect',
            symbolSize:[120,20],
            data:[ { value:'低报: '+ data.low + ' %LEL ', xAxis: data.date.length-4, yAxis:data.low || 0 } ],
        },
        tooltip:{ show:false }
    });
    seriesData.push({
        type:'line',
        symbol:'none',
        name:'高报',
        data:data.value.map(i=> data.high  || 0),
        itemStyle:{
            color:'#ff2d2e'
        },
        lineStyle:{
            type:'dashed'
        },
        markPoint:{
            symbol:'rect',
            symbolSize:[120,20],
            data:[ { value:'高报: '+ data.high + ' %LEL ', xAxis: data.date.length-4, yAxis:data.high || 0 } ],
        },
        tooltip:{ show:false }
    })
    
    return (            
            <ReactEcharts
                notMerge={true}
                style={{ height:'100%' }}
                option={{
                    title:{
                        text:'浓度趋势',
                        left:10,
                        top:6,
                        textStyle:{
                            fontSize:14,
                            color:'#fff'
                        }
                    },
                    grid:{
                        top:60,
                        bottom:20,
                        left:20,
                        right:20,
                        containLabel:true
                    },

                    tooltip:{
                        trigger:'axis'
                    },
                    xAxis:{
                        type:'category',
                        axisTick:{ show:false },
                        axisLine:{ show:false },
                        axisLabel:{
                            color:'#b5b5bd',
                            formatter:value=>{
                                let dateArr = value.split(' ');
                                let temp = dateArr[1] || '';
                                return temp;
                            }
                        },
                        data:data.date
                    },
                    yAxis:{
                        type:'value',
                        name:'%LEL',
                        nameTextStyle:{ color:'#b5b5bd'},
                        splitLine:{
                            lineStyle:{
                                color:'#21213c'
                            }
                        },
                        axisTick:{
                            show:false
                        },
                        axisLine:{
                            show:false
                        },
                        axisLabel:{
                            color:'#b5b5bd'
                        },
                    },
                    series:seriesData
                }}
            />
    )
}
function areEqual(prevProps, nextProps){
    if ( prevProps.data !== nextProps.data  ) {
        return false;
    } else {
        return true;
    }
}
export default LineChart;