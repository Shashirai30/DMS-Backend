package com.rkt.dms.cache;

import java.net.InetAddress;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
@Component
public class SystemInformation {

    public Map<String, String> getSystemInfo;

    @PostConstruct
    public void getSystemInformation() {
        getSystemInfo = new HashMap<>();
        try {
            InetAddress localHost = InetAddress.getLocalHost();
            getSystemInfo.put("hostname", localHost.getHostName());
            getSystemInfo.put("ip", localHost.getHostAddress());
            getSystemInfo.put("os", System.getProperty("os.name"));
            getSystemInfo.put("user", System.getProperty("user.name"));

            System.out.println("SystemInformation : "+getSystemInfo.get("ip"));
        } catch (Exception e) {
            getSystemInfo.put("error", e.getMessage());
        }
    }
}
