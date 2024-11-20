import api from './api';

const fetchNotifications = () => api.get('/notifications');
const markAsRead = (id) => api.patch(`/notifications/${id}`, { is_read: true });

export default { fetchNotifications, markAsRead };
