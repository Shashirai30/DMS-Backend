package com.rkt.dms.audit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(1)
public class RequestAuditFilter extends OncePerRequestFilter {

    private static final String REQUEST_ID = "requestId";
    private static final String METHOD = "method";
    private static final String IP = "ip";
    private static final String IP_NORMALIZED = "ipNormalized";
    private static final String UA = "ua";
    private static final String LATENCY = "latency";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain)
            throws ServletException, IOException {

        long start = System.nanoTime();

        String requestId = UUID.randomUUID().toString();

        try {

            MDC.put(REQUEST_ID, requestId);
            MDC.put(METHOD, request.getMethod());

            String ip = extractIp(request);

            MDC.put(IP, ip);
            MDC.put(IP_NORMALIZED, normalizeIp(ip));
            MDC.put(UA, request.getHeader("User-Agent"));

            response.setHeader("X-Request-ID", requestId);

            response.setHeader("Access-Control-Expose-Headers", "X-Request-ID");

            chain.doFilter(request, response);

        } finally {

            long latencyMs = (System.nanoTime() - start) / 1_000_000;

            MDC.put(LATENCY, String.valueOf(latencyMs));

            MDC.clear();
        }
    }

    private String extractIp(HttpServletRequest request) {

        String xf = request.getHeader("X-Forwarded-For");

        if (xf != null && !xf.isEmpty()) {
            return xf.split(",")[0].trim();
        }

        return request.getRemoteAddr();
    }

    private String normalizeIp(String ip) {

        if (ip == null) {
            return "UNKNOWN";
        }

        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            return "127.0.0.1";
        }

        return ip;
    }
}
