export const handleLogoutIndicator = (id, provider_name) => {

    let is_sync_users_with_ads = JSON.parse(localStorage.getItem('is_sync_users_with_ads')) || {}
    if (is_sync_users_with_ads[id])
        deleteNestedProperty(is_sync_users_with_ads, `${id}.${provider_name}`)
    localStorage.setItem("is_sync_users_with_ads", JSON.stringify(is_sync_users_with_ads));
}

function deleteNestedProperty(obj, propertyPath) {
    const properties = propertyPath.split('.');
    const lastProperty = properties.pop();
    for (let property of properties) {
        if (!obj || typeof obj !== 'object') {
            return; // Property path is invalid
        }
        obj = obj[property];
    }
    if (obj && typeof obj === 'object') {
        delete obj[lastProperty];
    }
}

export const getStatus = (remaining) => {
    var threshold = 200; // 200 threshold for determining "closer" value
    if (remaining < 50) {
        // spend is greater than remaining
        return "Take Action";
    } else if (remaining <= threshold) {
        // spend is closer to remaining
        return "Monitor";
    } else {
        // spend is less than remaining
        return "Good";
    }
}
