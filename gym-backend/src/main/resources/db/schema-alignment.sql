-- Keep schema/data aligned with backend validation rules.
-- Script is idempotent and safe to run multiple times.

-- MEMBER
ALTER TABLE IF EXISTS member DROP COLUMN IF EXISTS plan_type;

UPDATE member
SET email = 'member' || id || '@gymfit.local'
WHERE email IS NULL
   OR btrim(email) = ''
   OR email !~ '^(?=.{6,254}$)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$';

UPDATE member
SET phone = '9' || lpad(id::text, 9, '0')
WHERE phone IS NULL
   OR btrim(phone) = ''
   OR phone !~ '^[6-9][0-9]{9}$';

UPDATE member
SET email = lower(btrim(email)),
    phone = btrim(phone);

ALTER TABLE IF EXISTS member
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN phone SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_member_email_lower ON member (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS ux_member_phone ON member (phone);

-- TRAINER
UPDATE trainer
SET specialization = 'General Fitness'
WHERE specialization IS NULL OR btrim(specialization) = '';

UPDATE trainer
SET email = 'trainer' || id || '@gymfit.local'
WHERE email IS NULL
   OR btrim(email) = ''
   OR email !~ '^(?=.{6,254}$)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$';

UPDATE trainer
SET phone = '9' || lpad(id::text, 9, '0')
WHERE phone IS NULL
   OR btrim(phone) = ''
   OR phone !~ '^[6-9][0-9]{9}$';

UPDATE trainer
SET email = lower(btrim(email)),
    phone = btrim(phone);

ALTER TABLE IF EXISTS trainer
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN specialization SET NOT NULL,
    ALTER COLUMN email SET NOT NULL,
    ALTER COLUMN phone SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_trainer_email_lower ON trainer (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS ux_trainer_phone ON trainer (phone);

-- PAYMENT
UPDATE payment
SET status = upper(btrim(status))
WHERE status IS NOT NULL;

UPDATE payment
SET payment_method = upper(btrim(payment_method))
WHERE payment_method IS NOT NULL;

ALTER TABLE IF EXISTS payment DROP CONSTRAINT IF EXISTS chk_payment_status_valid;
ALTER TABLE IF EXISTS payment
    ADD CONSTRAINT chk_payment_status_valid
        CHECK (status IN ('PENDING', 'PAID', 'FAILED'));

ALTER TABLE IF EXISTS payment DROP CONSTRAINT IF EXISTS chk_payment_method_valid;
ALTER TABLE IF EXISTS payment
    ADD CONSTRAINT chk_payment_method_valid
        CHECK (payment_method IS NULL OR payment_method IN ('CASH', 'CARD', 'UPI'));

ALTER TABLE IF EXISTS payment DROP CONSTRAINT IF EXISTS chk_payment_due_date;
ALTER TABLE IF EXISTS payment
    ADD CONSTRAINT chk_payment_due_date
        CHECK (due_date IS NULL OR due_date >= payment_date);
