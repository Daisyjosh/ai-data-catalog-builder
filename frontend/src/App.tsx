import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import UploadDataset from './pages/UploadDataset'
import CatalogExplorer from './pages/CatalogExplorer'
import Search from './pages/Search'
import DatasetDetails from './pages/DatasetDetails'
import AgentMonitor from './pages/AgentMonitor'
import MCPPlayground from './pages/MCPPlayground'
import Settings from './pages/Settings'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDataset />} />
          <Route path="/catalog" element={<CatalogExplorer />} />
          <Route path="/search" element={<Search />} />
          <Route path="/datasets/:id" element={<DatasetDetails />} />
          <Route path="/agent" element={<AgentMonitor />} />
          <Route path="/mcp" element={<MCPPlayground />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  )
}

export default App
