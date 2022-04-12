import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:TerminalMonitor } = await import('./TerminalMonitor');
        return TerminalMonitor;
    }
})
