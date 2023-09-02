export const isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
}

export const isValidDate = (date) => {
    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) {
        return false;
    } else {
        const d = new Date(timestamp);
        return d.toISOString().slice(0, 10) === date;
    }
}

export const isString = (text) => {
    return typeof text === 'string';
}
