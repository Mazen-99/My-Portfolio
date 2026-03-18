import API_URL from "./config";

const SERVICE_API_URL = `${API_URL}/services`;

export const getServices = async () => {
    const response = await fetch(SERVICE_API_URL);
    if (!response.ok) throw new Error('Failed to fetch services');
    return await response.ok ? response.json() : [];
};

export const createService = async (serviceData, password) => {
    const response = await fetch(SERVICE_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-password': password
        },
        body: JSON.stringify(serviceData)
    });
    if (!response.ok) throw new Error('Failed to create service');
    return await response.json();
};

export const updateService = async (id, serviceData, password) => {
    const response = await fetch(`${SERVICE_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-admin-password': password
        },
        body: JSON.stringify(serviceData)
    });
    if (!response.ok) throw new Error('Failed to update service');
    return await response.json();
};

export const deleteService = async (id, password) => {
    const response = await fetch(`${SERVICE_API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'x-admin-password': password
        }
    });
    if (!response.ok) throw new Error('Failed to delete service');
    return await response.json();
};
