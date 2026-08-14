import { createBrowserRouter } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'

// 온보딩
import Landing from './pages/OnBoarding/Landing'
import SignIn from './pages/OnBoarding/SignIn'
import SignUp from './pages/OnBoarding/SignUp'
import Language from './pages/OnBoarding/Language'
import Role from './pages/OnBoarding/Role'
import InviteCode from './pages/OnBoarding/InviteCode'
import ProjectConnect from './pages/OnBoarding/ProjectConnect'
import NotFound from './pages/NotFound'

// 메인
import ProjectMap from './pages/Main/ProjectMap'
import ProjectOverview from './pages/Main/ProjectOverview'
import FeatureList from './pages/Main/FeatureList'
import FeatureDetail from './pages/Main/FeatureDetail'
import QA from './pages/Main/QA'
import TeamSettings from './pages/Main/TeamSettings'
import Settings from './pages/Main/Settings'

export const router = createBrowserRouter([
  // 온보딩
  { path: '/', element: <Landing /> },
  { path: '/sign-in', element: <SignIn /> },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/onboarding/language', element: <Language /> },
  { path: '/onboarding/role', element: <Role /> },
  { path: '/onboarding/invite-code', element: <InviteCode /> },
  { path: '/onboarding/connect', element: <ProjectConnect /> },

  // 메인
  {
    element: <AppLayout />,
    children: [
      { path: '/map', element: <ProjectMap /> },
      { path: '/overview', element: <ProjectOverview /> },
      { path: '/features', element: <FeatureList /> },
      { path: '/features/:featureId', element: <FeatureDetail /> },
      { path: '/qa', element: <QA /> },
      { path: '/team-settings', element: <TeamSettings /> },
      { path: '/settings', element: <Settings /> },
    ],
  },

  // 위 어떤 경로에도 안 맞을 때
  { path: '*', element: <NotFound /> },
])