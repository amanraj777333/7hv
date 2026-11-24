import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Users,
  Check,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function EventsAdminModule() {
  const { events, setEvents, showToast, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [editingEvent, setEditingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const defaultEventForm = {
    title: '',
    slug: '',
    category: 'Founder & Business Networking',
    type: 'Founder Connect',
    organizerType: '7 Horse Ventures',
    format: 'In-Person',
    partnerName: '',
    partnerLogo: '',
    date: 'Saturday, August 15, 2026',
    time: '4:00 PM – 7:30 PM IST',
    location: 'Cyber City, Gurugram',
    city: 'Gurugram',
    onlineDetails: '',
    registrationLink: '',
    status: 'Upcoming',
    capacity: '40 Founders',
    registeredCount: 0,
    curationNote: 'Curated cohort. Prior registration & approval required.',
    description: '',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Founder Cohort'],
    published: true,
    agenda: [
      { time: '4:00 PM', title: 'Arrival & Curated Informal Introductions' },
      { time: '4:45 PM', title: 'Roundtable: Scaling Bottlenecks & Practical Solutions' },
      { time: '6:00 PM', title: 'Structured 1:1 Founder Peer Exchanges' }
    ]
  };

  const [formData, setFormData] = useState(defaultEventForm);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormData(defaultEventForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setFormData({
      ...defaultEventForm,
      ...evt,
      tags: evt.tags || ['Delhi NCR'],
      agenda: evt.agenda || defaultEventForm.agenda
    });
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      if (editingEvent) {
        // PUT update
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            adminUser: currentUser?.name || 'Admin'
          })
        });
        if (res.ok) {
          const updated = await res.json();
          setEvents((prev) => prev.map((item) => (item.id === editingEvent.id ? updated : item)));
          showToast('Event updated successfully', 'success');
          setIsModalOpen(false);
        }
      } else {
        // POST create
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
            adminUser: currentUser?.name || 'Admin'
          })
        });
        if (res.ok) {
          const created = await res.json();
          setEvents((prev) => [created, ...prev]);
          showToast('Event created successfully', 'success');
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save event', 'error');
    }
  };

  const handleTogglePublish = async (evt) => {
    try {
      const nextPublished = evt.published === false ? true : false;
      const res = await fetch(`/api/events/${evt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished, adminUser: currentUser?.name || 'Admin' })
      });
      if (res.ok) {
        const updated = await res.json();
        setEvents((prev) => prev.map((item) => (item.id === evt.id ? updated : item)));
        showToast(`Event ${nextPublished ? 'published' : 'hidden from public'}`, 'info');
      }
    } catch (err) {
      showToast('Error toggling status', 'error');
    }
  };

  const handleDuplicate = async (evt) => {
    try {
      const duplicateData = {
        ...evt,
        id: undefined,
        title: `${evt.title} (Copy)`,
        slug: `${evt.slug || 'cohort'}-copy-${Date.now().toString().slice(-4)}`,
        registeredCount: 0,
        adminUser: currentUser?.name || 'Admin'
      };
      delete duplicateData.id;

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicateData)
      });
      if (res.ok) {
        const created = await res.json();
        setEvents((prev) => [created, ...prev]);
        showToast('Event duplicated', 'success');
      }
    } catch (err) {
      showToast('Failed to duplicate event', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEvents((prev) => prev.filter((item) => item.id !== id));
        showToast('Event deleted', 'info');
      }
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.type?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'All' || evt.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-white">Events & Cohorts Management</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Create, schedule, edit, and curate upcoming Delhi NCR founder gatherings.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, type, venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-[#C5A46D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-400 whitespace-nowrap">City:</span>
          {['All', 'Gurugram', 'Delhi', 'Noida'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer ${
                selectedCity === c
                  ? 'bg-[#C5A46D] text-[#101010] font-semibold'
                  : 'bg-[#1e1e1e] text-stone-300 hover:bg-[#282828]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table / Grid */}
      <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#181818] border-b border-[#282828] text-stone-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4">Cohort Program</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Registrations</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-stone-500">
                    No events found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-[#1a1a1a]/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-12 h-10 object-cover rounded border border-[#2c2c2c] shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-white text-sm line-clamp-1">{evt.title}</div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-stone-500">ID: {evt.id}</span>
                            {evt.curationNote && <span className="text-amber-400/80">• Curated</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[#C5A46D]/15 text-[#C5A46D] block w-fit">
                        {evt.type || evt.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                        <span className="px-1.5 py-0.5 rounded bg-[#202020] text-stone-300 font-mono text-[9px]">
                          {evt.format || 'In-Person'}
                        </span>
                        {evt.organizerType && evt.organizerType !== '7 Horse Ventures' && (
                          <span className="text-amber-400/90 font-medium text-[10px]">
                            {evt.organizerType === 'Collaborative' ? 'Co-hosted' : 'Partner'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-white font-medium">{evt.date}</div>
                      <div className="text-stone-400 text-[11px]">{evt.time}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-stone-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C5A46D] shrink-0" />
                        <span>{evt.location}</span>
                      </div>
                      <div className="text-stone-400 text-[10px] mt-0.5">{evt.city}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="font-bold text-white text-sm">{evt.registeredCount || 0}</div>
                      <div className="text-[10px] text-stone-400">of {evt.capacity || '40'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            evt.status === 'Upcoming'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {evt.status}
                        </span>
                        {evt.published === false && (
                          <span className="text-[9px] text-red-400 font-medium">Unpublished</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTogglePublish(evt)}
                          title={evt.published === false ? 'Publish' : 'Unpublish'}
                          className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                        >
                          {evt.published === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDuplicate(evt)}
                          title="Duplicate Event"
                          className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-white cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(evt)}
                          title="Edit Event"
                          className="p-1.5 rounded hover:bg-[#252525] text-stone-400 hover:text-[#C5A46D] cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(evt.id, evt.title)}
                          title="Delete Event"
                          className="p-1.5 rounded hover:bg-red-950/40 text-stone-400 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#141414] border border-[#2e2e2e] rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#262626] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white font-serif">
                  {editingEvent ? 'Edit Cohort Event' : 'Create New Cohort Event'}
                </h3>
                <p className="text-xs text-stone-400">Configure event details, venue, capacity, and agenda</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white hover:bg-[#222222] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEvent} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. 7H Founder Connect — Gurugram Inaugural Edition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Program Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  >
                    <option value="Founder Connect">7H Founder Connect</option>
                    <option value="Pitch & Capital Connect">Pitch & Capital Connect</option>
                    <option value="Executive Roundtable">Executive Roundtable</option>
                    <option value="Closed Investor Dinner">Closed Investor Dinner</option>
                    <option value="Corporate Demo Day">Corporate Demo Day</option>
                    <option value="Knowledge Session">Knowledge Session / Workshop</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Organizer / Host Type *</label>
                  <select
                    value={formData.organizerType || '7 Horse Ventures'}
                    onChange={(e) => setFormData({ ...formData, organizerType: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  >
                    <option value="7 Horse Ventures">Organised by 7 Horse Ventures</option>
                    <option value="Collaborative">In Collaboration with Partner</option>
                    <option value="Partner / Community">Hosted by Partner / Community</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Event Format *</label>
                  <select
                    value={formData.format || 'In-Person'}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Partner / Host Name (Optional)</label>
                  <input
                    type="text"
                    value={formData.partnerName || ''}
                    onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. Fintech Circle, AWS Community, etc."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">City / Hub *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. Gurugram, Delhi, Bengaluru, Online"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. Saturday, August 15, 2026"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Time</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. 4:00 PM – 7:30 PM IST"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Location / Venue (Address or Virtual link)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. DLF Cyber City, Phase 2, Gurugram OR Interactive Online Webinar"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Online Meeting Details (Optional for Online/Hybrid)</label>
                  <input
                    type="text"
                    value={formData.onlineDetails || ''}
                    onChange={(e) => setFormData({ ...formData, onlineDetails: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. Hosted via Google Meet. Link dispatched to confirmed attendees."
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">External / Direct Registration Link (Optional)</label>
                  <input
                    type="url"
                    value={formData.registrationLink || ''}
                    onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. https://lu.ma/... or leave empty to use on-site RSVP form"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Cohort Capacity</label>
                  <input
                    type="text"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. 40 Founders"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-stone-300 font-medium">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                  >
                    <option value="Upcoming">Upcoming (Registrations Open)</option>
                    <option value="Cohort Full">Cohort Full (Waitlist Only)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Banner Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="Cohort objective, participant requirements, and discussion scope..."
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-stone-300 font-medium">Curation Note / Eligibility</label>
                  <input
                    type="text"
                    value={formData.curationNote}
                    onChange={(e) => setFormData({ ...formData, curationNote: e.target.value })}
                    className="w-full bg-[#1b1b1b] border border-[#2e2e2e] rounded p-2 text-stone-100 focus:border-[#C5A46D] outline-none"
                    placeholder="e.g. Curated for venture-backed founders and Series A+ operators"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#262626] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#222222] hover:bg-[#2c2c2c] text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#C5A46D] hover:bg-[#D8C39A] text-[#101010] font-semibold cursor-pointer"
                >
                  {editingEvent ? 'Save Changes' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
