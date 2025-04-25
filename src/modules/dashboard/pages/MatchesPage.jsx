import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/AuthProvider';
import { useForm } from 'react-hook-form';
import * as Sentry from '@sentry/browser';

export default function MatchesPage() {
  const { user, getToken } = useAuth();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  
  useEffect(() => {
    fetchMatches();
  }, []);
  
  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/matches');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      Sentry.captureException(err);
      setError('Gagal memuat data pertandingan. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };
  
  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      
      // Prepare match data
      const matchData = {
        ...data,
        matchDate: new Date(data.matchDate).toISOString(),
        // Convert scores to numbers
        ourScore: data.ourScore ? parseInt(data.ourScore, 10) : null,
        opponentScore: data.opponentScore ? parseInt(data.opponentScore, 10) : null
      };
      
      // Determine match result if scores are provided
      if (matchData.ourScore !== null && matchData.opponentScore !== null) {
        if (matchData.ourScore > matchData.opponentScore) {
          matchData.matchResult = 'win';
        } else if (matchData.ourScore < matchData.opponentScore) {
          matchData.matchResult = 'loss';
        } else {
          matchData.matchResult = 'draw';
        }
      }
      
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(matchData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh matches list
      fetchMatches();
      reset();
      setFormVisible(false);
    } catch (err) {
      console.error('Error recording match:', err);
      Sentry.captureException(err);
      setError('Gagal menyimpan data pertandingan. Silakan coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleForm = () => {
    setFormVisible(!formVisible);
    if (!formVisible) {
      reset();
      setError(null);
    }
  };
  
  // Get unique years from matches
  const years = [...new Set(matches.map(match => 
    new Date(match.matchDate).getFullYear()
  ))].sort((a, b) => b - a); // Sort descending
  
  // Group matches by year and month
  const matchesByYearMonth = matches.reduce((acc, match) => {
    const date = new Date(match.matchDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const key = `${year}-${month}`;
    
    if (!acc[key]) {
      acc[key] = {
        year,
        month,
        monthName: date.toLocaleDateString('id-ID', { month: 'long' }),
        matches: []
      };
    }
    
    acc[key].matches.push(match);
    return acc;
  }, {});
  
  // Sort matches within each group by date (most recent first)
  Object.values(matchesByYearMonth).forEach(group => {
    group.matches.sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));
  });
  
  // Convert to array and sort by year and month (most recent first)
  const sortedGroups = Object.values(matchesByYearMonth).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-orbitron font-bold">Pertandingan</h1>
        {user && (
          <button 
            onClick={toggleForm} 
            className="btn-primary flex items-center cursor-pointer"
          >
            {formVisible ? (
              <>
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tutup Form
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Catat Pertandingan
              </>
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Form to record new match */}
      {formVisible && (
        <div className="frost-card p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Catat Pertandingan Baru</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="frost-form-group">
                <label htmlFor="opponent" className="frost-label">Nama Lawan</label>
                <input 
                  id="opponent"
                  type="text" 
                  className="frost-input"
                  placeholder="Nama tim lawan"
                  {...register('opponent', { 
                    required: 'Nama lawan wajib diisi' 
                  })}
                />
                {errors.opponent && <p className="frost-error">{errors.opponent.message}</p>}
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="matchDate" className="frost-label">Tanggal Pertandingan</label>
                <input 
                  id="matchDate"
                  type="date" 
                  className="frost-input"
                  {...register('matchDate', { 
                    required: 'Tanggal pertandingan wajib diisi' 
                  })}
                />
                {errors.matchDate && <p className="frost-error">{errors.matchDate.message}</p>}
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="ourScore" className="frost-label">Skor Frost Warlord</label>
                <input 
                  id="ourScore"
                  type="number" 
                  min="0"
                  className="frost-input"
                  placeholder="Contoh: 2"
                  {...register('ourScore')}
                />
              </div>
              
              <div className="frost-form-group">
                <label htmlFor="opponentScore" className="frost-label">Skor Lawan</label>
                <input 
                  id="opponentScore"
                  type="number" 
                  min="0"
                  className="frost-input"
                  placeholder="Contoh: 1"
                  {...register('opponentScore')}
                />
              </div>
              
              <div className="frost-form-group md:col-span-2">
                <label htmlFor="notes" className="frost-label">Catatan (opsional)</label>
                <textarea 
                  id="notes"
                  className="frost-input"
                  rows="3"
                  placeholder="Catatan tentang pertandingan, highlight, dll."
                  {...register('notes')}
                ></textarea>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button 
                type="button" 
                onClick={toggleForm}
                className="btn-secondary cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="btn-primary cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="frost-loading mr-2"></span>
                    <span>Menyimpan...</span>
                  </>
                ) : 'Simpan Pertandingan'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="frost-loading frost-loading-lg"></div>
        </div>
      ) : matches.length === 0 ? (
        <div className="frost-card p-6 text-center">
          <p className="text-warlord-600">Belum ada data pertandingan yang tercatat.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedGroups.map(group => (
            <div key={`${group.year}-${group.month}`} className="frost-card overflow-hidden">
              <div className="bg-frost-800 text-white p-4">
                <h2 className="font-orbitron">{group.monthName} {group.year}</h2>
              </div>
              <div className="divide-y divide-frost-100">
                {group.matches.map(match => (
                  <div key={match.id} className="p-4 hover:bg-frost-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-frost-800">Frost Warlord vs {match.opponent}</h3>
                        <div className="flex items-center text-sm text-warlord-600 mt-1">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(match.matchDate).toLocaleDateString('id-ID', { 
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </div>
                        <div className="mt-2">
                          <span className="font-medium">Skor: </span>
                          <span className={`font-bold ${
                            match.matchResult === 'win' ? 'text-green-600' : 
                            match.matchResult === 'loss' ? 'text-red-600' : 
                            'text-warlord-600'
                          }`}>
                            {match.ourScore !== null && match.opponentScore !== null 
                              ? `${match.ourScore} - ${match.opponentScore}` 
                              : 'Belum tercatat'}
                          </span>
                        </div>
                        {match.notes && (
                          <p className="mt-2 text-warlord-700">{match.notes}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        match.matchResult === 'win' ? 'bg-green-100 text-green-800' :
                        match.matchResult === 'loss' ? 'bg-red-100 text-red-800' :
                        match.matchResult === 'draw' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-warlord-100 text-warlord-800'
                      }`}>
                        {match.matchResult === 'win' ? 'Menang' :
                         match.matchResult === 'loss' ? 'Kalah' :
                         match.matchResult === 'draw' ? 'Seri' :
                         'Belum selesai'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}