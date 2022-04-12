import React from 'react';
import ReactEcharts from 'echarts-for-react';

let colorMaps = {
    'fault':{ text:'故障告警', color:'#f03aff' },
    'link':{ text:'通讯告警', color:'#ffa84e'},
    'safe':{ text:'安全告警', color:'#e22a2e' }
}

function BarChart({ forReport, forRank, data, timeType, category, title, theme }){
    let textColor = theme === 'dark' ? '#b0b0b0' : '#000';
    let seriesData = [];
    
    Object.keys(data).forEach(key=>{
        if ( key === 'date' ) return;
        seriesData.push({
            type:'bar',
            name:colorMaps[key] ? colorMaps[key].text : key,
            stack:'gas',
            barWidth:10,
            itemStyle:{
                color:colorMaps[key] ? colorMaps[key].color : '#04a3fe'
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
                title:{
                    show:forReport ? false : true,
                    top:6,
                    left:10,
                    text:title,
                    textStyle:{ fontSize:14, color:'#fff' }
                },
                legend:{
                    show:seriesData.length > 1 ? true : false,
                    left:'center',
                    top:6,
                    itemWidth:14,
                    itemHeight:8,
                    data:seriesData.map(i=>i.name),
                    textStyle:{ color:'rgba(255, 255, 255, 0.65)' }
                },
                grid:{
                    top: forReport ? 40 : 60,
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
                        color:textColor,
                        formatter:(value)=>{
                            let result = '';
                            if ( forRank ){
                                let str;
                                if ( value.length > 8 ) {
                                    str = value.substring(0, 8);
                                } else {
                                    str = value;
                                }
                                result = str.split('').join('\n');
                            } else {
                                let temp = timeType === '1' ? value.split(' ') : timeType === '2' ? value.split('-') : value;
                                result = timeType === '1' ? temp[1] : timeType === '2' ? temp[2] : temp ;
                            }
                            return result;
                        }
                    },
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
                    minInterval:1,
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
    if ( prevProps.data !== nextProps.data || prevProps.title !== nextProps.title ){
        return false;
    } else {
        return true;
    }
}

export default React.memo(BarChart, areEqual);