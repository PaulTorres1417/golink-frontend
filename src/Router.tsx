import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PrivateRoute } from './utils/routerPrivate/PrivateRouter'
import { lazy } from 'react'
import NotFollowing from './pages/user/NotFollowing'

const Home = lazy(() => import('./pages/home/Home').then(m => ({ default: m.Home })))
const Following = lazy(() => import('./pages/Following/Following').then(m => ({ default: m.Following })))
const Explore = lazy(() => import('./pages/explore/Explore').then(m => ({ default: m.Explore })))
const Notifications = lazy(() => import('./pages/notifications/Notifications').then(m => ({ default: m.Notifications })))
const BookMarks = lazy(() => import('./pages/bookmarks/BookMarks').then(m => ({ default: m.BookMarks })))
const Setting = lazy(() => import('./pages/settings/Setting').then(m => ({ default: m.Setting })))
const Login = lazy(() => import('./pages/login/Login'))
const PostThread = lazy(() => import('./pages/post/PostThread').then(m => ({ default: m.PostThread })))
const CommentThread = lazy(() => import('./pages/post/CommentThread').then(m => ({ default: m.CommentThread })))
const Profile = lazy(() => import('./pages/profile/Profile').then(m => ({ default: m.Profile })))
const ProfileGlobal = lazy(() => import('./pages/profile/ProfileGlobal').then(m => ({ default: m.ProfileGlobal })))
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/auth/callback", 
    element: <AuthCallback />,
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/home",
    element: <PrivateRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <Home /> },
          { path: "not-following", element: <NotFollowing />},
          { path: "explore", element: <Explore /> },
          { path: "following", element: <Following /> },
          { path: "notifications", element: <Notifications /> },
          { path: "bookmarks", element: <BookMarks /> },
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