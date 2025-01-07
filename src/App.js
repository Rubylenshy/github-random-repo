import { useEffect, useState, useCallback } from 'react';
import './App.css';
import languageList from './languages.json';

const FETCH_ERROR_MESSAGE = "Failed to fetch repositories";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [randomRepo, setRandomRepo] = useState(null);

  const fetchRepositories = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);
      setRandomRepo(null);
  
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=language=${selectedLanguage}&sort=stars&order=desc`,
          
        );
  
        if (!response.ok) {
          setError(FETCH_ERROR_MESSAGE)
          return
        }
  
        const data = await response.json();
        const repos = data.items;
  
        if (repos.length > 0) {
          const randomIndex = Math.floor(Math.random() * repos.length);
          setRandomRepo(repos[randomIndex]);
        } else {
          setRandomRepo(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }, [selectedLanguage]);

  useEffect(() => {

    if (selectedLanguage) {
      fetchRepositories();
    }

  }, [selectedLanguage, fetchRepositories]);

  return (
    <div className="random-repo-app ff-montserrat">
      <Header />
      <DropdownComp 
        languageList={languageList} 
        selectedLanguage={selectedLanguage} 
        setSelectedLanguage={setSelectedLanguage} 
      />
      <Result 
        selectedLanguage={selectedLanguage}
        randomRepo={randomRepo}
        error={error} 
        isLoading={isLoading}
        onRetry={fetchRepositories}
      />
    </div>
  );
}

function Header() {
  return (
    <header className='header-container'>
      <div className='logo-icon'>
        <img src='images/github-svgrepo-com.svg' alt='github-icon' /> 
      </div>
      <h2>Github Repository Finder</h2>
    </header>
  );
}

function DropdownComp({ languageList, selectedLanguage, setSelectedLanguage }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelect = (language) => {
    setSelectedLanguage(language.value);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        className="dropdown-selected fw-500"
        onClick={toggleDropdown}
      >
        <span>{selectedLanguage ? selectedLanguage : 'Select language'}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <ul className="dropdown-list">
          {[{label: "Select language", value: ''}, {label: "Python", value: "Python"}, {label: "Javascript", value: "Javascript"}, {label: "PHP", value: "PHP"}].map((language) => (
            <li
              key={language.label}
              onClick={() => handleSelect(language)}
              className="dropdown-item"
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              {language.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Result({ isLoading, error, selectedLanguage, randomRepo, onRetry }) {
  const formatter = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  }

  return (
    <div className='results-container'>
      { isLoading ?
        <div className='loading-state state-container text-center'>
          Loading, please wait ...
        </div> : (
          !selectedLanguage ?
          <div className='pre-loading-state state-container text-center'>
            Please select a language
          </div> : (
            error ?
            <div className='error-state state-container text-center'>
              Error fetching repositories
            </div> : 
            <div className='repo-details'>
              {randomRepo ? (
                <div className="repo-card" key={randomRepo.id}>
                  <h3>
                    <a href={randomRepo.html_url} target="_blank" rel="noopener noreferrer">
                      {randomRepo.name}
                    </a>
                  </h3>
                  <p className='desc'>{randomRepo.description}</p>
                  <p>
                    🎈 {randomRepo.language || selectedLanguage} | ⭐ {formatter(randomRepo.stargazers_count)} | 🍴 {formatter(randomRepo.forks_count)} | ❗ {formatter(randomRepo.open_issues_count)}
                  </p>
                </div>
              ) : (
                <div>No repositories found.</div>
              )}
            </div>
          )
        )
      }

      {(!isLoading && selectedLanguage) && (
        <button className={error ? 'btn error' : 'btn'} onClick={onRetry}>
          {!isLoading && !error ? 'Refresh' : 'Click to retry'}
        </button>
      )}
    </div>
  );
}

export default App;
