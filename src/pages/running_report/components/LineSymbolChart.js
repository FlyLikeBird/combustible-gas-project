import React from 'react';
import ReactEcharts from 'echarts-for-react';

function LineSymbolChart({ xData, yData, unit, theme }){
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let seriesData = [];
    seriesData.push({
        type:'line',
        // name:key,
        itemStyle:{
            color:'#4debe7'
        },
        symbolSize:6,
        symbol:'circle',
        lineStyle:{
            color:'#1a63b2'
        },
        data:yData
    })
    
    // let categoryData =[], seriesData = [];
    // Object.keys(data).forEach((key,index)=>{
    //     if ( index === 0 ){
    //         categoryData = data[key].date;
    //     }
    //     seriesData.push({
    //         type:'bar',
    //         name:key,
    //         stack:'gas',
    //         barWidth:10,
    //         itemStyle:{
    //             color:colorsArr[index]
    //         },
    //         data:data[key].value
    //     })
    // })
    return (
        <ReactEcharts
            notMerge={true}
            style={{ width:'100%', height:'100%' }}
            option={{
                tooltip: { 
                    show:true, 
                    trigger:'axis',
                    // formatter:(params)=>{
                    //     return `${params[0].marker}${params[0].axisValue}<br/>${params[0].data || '-- --'}%`
                    // }
                },
                grid:{
                    top:40,
                    bottom:20,
                    left:20,
                    right:30,
                    containLabel:true
                },    
                xAxis: {
                    show: true,
                    // name: timeType === '1' ? '时' : timeType === '2' ?  '日' : '月',
                    // nameTextStyle:{ color:textColor },
                    type:'category',
                    data:xData,
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{
                        color:textColor
                    }
                },
                yAxis:{
                    show:true,
                    name:unit,
                    nameTextStyle:{
                        color:textColor
                    },
                    type:'value',
                    splitLine:{
                        lineStyle:{
                            color: theme === 'dark' ? '#22264b' : '#f0f0f0'
                        }
                    },
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{
                        color:textColor
                    }
                },
                series:seriesData
            }}
        /> 
    )
}

function areEqual(prevProps, nextProps){
    if ( prevProps.xData !== nextProps.yData ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(LineSymbolChart, areEqual);