import React from 'react';
import style from '../RunningReport.css';
import titleBg from '../../../../public/title-bg.png';

function PageItem({ title, content }){
    return (
        <div className={style['page-container']}>
            <div className={style['page-title']}>
                <span className={style['line']}></span>          
                <span className={style['text-container']} >
                    <span className={style['title']} style={{ backgroundImage:`url(${titleBg})`}}>{ title }</span>
                    {/* <span className={style['symbol']}></span> */}
                </span>
            </div>
            <div className={style['page-content']}>
                { content }
            </div>
        </div> 
    )
}

export default PageItem;