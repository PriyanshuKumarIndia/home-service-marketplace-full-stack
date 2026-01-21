import { useState, useEffect } from 'react'
import { getServices, createBooking } from '../api'
import BookingModal from '../components/BookingModal'

export default function Home() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await getServices()
      setServices(response.data.data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookService = (service) => {
    setSelectedService(service)
    setShowModal(true)
  }

  const handleBookingSubmit = async (bookingData) => {
    try {
      await createBooking({
        ...bookingData,
        service_id: selectedService.id
      })
      alert('Booking created successfully!')
      setShowModal(false)
    } catch (error) {
      alert('Error creating booking')
    }
  }

  if (loading) return <div className="text-center p-2">Loading...</div>

  return (
    <div>
      <header style={{ background: '#007bff', color: 'white', padding: '1rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Clean Fanatics</h1>
            <a href="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</a>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: '2rem 20px' }}>
        <div className="text-center mb-2">
          <h2>Professional Home Services</h2>
          <p>Book trusted professionals for your home</p>
        </div>

        <div className="grid grid-3">
          {services.map(service => (
            <div key={service.id} className="card">
              <h3>{service.name}</h3>
              <p style={{ color: '#666', margin: '10px 0' }}>{service.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                  ₹{service.price}
                </span>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleBookService(service)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center">
            <p>No services available</p>
          </div>
        )}
      </div>

      {showModal && (
        <BookingModal
          service={selectedService}
          onSubmit={handleBookingSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}