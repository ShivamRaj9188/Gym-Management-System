export const NAME_REGEX = /^(?=.{2,60}$)[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const PLAN_NAME_REGEX = /^(?=.{2,60}$)[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const SPECIALIZATION_REGEX = /^(?=.{2,80}$)[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const EMAIL_REGEX =
  /^(?=.{6,254}$)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/;
export const PHONE_REGEX = /^[6-9][0-9]{9}$/;
export const PAYMENT_METHOD_REGEX = /^(CASH|CARD|UPI)$/;
export const PAYMENT_STATUSES = new Set(["PENDING", "PAID", "FAILED"]);

export const isValidName = value => NAME_REGEX.test(value);
export const isValidPlanName = value => PLAN_NAME_REGEX.test(value);
export const isValidSpecialization = value => SPECIALIZATION_REGEX.test(value);
export const isValidEmail = value => EMAIL_REGEX.test(value);
export const isValidPhone = value => PHONE_REGEX.test(value);
export const isValidPaymentMethod = value => PAYMENT_METHOD_REGEX.test(value);
export const isValidPaymentStatus = value => PAYMENT_STATUSES.has(value);
