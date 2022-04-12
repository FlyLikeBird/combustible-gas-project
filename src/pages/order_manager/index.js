import { dynamic } from 'umi';

export default dynamic({
    loader:async function(){
        const { default:OrderManager } = await import('./OrderManager');
        return OrderManager;
    }
})
