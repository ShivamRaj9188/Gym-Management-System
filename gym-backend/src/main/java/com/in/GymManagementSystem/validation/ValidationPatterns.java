package com.in.GymManagementSystem.validation;

public final class ValidationPatterns {
    private ValidationPatterns() {}

    public static final String NAME_REGEX = "^(?=.{2,60}$)[A-Za-z]+(?:[ '-][A-Za-z]+)*$";
    public static final String PLAN_NAME_REGEX = "^(?=.{2,60}$)[A-Za-z]+(?:[ '-][A-Za-z]+)*$";
    public static final String SPECIALIZATION_REGEX = "^(?=.{2,80}$)[A-Za-z]+(?:[ '-][A-Za-z]+)*$";
    public static final String EMAIL_REGEX =
            "^(?=.{6,254}$)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\\.[A-Za-z]{2,})+$";
    public static final String PHONE_REGEX = "^[6-9][0-9]{9}$";
    public static final String PAYMENT_STATUS_REGEX = "^(PENDING|PAID|FAILED)$";
    public static final String PAYMENT_METHOD_REGEX = "^(CASH|CARD|UPI)$";
}
