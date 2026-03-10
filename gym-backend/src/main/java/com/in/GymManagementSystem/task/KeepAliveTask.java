package com.in.GymManagementSystem.task;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Executes a lightweight query periodically to prevent the free-tier database
 * (like Supabase) from pausing due to inactivity.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class KeepAliveTask {

    private final JdbcTemplate jdbcTemplate;

    // Run every 10 minutes
    @Scheduled(fixedRate = 600000)
    public void keepDbAlive() {
        try {
            jdbcTemplate.execute("SELECT 1");
            log.debug("Keep-alive query executed successfully.");
        } catch (Exception e) {
            log.error("Error executing keep-alive query", e);
        }
    }
}
