package com.in.GymManagementSystem;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class MemberControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetMembersRequiresAuthentication() throws Exception {
        // Without JWT token, this should be blocked (401 Unauthorized or 403 Forbidden)
        mockMvc.perform(get("/api/members"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    public void testGetPlansDoesNotCrash() throws Exception {
        mockMvc.perform(get("/api/plans"))
                .andExpect(status().is4xxClientError());
    }
}
