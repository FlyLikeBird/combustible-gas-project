import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:AgentManager } = await import('./AgentManager');
        return AgentManager;
    }
})
