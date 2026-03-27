package com.in.GymManagementSystem.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Per-cache Caffeine configuration providing Redis-speed in-memory caching
 * with optimized TTL and size limits for each cache region.
 */
@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();

        // Default cache spec for any unregistered cache names
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(50)
                .expireAfterWrite(60, TimeUnit.SECONDS));

        // Register per-cache configurations
        manager.registerCustomCache("dashboard",
                Caffeine.newBuilder()
                        .maximumSize(10)
                        .expireAfterWrite(30, TimeUnit.SECONDS)
                        .build());

        manager.registerCustomCache("members",
                Caffeine.newBuilder()
                        .maximumSize(100)
                        .expireAfterWrite(60, TimeUnit.SECONDS)
                        .build());

        manager.registerCustomCache("plans",
                Caffeine.newBuilder()
                        .maximumSize(50)
                        .expireAfterWrite(5, TimeUnit.MINUTES)
                        .build());

        manager.registerCustomCache("trainers",
                Caffeine.newBuilder()
                        .maximumSize(50)
                        .expireAfterWrite(60, TimeUnit.SECONDS)
                        .build());

        return manager;
    }
}
