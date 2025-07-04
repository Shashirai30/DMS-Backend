import { BrowserRouter } from "react-router-dom";
import Theme from "@/components/template/Theme";
import Layout from "@/components/layouts";
import { AuthProvider } from "@/auth";
import Views from "@/views";
import appConfig from "./configs/app.config";
import 'remixicon/fonts/remixicon.css';


if (appConfig.enableMock) {
  import("./mock");
}

function App() {
  return (
    <Theme>
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Views />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </Theme>
  );
}

export default App;

// to verify user mail id visit below ip =>
// http://192.168.0.111:8081/public/verify-email?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzdG9yZXN1ZGhpcjA4QGdtYWlsLmNvbSIsImlhdCI6MTc0ODU4ODkxMX0.Xgi3Fopx4Wn6z7D7sozkaqwyeVaFwBvWTlLjgmSRnB0
