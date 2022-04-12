import React from 'react';
import ReactEcharts from 'echarts-for-react';
function LineChart({ xData, yData, maxDay, unit, theme }){
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let seriesData = [];
    let cagetoryData = [];
    for(var i = 1;i <= maxDay;i++){
        cagetoryData.push(i);
    }
    seriesData.push({
        type:'line',
        // name:key,
        itemStyle:{
            color:'#1b8ffe'
        },
        symbol:'none',
        lineStyle:{
            width:3
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
                        color:textColor,
                        align:'left',
                        formatter:(value, index)=>{
                            if ( index === 0 ){
                                return cagetoryData.join('    ');
                            } else {
                                return null
                            }
            
                        }
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
    if ( prevProps.xData !== nextProps.xData ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(LineChart, areEqual);