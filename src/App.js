import { useEffect, useState } from 'react';
import './App.css';
import languageList from './languages.json';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [randomRepo, setRandomRepo] = useState(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true);
      setError(null);
      setRandomRepo(null);
  
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars&order=desc`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Failed to fetch repositories");
        }
  
        const data = await response.json();
        const repos = data.items;
  
        if (repos.length > 0) {
          const randomIndex = Math.floor(Math.random() * repos.length);
          console.log(repos[randomIndex]);
          setRandomRepo(repos[randomIndex]);
        } else {
          setRandomRepo(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedLanguage) {
      fetchRepositories();
    }

  }, [selectedLanguage]);

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
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        className="dropdown-selected"
        onClick={toggleDropdown}
      >
        <span>{selectedLanguage ? selectedLanguage : 'Select language'}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <ul className="dropdown-list">
          {["Select language", "Python", "Javascript", "PHP"].map((language) => (
            <li
              key={language}
              onClick={() => handleSelect(language)}
              className="dropdown-item"
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
            >
              {language}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Result({ isLoading, error, selectedLanguage, randomRepo }) {
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
                  <p>{randomRepo.description}</p>
                  <p>
                    ⭐ {randomRepo.stargazers_count} | 🍴 {randomRepo.forks_count}
                  </p>
                </div>
              ) : (
                <div>No repositories found.</div>
              )}
            </div>
          )
        )
      }

      <button className={error ? 'btn error' : 'btn'}>
        {!isLoading && !error ? 'Refresh' : 'Click to retry'}
      </button>
    </div>
  );
}

export default App;
