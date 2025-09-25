import { GoogleMap, LoadScript, Marker, Polygon } from '@react-google-maps/api';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { addDoc, collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// Assume Tailwind CSS is included via CDN in the HTML
// <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">

// Firebase config from global variables
const firebaseConfig = window.__firebase_config || {
  apiKey: "demo-key",
  authDomain: "demo.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo.appspot.com",
  messagingSenderId: "123456789",
  appId: window.__app_id || "demo-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Dummy data for demo
const dummyUsers = [
  { id: 'user1', lat: 28.6139, lng: 77.2090, name: 'User 1' },
  { id: 'user2', lat: 28.7041, lng: 77.1025, name: 'User 2' },
  { id: 'user3', lat: 28.5355, lng: 77.3910, name: 'User 3' }
];

// Geofence polygons for demo
const geofences = [
  {
    paths: [
      { lat: 28.6, lng: 77.2 },
      { lat: 28.6, lng: 77.3 },
      { lat: 28.7, lng: 77.3 },
      { lat: 28.7, lng: 77.2 }
    ]
  }
];

// Simple point in polygon check (ray casting algorithm)
const isPointInPolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (((polygon[i].lng > point.lng) !== (polygon[j].lng > point.lng)) &&
        (point.lat < (polygon[j].lat - polygon[i].lat) * (point.lng - polygon[i].lng) / (polygon[j].lng - polygon[i].lng) + polygon[i].lat)) {
      inside = !inside;
    }
  }
  return inside;
};

// Simple sentiment analysis
const analyzeSentiment = (message) => {
  const distressKeywords = ['help', 'danger', 'emergency', 'attack', 'hurt'];
  const lowerMessage = message.toLowerCase();
  return distressKeywords.some(keyword => lowerMessage.includes(keyword)) ? 'distress' : 'minor';
};

const SurakshaKavach = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // landing, userId, map, report, geofence, dashboard
  const [userId, setUserId] = useState('');
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [incidents, setIncidents] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportMessage, setReportMessage] = useState('');
  const [isInGeofence, setIsInGeofence] = useState(false);

  useEffect(() => {
    // Anonymous auth
    // TODO: Use __initial_auth_token for custom authentication if needed
    signInAnonymously(auth).then((userCredential) => {
      setUser(userCredential.user);
      // Blockchain-based ID: In production, integrate with blockchain for unique ID generation
      setUserId(userCredential.user.uid); // Demo: Firebase UID as ID
    });

    // Get current location
    // TODO: Handle location permissions and errors
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }

    // Real-time incidents
    // TODO: Add authentication to restrict access to incidents
    const q = query(collection(db, 'incidents'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const incidentsData = [];
      querySnapshot.forEach((doc) => {
        incidentsData.push({ id: doc.id, ...doc.data() });
      });
      setIncidents(incidentsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Check geofence
    // TODO: Fetch real geofence data from backend
    const inFence = geofences.some(fence => isPointInPolygon(location, fence.paths));
    setIsInGeofence(inFence);
  }, [location]);

  const reportIncident = async () => {
    if (reportMessage.trim()) {
      const sentiment = analyzeSentiment(reportMessage);
      // TODO: Add user location and timestamp validation
      await addDoc(collection(db, 'incidents'), {
        userId,
        message: reportMessage,
        location,
        sentiment,
        timestamp: new Date()
      });
      setReportMessage('');
      alert('Incident reported!');
    }
  };

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-teal-400 p-4">
      <h1 className="text-4xl font-bold mb-8 text-white">Suraksha Kavach</h1>
      <button onClick={() => setCurrentView('userId')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg mb-4 text-xl">I’m Safe ✅</button>
      <button onClick={() => setCurrentView('report')} className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full shadow-lg mb-4 text-xl">Emergency 🚨</button>
      <button onClick={() => setCurrentView('geofence')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full shadow-lg mb-4 text-xl">Check Geofence Status</button>
      <button onClick={() => setCurrentView('dashboard')} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-full shadow-lg text-xl">Dashboard (Authorities)</button>
    </div>
  );

  const renderUserId = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-teal-400 p-4">
      <h2 className="text-2xl mb-4 text-white">Your Unique Blockchain-Based ID</h2>
      <p className="text-lg bg-white p-4 rounded-lg shadow-lg">{userId}</p>
      <button onClick={() => setCurrentView('map')} className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">View Location</button>
      <button onClick={() => setCurrentView('landing')} className="mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">Back</button>
    </div>
  );

  const renderMap = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-teal-400 p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <LoadScript googleMapsApiKey={window.__google_maps_api_key || "demo-key"}>
          <GoogleMap
            mapContainerStyle={{ height: '80vh', width: '100%' }}
            center={location}
            zoom={12}
          >
            <Marker position={location} />
            {geofences.map((fence, index) => (
              <Polygon
                key={index}
                paths={fence.paths}
                options={{ fillColor: 'green', fillOpacity: 0.2, strokeColor: 'green' }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
      <button onClick={() => setCurrentView('userId')} className="mt-4 bg-white p-2 rounded-full shadow-lg">Back</button>
    </div>
  );

  const renderReport = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-teal-400 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl mb-4">Report Incident</h2>
        <textarea
          value={reportMessage}
          onChange={(e) => setReportMessage(e.target.value)}
          placeholder="Describe the incident..."
          className="w-full h-32 p-2 border rounded mb-4"
        />
        <button onClick={reportIncident} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg w-full">Send Report</button>
      </div>
      <button onClick={() => setCurrentView('landing')} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">Back</button>
    </div>
  );

  const renderGeofence = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-teal-400 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl mb-4">Geofence Status</h2>
        <p className={`text-lg ${isInGeofence ? 'text-green-600' : 'text-red-600'}`}>
          {isInGeofence ? 'You are in a safe zone.' : 'You are outside safe zones.'}
        </p>
      </div>
      <button onClick={() => setCurrentView('landing')} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">Back</button>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-2xl mb-4">User Locations</h2>
          <LoadScript googleMapsApiKey={window.__google_maps_api_key || "demo-key"}>
            <GoogleMap
              mapContainerStyle={{ height: '400px', width: '100%' }}
              center={{ lat: 28.6139, lng: 77.2090 }}
              zoom={10}
            >
              {dummyUsers.map(user => (
                <Marker
                  key={user.id}
                  position={{ lat: user.lat, lng: user.lng }}
                  label={user.name}
                  onClick={() => setSelectedUser(user)}
                />
              ))}
              {geofences.map((fence, index) => (
                <Polygon
                  key={index}
                  paths={fence.paths}
                  options={{ fillColor: 'green', fillOpacity: 0.2, strokeColor: 'green' }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
        {selectedUser && (
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl mb-2">User Details</h3>
            <p><strong>Blockchain ID:</strong> {selectedUser.id}</p>
            <p><strong>Location:</strong> {selectedUser.lat}, {selectedUser.lng}</p>
          </div>
        )}
      </div>
      <div className="w-full md:w-1/2 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-2xl mb-4">Real-Time Incident Feed</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {incidents.map(incident => (
              <div key={incident.id} className={`p-3 rounded-lg ${incident.sentiment === 'distress' ? 'bg-red-100 border-l-4 border-red-500' : 'bg-yellow-100 border-l-4 border-yellow-500'}`}>
                <p><strong>User ID:</strong> {incident.userId}</p>
                <p><strong>Message:</strong> {incident.message}</p>
                <p><strong>Sentiment:</strong> {incident.sentiment === 'distress' ? 'Distress 🔴' : 'Minor 🟡'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => setCurrentView('landing')} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">Back</button>
    </div>
  );

  if (!user) return <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-teal-400">Loading...</div>;

  switch (currentView) {
    case 'landing':
      return renderLanding();
    case 'userId':
      return renderUserId();
    case 'map':
      return renderMap();
    case 'report':
      return renderReport();
    case 'geofence':
      return renderGeofence();
    case 'dashboard':
      return renderDashboard();
    default:
      return renderLanding();
  }
};

export default SurakshaKavach;

// To render in a React app:
// import SurakshaKavach from './SurakshaKavach';
// ReactDOM.render(<SurakshaKavach />, document.getElementById('root'));
