import { mock } from '../MockAdapter'
import {
    analyticsData,
} from '../data/dashboardData'



mock.onGet(`/api/dashboard/analytic`).reply(() => {
    const resp = { ...analyticsData }

    return [200, resp]
})

