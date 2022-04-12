import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:AlarmMonitor } = await import('./AlarmMonitor');
        return AlarmMonitor;
    }
})
