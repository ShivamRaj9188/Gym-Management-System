package com.in.GymManagementSystem.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * OWASP: Input sanitization filter.
 *
 * - Strips HTML tags from JSON request bodies to prevent stored XSS
 * - Rejects payloads larger than MAX_BODY_SIZE to prevent DoS via large
 * payloads
 * - Runs early in the filter chain (high precedence)
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class SanitizationFilter extends OncePerRequestFilter {

    // OWASP: Reject payloads larger than 10KB to prevent abuse
    private static final int MAX_BODY_SIZE = 10 * 1024;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // Only process requests with JSON bodies (POST, PUT, PATCH)
        String contentType = request.getContentType();
        String method = request.getMethod();
        boolean hasJsonBody = contentType != null
                && contentType.contains("application/json")
                && ("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method)
                        || "PATCH".equalsIgnoreCase(method));

        if (!hasJsonBody) {
            filterChain.doFilter(request, response);
            return;
        }

        // OWASP: Check content length before reading body
        if (request.getContentLengthLong() > MAX_BODY_SIZE) {
            response.setStatus(HttpStatus.PAYLOAD_TOO_LARGE.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Request payload too large.\"}");
            return;
        }

        // Read body bytes
        byte[] bodyBytes = request.getInputStream().readAllBytes();
        if (bodyBytes.length > MAX_BODY_SIZE) {
            response.setStatus(HttpStatus.PAYLOAD_TOO_LARGE.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Request payload too large.\"}");
            return;
        }

        // OWASP: Strip HTML tags from body to prevent stored XSS
        String body = new String(bodyBytes, StandardCharsets.UTF_8);
        String sanitized = body.replaceAll("<[^>]*>", "");

        // Wrap request with sanitized body
        byte[] sanitizedBytes = sanitized.getBytes(StandardCharsets.UTF_8);
        HttpServletRequest wrappedRequest = new SanitizedRequestWrapper(request, sanitizedBytes);
        filterChain.doFilter(wrappedRequest, response);
    }

    /**
     * Request wrapper that replaces the input stream with sanitized content.
     */
    private static class SanitizedRequestWrapper extends HttpServletRequestWrapper {
        private final byte[] body;

        SanitizedRequestWrapper(HttpServletRequest request, byte[] body) {
            super(request);
            this.body = body;
        }

        @Override
        public ServletInputStream getInputStream() {
            ByteArrayInputStream bais = new ByteArrayInputStream(body);
            return new ServletInputStream() {
                @Override
                public int read() {
                    return bais.read();
                }

                @Override
                public boolean isFinished() {
                    return bais.available() == 0;
                }

                @Override
                public boolean isReady() {
                    return true;
                }

                @Override
                public void setReadListener(ReadListener listener) {
                    /* no-op for synchronous */ }
            };
        }

        @Override
        public int getContentLength() {
            return body.length;
        }

        @Override
        public long getContentLengthLong() {
            return body.length;
        }
    }
}
