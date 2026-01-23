'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function IPMonitor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [ipCounts, setIpCounts] = useState([]);
  const [blockedIPs, setBlockedIPs] = useState([]);
  const [allBlockedIPs, setAllBlockedIPs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
      toast.error('Access denied');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/ip-logs', {
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch IP logs');
        const data = await res.json();
       
        setLogs(data.logs || []);
        setIpCounts(data.ipCounts || []);
        setBlockedIPs(data.blockedIPs || []);
        setAllBlockedIPs(data.allBlockedIPs || []);
      } catch (error) {
        console.error('Error fetching IP logs:', error);
        toast.error('Failed to load IP logs');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, status, router]);

  const handleAction = async (ip, action) => {
    const reason = action === 'permanent' ? prompt('Enter reason for blocking this IP:') : '';
    try {
      const res = await fetch('/api/admin/ip-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, reason, action }),
      });
      if (res.ok) {
        toast.success(`${action} action performed on IP ${ip}`);
        setAllBlockedIPs(prev => action === 'unblock' ? prev.filter(i => i !== ip) : [...prev, ip]);
      } else {
        throw new Error('Failed to perform action');
      }
    } catch (error) {
      console.error(`Error ${action}ing IP:`, error);
      toast.error(`Failed to ${action} IP`);
    }
  };

  if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-gray-800 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">IP Monitoring Dashboard</h1>

      {/* IP Access Frequency */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">IP Access Frequency</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ipCounts.length === 0 ? (
            <div className="bg-gray-700 p-4 rounded-lg shadow text-center">
              No IP access data yet. Visit your site from different IPs to generate data.
            </div>
          ) : (
            ipCounts.map(({ _id: ip, count, lastAccess }) => (
              <div key={ip} className="bg-gray-700 p-4 rounded-lg shadow">
                <p><strong>IP:</strong> {ip}</p>
                <p><strong>Requests:</strong> {count}</p>
                <p><strong>Last Access:</strong> {new Date(lastAccess).toLocaleString()}</p>
                {allBlockedIPs.includes(ip) ? (
                  <p className="text-red-500 mt-2">Blocked</p>
                ) : (
                  <button
                    onClick={() => handleAction(ip, 'temporary')}
                    className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded mr-2"
                  >
                    Temp Block
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left border-b border-gray-600">IP</th>
                <th className="p-3 text-left border-b border-gray-600">Endpoint</th>
                <th className="p-3 text-left border-b border-gray-600">Method</th>
                <th className="p-3 text-left border-b border-gray-600">User</th>
                <th className="p-3 text-left border-b border-gray-600">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-400">
                    No recent requests found. Make requests to your site to populate this table.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-t border-gray-600">
                    <td className="p-3">{log.ip}</td>
                    <td className="p-3">{log.endpoint}</td>
                    <td className="p-3">{log.method}</td>
                    <td className="p-3">
                      {log.userId ? (
                        <Link href={`/u/${log.userId.username}`} className="text-blue-400 hover:underline">
                          {log.userId.username}
                        </Link>
                      ) : 'Anonymous'}
                    </td>
                    <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blocked IPs List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Blocked IPs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left border-b border-gray-600">IP</th>
                <th className="p-3 text-left border-b border-gray-600">Reason</th>
                <th className="p-3 text-left border-b border-gray-600">Blocked At</th>
                <th className="p-3 text-left border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allBlockedIPs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-400">
                    No blocked IPs yet. Use the actions above to block IPs.
                  </td>
                </tr>
              ) : (
                blockedIPs.map((ip) => (
                  <tr key={ip._id} className="border-t border-gray-600">
                    <td className="p-3">{ip.ip}</td>
                    <td className="p-3">{ip.reason || 'No reason provided'}</td>
                    <td className="p-3">{new Date(ip.blockedAt).toLocaleString()}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleAction(ip.ip, 'unblock')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
                      >
                        Unblock
                      </button>
                      <button
                        onClick={() => handleAction(ip.ip, 'permanent')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                      >
                        Permanent Block
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}