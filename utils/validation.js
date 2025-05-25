function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateCPF(cpf) {
    return cpf && cpf.length === 11 && /^\d{11}$/.test(cpf);
}

function validatePhone(phone) {
    return phone && phone.length === 11 && /^\d{11}$/.test(phone);
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

function formatCPF(value) {
    return value.replace(/\D/g, '').slice(0, 11);
}

function formatPhone(value) {
    return value.replace(/\D/g, '').slice(0, 11);
}
