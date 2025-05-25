function generateToken() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const numbers = Math.floor(1000 + Math.random() * 9000);
    return `${letter}${numbers}`;
}

function isTokenExpired(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffHours = (now - created) / (1000 * 60 * 60);
    return diffHours >= 12;
}

function getTimeRemaining(createdAt) {
    const created = new Date(createdAt);
    const expiry = new Date(created.getTime() + 12 * 60 * 60 * 1000);
    const now = new Date();
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
}

function getVisitorCardColor(index) {
    const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];
    return colors[index % colors.length];
}

function shouldShowWarning(failedAttempts) {
    return failedAttempts >= 3;
}
