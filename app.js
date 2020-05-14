import React from 'react';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const getUser = () => 
  sleep(1000)
    .then(() => ({username: 'Jack'}))
    // .then(() => null);

const AuthContext = React.createContext();

function AuthProvider({children}) {

  const [state, setState] = React.useState({
    status: 'pending',
    error: null,
    user: null,
  });

  React.useEffect(() => {
    getUser().then(
      user => setState({status: 'success', error: null, user}),
      error => setState({status: 'error', user: null, error}),  
    )
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {state.status === 'pending' ? (
        'Loading...'
      ) : state.status === 'error' ? (
        <div>
          <h3>Oh no!</h3>
          <p>Error: <pre>{state.error.message}</pre></p>
        </div>
      ) : (
        children
      ) }
    </AuthContext.Provider>
  )
}

function useAuthState() {
  const state = React.useContext(AuthContext);
  const isPending = state.status === 'pending';
  const isError = state.status === 'error';
  const isSuccess = state.status === 'success';
  const isAuthenticated = state.user && isSuccess;

  return {
    ...state,
    isPending,
    isError,
    isSuccess,
    isAuthenticated,
  }
}

function Footer() {
  return <p>This is an awesome app!</p>;
}

function Header() {
  const {user} = useAuthState();
  return <p>Hello, dear {user.username}!</p>;
}

function Content() {
  const {user} = useAuthState();
  return <p>We're so happy to see you here, {user.username}!</p>;
}

function UnauthenticatedHeader() {
  return <p>Please login</p>;
}

function UnauthenticatedContent() {
  return <p>You have to login to see the content.</p>;
}

function AuthenticatedApp() {
  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  )
}

function UnauthenticatedApp() {
  return (
    <>
      <UnauthenticatedHeader />
      <UnauthenticatedContent />
    </>
  )
}

function Home() {
  const {user} = useAuthState();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <div>
          <h1>Hello there!</h1>
          <p>Welcome to my app...</p>
          <Home />
        </div>
      </AuthProvider>
    </div>
  );
}

export default App;
