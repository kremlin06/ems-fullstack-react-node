import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from '../../styles/Dashboards/Admin/Events.styles';
import { SearchSVG, PlusSVG, MoreVerticalSVG, EditSVG, TrashSVG, EyeSVG, CalendarSVG, LocationSVG } from '../../components/SVGs';

const Events = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const itemsPerPage = 6;

  // Mock data - replace with API call
  const [events] = useState([
    { id: 1, name: 'Tech Summit 2026', date: '2026-05-25', location: 'STI Balagtas', status: 'Upcoming' },
    { id: 2, name: 'IT Meeting 2026', date: '2026-05-25', location: 'STI Balagtas', status: 'Upcoming' },
    { id: 3, name: 'CS Meeting 2026', date: '2026-05-25', location: 'STI Balagtas', status: 'Upcoming' },
    { id: 4, name: 'Accountancy Meeting 2026', date: '2026-05-25', location: 'STI Balagtas', status: 'Ongoing' },
    { id: 5, name: 'Accountancy Meeting 2026', date: '2026-05-25', location: 'STI Balagtas', status: 'Ongoing' },
    { id: 6, name: 'Accountancy Meeting 2026', date: '2026-05-25', location: 'STI Balagtas', status: 'Draft' },
  ]);

  // Filter and search events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handleMenuToggle = (eventId) => {
    setActiveMenu(activeMenu === eventId ? null : eventId);
  };

  const handleEdit = (eventId) => {
    console.log('Edit event:', eventId);
    navigate(`/dashboard/events/${eventId}/edit`);
    setActiveMenu(null);
  };

  const handleView = (eventId) => {
    console.log('View event:', eventId);
    navigate(`/dashboard/events/${eventId}`);
    setActiveMenu(null);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      console.log('Delete event:', eventId);
      // Add delete logic here
      setActiveMenu(null);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setActiveMenu(null);
  };

  return (
    <S.EventsContainer>
      {/* Page Header */}
      <S.PageHeader>
        <div className="title-section">
          <h1>Event</h1>
          <p className="subtitle">Manage and organize all your events</p>
        </div>
        <S.CreateButton onClick={() => navigate('/dashboard/events/new')}>
          <PlusSVG />
          Create New Event
        </S.CreateButton>
      </S.PageHeader>

      {/* Controls Bar */}
      <S.ControlsBar>
        <S.SearchBox>
          <SearchSVG size={18} />
          <S.SearchInput
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </S.SearchBox>
        
        <S.FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
          <option value="cancelled">Cancelled</option>
        </S.FilterSelect>
      </S.ControlsBar>

      {/* Events Table */}
      <S.TableContainer>
        {currentEvents.length > 0 ? (
          <>
            <S.Table>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <S.EventName>{event.name}</S.EventName>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CalendarSVG size={14} />
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LocationSVG size={14} />
                        {event.location}
                      </div>
                    </td>
                    <td>
                      <S.StatusBadge status={event.status}>
                        {event.status}
                      </S.StatusBadge>
                    </td>
                    <td>
                      <S.ActionMenu onClick={(e) => e.stopPropagation()}>
                        <S.ActionButton onClick={() => handleMenuToggle(event.id)}>
                          <MoreVerticalSVG size={18} />
                        </S.ActionButton>
                        
                        {activeMenu === event.id && (
                          <S.DropdownMenu onClick={handleClickOutside}>
                            <S.DropdownItem onClick={() => handleView(event.id)}>
                              <EyeSVG size={16} />
                              View Details
                            </S.DropdownItem>
                            <S.DropdownItem onClick={() => handleEdit(event.id)}>
                              <EditSVG size={16} />
                              Edit Event
                            </S.DropdownItem>
                            <S.DropdownItem onClick={() => handleDelete(event.id)} style={{ color: '#ef4444' }}>
                              <TrashSVG size={16} />
                              Delete
                            </S.DropdownItem>
                          </S.DropdownMenu>
                        )}
                      </S.ActionMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </S.Table>
            
            {/* Pagination */}
            <S.Pagination>
              <S.PaginationInfo>
                Showing {startIndex + 1}–{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} entries
              </S.PaginationInfo>
              
              <S.PaginationButtons>
                <S.PageButton
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </S.PageButton>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <S.PageButton
                    key={page}
                    active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </S.PageButton>
                ))}
                
                <S.PageButton
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </S.PageButton>
              </S.PaginationButtons>
            </S.Pagination>
          </>
        ) : (
          <S.EmptyState>
            <SearchSVG size={48} />
            <h3>No events found</h3>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <S.CreateButton onClick={() => navigate('/dashboard/events/new')}>
              <PlusSVG />
              Create New Event
            </S.CreateButton>
          </S.EmptyState>
        )}
      </S.TableContainer>
    </S.EventsContainer>
  );
};

export default Events;