import React from 'react';
import ReactEcharts from 'echarts-for-react';
const statusMaps = {
    '1':{ text:'未处理', color:'#ff8481'},
    '2':{ text:'跟进中', color:'#04fde7'},
    '3':{ text:'已处理', color:'#0676cb'},
    '4':{ text:'挂起', color:'#aadbff'}
}
function findData(name, data){
    let result = {};
    if ( name && data && data.length ){
        for(var i=0;i<data.length;i++){
            if ( data[i].name === name ) {
                result = { value:data[i].value, ratio:data[i].ratio };
            }
        }
    }
    return result;
}
function PieChart({ data }){
    let seriesData = [], bgData = [], total = 0;
    Object.keys(data).forEach(key=>{
        total += data[key];
        seriesData.push({
            name:statusMaps[key].text,
            value:data[key],
            itemStyle:{
                color:statusMaps[key].color,
                borderColor:'#091221',
                borderWidth:3,
            }
        });
        bgData.push({
            name:statusMaps[key].text,
            value:data[key],
            itemStyle:{
                color: {
                    type: 'linear',
                    x: 0,                 // 左上角x
                    y: 0,                 // 左上角y
                    x2: 1,                // 右下角x
                    y2: 0,                // 右下角y
                    colorStops: [{
                        offset: 0, color: statusMaps[key].color // 0% 处的颜色
                    }, {
                        offset: 1, color: 'rgba(0,0,0,0)' // 100% 处的颜色
                    }],
                },                    
                opacity:0.5,
                borderColor:'#091221',
                borderWidth:3,
            }
        });
    });
    
    return (
        <ReactEcharts
            style={{ width:'100%', height:'100%' }}
            notMerge={true}
            option={{
                legend: {
                    show:true,
                    left:'60%',
                    top:'center',
                    orient:'vertical',
                    data:seriesData.map(i=>i.name),
                    icon:'circle',
                    itemWidth:10,
                    itemHeight:10,
                    formatter:(name)=>{
                        let temp = findData(name, seriesData);
                        return `{title|${name}}{value|${temp.value}次}`
                    },
                    textStyle:{
                        rich: {
                            title: {
                                fontSize: 12,
                                lineHeight: 20,
                                color: '#9a9a9a'
                            },
                            value: {
                                fontSize: 14,
                                // fontWeight:'bold',
                                lineHeight: 16,
                                color: '#fff',
                                padding:[0,0,0,6]
                            }
                        }
                    }
                },
                series:[{
                    type:'pie',
                    center:['24%','50%'],
                    radius:['60%', '70%'],
                    label:{ show:false },
                    labelLine:{ show:false },
                    data:seriesData,
                    label:{
                        show:true,
                        position:'center',
                        formatter:(params)=>{
                            return `{b|本月告警数}\n{a|${total}次}`
                        },
                        rich:{
                            'a':{
                                color:'#fff',
                                fontSize:16,
                                padding:[0,4,0,0]                                
                            },
                            'b':{
                                color:'#9a9a9a',
                                fontSize:12,
                                padding:[6,0,6,0]
                            }
                        }
                    },
                },
                {
                    type:'pie',
                    silent:true,
                    center:['24%','50%'],
                    radius:['50%', '60%'],
                    label:{ show:false },
                    labelLine:{ show:false },
                    data:bgData
                }
            ]
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

export default React.memo(PieChart, areEqual);