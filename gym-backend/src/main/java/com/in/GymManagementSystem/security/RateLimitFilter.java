package com.in.GymManagementSystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * OWASP: Rate limiting filter to prevent brute-force and DDoS attacks.
 *
 * - Auth endpoints (/api/auth/**): 20 requests per minute per IP (stricter to
 * prevent brute-force)
 * - All other endpoints: 60 requests per minute per IP
 * - Returns 429 Too Many Requests with Retry-After header on violation
 *
 * Uses an in-memory sliding window approach. For production with multiple
 * instances,
 * replace with Redis-backed rate limiting (e.g., Spring Cloud Gateway or
 * Bucket4j + Redis).
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // OWASP: Sensible defaults — auth endpoints get stricter limits to mitigate
    // credential stuffing
    private static final int AUTH_LIMIT = 20; // requests per window for auth endpoints
    private static final int GENERAL_LIMIT = 60; // requests per window for authenticated endpoints
    private static final long WINDOW_MS = 60_000L; // 1-minute sliding window
    private static final long CLEANUP_INTERVAL_MS = 5 * 60_000L; // clean stale entries every 5 min

    private final ConcurrentHashMap<String, ConcurrentLinkedDeque<Long>> requestLog = new ConcurrentHashMap<>();
    private volatile long lastCleanup = System.currentTimeMillis();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // OWASP: Skip rate limiting for preflight CORS requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = resolveClientIp(request);
        String path = request.getRequestURI();
        boolean isAuthEndpoint = path.startsWith("/api/auth");

        // Build a key that separates auth vs general traffic
        String key = clientIp + (isAuthEndpoint ? ":auth" : ":general");
        int limit = isAuthEndpoint ? AUTH_LIMIT : GENERAL_LIMIT;

        long now = System.currentTimeMillis();
        periodicCleanup(now);

        ConcurrentLinkedDeque<Long> timestamps = requestLog.computeIfAbsent(key, k -> new ConcurrentLinkedDeque<>());

        // Remove timestamps outside the sliding window
        long windowStart = now - WINDOW_MS;
        while (!timestamps.isEmpty() && timestamps.peekFirst() != null && timestamps.peekFirst() < windowStart) {
            timestamps.pollFirst();
        }

        if (timestamps.size() >= limit) {
            // OWASP: Return 429 with Retry-After header for graceful client handling
            long oldestInWindow = timestamps.peekFirst() != null ? timestamps.peekFirst() : now;
            long retryAfterSeconds = Math.max(1, (oldestInWindow + WINDOW_MS - now) / 1000);

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
            response.setContentType("application/json");
            response.getWriter()
                    .write("{\"message\":\"Too many requests. Please try again later.\",\"retryAfterSeconds\":"
                            + retryAfterSeconds + "}");
            return;
        }

        timestamps.addLast(now);
        filterChain.doFilter(request, response);
    }

    /**
     * OWASP: Resolve client IP considering proxies.
     * In production behind a load balancer, trust X-Forwarded-For cautiously.
     */
    private String resolveClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            // Take the first IP (client IP) — OWASP: be cautious with spoofed headers
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Periodically remove stale entries to prevent memory leaks.
     */
    private void periodicCleanup(long now) {
        if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
            lastCleanup = now;
            long windowStart = now - WINDOW_MS;
            requestLog.entrySet().removeIf(entry -> {
                ConcurrentLinkedDeque<Long> ts = entry.getValue();
                while (!ts.isEmpty() && ts.peekFirst() != null && ts.peekFirst() < windowStart) {
                    ts.pollFirst();
                }
                return ts.isEmpty();
            });
        }
    }
}
