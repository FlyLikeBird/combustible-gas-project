import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:MachManager } = await import('./MachManager');
        return MachManager;
    }
})
