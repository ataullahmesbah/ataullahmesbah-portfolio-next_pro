'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetch('/api/traffic-logs')
            .then((res) => res.json())
            .then((data) => setLogs(data));
    }, []);

    const filteredLogs = logs.filter((log) =>
        log.ip.includes(filter) || log.country.includes(filter)
    );

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <input
                type="text"
                placeholder="Filter by IP or country"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            <table>
                <thead>
                    <tr>
                        <th>IP</th>
                        <th>Path</th>
                        <th>Country</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((log) => (
                        <tr key={log._id}>
                            <td>{log.ip}</td>
                            <td>{log.path}</td>
                            <td>{log.country}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}