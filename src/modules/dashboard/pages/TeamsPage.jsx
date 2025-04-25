import React, { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/AuthProvider';
import * as Sentry from '@sentry/browser';

export default function TeamsPage() {
  const { getToken } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Define roles to organize members
  const roles = ['Tank', 'Marksman', 'Mage', 'Assassin', 'Support'];
  
  // Function to fetch team members
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      // Mock data for demonstration - in a real app, this would be an API call
      // In reality, you would implement this endpoint to fetch user data
      const mockMembers = [
        { id: '1', name: 'Frost King', role: 'Tank', profilePicture: null, status: 'Elite', experience: '3 tahun' },
        { id: '2', name: 'Ice Ranger', role: 'Marksman', profilePicture: null, status: 'Elite', experience: '4 tahun' },
        { id: '3', name: 'Cryo Mage', role: 'Mage', profilePicture: null, status: 'Elite', experience: '2 tahun' },
        { id: '4', name: 'Blizzard', role: 'Assassin', profilePicture: null, status: 'Elite', experience: '3 tahun' },
        { id: '5', name: 'Glacier', role: 'Support', profilePicture: null, status: 'Elite', experience: '2 tahun' },
        { id: '6', name: 'Snow Warrior', role: 'Tank', profilePicture: null, status: 'Senior', experience: '1 tahun' },
        { id: '7', name: 'Frost Hunter', role: 'Marksman', profilePicture: null, status: 'Senior', experience: '1.5 tahun' },
        { id: '8', name: 'Winter Witch', role: 'Mage', profilePicture: null, status: 'Senior', experience: '2 tahun' },
        { id: '9', name: 'Shadow Ice', role: 'Assassin', profilePicture: null, status: 'Junior', experience: '8 bulan' },
        { id: '10', name: 'Frost Healer', role: 'Support', profilePicture: null, status: 'Junior', experience: '6 bulan' },
      ];
      
      // Simulate API request delay
      setTimeout(() => {
        setTeamMembers(mockMembers);
        setLoading(false);
      }, 800);
      
    } catch (err) {
      console.error('Error fetching team members:', err);
      Sentry.captureException(err);
      setError('Gagal memuat data tim. Silakan coba lagi nanti.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTeamMembers();
  }, []);
  
  // Group members by role
  const membersByRole = roles.map(role => ({
    role,
    members: teamMembers.filter(member => member.role === role)
  }));
  
  return (
    <div>
      <h1 className="text-2xl font-orbitron font-bold mb-6">Tim Frost Warlord</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="frost-loading frost-loading-lg"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membersByRole.map(group => (
            <div key={group.role} className="frost-card overflow-hidden">
              <div className="bg-frost-800 text-white p-4">
                <h2 className="font-orbitron font-bold">{group.role}</h2>
                <p className="text-sm text-frost-200">{group.members.length} anggota</p>
              </div>
              
              <div className="divide-y divide-frost-100">
                {group.members.length === 0 ? (
                  <div className="p-4 text-center text-warlord-500">
                    Belum ada anggota dengan role ini
                  </div>
                ) : (
                  group.members.map(member => (
                    <div key={member.id} className="p-4 hover:bg-frost-50 transition-colors">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {member.profilePicture ? (
                            <img 
                              src={member.profilePicture} 
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-frost-200"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-frost-600 flex items-center justify-center text-white text-lg font-bold">
                              {member.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-frost-800">{member.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              member.status === 'Elite' ? 'bg-amber-100 text-amber-800' :
                              member.status === 'Senior' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {member.status}
                            </span>
                            <span className="text-xs text-warlord-600">
                              {member.experience}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}