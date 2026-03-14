import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SongContextProvider } from './features/home/song.context.jsx';
import { AuthProvider } from './features/Auth/auth.context.jsx';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <SongContextProvider>
            <AuthProvider >
                <App />
            </AuthProvider>
        </SongContextProvider>
    </BrowserRouter>
);
