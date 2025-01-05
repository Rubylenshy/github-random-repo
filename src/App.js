import { useEffect, useState } from 'react';
import './App.css';
import languageList from './languages.json';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect( function () {
    // console.log(typeof(Object.keys(languageList)))
  }, []);

  return (
    <div className="random-repo-app ff-montserrat">
      <Header />
      <DropdownComp languageList={languageList} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      <Result selectedLanguage={selectedLanguage} error={error} isLoading={isLoading} />
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
  )
}

function DropdownComp(languageList, selectedLanguage, setSelectedLanguage) {
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
        <ul className="dropdown-list" >
          {["Python", "Javascript", "PHP"].map((language) => (
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

function Result(isLoading, error, selectedLanguage) {
  return (
    <div className='results-container'>
      { isLoading ?
        <div className='loading-state state-container text-center'>
          Loading, please wait ...
        </div> : (
          !selectedLanguage ?
          <div className='pre-loading-state state-container'>
            Please select a language
          </div> : (
            error ?
            <div className='error-state state-container'>
              Error fetching repositories
            </div> : 
            <div className='repo-details'>
    
            </div>
          )
        )
      }

      <button className={error ? 'btn error' : 'btn'}>{!isLoading && !error ? 'Refresh' : 'Click to retry'}</button>
    </div>
  )
}

export default App;
