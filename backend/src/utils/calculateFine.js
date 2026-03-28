export const calculateFine = ({
    dueDate,
    returnDate,
    finePerDay = 10,
    graceDays = 0,
    maxFine = 1000,
    chargePartialDay = true
}) => {

    if (!dueDate || !returnDate) return 0;

    const due = new Date(dueDate);
    const returned = new Date(returnDate);

    if (returned <= due) return 0;

    const diffMs = returned - due;
    const oneDayMs = 1000 * 60 * 60 * 24;

    let lateDays = chargePartialDay
        ? Math.ceil(diffMs / oneDayMs)
        : Math.floor(diffMs / oneDayMs);

    lateDays = Math.max(0, lateDays - graceDays);

    if (lateDays <= 0) return 0;

    let totalFine = lateDays * finePerDay;

    if (maxFine && totalFine > maxFine) {
        totalFine = maxFine;
    }

    return totalFine;
};
