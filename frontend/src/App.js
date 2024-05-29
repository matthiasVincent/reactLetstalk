import './App.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
// import { Chat } from './components/Chat';
import { ChatNew } from './components/ChatNew';
import { Feed } from './components/Feed';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import SignUp from './components/SIgnUp';
import Settings from './components/Settings/Settings';
import ProfilePage from './components/profilepage/Profile';
import { ProfileContextProvider } from './components/context/ProfileContext';
import CreatePost from './components/createpost/CreatePost';
import SinglePost from './components/SinglePost';
import { Buddy } from './components/Buddy';
import { Friends } from './components/Friends';
import { Route, Routes } from 'react-router-dom';
import { SocketContextProvider } from './components/context/socketContext';
import { DetailPictures } from './components/PostPicturesDetail';
import { Reply } from './components/CommentReplies';


function App() {
  return(
    <>
      <Routes>
        <Route exact path='/' element={
        <SocketContextProvider>
          <ProtectedRoute>
            <Feed /> 
        </ProtectedRoute>
        </SocketContextProvider>
        } />
          <Route 
            path="/chat/:room_name"
            element={
            <SocketContextProvider>
              <ProtectedRoute>
                <ChatNew />
              </ProtectedRoute>
            </SocketContextProvider>
            } 
            />

        <Route 
          path='/friends' 
          element={
          <SocketContextProvider>
            <Friends />
          </SocketContextProvider>
          } />

        <Route 
          path='/buddy-list' 
          element={
          <SocketContextProvider>
            <Buddy />
          </SocketContextProvider>
          } />

        <Route
          path='/posts/:post_id'
          element={
              <SocketContextProvider>
                <SinglePost />
              </SocketContextProvider>
          }
          />

        <Route
          path='/posts/:post_id/photos'
          element={
              <SocketContextProvider>
                <DetailPictures />
              </SocketContextProvider>
          }
          />

        <Route
          path='/profile/:username'
          element={
            <SocketContextProvider>
              <ProfileContextProvider>
              <ProfilePage />
            </ProfileContextProvider>
            </SocketContextProvider>
          }
          />

        <Route
          path='/createpost'
          element={
              <SocketContextProvider>
                <CreatePost />
              </SocketContextProvider>
          }
        />

        <Route 
          path='/posts/:post_id/comments/:comment_id/replies'
          element={
            <SocketContextProvider>
              <Reply />
            </SocketContextProvider>
          } 
          />

      <Route 
      path='/signup' 
      element={
        <SignUp />
      } />

      <Route 
        path='/settings'
        element={<Settings />}
        />

      <Route 
        path='/login' 
        element={
          <Login />
        } />  
    </Routes>


  </>
  )
}

  
export default App;
