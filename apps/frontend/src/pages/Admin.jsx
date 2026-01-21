import { useState, useEffect } from 'react'
import { adminLogin, getAdminBookings, getBookingStats, updateBookingStatus } from '../api'

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      setIsLoggedIn(true)
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookingsRes, statsRes] = await Promise.all([
        getAdminBookings(),
        getBookingStats()
      ])
      setBookings(bookingsRes.data.data || [])
      setStats(statsRes.data.data || {})
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const password = formData.get('password')

    try {
      const response = await adminLogin({ email, password })
      localStorage.setItem('adminToken', response.data.data.token)
      setIsLoggedIn(true)
      fetchData()
    } catch (error) {
      alert('Invalid credentials')
    }
  }

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status)
      fetchData()
    } catch (error) {
      alert('Error updating status')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="card" style={{ width: '400px' }}>
          <h2 className="text-center mb-2">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                className="form-control" 
                required 
                defaultValue="priyanshurazz4@gmail.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password" 
                className="form-control" 
                required 
                defaultValue="WorkingHard@123"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Login
            </button>
          </form>
          <div className="text-center mt-2">
            <a href="/" style={{ color: '#007bff' }}>← Back to Home</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <header style={{ background: '#2c3e50', color: 'white', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Admin Dashboard</h1>
            <div>
              <a href="/" style={{ color: 'white', marginRight: '1rem' }}>Home</a>
              <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: '2rem 20px' }}>
        {/* Stats */}
        <div className="grid grid-4 mb-2">
          <div className="card text-center">
            <h3 style={{ color: '#007bff' }}>{stats.total || 0}</h3>
            <p>Total Bookings</p>
          </div>
          <div className="card text-center">
            <h3 style={{ color: '#ffc107' }}>{stats.pending || 0}</h3>
            <p>Pending</p>
          </div>
          <div className="card text-center">
            <h3 style={{ color: '#28a745' }}>{stats.completed || 0}</h3>
            <p>Completed</p>
          </div>
          <div className="card text-center">
            <h3 style={{ color: '#dc3545' }}>{stats.cancelled || 0}</h3>
            <p>Cancelled</p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>All Bookings</h2>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Service</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>#{booking.id}</td>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div>{booking.customer?.name || 'N/A'}</div>
                          <small style={{ color: '#666' }}>{booking.customer?.email}</small>
                        </div>
                      </td>
                      <td style={{ padding: '12px' }}>{booking.service?.name || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>
                        {new Date(booking.scheduled_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: 'white',
                          background: booking.status === 'PENDING' ? '#ffc107' :
                                    booking.status === 'ASSIGNED' ? '#007bff' :
                                    booking.status === 'IN_PROGRESS' ? '#6f42c1' :
                                    booking.status === 'COMPLETED' ? '#28a745' : '#dc3545'
                        }}>
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {booking.status === 'PENDING' && (
                            <>
                              <button 
                                className="btn btn-primary"
                                style={{ fontSize: '12px', padding: '4px 8px' }}
                                onClick={() => handleStatusUpdate(booking.id, 'ASSIGNED')}
                              >
                                Assign
                              </button>
                              <button 
                                className="btn btn-danger"
                                style={{ fontSize: '12px', padding: '4px 8px' }}
                                onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === 'ASSIGNED' && (
                            <button 
                              className="btn btn-warning"
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                              onClick={() => handleStatusUpdate(booking.id, 'IN_PROGRESS')}
                            >
                              Start
                            </button>
                          )}
                          {booking.status === 'IN_PROGRESS' && (
                            <button 
                              className="btn btn-success"
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                              onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="text-center p-2">No bookings found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}