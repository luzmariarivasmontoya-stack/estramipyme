import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { Layout } from '@/components/common/Layout'
import Landing from '@/pages/Landing'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Dashboard from '@/pages/Dashboard'
import NewCompany from '@/pages/NewCompany'
import Plans from '@/pages/Plans'
import Stage1Explorar from '@/pages/stages/Stage1Explorar'
import Stage2Conocer from '@/pages/stages/Stage2Conocer'
import Stage3Analizar from '@/pages/stages/Stage3Analizar'
import Stage4Integrar from '@/pages/stages/Stage4Integrar'
import Stage5Facilitar from '@/pages/stages/Stage5Facilitar'
import Stage6Consolidar from '@/pages/stages/Stage6Consolidar'
import Questionnaire from '@/pages/Questionnaire'
import Report from '@/pages/Report'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/planes" element={<Plans />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="nueva-empresa" element={<NewCompany />} />
        <Route path="etapa/1" element={<Stage1Explorar />} />
        <Route path="etapa/2" element={<Stage2Conocer />} />
        <Route path="etapa/3" element={<Stage3Analizar />} />
        <Route path="etapa/4" element={<Stage4Integrar />} />
        <Route path="etapa/5" element={<Stage5Facilitar />} />
        <Route path="etapa/6" element={<Stage6Consolidar />} />
        <Route path="preguntas" element={<Questionnaire />} />
        <Route path="reporte" element={<Report />} />
      </Route>
    </Routes>
  )
}
