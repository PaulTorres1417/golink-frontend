import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PrivateRoute } from './utils/routerPrivate/PrivateRouter'
import { lazy } from 'react'

const Home = lazy(() => import('./pages/home/Home').then(m => ({ default: m.Home })))
const Following = lazy(() => import('./pages/following/Following').then(m => ({ default: m.Following })))
const Explore = lazy(() => import('./pages/explore/Explore').then(m => ({ default: m.Explore })))
const Friends = lazy(() => import('./pages/friends/Friends').then(m => ({ default: m.Friends })))
const Notifications = lazy(() => import('./pages/notifications/Notifications').then(m => ({ default: m.Notifications })))
const SavedItems = lazy(() => import('./pages/savedItems/SavedItems').then(m => ({ default: m.SavedItems })))
const Setting = lazy(() => import('./pages/settings/Setting').then(m => ({ default: m.Setting })))
const Login = lazy(() => import('./pages/login/Login'))
const PostThread = lazy(() => import('./pages/post/PostThread').then(m => ({ default: m.PostThread })))
const CommentThread = lazy(() => import('./pages/post/CommentThread').then(m => ({ default: m.CommentThread })))
const Profile = lazy(() => import('./pages/profile/Profile').then(m => ({ default: m.Profile })))
const ProfileGlobal = lazy(() => import('./pages/profile/ProfileGlobal').then(m => ({ default: m.ProfileGlobal })))
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback'));

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth/callback", 
    element: <AuthCallback />,
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: "following", element: <Following /> },
          { path: "explore", element: <Explore /> },
          { path: "friends", element: <Friends /> },
          { path: "notifications", element: <Notifications /> },
          { path: "bookmarks", element: <SavedItems /> },
          { path: "profile", element: <Profile /> },
          { path: "profile/:id", element: <ProfileGlobal />},
          { path: "setting", element: <Setting /> },
          { path: "post/:id", element: <PostThread />},
          { path: "post/:id/comment/:commentId", element: <CommentThread /> },
        ],
      },
    ],
  },
])