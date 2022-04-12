import React from 'react';
import ReactEcharts from 'echarts-for-react';

let colorMaps = {
    '通讯异常':'#f03aff',
    '设备故障':'#ffa84e',
    '浓度低报':'#e22a2e'
}

function BarChart({ data, category, theme }){
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let seriesData = [];
    Object.keys(data).forEach(key=>{
        seriesData.push({
            type:'bar',
            name:key,
            stack:'gas',
            barWidth:10,
            itemStyle:{
                color:colorMaps[key] || '#04a3fe'
            },
            data:data[key]
        })
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
                legend:{
                    show:seriesData.length > 1 ? true : false,
                    left:'center',
                    data:seriesData.map(i=>i.name),
                    textStyle:{ color:'rgba(255, 255, 255, 0.65)' }
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
                    data:category,
                    axisLine:{ show:false },
                    axisTick:{ show:false },
                    axisLabel:{
                        color:textColor
                    }
                },
                yAxis:{
                    show:true,
                    name:'件',
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
    if ( prevProps.data !== nextProps.data ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(BarChart, areEqual);