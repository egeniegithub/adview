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