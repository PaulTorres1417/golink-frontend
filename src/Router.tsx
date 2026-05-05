import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { PrivateRoute } from './utils/routerPrivate/PrivateRouter'
import { lazy } from 'react'

const Home = lazy(() => import('./pages/home/Home'));
const Following = lazy(() => import('./pages/following/Following'));
const Explore = lazy(() => import('./pages/explore/Explore'));
const Notifications = lazy(() => import('./pages/notifications/Notifications'));
const BookMarks = lazy(() => import('./pages/bookmarks/BookMarks'));
const Setting = lazy(() => import('./pages/settings/Setting'));
const Login = lazy(() => import('./pages/login/Login'));
const PostThread = lazy(() => import('./pages/post/PostThread'));
const CommentThread = lazy(() => import('./pages/post/CommentThread'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const ProfileGlobal = lazy(() => import('./pages/profile/ProfileGlobal'));
const AuthCallback = lazy(() => import('./pages/auth/AuthCallback'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const NotFollowing = lazy(() => import('./pages/user/NotFollowing'))

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