import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

import Layout from './components/Layout';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Categories from './pages/Categories';
import CategoryDetails from './pages/CategoryDetails';
import CategoryForm from './pages/CategoryForm';
import Add from './pages/Add';
import ItemForm from './pages/ItemForm';
import ItemDetails from './pages/ItemDetails';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Todos from './pages/Todos';
import HabitTracker from './pages/HabitTracker';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Fetch additional user data (like role) from Firestore
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            // Fallback for new users or if doc doesn't exist yet
            setUserData({ uid: currentUser.uid, email: currentUser.email, name: currentUser.displayName || 'User' });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Set basic data even if Firestore fails (likely permission issue)
          setUserData({ uid: currentUser.uid, email: currentUser.email, name: currentUser.displayName || 'User' });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <DataProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />

            <Route element={user ? <Layout /> : <Navigate to="/login" />}>
              <Route path="/home" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:id" element={<CategoryDetails />} />
              <Route path="/add" element={<Add />} />
              <Route path="/add-category" element={<CategoryForm />} />
              <Route path="/edit-category/:id" element={<CategoryForm />} />
              <Route path="/add-item" element={<ItemForm />} />
              <Route path="/edit-item/:id" element={<ItemForm />} />
              <Route path="/item/:id" element={<ItemDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/todos" element={<Todos />} />
              <Route path="/habits" element={<HabitTracker />} />
              <Route path="/admin" element={<Admin />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </DataProvider>
    </ThemeProvider>
  );
}
