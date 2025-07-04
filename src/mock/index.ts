import { mock } from './MockAdapter'
import './fakeApi/commonFakeApi'
import './fakeApi/fileFakeApi'
import './fakeApi/logFakeApi'
import './fakeApi/accountsFakeApi'
import './fakeApi/dashboardFakeApi'

mock.onAny().passThrough()
