import React from 'react';
import ReactEcharts from 'echarts-for-react';

let stylesMap = {
    '1':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#4cbaf7' // 0% 处的颜色
        }, {
            offset: 1, color: '#4ce6e6' // 100% 处的颜色
        }],
        
    },
    '2':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#851af9' // 0% 处的颜色
        }, {
            offset: 1, color: '#a91dfb' // 100% 处的颜色
        }],
    },
    '3':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#ff9f48' // 0% 处的颜色
        }, {
            offset: 1, color: '#ffb455' // 100% 处的颜色
        }],
    },
    '4':{
        type:'linear',
        x:0,
        y:0,
        x2:1,
        y2:0,
        colorStops: [{
            offset: 0, color: '#525286' // 0% 处的颜色
        }, {
            offset: 1, color: '#7a7ab3' // 100% 处的颜色
        }],
    },
} 

let timeMaps = {
    'tip':'尖时段',
    'top':'峰时段',
    'middle':'平时段',
    'bottom':'谷时段'
};
function PieChart({ data, title, unit }){
   
    let seriesData = [];
    let num = 0;
    Object.keys(data).forEach(key=>{
        num += +data[key];
        seriesData.push({ value:data[key] ? Math.round(data[key]) : 0, name:key });
    });
   
    return (
        <ReactEcharts
            style={{ height:'100%' }}
            notMerge={true}
            option={{
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    show:true,
                    left:'56%',
                    top:'center',
                    orient:'vertical',
                    data:seriesData.map(i=>i.name),
                    icon:'circle',
                    itemWidth:8,
                    itemHeight:8,
                    formatter:(name)=>{
                        let temp = seriesData.filter(i=>i.name === name)[0];
                        // let temp = findData(name, seriesData);
                        let ratio = num ? (temp.value / num * 100).toFixed(1) : 0.0;
                        return `{title|${name}}{value|${temp.value}}`
                    },
                    textStyle:{
                        rich: {
                            title: {
                                fontSize: 12,
                                lineHeight: 24,
                                color: '#9a9a9a',
                                padding:[0, 10, 0, 0],
                                align:'left'
                            },
                            
                            value: {
                                width:80,
                                // align:'right',
                                fontSize: 16,
                                fontWeight:'bold',
                                lineHeight: 24,
                                color:'#fff',
                                paddding:[0,4,0,0]
                            }
                        }
                    }
                },
                series:[{
                    type:'pie',
                    name:title,
                    center:['30%','50%'],
                    radius: ['58%', '78%'],
                    avoidLabelOverlap: false,
                    label:{
                        show:false,
                        position:'center',
                        formatter:(params)=>{
                            return `{a|${Math.round(num)}${unit}}\n{b|当月总${title}}`
                        },
                        rich:{
                            'a':{
                                color:'#fff',
                                fontSize:16
                            },
                            'b':{
                                color:'#9a9a9a',
                                fontSize:12,
                                padding:[6,0,6,0]
                            }
                        }
                    },
                    labelLine:{
                        show:false
                    },
                    data:seriesData.map((item,index)=>{
                        return { 
                            value:item.value, 
                            name:item.name,
                            itemStyle:{
                                borderWidth:6,
                                borderColor:'#191a2f',
                                color:stylesMap[index+1]
                            }
                        }
                    })
                }]
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
export default React.memo(PieChart, areEqual);