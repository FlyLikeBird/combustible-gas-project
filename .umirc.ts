import { defineConfig } from 'umi';

export default defineConfig({
    hash:true,
    dynamicImport:{},
    nodeModulesTransform: {
        type: 'none',
    },
    routes: [
        { path:'/login', component:'@/pages/login_page'},
        { 
            path:'/', 
            component:'@/pages/layout',
            routes:[
                { path:'/', component:'@/pages/agent_manager'},
                { path:'/index', component:'@/pages/agent_manager' },
                { path:'/terminal_monitor', component:'@/pages/terminal_monitor' },
                { path:'/alarm_monitor', component:'@/pages/alarm_monitor'},
                { path:'/mach_manager', component:'@/pages/mach_manager'},
                { path:'/running_report', component:'@/pages/running_report'},
                { path:'/sys_setting', component:'@/pages/sys_manager'}
                // { path:'/ac_control', component:'@/pages/smart_manager'},
                // { path:'/ac_cost', component:'@/pages/cost_manager'},
                // { path:'/ac_report', component:'@/pages/data_report'},
                // { path:'/ac_system', component:'@/pages/system_manager'},
                // { path:'/ac_alarm', component:'@/pages/alarm_manager'}
                // { path:'/sw_home', component:'@/pages/agent_manager'},
                // { path:'/sw_meter', component:'@/pages/terminal_mach'},
                // { path:'/sw_ctrl', component:'@/pages/smart_manager'},
                // { path:'/sw_realtime', component:'@/pages/realtime_data'},
                // { path:'/sw_warning', component:'@/pages/alarm_manager' },
                // { path:'/data_report', component:'@/pages/data_report' },
                // { path:'/sw_system', component:'@/pages/system_manager'},
                // { path:'/map_test', component:'@/pages/BuildingLayer'},
            ]
        }
    ],
    fastRefresh: {},
});
