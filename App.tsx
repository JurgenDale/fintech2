import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/shared/Layout';
import AdminDashboard from './components/dashboard/AdminDashboard';
import LenderDashboard from './components/dashboard/LenderDashboard';
import BorrowerDashboard from './components/dashboard/BorrowerDashboard';
import LoanApplicationForm from './components/loans/LoanApplicationForm';
import { User, Role, LoanStatus } from './types';
import { users } from './services/firebaseService';
import { Users, Landmark } from 'lucide-react';
import ReportsPage from './components/reports/ReportsPage';
import LoanList from './components/loans/LoanList';
import { LandingPage } from './components/landing/LandingPage';

// Standalone component for user selection (simulates login/signup)
const UserSelectionScreen: React.FC<{ onSelectUser: (user: User) => void }> = ({ onSelectUser }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-2 mb-2">
                <Landmark className="h-10 w-10 text-primary"/>
                <h1 className="text-4xl font-bold text-primary">LendFlow</h1>
            </div>
          <p className="text-muted-foreground text-lg">Select a user profile to simulate login</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="bg-card p-6 rounded-lg border border-border shadow-sm hover:shadow-lg hover:border-primary transition-all cursor-pointer flex flex-col items-center text-center"
            >
              <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <span className={`mt-4 px-3 py-1 text-xs font-medium rounded-full ${
                  user.role === Role.Admin ? 'bg-red-100 text-red-800' :
                  user.role === Role.Lender ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
              }`}>{user.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const AppContent = () => {
    const { user, login } = useAuth();
    const [page, setPage] = useState('dashboard');
    const [showLogin, setShowLogin] = useState(false);

    const handleLogin = (selectedUser: User) => {
        login(selectedUser);
        setShowLogin(false);
        setPage('dashboard');
    };

    // 1. User is not logged in, and hasn't tried to -> Show Landing Page
    if (!user && !showLogin) {
        return <LandingPage onSignIn={() => setShowLogin(true)} />;
    }

    // 2. User is not logged in, but has clicked Sign In/Up -> Show Login screen
    if (!user && showLogin) {
        return <UserSelectionScreen onSelectUser={handleLogin} />;
    }

    // 3. User is logged in -> Show the main application
    const navigateTo = (pageName: string) => {
        setPage(pageName);
    };

    const renderContent = () => {
        switch (page) {
            case 'dashboard':
                if (user?.role === Role.Admin) return <AdminDashboard navigateTo={navigateTo} />;
                if (user?.role === Role.Lender) return <LenderDashboard navigateTo={navigateTo} />;
                return <BorrowerDashboard navigateTo={navigateTo} />;
            case 'apply-loan':
                return <LoanApplicationForm onApplicationSuccess={() => navigateTo('dashboard')} />;
            case 'all-loans':
                return <LoanList title="All Loans" filter={{}} navigateTo={navigateTo}/>
            case 'pending-loans':
                return <LoanList title="Pending Applications" filter={{ status: LoanStatus.Pending }} navigateTo={navigateTo}/>
            case 'reports':
                return <ReportsPage/>;
            default:
                if (user?.role === Role.Admin) return <AdminDashboard navigateTo={navigateTo} />;
                if (user?.role === Role.Lender) return <LenderDashboard navigateTo={navigateTo} />;
                return <BorrowerDashboard navigateTo={navigateTo} />;
        }
    };

    return (
        <Layout navigateTo={navigateTo}>
            {renderContent()}
        </Layout>
    );
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;